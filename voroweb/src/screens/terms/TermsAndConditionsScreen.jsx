import { useEffect, useState, useCallback } from "react";
import { Sun, Moon, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const sections = [
  { id: "intro", title: "Introduzione" },
  { id: "acceptance", title: "Accettazione dei Termini" },
  { id: "accounts", title: "Registrazione e Account" },
  { id: "content", title: "Contenuti degli Utenti" },
  { id: "license", title: "Licenza e Uso Consentito" },
  { id: "prohibited", title: "Condotta Vietata" },
  { id: "payments", title: "Pagamenti e Servizi a Pagamento" },
  { id: "ip", title: "Proprietà Intellettuale" },
  { id: "liability", title: "Limitazione di Responsabilità" },
  { id: "indemnity", title: "Indennità" },
  { id: "termination", title: "Sospensione e Risoluzione" },
  { id: "changes", title: "Modifiche ai Termini" },
  { id: "governing", title: "Legge Applicabile" },
  { id: "contact", title: "Contatti" }
];

export default function TermsAndConditionsScreen({ onBack }) {
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
  };

  const handleBack = useCallback(() => {
    if (onBack) return onBack();
    if (window.history && window.history.length > 1) return window.history.back();
    window.location.href = "/";
  }, [onBack]);

  return (
    <div className={`min-h-screen transition-colors duration-300 p-6 ${theme.page}`}>
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
          className={`p-2 rounded-full cursor-pointer shadow-md transition hover:scale-105 focus:outline-none ${dark ? "bg-white/6" : "bg-white/80"}`}>
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>

      <main className="max-w-6xl mx-auto">
        <div className={`mx-auto ${theme.card} rounded-2xl shadow-xl p-8 md:p-12 transition-colors`}> 
          <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-bold mb-4">
            Terms & Conditions — Voro
          </motion.h1>

          <p className={`mb-6 ${theme.muted}`}>
            Benvenuto su Voro. Questi Termini e Condizioni regolano l'accesso e l'utilizzo dei servizi offerti da Voro
            (la "Piattaforma"). Utilizzando la Piattaforma accetti di rispettare e essere vincolato da questi termini.
            Se non sei d'accordo, non utilizzare i nostri servizi.
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
                Voro è una piattaforma dedicata a fornire feed personalizzati, raccomandazioni e strumenti di social
                interaction. Questi Termini disciplinano il rapporto tra te e Voro, incluse le responsabilità reciproche,
                l'uso accettabile della piattaforma e le condizioni per servizi a pagamento.
              </p>
            </section>

            <section id="acceptance" className="mb-8">
              <motion.h2 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-semibold mb-3">Accettazione dei Termini</motion.h2>
              <p className={theme.muted}>
                Registrandoti o usando i servizi di Voro dichiari di accettare questi Termini. Voro si riserva il diritto
                di modificare i Termini; cambiamenti significativi saranno comunicati attraverso la piattaforma o via email.
              </p>
              <p className={theme.muted + " mt-3"}>
                Ti consigliamo di controllare regolarmente questa pagina. L'uso continuato della Piattaforma dopo le modifiche
                costituisce accettazione dei nuovi termini.
              </p>
            </section>

            <section id="accounts" className="mb-8">
              <motion.h2 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-semibold mb-3">Registrazione e Account</motion.h2>
              <p className={theme.muted}>
                Per utilizzare alcune funzionalità devi creare un account. Sei responsabile della veridicità delle informazioni
                fornite e della riservatezza delle credenziali. Notifica immediatamente Voro in caso di accessi non autorizzati.
              </p>
              <p className={theme.muted + " mt-2"}>
                Non consentiamo la condivisione delle credenziali né l'uso di account falsi o ingannevoli. In caso di violazione
                possiamo sospendere o chiudere l'account.
              </p>
            </section>

            <section id="content" className="mb-8">
              <motion.h2 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-semibold mb-3">Contenuti degli Utenti</motion.h2>
              <p className={theme.muted}>
                Gli utenti possono caricare, pubblicare o condividere contenuti. Sei responsabile del materiale che pubblichi
                e garantisci di avere i diritti necessari. Voro può moderare contenuti che violano i Termini o le leggi vigenti.
              </p>
              <p className={theme.muted + " mt-2"}>
                Conservando o pubblicando contenuti, concedi a Voro una licenza non esclusiva, trasferibile e mondiale per
                utilizzare, distribuire e mostrare tali contenuti ai fini dell'erogazione del servizio.
              </p>
            </section>

            <section id="license" className="mb-8">
              <motion.h2 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-semibold mb-3">Licenza e Uso Consentito</motion.h2>
              <p className={theme.muted}>
                Vaglio concede all'utente una licenza limitata, non esclusiva, revocabile per utilizzare i servizi conformemente
                ai Termini. L'uso deve essere personale e non commerciale, salvo diverso accordo scritto con Voro.
              </p>
              <p className={theme.muted + " mt-2"}>
                Non devi tentare di interferire con la piattaforma, eseguire scraping non autorizzato o riprodurre parti del
                servizio senza permesso.
              </p>
            </section>

            <section id="prohibited" className="mb-8">
              <motion.h2 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-semibold mb-3">Condotta Vietata</motion.h2>
              <ul className={theme.muted + " list-disc pl-5 mt-3 space-y-2"}>
                <li>Fornire informazioni false o fuorvianti.</li>
                <li>Utilizzare la piattaforma per attività illegali, fraudolente o di hate speech.</li>
                <li>Effettuare scraping o accessi automatizzati non autorizzati.</li>
                <li>Diffondere malware, phishing o strumenti che compromettono la sicurezza di terzi.</li>
              </ul>
              <p className={theme.muted + " mt-2"}>
                La violazione può comportare la sospensione temporanea o definitiva dell'account e, se necessario, la segnalazione
                alle autorità competenti.
              </p>
            </section>

            <section id="payments" className="mb-8">
              <motion.h2 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-semibold mb-3">Pagamenti e Servizi a Pagamento</motion.h2>
              <p className={theme.muted}>
                Alcune funzionalità di Voro possono essere offerte dietro pagamento. Le transazioni sono processate tramite
                provider terzi sicuri; Voro non memorizza numeri completi di carte di credito. I prezzi, le condizioni di rimborso
                e la fatturazione sono specificati al momento dell'acquisto.
              </p>
              <p className={theme.muted + " mt-2"}>
                In caso di pagamenti ricorrenti, puoi gestire o annullare l'abbonamento dal tuo account. Eventuali cancellazioni
                non danno diritto a rimborsi retroattivi salvo diversa indicazione.
              </p>
            </section>

            <section id="ip" className="mb-8">
              <motion.h2 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-semibold mb-3">Proprietà Intellettuale</motion.h2>
              <p className={theme.muted}>
                Tutti i contenuti originali della piattaforma (design, marchi, codice, testi) sono di proprietà di Voro o
                dei rispettivi licenzianti. L'utente non acquisisce diritti di proprietà su tali contenuti, se non quanto
                espressamente previsto in questi Termini.
              </p>
            </section>

            <section id="liability" className="mb-8">
              <motion.h2 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-semibold mb-3">Limitazione di Responsabilità</motion.h2>
              <p className={theme.muted}>
                Nella misura massima consentita dalla legge, Voro non sarà responsabile per danni indiretti, consequenziali,
                perdita di profitti o dati derivanti dall'uso o dall'incapacità di usare la piattaforma. La responsabilità totale
                di Voro per qualsiasi reclamo sarà limitata, nella misura massima consentita, all'importo pagato dall'utente nei
                12 mesi precedenti il reclamo o a un importo simbolico se non sono stati effettuati pagamenti.
              </p>
            </section>

            <section id="indemnity" className="mb-8">
              <motion.h2 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-semibold mb-3">Indennità</motion.h2>
              <p className={theme.muted}>
                Accetti di manlevare e tenere indenne Voro, i suoi dipendenti e partner da qualsiasi reclamo, perdita o danno
                derivante dalla tua violazione dei Termini o dall'uso improprio dei servizi.
              </p>
            </section>

            <section id="termination" className="mb-8">
              <motion.h2 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-semibold mb-3">Sospensione e Risoluzione</motion.h2>
              <p className={theme.muted}>
                Voro può sospendere o terminare l'accesso di un utente in caso di violazioni gravi o ripetute. In caso di terminazione,
                alcune informazioni possono essere mantenute per obblighi legali o per risolvere controversie.
              </p>
            </section>

            <section id="changes" className="mb-8">
              <motion.h2 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-semibold mb-3">Modifiche ai Termini</motion.h2>
              <p className={theme.muted}>
                Possiamo aggiornare questi Termini periodicamente. Per cambiamenti sostanziali avviseremo con notifiche
                visibili nella piattaforma o tramite email. È tua responsabilità verificare i Termini regolarmente.
              </p>
            </section>

            <section id="governing" className="mb-8">
              <motion.h2 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-semibold mb-3">Legge Applicabile e Foro Competente</motion.h2>
              <p className={theme.muted}>
                Questi Termini sono regolati dalla legge italiana. Per le controversie sarà competente, salvo diversa
                disposizione di legge, il Foro competente indicato nella sede legale di Voro.
              </p>
            </section>

            <section id="contact" className="mb-8">
              <motion.h2 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-semibold mb-3">Contatti</motion.h2>
              <p className={theme.muted}>
                Per domande relative ai Termini o per segnalare abusi, contatta il team di Voro:
              </p>
              <ul className={theme.muted + " list-disc pl-5 mt-3 space-y-2"}>
                <li>Email: <a href="mailto:legal@voro.example" className={theme.accent}>legal@voro.example</a></li>
                <li>Indirizzo: Voro S.r.l., Via Esempio 10, 00100 Roma, Italy</li>
                <li>Tempo di risposta stimato: solitamente entro 30 giorni lavorativi</li>
              </ul>

              <p className={theme.muted + " mt-4"}>
                Grazie per aver scelto Voro. Ti invitiamo a leggere anche la nostra Privacy Policy per informazioni sul trattamento
                dei dati personali.
              </p>
            </section>
          </article>
        </div>

        <div className="mt-6 text-center text-sm opacity-80 text-[#94A3B8]">© {new Date().getFullYear()} <a href="#" className="link-futuristic" onClick={() => window.open("https://github.com/ZygoteCode/", "_blank")}>ZygoteCode</a> — All rights reserved.</div>
      </main>

      <style>{` .prose p { margin-top: .6rem; margin-bottom: .6rem; } .prose ul { margin-top: .6rem; margin-bottom: .6rem; } `}</style>
    </div>
  );
}