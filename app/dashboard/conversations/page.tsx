"use client";

import DashboardLayout from "@/components/dashboard-layout";
import { MessageSquare, User, Send, Search, Filter, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface Customer {
    id: string;
    name: string;
    external_id: string;
}

interface Conversation {
    id: string;
    tenant_id: string;
    customer_id: string;
    messages: any[];
    summary: string;
    sentiment: string;
    created_at: string;
    customers: Customer;
}

export default function ConversationsPage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        async function fetchConversations() {
            try {
                const { data, error } = await supabase
                    .from('conversations')
                    .select('*, customers(*)')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setConversations(data || []);
                if (data && data.length > 0) {
                    setSelectedChat(data[0]);
                }
            } catch (err) {
                console.error("Error fetching conversations:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchConversations();
    }, [supabase]);

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
                        {loading ? (
                            <div className="flex items-center justify-center h-40">
                                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                            </div>
                        ) : conversations.length === 0 ? (
                            <div className="p-4 text-center text-xs text-muted-foreground">
                                No hay conversaciones aún.
                            </div>
                        ) : (
                            conversations.map((chat) => (
                                <div
                                    key={chat.id}
                                    onClick={() => setSelectedChat(chat)}
                                    className={`p-3 rounded-xl cursor-pointer transition-all ${selectedChat?.id === chat.id ? "bg-primary/20 border-primary/20" : "hover:bg-white/5 border-transparent"
                                        } border`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs uppercase">
                                                {chat.customers?.name?.[0] || chat.customers?.external_id?.[0] || "?"}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline">
                                                <p className="font-semibold text-sm truncate">{chat.customers?.name || chat.customers?.external_id}</p>
                                                <span className="text-[10px] text-muted-foreground">
                                                    {new Date(chat.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground truncate">{chat.summary || "Sin resumen"}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat View */}
                <div className="flex-1 glass-card p-0 flex flex-col overflow-hidden">
                    {selectedChat ? (
                        <>
                            {/* Top Bar */}
                            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-sm text-primary uppercase">
                                        {selectedChat.customers?.name?.[0] || "?"}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{selectedChat.customers?.name || "Cliente Desconocido"}</p>
                                        <p className="text-xs text-muted-foreground">ID: {selectedChat.customers?.external_id}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 text-xs font-medium px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full">
                                    {selectedChat.sentiment || "Neutral"}
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {selectedChat.messages.map((msg, idx) => (
                                    <div key={idx} className={`flex gap-3 max-w-[80%] ${msg.role === 'assistant' ? 'ml-auto flex-row-reverse' : ''}`}>
                                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'assistant' ? 'bg-primary text-white font-bold text-[10px]' : 'bg-white/10'}`}>
                                            {msg.role === 'assistant' ? 'AI' : <User className="w-4 h-4" />}
                                        </div>
                                        <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'assistant'
                                                ? 'bg-primary text-white rounded-tr-none shadow-lg shadow-primary/20'
                                                : 'bg-white/5 border border-white/10 rounded-tl-none'
                                            }`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Input placeholder */}
                            <div className="p-4 bg-white/[0.02] border-t border-white/5">
                                <p className="text-xs text-center text-muted-foreground italic">
                                    El n8n Agent está gestionando esta conversación.
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-muted-foreground">
                            Selecciona una conversación para ver los detalles
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
