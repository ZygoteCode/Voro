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
  Circle,
  CircleDot,
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
function Avatar({ friend, size = "md", showStatus = true }) {
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
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-full h-full rounded-full flex items-center justify-center text-white font-medium ${
          friend.avatarColor
        } ${size === "lg" ? "text-2xl" : ""}`}
      >
        {friend.name[0]}
      </motion.div>
      {showStatus && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`absolute right-0 bottom-0 block w-3.5 h-3.5 rounded-full border-2 dark:border-[#071025] border-white ${
            statusColors[friend.status]
          }`}
        />
      )}
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
  notificationCount,
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
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${"bg-indigo-500"}`}
            >
              V
            </motion.div>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`absolute right-0 bottom-0 block w-3 h-3 rounded-full border-2 ${
                dark ? "border-[#0B152B]" : "border-white"
              } ${"bg-green-400"}`}
            />
          </div>
          <div className="relative">
            <div className="text-sm font-semibold">you@voro</div>
            <div className="text-xs opacity-80">Online</div>
            {notificationCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
              >
                {notificationCount}
              </motion.div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowSettings(true)}
            className={`p-2 rounded-md ${
              dark ? "hover:bg-white/10" : "hover:bg-slate-100"
            }`}
            aria-label="Impostazioni"
          >
            <Settings size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setDark((d) => !d)}
            className={`p-2 rounded-md ${
              dark ? "hover:bg-white/10" : "hover:bg-slate-100"
            }`}
            aria-label="Tema"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>
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

      {/* Lista Chat - WhatsApp Style */}
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
          // Determine if this chat has unread messages (for demo purposes, we'll simulate this)
          const hasUnread = c.lastMessage && !c.lastMessage.startsWith("You:");
          
          return (
            <motion.button
              key={c.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ x: 5 }}
              onClick={() => setSelectedChatId(c.id)}
              className={`w-full text-left flex items-center gap-3 px-3 py-3 rounded-lg ${
                selectedChatId === c.id
                  ? dark
                    ? "bg-white/10"
                    : "bg-[#E6F0FF]"
                  : dark
                  ? "hover:bg-white/5"
                  : "hover:bg-slate-50"
              }`}
            >
              <div className="relative">
                <Avatar friend={f} size="sm" />
                {hasUnread && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    1
                  </motion.div>
                )}
              </div>
              <div className="flex-1 text-sm overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{f.name}</div>
                  <div className="text-xs opacity-60 flex-shrink-0">
                    {timeHHMM(c.lastAt)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className={`text-xs truncate ${hasUnread ? "font-semibold" : "opacity-70"}`}>
                    {c.lastMessage}
                  </div>
                  {hasUnread && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-[#1877F2] rounded-full w-2 h-2 flex-shrink-0 ml-2"
                    />
                  )}
                </div>
              </div>
            </motion.button>
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
    { id: "online", label: "Online" },
    { id: "blocked", label: "Bloccati" },
  ];

  // Group friends by status for Discord-like appearance
  const groupedFriends = useMemo(() => {
    const groups = {};
    filteredFriends.forEach(friend => {
      const status = friend.status;
      if (!groups[status]) {
        groups[status] = [];
      }
      groups[status].push(friend);
    });
    return groups;
  }, [filteredFriends]);

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
            <motion.button
              key={tab.id}
              whileHover={{ scale: 0.98 }}
              whileTap={{ scale: 0.98 }}
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
            </motion.button>
          ))}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
              dark
                ? "bg-white/10 hover:bg-white/20"
                : "bg-slate-100 hover:bg-slate-200"
            }`}
          >
            <UserPlus size={16} /> Aggiungi
          </motion.button>
        </div>
      </div>

      {/* Lista Amici - Discord Style */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {friendsTab === "online" ? (
          <>
            <h3
              className={`text-sm font-semibold ${
                dark ? "text-slate-400" : "text-slate-600"
              } uppercase tracking-wider mb-3`}
            >
              Online - {groupedFriends.online ? groupedFriends.online.length : 0}
            </h3>
            {groupedFriends.online && groupedFriends.online.length > 0 ? (
              groupedFriends.online.map((f) => (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 5 }}
                  className={`p-3 rounded-lg ${
                    dark ? "hover:bg-white/5" : "hover:bg-slate-50"
                  } flex items-center justify-between border ${
                    dark ? "border-white/10" : "border-transparent"
                  } cursor-pointer`}
                  onClick={() => openChatWithFriend(f.id)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar friend={f} size="sm" />
                    <div>
                      <div className="font-semibold">{f.name}</div>
                      <div className="text-xs opacity-70">Online</div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowBlockConfirm(f.id);
                    }}
                    title="Blocca Utente"
                    className={`p-2 rounded-full text-red-500 ${
                      dark
                        ? "hover:bg-red-500/10"
                        : "hover:bg-red-500/10"
                    }`}
                  >
                    <Slash size={18} />
                  </motion.button>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-10 opacity-60">
                Nessun amico online.
              </div>
            )}
          </>
        ) : friendsTab === "blocked" ? (
          <>
            <h3
              className={`text-sm font-semibold ${
                dark ? "text-slate-400" : "text-slate-600"
              } uppercase tracking-wider mb-3`}
            >
              Bloccati - {groupedFriends.blocked ? groupedFriends.blocked.length : 0}
            </h3>
            {groupedFriends.blocked && groupedFriends.blocked.length > 0 ? (
              groupedFriends.blocked.map((f) => (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 5 }}
                  className={`p-3 rounded-lg ${
                    dark ? "hover:bg-white/5" : "hover:bg-slate-50"
                  } flex items-center justify-between border ${
                    dark ? "border-white/10" : "border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar friend={f} size="sm" />
                    <div>
                      <div className="font-semibold">{f.name}</div>
                      <div className="text-xs opacity-70 capitalize">Bloccato</div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      // Unblock functionality would go here
                    }}
                    title="Sblocca Utente"
                    className={`p-2 rounded-full text-green-500 ${
                      dark
                        ? "hover:bg-green-500/10"
                        : "hover:bg-green-500/10"
                    }`}
                  >
                    <Check size={18} />
                  </motion.button>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-10 opacity-60">
                Nessun amico bloccato.
              </div>
            )}
          </>
        ) : (
          <>
            {Object.entries(groupedFriends).map(([status, friendsList]) => (
              <div key={status}>
                <h3
                  className={`text-sm font-semibold ${
                    dark ? "text-slate-400" : "text-slate-600"
                  } uppercase tracking-wider mb-3 mt-4 first:mt-0`}
                >
                  {status === "online" ? "Online" : status === "away" ? "Inattivo" : "Offline"} - {friendsList.length}
                </h3>
                {friendsList.map((f) => (
                  <motion.div
                    key={f.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ x: 5 }}
                    className={`p-3 rounded-lg ${
                      dark ? "hover:bg-white/5" : "hover:bg-slate-50"
                    } flex items-center justify-between border ${
                      dark ? "border-white/10" : "border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar friend={f} size="sm" />
                      <div>
                        <div className="font-semibold">{f.name}</div>
                        <div className="text-xs opacity-70 capitalize">
                          {status === "online" ? "Online" : status === "away" ? "Inattivo" : "Offline"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {status !== "blocked" && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => openChatWithFriend(f.id)}
                          title="Invia Messaggio"
                          className={`p-2 rounded-full ${
                            dark
                              ? "bg-white/10 hover:bg-white/20"
                              : "bg-slate-100 hover:bg-slate-200"
                          }`}
                        >
                          <MessageSquare size={18} />
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowBlockConfirm(f.id)}
                        title="Blocca Utente"
                        className={`p-2 rounded-full text-red-500 ${
                          dark
                            ? "hover:bg-red-500/10"
                            : "hover:bg-red-500/10"
                        }`}
                      >
                        <Slash size={18} />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ))}
          </>
        )}
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
      {/* Header Chat - Telegram Style */}
      <div
        className={`p-4 flex items-center justify-between border-b ${
          dark ? "border-white/10 bg-[#0B152B]" : "border-slate-200 bg-white"
        } flex-shrink-0 shadow-sm`}
      >
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSelectedChatId(null)}
            className={`p-2 rounded-full -ml-2 ${
              dark ? "hover:bg-white/10" : "hover:bg-slate-100"
            }`}
            aria-label="Indietro"
          >
            <ArrowLeftCircle size={20} />
          </motion.button>
          <Avatar friend={friend} size="sm" />
          <div>
            <div className="font-semibold">{friend.name}</div>
            <div className="text-xs opacity-70 capitalize">{friend.status}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-2 rounded-md ${
              dark ? "hover:bg-white/10" : "hover:bg-slate-100"
            }`}
            aria-label="Cerca in chat"
          >
            <Search size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-2 rounded-md ${
              dark ? "hover:bg-white/10" : "hover:bg-slate-100"
            }`}
            aria-label="Altre azioni"
          >
            <MoreVertical size={18} />
          </motion.button>
        </div>
      </div>

      {/* Area Messaggi - Telegram Style */}
      <div
        className="flex-1 overflow-y-auto p-4"
        style={chatBgStyle}
      >
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.map((m, index) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`flex ${
                m.fromMe ? "justify-end" : "justify-start"
              }`}
            >
              {!m.fromMe && (
                <div className="mr-2 mt-1">
                  <Avatar friend={friend} size="sm" showStatus={false} />
                </div>
              )}
              <div
                className={`max-w-[75%] p-3 rounded-2xl whitespace-pre-wrap break-words ${
                  m.fromMe
                    ? "bg-[#1877F2] text-white rounded-br-lg"
                    : dark
                    ? "bg-[#1a2234] text-white rounded-bl-lg"
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

      {/* Composer - Telegram Style */}
      <div
        className={`p-4 flex items-end gap-3 border-t ${
          dark ? "border-white/10 bg-[#0B152B]" : "border-slate-200 bg-white/80"
        } backdrop-blur-sm flex-shrink-0 shadow-lg`}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`p-3 h-[44px] rounded-full ${
            dark ? "hover:bg-white/10" : "hover:bg-slate-100"
          }`}
          aria-label="Allega"
        >
          <Paperclip size={18} />
        </motion.button>
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
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
          className="px-4 py-2 h-[44px] rounded-lg bg-[#1877F2] text-white flex items-center justify-center gap-2 shadow-md"
        >
          <Send size={16} />
        </motion.button>
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

  // iOS-style radio button component
  const RadioButton = ({ selected, onClick, label }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex items-center justify-between p-4 rounded-xl cursor-pointer ${
        dark ? "hover:bg-white/5" : "hover:bg-slate-100"
      }`}
    >
      <span>{label}</span>
      <div className="relative w-10 h-6 rounded-full bg-gray-300 dark:bg-gray-600 transition-colors">
        <motion.div
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
          initial={false}
          animate={{
            left: selected ? "calc(100% - 1rem)" : "0.25rem",
            backgroundColor: selected ? "#1877F2" : "#FFFFFF",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      </div>
    </motion.div>
  );

  // iOS-style toggle switch
  const ToggleSwitch = ({ enabled, onChange, label }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`flex items-center justify-between p-4 rounded-xl ${
        dark ? "hover:bg-white/5" : "hover:bg-slate-100"
      }`}
    >
      <span>{label}</span>
      <div
        onClick={() => onChange(!enabled)}
        className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
          enabled ? "bg-[#1877F2]" : "bg-gray-300 dark:bg-gray-600"
        }`}
      >
        <motion.div
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
          initial={false}
          animate={{
            left: enabled ? "calc(100% - 1rem)" : "0.25rem",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      </div>
    </motion.div>
  );

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
                  <motion.button
                    key={item.id}
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setTab(item.id)}
                    className={`w-full text-left flex items-center gap-3 px-3 py-3 rounded-lg font-medium text-sm ${
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
                  </motion.button>
                ))}
              </div>
              <motion.button
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full text-left flex items-center gap-3 px-3 py-3 rounded-lg font-medium text-sm ${
                  dark
                    ? "hover:bg-white/5 opacity-70"
                    : "hover:bg-slate-200 opacity-80"
                }`}
              >
                <LogOut size={18} />
                Esci
              </motion.button>
            </div>

            {/* Contenuto Impostazioni */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex items-center justify-end mb-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className={`p-2 rounded-full ${
                    dark ? "hover:bg-white/10" : "hover:bg-slate-100"
                  }`}
                  aria-label="Chiudi"
                >
                  <X size={20} />
                </motion.button>
              </div>

              {/* Tab: Il mio Account */}
              {tab === "account" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold">Il mio Account</h2>
                  <div
                    className={`p-6 rounded-2xl ${
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
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-4 px-4 py-2 rounded-lg bg-[#1877F2] text-white text-sm"
                    >
                      Modifica Profilo
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Tab: Aspetto */}
              {tab === "appearance" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold">Aspetto</h2>
                  <div
                    className={`p-4 rounded-2xl ${
                      dark ? "bg-white/5" : "bg-slate-50"
                    }`}
                  >
                    <h3 className="font-semibold mb-3">Tema App</h3>
                    <div className="space-y-3">
                      <RadioButton
                        selected={!dark}
                        onClick={() => setDark(false)}
                        label="Chiaro"
                      />
                      <RadioButton
                        selected={dark}
                        onClick={() => setDark(true)}
                        label="Scuro"
                      />
                    </div>
                  </div>
                  
                  <div
                    className={`p-4 rounded-2xl ${
                      dark ? "bg-white/5" : "bg-slate-50"
                    }`}
                  >
                    <h3 className="font-semibold mb-3">Dimensioni Testo</h3>
                    <div className="space-y-3">
                      <RadioButton selected={true} onClick={() => {}} label="Normale" />
                      <RadioButton selected={false} onClick={() => {}} label="Grande" />
                      <RadioButton selected={false} onClick={() => {}} label="Molto Grande" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tab: Privacy */}
              {tab === "privacy" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold">Privacy e Sicurezza</h2>
                  <div
                    className={`p-4 rounded-2xl ${
                      dark ? "bg-white/5" : "bg-slate-50"
                    }`}
                  >
                    <h3 className="font-semibold mb-3">Impostazioni Privacy</h3>
                    <div className="space-y-3">
                      <ToggleSwitch enabled={true} onChange={() => {}} label="Mostra quando sono online" />
                      <ToggleSwitch enabled={false} onChange={() => {}} label="Consenti messaggi da sconosciuti" />
                      <ToggleSwitch enabled={true} onChange={() => {}} label="Conferma lettura" />
                    </div>
                  </div>
                  
                  <div
                    className={`p-4 rounded-2xl ${
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
                          className={`p-3 rounded-lg ${
                            dark ? "bg-black/20" : "bg-white"
                          } flex items-center justify-between`}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar friend={f} size="sm" />
                            <div className="font-medium">{f.name}</div>
                          </div>
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-3 py-1 rounded-md bg-red-600 text-white text-sm"
                          >
                            Sblocca
                          </motion.button>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
                
              {/* Tab: Notifiche */}
              {tab === "notifications" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold">Notifiche</h2>
                  <div
                    className={`p-4 rounded-2xl ${
                      dark ? "bg-white/5" : "bg-slate-50"
                    }`}
                  >
                    <h3 className="font-semibold mb-3">Impostazioni Notifiche</h3>
                    <div className="space-y-3">
                      <ToggleSwitch enabled={true} onChange={() => {}} label="Notifiche Messaggi" />
                      <ToggleSwitch enabled={true} onChange={() => {}} label="Suono Messaggi" />
                      <ToggleSwitch enabled={false} onChange={() => {}} label="Notifiche Gruppo" />
                      <ToggleSwitch enabled={true} onChange={() => {}} label="Anteprima Messaggi" />
                    </div>
                  </div>
                  
                  <div
                    className={`p-4 rounded-2xl ${
                      dark ? "bg-white/5" : "bg-slate-50"
                    }`}
                  >
                    <h3 className="font-semibold mb-3">Orari Non Disturbare</h3>
                    <div className="space-y-3">
                      <ToggleSwitch enabled={false} onChange={() => {}} label="Attiva" />
                      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-100 dark:bg-white/5">
                        <span>Dalle 22:00 alle 08:00</span>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1 rounded-md bg-[#1877F2] text-white text-sm"
                        >
                          Modifica
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
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
  
  // Calculate notification count (unread messages)
  const notificationCount = useMemo(() => {
    return chats.filter(chat => chat.lastMessage && !chat.lastMessage.startsWith("You:")).length;
  }, [chats]);

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
        notificationCount={notificationCount}
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