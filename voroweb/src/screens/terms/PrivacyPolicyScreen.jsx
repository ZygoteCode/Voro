import { useEffect, useState, useCallback } from "react";
import { Sun, Moon, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const sections = [
  { id: "intro", title: "Introduzione" },
  { id: "data-collected", title: "Dati che raccogliamo" },
  { id: "how-we-use", title: "Come usiamo i dati" },
  { id: "cookies", title: "Cookie e tecnologie di tracciamento" },
  { id: "third-parties", title: "Servizi di terze parti" },
  { id: "retention", title: "Conservazione dei dati" },
  { id: "rights", title: "Diritti degli utenti" },
  { id: "security", title: "Sicurezza dei dati" },
  { id: "minors", title: "Minori" },
  { id: "changes", title: "Modifiche a questa informativa" },
  { id: "contact", title: "Contatti" }
];

export default function PrivacyPolicyScreen({ onBack }) {
  const [dark, setDark] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("prefersDark")) ?? false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("prefersDark", JSON.stringify(dark));
    } catch {}
  }, [dark]);

  const theme = {
    page: dark ? "bg-[#071025] text-[#E6F0FF]" : "bg-gradient-to-br from-[#E9F2FF] via-white to-[#E6F0FF] text-[#0F1724]",
    card: dark ? "bg-white/4 border border-white/8" : "bg-white/90",
    muted: dark ? "text-[#A7B4C7]" : "text-[#64748B]",
    accent: "text-[#1877F2]",
    sectionBg: dark ? "bg-white/2" : "bg-white/"
  };

  const handleBack = useCallback(() => {
    if (onBack) return onBack();
    if (window.history && window.history.length > 1) return window.history.back();
    window.location.href = "/";
  }, [onBack]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme.page} p-6`}> 
      <header className="max-w-6xl mx-auto flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            aria-label="Go back"
            className={`inline-flex cursor-pointer items-center gap-2 px-3 py-2 rounded-lg shadow-sm transition hover:brightness-95 hover:bg-gray-500 ${dark ? "bg-white/6" : "bg-white"}`}>
            <ArrowLeft size={18} />
            <span className={`text-sm font-medium ${dark ? "text-white" : "text-[#0F1724]"}`}>Go back</span>
          </button>
        </div>

        <button
          onClick={() => setDark((d) => !d)}
          aria-label="Toggle theme"
          className={`p-2 cursor-pointer rounded-full shadow-md transition hover:scale-105 ${dark ? "bg-white/6" : "bg-white/80"}`}>
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>

      <main className="max-w-6xl mx-auto">
        <div className={`mx-auto ${theme.card} rounded-2xl shadow-xl p-8 md:p-12 transition-colors`}> 
          <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-bold mb-4">
            Privacy Policy — Voro
          </motion.h1>
          <p className={`mb-6 ${theme.muted}`}>
            Questa Privacy Policy descrive come <strong>Voro</strong> raccoglie, usa, conserva e protegge le informazioni
            personali degli utenti. Voro è una piattaforma che fornisce funzionalità di personalizzazione del feed,
            raccomandazioni in tempo reale, sincronizzazione tra dispositivi e strumenti social. In questo documento
            spieghiamo quali dati trattiamo e come puoi gestire le tue preferenze.
          </p>

          <div className={`mb-6 p-4 rounded-lg ${dark ? "bg-white/6" : "bg-[#F8FAFF]"}`}>
            <h3 className={`font-semibold mb-2 ${theme.muted}`}>Indice</h3>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className={`hover:underline ${theme.accent}`}>{s.title}</a>
                </li>
              ))}
            </ul>
          </div>

          <article className="prose prose-lg max-w-none dark:prose-invert">
            <section id="intro" className="mb-8">
              <motion.h2 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-semibold mb-3">Introduzione</motion.h2>
              <p className={theme.muted}>
                Voro ("la Piattaforma") mette al centro il controllo degli utenti e la trasparenza. La presente
                informativa descrive i tipi di dati che raccogliamo quando usi i nostri servizi, incluse le funzionalità
                di social feed, suggerimenti personalizzati e sincronizzazione multi-dispositivo. Leggi con attenzione
                per capire come trattiamo i tuoi dati e come esercitare i tuoi diritti.
              </p>
            </section>

            <section id="data-collected" className="mb-8">
              <motion.h2 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-semibold mb-3">Dati che raccogliamo</motion.h2>
              <p className={theme.muted}>
                Voro può raccogliere diverse categorie di informazioni personali, tra cui:
              </p>
              <ul className={theme.muted + " list-disc pl-5 mt-3 space-y-2"}>
                <li><strong>Dati di account:</strong> nome, indirizzo email, immagine profilo, preferenze pubbliche.</li>
                <li><strong>Attività sulla piattaforma:</strong> post, commenti, like, cronologia delle visualizzazioni e
                interazioni con i contenuti per migliorare raccomandazioni e ranking.</li>
                <li><strong>Dati tecnici:</strong> indirizzo IP, tipo di dispositivo, sistema operativo, identificatori
                univoci dei dispositivi e dati di connessione (log di accesso, timestamp).</li>
                <li><strong>Dati di pagamento (se applicabili):</strong> token o metadati necessari per processare transazioni
                attraverso fornitori terzi; Voro non conserva numero completo della carta sul nostro sistema.</li>
                <li><strong>Dati generati dagli utenti:</strong> contenuti che carichi o condividi (testi, immagini, video),
                inclusi quelli pubblici e privati secondo le tue impostazioni di visibilità.</li>
              </ul>
            </section>

            <section id="how-we-use" className="mb-8">
              <motion.h2 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-semibold mb-3">Come usiamo i dati</motion.h2>
              <p className={theme.muted}>
                I dati raccolti vengono impiegati per i seguenti scopi principali:
              </p>
              <ul className={theme.muted + " list-disc pl-5 mt-3 space-y-2"}>
                <li><strong>Personalizzazione:</strong> migliorare il feed e le raccomandazioni in base ai tuoi interessi.</li>
                <li><strong>Funzionalità social:</strong> abilitare messaggistica, follow, e condivisione tra utenti.</li>
                <li><strong>Sicurezza e conformità:</strong> rilevare abusi, frodi, o comportamenti che violano i termini di servizio.</li>
                <li><strong>Analisi e miglioramento:</strong> analizzare l'uso della piattaforma per sviluppare nuove funzionalità.</li>
                <li><strong>Supporto:</strong> rispondere a richieste di assistenza e gestire account e dispute.</li>
              </ul>
              <p className={theme.muted + " mt-3"}>
                Quando possibile, i dati vengono anonimizzati o aggregati per ridurre i rischi e proteggere la privacy.
                Il trattamento avviene nel rispetto delle leggi applicabili e solo per finalità legittime.
              </p>
            </section>

            <section id="cookies" className="mb-8">
              <motion.h2 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-semibold mb-3">Cookie e tecnologie di tracciamento</motion.h2>
              <p className={theme.muted}>
                Usiamo cookie e tecnologie simili (local storage, pixel di tracciamento) per vari scopi: mantenere la tua
                sessione, ricordare le preferenze, misurare le performance e fornire contenuti personalizzati. Puoi gestire
                le tue preferenze tramite le impostazioni del browser o il pannello privacy della piattaforma.
              </p>
              <p className={theme.muted + " mt-2"}>
                Tipologie comuni:
              </p>
              <ul className={theme.muted + " list-disc pl-5 mt-3 space-y-2"}>
                <li><strong>Cookie essenziali:</strong> necessari per il funzionamento del sito (autenticazione, sicurezza).</li>
                <li><strong>Cookie di preferenza:</strong> ricordano scelte dell'utente come lingua e tema.</li>
                <li><strong>Cookie analitici:</strong> raccolgono dati aggregati sull'utilizzo per migliorare i servizi.</li>
                <li><strong>Cookie pubblicitari:</strong> usati per mostrare annunci rilevanti; puoi disattivarli su base opt-out.</li>
              </ul>
            </section>

            <section id="third-parties" className="mb-8">
              <motion.h2 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-semibold mb-3">Servizi di terze parti</motion.h2>
              <p className={theme.muted}>
                Voro può utilizzare provider terzi per hosting, analytics, elaborazione pagamenti, distribuzione di contenuti
                (CDN) e servizi di autenticazione. Quando integri terze parti (es. login via social), tali servizi potrebbero
                raccogliere dati direttamente; ti consigliamo di leggere anche le loro informative sulla privacy.
              </p>
            </section>

            <section id="retention" className="mb-8">
              <motion.h2 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-semibold mb-3">Conservazione dei dati</motion.h2>
              <p className={theme.muted}>
                Conserviamo i dati per il tempo necessario a offrire i nostri servizi e per rispettare obblighi legali. Alcuni
                dati di sistema (log) possono essere conservati per periodi più lunghi a fini di sicurezza e analisi. Se desideri
                che i tuoi dati vengano cancellati, consulta la sezione "Diritti degli utenti" per le istruzioni su come procedere.
              </p>
            </section>

            <section id="rights" className="mb-8">
              <motion.h2 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-semibold mb-3">Diritti degli utenti</motion.h2>
              <p className={theme.muted}>
                A seconda della tua giurisdizione, puoi avere diritti quali accesso, rettifica, cancellazione, portabilità,
                opposizione al trattamento e limitazione. Per esercitare i tuoi diritti, contatta il nostro team (vedi sezione
                contatti) e forniremo istruzioni per verificare la tua identità e procedere.
              </p>
              <ul className={theme.muted + " list-disc pl-5 mt-3 space-y-2"}>
                <li><strong>Accesso:</strong> richiedere copia dei dati che conserviamo su di te.</li>
                <li><strong>Rettifica:</strong> correggere informazioni inesatte o incomplete.</li>
                <li><strong>Cancellazione:</strong> chiedere la rimozione dei dati (con alcune eccezioni legali).</li>
                <li><strong>Portabilità:</strong> ottenere una copia dei tuoi dati in formato strutturato e comune.</li>
              </ul>
            </section>

            <section id="security" className="mb-8">
              <motion.h2 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-semibold mb-3">Sicurezza dei dati</motion.h2>
              <p className={theme.muted}>
                La sicurezza è una priorità. Applichiamo misure tecniche e organizzative per proteggere i dati da accessi non
                autorizzati, perdita o divulgazione. Queste misure includono cifratura in transito (TLS), controlli di accesso,
                monitoraggio e routine di backup. Nessuna misura può garantire sicurezza assoluta, ma lavoriamo costantemente
                per mitigare i rischi.
              </p>
            </section>

            <section id="minors" className="mb-8">
              <motion.h2 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-semibold mb-3">Minori</motion.h2>
              <p className={theme.muted}>
                I servizi Voro non sono destinati a minori di 13 anni (o età equivalente nella tua giurisdizione). Non
                raccogliamo consapevolmente informazioni personali di minori; se ritieni che abbiamo raccolto dati di un minore,
                contattaci e provvederemo a eliminarli quando appropriato.
              </p>
            </section>

            <section id="changes" className="mb-8">
              <motion.h2 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-semibold mb-3">Modifiche a questa informativa</motion.h2>
              <p className={theme.muted}>
                Potremmo aggiornare la presente informativa periodicamente. Quando apportiamo cambiamenti significativi,
                ti informeremo tramite e-mail o con un avviso all'interno della piattaforma, indicando la data di entrata in
                vigore della nuova versione.
              </p>
            </section>

            <section id="contact" className="mb-8">
              <motion.h2 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-semibold mb-3">Contatti</motion.h2>
              <p className={theme.muted}>
                Per richieste relative alla privacy o per esercitare i tuoi diritti, puoi contattarci:
              </p>
              <ul className={theme.muted + " list-disc pl-5 mt-3 space-y-2"}>
                <li>Email: <a href="mailto:privacy@voro.example" className={theme.accent}>privacy@voro.example</a></li>
                <li>Indirizzo: Voro S.r.l., Via Esempio 10, 00100 Roma, Italy</li>
                <li>Tempo di risposta stimato: solitamente entro 30 giorni lavorativi</li>
              </ul>

              <p className={theme.muted + " mt-4"}>
                Grazie per aver letto la nostra informativa. La tua fiducia è importante: ci impegniamo a mantenere la
                tua esperienza su Voro sicura e trasparente.
              </p>
            </section>
          </article>
        </div>

        <div className="mt-6 text-center text-sm opacity-80 text-[#94A3B8]">© {new Date().getFullYear()} <a href="#" className="link-futuristic" onClick={() => window.open("https://github.com/ZygoteCode/", "_blank")}>ZygoteCode</a> — All rights reserved.</div>
      </main>

      <style>{`
        .prose p { margin-top: .6rem; margin-bottom: .6rem; }
        .prose ul { margin-top: .6rem; margin-bottom: .6rem; }
      `}</style>
    </div>
  );
}