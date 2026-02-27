"use client";

import DashboardLayout from "@/components/dashboard-layout";
import { MessageSquare, User, Send, Search, Filter } from "lucide-react";
import { useState } from "react";

const chats = [
    { id: 1, name: "Empresa ABC", lastMsg: "¿Cómo puedo integrar el API?", time: "2m", status: "online" },
    { id: 2, name: "Juan Domínguez", lastMsg: "Gracias por la información.", time: "1h", status: "offline" },
    { id: 3, name: "Logística Global", lastMsg: "Tengo un problema con el login.", time: "3h", status: "online" },
];

export default function ConversationsPage() {
    const [selectedChat, setSelectedChat] = useState(chats[0]);

    return (
        <DashboardLayout>
            <div className="flex h-[calc(100vh-160px)] gap-6">
                {/* Chat List */}
                <div className="w-80 flex flex-col gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Buscar chat..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                        />
                    </div>

                    <div className="glass-card p-2 flex-1 overflow-y-auto space-y-1">
                        {chats.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => setSelectedChat(chat)}
                                className={`p-3 rounded-xl cursor-pointer transition-all ${selectedChat.id === chat.id ? "bg-primary/20 border-primary/20" : "hover:bg-white/5 border-transparent"
                                    } border`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs">
                                            {chat.name[0]}
                                        </div>
                                        {chat.status === "online" && (
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#030303] rounded-full" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline">
                                            <p className="font-semibold text-sm truncate">{chat.name}</p>
                                            <span className="text-[10px] text-muted-foreground">{chat.time}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground truncate">{chat.lastMsg}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat View */}
                <div className="flex-1 glass-card p-0 flex flex-col overflow-hidden">
                    {/* Top Bar */}
                    <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-sm text-primary">
                                {selectedChat.name[0]}
                            </div>
                            <div>
                                <p className="font-semibold">{selectedChat.name}</p>
                                <p className="text-xs text-emerald-500">Agente AI respondiendo...</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 hover:bg-white/5 rounded-lg text-muted-foreground border border-white/10">
                                <Filter className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        <div className="flex gap-3 max-w-[80%]">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center">
                                <User className="w-4 h-4" />
                            </div>
                            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none text-sm leading-relaxed">
                                Hola, tengo una pregunta sobre cómo funciona vuestro sistema de automatización con n8n.
                            </div>
                        </div>

                        <div className="flex gap-3 max-w-[80%] ml-auto flex-row-reverse">
                            <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-white font-bold text-[10px]">
                                AI
                            </div>
                            <div className="bg-primary text-white p-4 rounded-2xl rounded-tr-none text-sm leading-relaxed shadow-lg shadow-primary/20">
                                ¡Hola! Claro, nuestro sistema utiliza n8n para conectar tus herramientas favoritas y procesar datos en tiempo real mediante agentes RAG. ¿En qué parte técnica te gustaría profundizar?
                            </div>
                        </div>
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white/[0.02] border-t border-white/5">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Escribe un mensaje..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-inner"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-xl hover:scale-105 transition-transform">
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
