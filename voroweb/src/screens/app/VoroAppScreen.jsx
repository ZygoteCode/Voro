import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Moon,
  Settings,
  Search,
  Plus,
  Paperclip,
  Send,
  MoreVertical,
  UserPlus,
  User,
  Slash,
  ArrowLeftCircle,
  MessageSquare,
  X,
  Check,
  Shield,
  Palette,
  LogOut,
  Bell,
  UserCircle,
} from "lucide-react";

// Voro Messaging App (single-file React component)
// REQUISITI: Tailwind CSS, framer-motion, lucide-react
//
// NOTE DI REFACTOR:
// 1.  LAYOUT FULL-SCREEN: Rimosso 'max-w-7xl mx-auto p-4'. L'app ora usa 'flex h-screen'
//     per un layout edge-to-edge.
// 2.  SIDEBAR (WhatsApp-style): La sidebar ora è 'w-[320px] h-full', fissa a sinistra.
//     La lista chat interna ora è 'flex-1' e scrollabile, occupando lo spazio.
// 3.  MAIN CONTENT (Telegram-style): Il main è 'flex-1 h-full'.
// 4.  CHAT OVERFLOW FIX: La vista chat ('ChatView') ora usa 'flex flex-col h-full'.
//     L'area messaggi ('flex-1 overflow-y-auto') si adatta e scrolla.
// 5.  FRIENDS VIEW (Discord-style): La griglia amici è stata sostituita da un elenco
//     verticale con avatar, nome e azioni a destra.
// 6.  SETTINGS MODAL: Il modale impostazioni è stato completamente implementato
//     con navigazione interna (Account, Aspetto, Privacy).
// 7.  CHAT TEXT WRAP FIX: Aggiunta classe 'break-words' al bubble dei messaggi
//     per gestire stringhe lunghe senza spazi (come da screenshot).

// --- Componenti UI Helper ---

/**
 * Avatar utente con status dot
 */
function Avatar({ friend, size = "md" }) {
  const sizes = {
    sm: "w-10 h-10",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };
  const statusColors = {
    online: "bg-green-400",
    away: "bg-yellow-400",
    blocked: "bg-red-500",
    offline: "bg-slate-400",
  };

  return (
    <div className={`relative flex-shrink-0 ${sizes[size]}`}>
      <div
        className={`w-full h-full rounded-full flex items-center justify-center text-white font-medium ${
          friend.avatarColor
        } ${size === "lg" ? "text-2xl" : ""}`}
      >
        {friend.name[0]}
      </div>
      <span
        className={`absolute right-0 bottom-0 block w-3.5 h-3.5 rounded-full border-2 dark:border-[#071025] border-white ${
          statusColors[friend.status]
        }`}
      />
    </div>
  );
}

/**
 * Sidebar
 */
function Sidebar({
  dark,
  setDark,
  chats,
  friends,
  selectedChatId,
  setSelectedChatId,
  setShowSettings,
  setShowAddModal,
}) {
  const [sidebarQuery, setSidebarQuery] = useState("");

  const getFriend = (id) =>
    friends.find((f) => f.id === id) || {
      name: "Sconosciuto",
      avatarColor: "bg-slate-400",
      status: "offline",
    };

  function timeHHMM(ts) {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  const filteredChats = useMemo(() => {
    if (!sidebarQuery.trim()) return chats;
    const q = sidebarQuery.toLowerCase();
    return chats.filter((c) => {
      const name = getFriend(c.friendId).name.toLowerCase();
      return (
        name.includes(q) || (c.lastMessage || "").toLowerCase().includes(q)
      );
    });
  }, [sidebarQuery, chats, friends]);

  return (
    <aside
      className={`w-[320px] h-full flex flex-col ${
        dark ? "bg-[#0B152B] text-white" : "bg-white text-[#0F1724]"
      } border-r ${dark ? "border-white/10" : "border-slate-200"}`}
    >
      {/* Header Sidebar */}
      <div className="p-4 flex items-center justify-between border-b border-inherit">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${"bg-indigo-500"}`}
            >
              V
            </div>
            <span
              className={`absolute right-0 bottom-0 block w-3 h-3 rounded-full border-2 ${
                dark ? "border-[#0B152B]" : "border-white"
              } ${"bg-green-400"}`}
            />
          </div>
          <div>
            <div className="text-sm font-semibold">you@voro</div>
            <div className="text-xs opacity-80">Online</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(true)}
            className={`p-2 rounded-md ${
              dark ? "hover:bg-white/10" : "hover:bg-slate-100"
            }`}
            aria-label="Impostazioni"
          >
            <Settings size={18} />
          </button>
          <button
            onClick={() => setDark((d) => !d)}
            className={`p-2 rounded-md ${
              dark ? "hover:bg-white/10" : "hover:bg-slate-100"
            }`}
            aria-label="Tema"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>

      {/* Nav Amici + Search */}
      <div className="p-4 space-y-3">
        <button
          onClick={() => setSelectedChatId(null)}
          className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-md font-semibold ${
            selectedChatId === null
              ? dark
                ? "bg-white/10"
                : "bg-[#E6F0FF]"
              : dark
              ? "hover:bg-white/5"
              : "hover:bg-slate-50"
          }`}
        >
          <User size={18} /> Amici
        </button>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60">
            <Search size={16} />
          </span>
          <input
            value={sidebarQuery}
            onChange={(e) => setSidebarQuery(e.target.value)}
            placeholder="Cerca chat o amici"
            className={`w-full pl-10 pr-3 py-2 rounded-md bg-transparent border ${
              dark ? "border-white/20" : "border-[#E6EDF5]"
            } focus:ring-2 focus:ring-[#1877F2]/20 outline-none`}
          />
        </div>
      </div>

      {/* Lista Chat */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-2 px-4">
        <div
          className={`text-xs ${
            dark ? "text-slate-400" : "text-[#64748B]"
          } uppercase tracking-wider mb-2 sticky top-0 ${
            dark ? "bg-[#0B152B]" : "bg-white"
          } py-2`}
        >
          Chat Aperte
        </div>
        {filteredChats.length === 0 && (
          <div className="text-sm opacity-60 text-center py-4">
            Nessuna chat trovata
          </div>
        )}
        {filteredChats.map((c) => {
          const f = getFriend(c.friendId);
          return (
            <button
              key={c.id}
              onClick={() => setSelectedChatId(c.id)}
              className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-md ${
                selectedChatId === c.id
                  ? dark
                    ? "bg-white/10"
                    : "bg-[#E6F0FF]"
                  : dark
                  ? "hover:bg-white/5"
                  : "hover:bg-slate-50"
              }`}
            >
              <Avatar friend={f} size="sm" />
              <div className="flex-1 text-sm overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{f.name}</div>
                  <div className="text-xs opacity-60 flex-shrink-0">
                    {timeHHMM(c.lastAt)}
                  </div>
                </div>
                <div className="text-xs opacity-70 truncate">
                  {c.lastMessage}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Sidebar */}
      <div
        className={`p-4 border-t border-inherit text-xs ${
          dark ? "text-slate-400" : "text-[#64748B]"
        } flex items-center justify-between`}
      >
        <div>voro · messaging</div>
        <button
          onClick={() => {
            setSelectedChatId(null);
            setShowAddModal(true);
          }}
          className={`p-2 rounded-md ${
            dark ? "hover:bg-white/10" : "hover:bg-slate-100"
          }`}
          aria-label="Aggiungi Amico"
        >
          <UserPlus size={16} />
        </button>
      </div>
    </aside>
  );
}

/**
 * Vista Amici (Discord-style)
 */
function FriendsView({
  friends,
  sidebarQuery,
  setShowAddModal,
  setShowBlockConfirm,
  openChatWithFriend,
  dark,
}) {
  const [friendsTab, setFriendsTab] = useState("all"); // all, blocked, add

  const filteredFriends = useMemo(() => {
    const q = sidebarQuery.toLowerCase();
    return friends
      .filter((f) =>
        friendsTab === "all"
          ? f.status !== "blocked"
          : friendsTab === "blocked"
          ? f.status === "blocked"
          : true
      )
      .filter((f) => f.name.toLowerCase().includes(q));
  }, [friends, friendsTab, sidebarQuery]);

  const tabs = [
    { id: "all", label: "Tutti" },
    { id: "blocked", label: "Bloccati" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header Vista Amici */}
      <div
        className={`p-4 flex items-center justify-between border-b ${
          dark ? "border-white/10" : "border-slate-200"
        }`}
      >
        <div>
          <h2 className="text-xl font-bold">Amici</h2>
          <p className="text-sm opacity-80">
            Gestisci le tue connessioni
          </p>
        </div>
        <div className="flex items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFriendsTab(tab.id)}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                friendsTab === tab.id
                  ? "bg-[#1877F2] text-white"
                  : dark
                  ? "hover:bg-white/10"
                  : "hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
          <button
            onClick={() => setShowAddModal(true)}
            className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
              dark
                ? "bg-white/10 hover:bg-white/20"
                : "bg-slate-100 hover:bg-slate-200"
            }`}
          >
            <UserPlus size={16} /> Aggiungi
          </button>
        </div>
      </div>

      {/* Lista Amici */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <h3
          className={`text-sm font-semibold ${
            dark ? "text-slate-400" : "text-slate-600"
          } uppercase tracking-wider mb-3`}
        >
          {friendsTab === "all" ? "Amici" : "Bloccati"} (
          {filteredFriends.length})
        </h3>
        {filteredFriends.length === 0 && (
          <div className="text-center py-10 opacity-60">
            Nessun amico in questa sezione.
          </div>
        )}
        {filteredFriends.map((f) => (
          <div
            key={f.id}
            className={`p-3 rounded-lg ${
              dark ? "hover:bg-white/5" : "hover:bg-slate-50"
            } flex items-center justify-between border ${
              dark ? "border-white/10" : "border-transparent"
            }`}
          >
            {/* Info Utente */}
            <div className="flex items-center gap-3">
              <Avatar friend={f} size="sm" />
              <div>
                <div className="font-semibold">{f.name}</div>
                <div className="text-xs opacity-70 capitalize">{f.status}</div>
              </div>
            </div>

            {/* Azioni */}
            <div className="flex items-center gap-2">
              {f.status !== "blocked" && (
                <button
                  onClick={() => openChatWithFriend(f.id)}
                  title="Invia Messaggio"
                  className={`p-2 rounded-full ${
                    dark
                      ? "bg-white/10 hover:bg-white/20"
                      : "bg-slate-100 hover:bg-slate-200"
                  }`}
                >
                  <MessageSquare size={18} />
                </button>
              )}
              <button
                onClick={() => setShowBlockConfirm(f.id)}
                title="Blocca Utente"
                className={`p-2 rounded-full text-red-500 ${
                  dark
                    ? "hover:bg-red-500/10"
                    : "hover:bg-red-500/10"
                }`}
              >
                <Slash size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Vista Chat (Telegram-style)
 */
function ChatView({
  chat,
  friend,
  messages,
  dark,
  sendMessage,
  setSelectedChatId,
}) {
  const [composer, setComposer] = useState("");
  const composerRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll all'ultimo messaggio
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Auto-resize della textarea
  function handleComposerChange(e) {
    setComposer(e.target.value);
    if (composerRef.current) {
      composerRef.current.style.height = "auto";
      composerRef.current.style.height = `${composerRef.current.scrollHeight}px`;
    }
  }

  function handleSend() {
    if (!composer.trim()) return;
    sendMessage(chat.id, composer);
    setComposer("");
    if (composerRef.current) {
      composerRef.current.style.height = "auto";
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function timeHHMM(ts) {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  // Sfondo chat stile Telegram/WhatsApp
  const chatBgStyle = dark
    ? { backgroundColor: "#071025" } // Sfondo scuro base
    : {
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm44 44c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm44-44c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zM11 82c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm44 0c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7z' fill='%23DCEAF7' fill-opacity='0.6' fill-rule='evenodd'/%3E%3C/svg%3E\")",
        backgroundColor: "#F0F4F8", // Sfondo chiaro
      };

  return (
    <div className="flex flex-col h-full">
      {/* Header Chat */}
      <div
        className={`p-4 flex items-center justify-between border-b ${
          dark ? "border-white/10 bg-[#0B152B]" : "border-slate-200 bg-white"
        } flex-shrink-0`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedChatId(null)}
            className={`p-2 rounded-full -ml-2 ${
              dark ? "hover:bg-white/10" : "hover:bg-slate-100"
            }`}
            aria-label="Indietro"
          >
            <ArrowLeftCircle size={20} />
          </button>
          <Avatar friend={friend} size="sm" />
          <div>
            <div className="font-semibold">{friend.name}</div>
            <div className="text-xs opacity-70 capitalize">{friend.status}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className={`p-2 rounded-md ${
              dark ? "hover:bg-white/10" : "hover:bg-slate-100"
            }`}
            aria-label="Cerca in chat"
          >
            <Search size={18} />
          </button>
          <button
            className={`p-2 rounded-md ${
              dark ? "hover:bg-white/10" : "hover:bg-slate-100"
            }`}
            aria-label="Altre azioni"
          >
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      {/* Area Messaggi */}
      <div
        className="flex-1 overflow-y-auto p-4"
        style={chatBgStyle}
      >
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className={`flex ${
                m.fromMe ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] p-3 rounded-2xl whitespace-pre-wrap break-words ${
                  m.fromMe
                    ? "bg-[#1877F2] text-white rounded-br-lg"
                    : dark
                    ? "bg-white/10 text-white rounded-bl-lg"
                    : "bg-white text-[#0F1724] shadow-sm rounded-bl-lg"
                }`}
              >
                {m.text}
                <div
                  className={`text-xs ${
                    m.fromMe ? "text-white/70" : "text-inherit/60"
                  } mt-1 text-right`}
                >
                  {timeHHMM(m.at)}
                </div>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Composer */}
      <div
        className={`p-4 flex items-end gap-3 border-t ${
          dark ? "border-white/10 bg-[#0B152B]" : "border-slate-200 bg-white/80"
        } backdrop-blur-sm flex-shrink-0`}
      >
        <button
          className={`p-3 h-[44px] rounded-full ${
            dark ? "hover:bg-white/10" : "hover:bg-slate-100"
          }`}
          aria-label="Allega"
        >
          <Paperclip size={18} />
        </button>
        <textarea
          ref={composerRef}
          value={composer}
          onChange={handleComposerChange}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Scrivi un messaggio..."
          className={`flex-1 resize-none p-3 max-h-40 rounded-xl border ${
            dark ? "border-white/20" : "border-[#E6EDF5]"
          } bg-transparent outline-none focus:ring-2 focus:ring-[#1877F2]/20`}
          style={{ height: "44px" }} // Altezza iniziale
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 h-[44px] rounded-lg bg-[#1877F2] text-white flex items-center justify-center gap-2"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

/**
 * Modale Impostazioni (Implementato)
 */
function SettingsModal({ show, onClose, dark, setDark, friends }) {
  const [tab, setTab] = useState("account");

  const navItems = [
    { id: "account", label: "Il mio Account", icon: UserCircle },
    { id: "appearance", label: "Aspetto", icon: Palette },
    { id: "privacy", label: "Privacy e Sicurezza", icon: Shield },
    { id: "notifications", label: "Notifiche", icon: Bell },
  ];

  const blockedFriends = friends.filter((f) => f.status === "blocked");

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className={`w-full max-w-4xl h-[80vh] rounded-2xl ${
              dark ? "bg-[#071025] text-white" : "bg-white text-[#0F1724]"
            } shadow-xl flex overflow-hidden`}
          >
            {/* Navigazione Impostazioni */}
            <div
              className={`w-64 p-4 space-y-2 border-r ${
                dark ? "border-white/10 bg-[#0B152B]" : "border-slate-200 bg-slate-50"
              } flex-shrink-0 flex flex-col`}
            >
              <div className="flex-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setTab(item.id)}
                    className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-md font-medium text-sm ${
                      tab === item.id
                        ? dark
                          ? "bg-white/10"
                          : "bg-[#E6F0FF]"
                        : dark
                        ? "hover:bg-white/5 opacity-70"
                        : "hover:bg-slate-200 opacity-80"
                    }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </button>
                ))}
              </div>
              <button
                className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-md font-medium text-sm ${
                  dark
                    ? "hover:bg-white/5 opacity-70"
                    : "hover:bg-slate-200 opacity-80"
                }`}
              >
                <LogOut size={18} />
                Esci
              </button>
            </div>

            {/* Contenuto Impostazioni */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex items-center justify-end mb-4">
                <button
                  onClick={onClose}
                  className={`p-2 rounded-full ${
                    dark ? "hover:bg-white/10" : "hover:bg-slate-100"
                  }`}
                  aria-label="Chiudi"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Tab: Il mio Account */}
              {tab === "account" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Il mio Account</h2>
                  <div
                    className={`p-6 rounded-lg ${
                      dark ? "bg-white/5" : "bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar
                        friend={{
                          name: "V",
                          avatarColor: "bg-indigo-500",
                          status: "online",
                        }}
                        size="lg"
                      />
                      <div>
                        <h3 className="text-xl font-semibold">you@voro</h3>
                        <p className="text-sm opacity-80">
                          Il tuo account Voro
                        </p>
                      </div>
                    </div>
                    <button className="mt-4 px-3 py-2 rounded-md bg-[#1877F2] text-white text-sm">
                      Modifica Profilo
                    </button>
                  </div>
                </div>
              )}

              {/* Tab: Aspetto */}
              {tab === "appearance" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Aspetto</h2>
                  <div
                    className={`p-4 rounded-lg ${
                      dark ? "bg-white/5" : "bg-slate-50"
                    }`}
                  >
                    <h3 className="font-semibold mb-3">Tema App</h3>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setDark(false)}
                        className={`flex-1 p-4 rounded-lg border-2 ${
                          !dark
                            ? "border-[#1877F2]"
                            : "border-transparent opacity-60"
                        } ${dark ? "bg-white/10" : "bg-white"}`}
                      >
                        <Sun className="mb-2" />
                        Chiaro
                      </button>
                      <button
                        onClick={() => setDark(true)}
                        className={`flex-1 p-4 rounded-lg border-2 ${
                          dark
                            ? "border-[#1877F2]"
                            : "border-transparent opacity-60"
                        } ${dark ? "bg-black/20" : "bg-slate-800 text-white"}`}
                      >
                        <Moon className="mb-2" />
                        Scuro
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Privacy */}
              {tab === "privacy" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Privacy e Sicurezza</h2>
                  <div
                    className={`p-4 rounded-lg ${
                      dark ? "bg-white/5" : "bg-slate-50"
                    }`}
                  >
                    <h3 className="font-semibold mb-3">Utenti Bloccati</h3>
                    <p className="text-sm opacity-80 mb-4">
                      Gli utenti bloccati non potranno inviarti messaggi.
                    </p>
                    <div className="space-y-2">
                      {blockedFriends.length === 0 && (
                        <p className="text-sm opacity-60">Nessun utente bloccato.</p>
                      )}
                      {blockedFriends.map((f) => (
                        <div
                          key={f.id}
                          className={`p-3 rounded-md ${
                            dark ? "bg-black/20" : "bg-white"
                          } flex items-center justify-between`}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar friend={f} size="sm" />
                            <div className="font-medium">{f.name}</div>
                          </div>
                          <button className="px-3 py-1 rounded-md bg-red-600 text-white text-sm">
                            Sblocca
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
                
              {/* Tab: Notifiche (Placeholder) */}
              {tab === "notifications" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Notifiche</h2>
                  <div
                    className={`p-4 rounded-lg ${
                      dark ? "bg-white/5" : "bg-slate-50"
                    }`}
                  >
                    <h3 className="font-semibold mb-3">Impostazioni Notifiche</h3>
                    <p className="text-sm opacity-80">
                      Controlli per suoni, badge e altro (non implementato).
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Modale Aggiungi Amico
 */
function AddFriendModal({ show, onClose, onAdd, dark }) {
  const [name, setName] = useState("");

  function handleAdd() {
    if (!name.trim()) return;
    onAdd(name);
    setName("");
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className={`w-full max-w-md p-6 rounded-2xl ${
              dark ? "bg-[#071025] text-white" : "bg-white text-[#0F1724]"
            } shadow-xl`}
          >
            <h3 className="text-xl font-bold mb-2">Aggiungi un amico</h3>
            <p className="text-sm opacity-80 mb-4">
              Inserisci il nome utente della persona che vuoi aggiungere.
            </p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="username"
              className={`w-full p-3 rounded-md border ${
                dark ? "border-white/10" : "border-[#E6EDF5]"
              } mb-4 bg-transparent`}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-3 py-2 rounded-md"
              >
                Annulla
              </button>
              <button
                onClick={handleAdd}
                className="px-3 py-2 rounded-md bg-[#1877F2] text-white"
              >
                Aggiungi
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Modale Conferma Blocco
 */
function BlockConfirmModal({ friend, onConfirm, onCancel, dark }) {
  return (
    <AnimatePresence>
      {friend && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className={`w-full max-w-sm p-6 rounded-2xl ${
              dark ? "bg-[#071025] text-white" : "bg-white text-[#0F1724]"
            } shadow-xl`}
          >
            <h4 className="text-lg font-semibold mb-2">
              Bloccare {friend.name}?
            </h4>
            <p className="text-sm opacity-80 mb-4">
              Sarà spostato nell'elenco bloccati e non potrà inviarti messaggi.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={onCancel} className="px-3 py-2 rounded-md">
                Annulla
              </button>
              <button
                onClick={() => onConfirm(friend.id)}
                className="px-3 py-2 rounded-md bg-red-600 text-white"
              >
                Blocca
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// --- Componente App Principale ---

export default function VoroAppScreen() {
  // === STATE ===
  const [dark, setDark] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("prefersDark")) ?? false;
    } catch {
      return false;
    }
  });

  const [friends, setFriends] = useState([
    { id: "u1", name: "Arianna", status: "online", avatarColor: "bg-pink-500" },
    { id: "u2", name: "Luca", status: "away", avatarColor: "bg-yellow-500" },
    { id: "u3", name: "Marco", status: "offline", avatarColor: "bg-slate-400" },
    { id: "u4", name: "Giulia", status: "online", avatarColor: "bg-cyan-400" },
    { id: "u5", name: "Elena", status: "online", avatarColor: "bg-emerald-400" },
  ]);

  const [chats, setChats] = useState([
    {
      id: "c1",
      friendId: "u1",
      lastMessage: "Ci vediamo dopo!",
      lastAt: Date.now() - 1000 * 60 * 60,
    },
    {
      id: "c2",
      friendId: "u2",
      lastMessage: "Guarda questo",
      lastAt: Date.now() - 1000 * 60 * 30,
    },
    {
      id: "c3",
      friendId: "u4",
      lastMessage: "Finiamo stasera.",
      lastAt: Date.now() - 1000 * 60 * 10,
    },
  ]);

  const [messagesMap, setMessagesMap] = useState({
    c1: [
      {
        id: "m1",
        fromMe: false,
        text: "Ehi, come va?",
        at: Date.now() - 1000 * 60 * 60 * 5,
      },
      {
        id: "m2",
        fromMe: true,
        text: "Tutto bene! Sto lavorando alla feature.\nSarà pronta oggi.",
        at: Date.now() - 1000 * 60 * 60 * 4.5,
      },
      {
        id: "m3",
        fromMe: false,
        text: "Perfetto — pingami quando è live.",
        at: Date.now() - 1000 * 60 * 60 * 4,
      },
    ],
    c2: [
      {
        id: "m1",
        fromMe: false,
        text: "Guarda questo screenshot",
        at: Date.now() - 1000 * 60 * 40,
      },
    ],
    c3: [],
  });

  const [selectedChatId, setSelectedChatId] = useState(null); // null -> mostra Amici
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBlockConfirm, setShowBlockConfirm] = useState(null); // friend id
  const [showSettings, setShowSettings] = useState(false);

  // === EFFETTI ===
  useEffect(() => {
    try {
      localStorage.setItem("prefersDark", JSON.stringify(dark));
    } catch {}
  }, [dark]);

  // === FUNZIONI ===
  const getFriend = (id) =>
    friends.find((f) => f.id === id) || {
      name: "Sconosciuto",
      avatarColor: "bg-slate-400",
      status: "offline",
    };

  function sendMessage(chatId, text) {
    const newMsg = {
      id: `m${Date.now()}`,
      fromMe: true,
      text: text,
      at: Date.now(),
    };
    setMessagesMap((m) => ({ ...m, [chatId]: [...(m[chatId] || []), newMsg] }));
    setChats((cs) =>
      cs.map((c) =>
        c.id === chatId
          ? { ...c, lastMessage: newMsg.text, lastAt: newMsg.at }
          : c
      )
    );
    // Simula risposta
    setTimeout(() => {
      const reply = {
        id: `m${Date.now() + 1}`,
        fromMe: false,
        text: "Ok — ricevuto!",
        at: Date.now(),
      };
      setMessagesMap((m) => ({
        ...m,
        [chatId]: [...(m[chatId] || []), reply],
      }));
      setChats((cs) =>
        cs.map((c) =>
          c.id === chatId
            ? { ...c, lastMessage: reply.text, lastAt: reply.at }
            : c
        )
      );
    }, 900);
  }

  function openChatWithFriend(friendId) {
    const existing = chats.find((c) => c.friendId === friendId);
    if (existing) return setSelectedChatId(existing.id);
    const newChat = {
      id: `c${Date.now()}`,
      friendId,
      lastMessage: "",
      lastAt: Date.now(),
    };
    setChats((c) => [newChat, ...c]);
    setMessagesMap((m) => ({ ...m, [newChat.id]: [] }));
    setSelectedChatId(newChat.id);
  }

  function addFriend(name) {
    const id = `u${Date.now()}`;
    const newF = {
      id,
      name,
      status: "online",
      avatarColor: "bg-violet-400",
    };
    setFriends((s) => [newF, ...s]);
    setShowAddModal(false);
  }

  function blockFriend(id) {
    setFriends((s) =>
      s.map((f) => (f.id === id ? { ...f, status: "blocked" } : f))
    );
    setShowBlockConfirm(null);
    const ch = chats.find((c) => c.friendId === id);
    if (ch && ch.id === selectedChatId) {
      setSelectedChatId(null);
    }
  }

  // === MEMO ===
  const selectedChat = useMemo(
    () => chats.find((c) => c.id === selectedChatId),
    [selectedChatId, chats]
  );
  const selectedFriend = useMemo(
    () => (selectedChat ? getFriend(selectedChat.friendId) : null),
    [selectedChat, friends]
  );
  const selectedMessages = useMemo(
    () => messagesMap[selectedChatId] || [],
    [selectedChatId, messagesMap]
  );
  const friendToBlock = useMemo(
    () => (showBlockConfirm ? getFriend(showBlockConfirm) : null),
    [showBlockConfirm, friends]
  );

  // === RENDER ===
  return (
    <div
      className={`flex h-screen overflow-hidden ${
        dark
          ? "min-h-screen bg-[#071025] text-white"
          : "min-h-screen bg-gradient-to-br from-[#E9F2FF] to-white text-[#0F1724]"
      }`}
    >
      <Sidebar
        dark={dark}
        setDark={setDark}
        chats={chats}
        friends={friends}
        selectedChatId={selectedChatId}
        setSelectedChatId={setSelectedChatId}
        setShowSettings={setShowSettings}
        setShowAddModal={setShowAddModal}
      />

      <main className="flex-1 h-full">
        {selectedChatId === null ? (
          <FriendsView
            friends={friends}
            sidebarQuery={""} // Puoi passare lo state della query se vuoi che cerchi anche qui
            setShowAddModal={setShowAddModal}
            setShowBlockConfirm={setShowBlockConfirm}
            openChatWithFriend={openChatWithFriend}
            dark={dark}
          />
        ) : (
          <ChatView
            chat={selectedChat}
            friend={selectedFriend}
            messages={selectedMessages}
            dark={dark}
            sendMessage={sendMessage}
            setSelectedChatId={setSelectedChatId}
          />
        )}
      </main>

      {/* Modali */}
      <AddFriendModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addFriend}
        dark={dark}
      />
      <BlockConfirmModal
        friend={friendToBlock}
        onCancel={() => setShowBlockConfirm(null)}
        onConfirm={blockFriend}
        dark={dark}
      />
      <SettingsModal
        show={showSettings}
        onClose={() => setShowSettings(false)}
        dark={dark}
        setDark={setDark}
        friends={friends}
      />
    </div>
  );
}