import dotenv from "dotenv";
import fastify from "fastify";
import zxcvbn from "zxcvbn-lite";
import { encrypt, decrypt } from "./cryptUtils";
import { Pool, types } from "pg";

dotenv.config();

const server = fastify({
    logger: false,
    trustProxy: true,
    ajv: {
        customOptions: {
            removeAdditional: 'all',
            useDefaults: true,
            coerceTypes: true,
            allErrors: true,
            allowUnionTypes: true
        }
    },
    bodyLimit: +process.env.MAX_PAYLOAD_SIZE,
});

types.setTypeParser(23, (val) => val === null ? null : +val);
types.setTypeParser(20, (val) => val === null ? null : +val);
types.setTypeParser(1700, (val) => val === null ? null : +val);

const dbConfig = {
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: +process.env.POSTGRES_PORT,
    max: +process.env.MAX_DB_CONNECTIONS,
    idleTimeoutMillis: +process.env.POSTGRES_IDLE_TIMEOUT,
    connectionTimeoutMillis: +process.env.POSTGRES_CONNECTION_TIMEOUT
};

const pool = new Pool(dbConfig);
const BCRYPT_SALT_ROUNDS = +process.env.BCRYPT_SALT_ROUNDS || 10;
const QUERY_CREATE_USER = `SELECT voro.create_user($1,$2)`;
const QUERY_LOGIN = `SELECT uid, password FROM voro.login($1)`;
const TOKEN_EXPIRATION = +process.env.TOKEN_EXPIRATION || 3600;
const TOKEN_VERSION = +process.env.TOKEN_EXPIRATION || 1;
const BEARER_REGEX = /^Bearer\s(.+)$/;

const REGISTER_RATE_LIMIT = {
    max: 1,
    timeWindow: '2 hours'
}

server.post("/register", {
    schema: {
        body: {
            type: 'object',
            properties: {
                username: { type: 'string', minLength: 3, maxLength: 16 },
                password: { type: 'string', minLength: 8, maxLength: 60 }
            },
            additionalProperties: false
        }      
    },
    config: {
        rateLimit: REGISTER_RATE_LIMIT
    }
}, async (request, reply) => {
    try {
        const { username, password } = request.body;

        if (zxcvbn(password).score < 3) {
            return reply.code(422).send();
        }

        const query = QUERY_CREATE_USER;
        const hashedPassword = await Bun.password.hash(password, {
            algorithm: "bcrypt",
            cost: BCRYPT_SALT_ROUNDS
        });

        await pool.query(query, [username, hashedPassword]);
        reply.code(201).send();
    } catch (err) {
        if (err.code === "23505") return reply.code(409).send();
        if (err.code === "22023") return reply.code(400).send();
        
        return reply.code(500).send();
    }
});

async function authMiddleware(request, reply) {
    try {
        const authHeader = request.headers.authorization;
        const match = authHeader && BEARER_REGEX.exec(authHeader);
        
        if (!match) {
            return reply.code(401).send();
        }

        const token = match[1];
        const payload = decrypt(token);

        if (payload.token_version !== TOKEN_VERSION) {
            return reply.code(401).send();
        }
        
        if (payload.expires_at < Date.now()) {
            return reply.code(401).send();
        }

        if (payload.user_agent !== request.headers['user-agent']) {
            return reply.code(401).send();
        }

        if (payload.ip_address !== request.ip) {
            return reply.code(401).send();
        }

        request.user = payload;
    } catch (err) {
        return reply.code(401).send();
    }
}

server.post("/login", {
    schema: {
        body: {
            type: 'object',
            properties: {
                username: { type: 'string', minLength: 3, maxLength: 16 },
                password: { type: 'string', minLength: 8, maxLength: 60 }
            },
            additionalProperties: false
        }
    }
}, async (request, reply) => {
    try {
        const { username, password } = request.body;

        if (zxcvbn(password).score < 3) {
            return reply.code(422).send();
        }

        const result = await pool.query(QUERY_LOGIN, [username]);

        if (result.rowCount === 0) {
            return reply.code(404).send();
        }

        const rowResult = result.rows[0];
        const hashedPassword = rowResult.password;
        const userUid = rowResult.uid;

        if (hashedPassword === undefined || hashedPassword === null) {
            return reply.code(404).send();
        }

        const verification = await Bun.password.verify(password, hashedPassword);

        if (verification) {
            const createdAt = Date.now();
            const expiresAt = createdAt + TOKEN_EXPIRATION;

            const token = encrypt({
                userUid: userUid,
                username: username,
                created_at: createdAt,
                expires_at: expiresAt,
                token_version: TOKEN_VERSION,
                ip_address: request.ip,
                user_agent: request.headers['user-agent']
            });

            return reply.code(200).send({ token: token });
        }

        return reply.code(401).send();
    } catch (err) {
        console.log(err);
        return reply.code(500).send();
    }
});

const serverBootstrap = async () => {
    await server.register(import('@fastify/rate-limit'), {
        max: 30,
        timeWindow: '1 minute'
    });

    await server.register(import("@fastify/helmet"), {
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:"],
                connectSrc: ["'self'"],
                fontSrc: ["'self'"],
                objectSrc: ["'none'"],
                frameAncestors: ["'none'"],
            }
        },
        referrerPolicy: {
            policy: "no-referrer"
        },
        frameguard: {
            action: "deny"
        },
        xssFilter: true,
        noSniff: true,
        hidePoweredBy: true,
        hsts: {
            maxAge: 63072000,
            includeSubDomains: true,
            preload: true
        }
    });

    await server.listen({
        port: +process.env.FASTIFY_PORT || 80,
        host: '0.0.0.0'
    });
};

serverBootstrap();