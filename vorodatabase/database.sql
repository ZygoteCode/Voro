DROP SCHEMA IF EXISTS voro CASCADE;
CREATE SCHEMA IF NOT EXISTS voro;
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE IF NOT EXISTS voro.users
(
    uid BIGSERIAL NOT NULL PRIMARY KEY,
    username TEXT NOT NULL CHECK (LENGTH(username) >= 3 AND LENGTH(username) <= 16) UNIQUE,
    password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS voro.tokens_blacklist
(
    uid BIGSERIAL NOT NULL PRIMARY KEY,
    token TEXT NOT NULL
);

CREATE OR REPLACE FUNCTION voro.create_user(
    p_username TEXT,
    p_password TEXT
)
RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
    new_uid BIGINT;
BEGIN
    IF length(p_username) < 3 OR length(p_username) > 16 THEN
        RAISE EXCEPTION 
            'Invalid username length'
            USING ERRCODE = '22023';
    END IF;

    INSERT INTO voro.users (username, password)
    VALUES (p_username, p_password)
    RETURNING uid INTO new_uid;

    RETURN new_uid;
EXCEPTION
    WHEN unique_violation THEN
        RAISE EXCEPTION
            'Username "%" already exists', p_username
            USING ERRCODE = '23505';
END;
$$;

CREATE OR REPLACE FUNCTION voro.login(p_username TEXT)
RETURNS TABLE(uid BIGINT, password TEXT)
LANGUAGE plpgsql
AS $$
BEGIN
    IF length(p_username) < 3 OR length(p_username) > 16 THEN
        RAISE EXCEPTION 'Invalid username length'
            USING ERRCODE = '22023';
    END IF;

    RETURN QUERY
    SELECT u.uid, u.password
    FROM voro.users AS u
    WHERE u.username = p_username;
END;
$$;

CREATE OR REPLACE FUNCTION voro.blacklist_token(p_token text)
RETURNS void AS $$
BEGIN
    INSERT INTO voro.tokens_blacklist (token)
    VALUES (p_token);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION voro.is_token_blacklisted(p_token TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    token_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM voro.tokens_blacklist
        WHERE token = p_token
    ) INTO token_exists;

    RETURN token_exists;
END;
$$ LANGUAGE plpgsql;