"use client";

import DashboardLayout from "@/components/dashboard-layout";
import { Upload, FileText, CheckCircle, Clock, AlertCircle, Database, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface KnowledgeItem {
    id: string;
    name: string;
    status: 'processing' | 'completed' | 'error';
    created_at: string;
    chunk_count: number;
}

export default function KnowledgePage() {
    const [isUploading, setIsUploading] = useState(false);
    const [items, setItems] = useState<KnowledgeItem[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchItems = async () => {
        try {
            const { data, error } = await supabase
                .from('knowledge_items')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setItems(data || []);
        } catch (err) {
            console.error("Error fetching knowledge items:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [supabase]);

    const handleUpload = () => {
        setIsUploading(true);
        // Aquí es donde n8n entraría en juego
        // Simulamos una inserción para ver el cambio visual
        setTimeout(() => {
            setIsUploading(false);
            fetchItems();
        }, 2000);
    };

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Agente RAG</h1>
                        <p className="text-muted-foreground">Gestiona el conocimiento que usa tu IA para responder.</p>
                    </div>
                    <button
                        onClick={handleUpload}
                        disabled={isUploading}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all disabled:opacity-50"
                    >
                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        {isUploading ? "Procesando..." : "Subir Documento"}
                    </button>
                </div>

                <div className="grid gap-6">
                    {/* Dropzone mockup */}
                    <div
                        onClick={handleUpload}
                        className="glass-card border-dashed border-2 border-white/10 flex flex-col items-center justify-center py-12 text-center group cursor-pointer hover:border-primary/50 transition-colors"
                    >
                        <div className="p-4 bg-primary/10 rounded-full mb-4 group-hover:scale-110 transition-transform">
                            {isUploading ? <Loader2 className="w-8 h-8 text-primary animate-spin" /> : <Upload className="w-8 h-8 text-primary" />}
                        </div>
                        <p className="font-semibold text-lg">Arrastra archivos aquí</p>
                        <p className="text-sm text-muted-foreground">PDF, TXT o DOCX (Máx. 10MB)</p>
                    </div>

                    {/* Table */}
                    <div className="glass-card p-0 overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <Database className="w-5 h-5 text-primary" />
                                Documentos Indexados
                            </h3>
                            <button onClick={fetchItems} className="text-xs text-muted-foreground hover:text-white transition-colors">
                                Actualizar
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/5 text-muted-foreground text-xs uppercase tracking-wider">
                                        <th className="px-6 py-4 font-semibold">Archivo</th>
                                        <th className="px-6 py-4 font-semibold">Estado</th>
                                        <th className="px-6 py-4 font-semibold text-center">Fragmentos</th>
                                        <th className="px-6 py-4 font-semibold text-right">Fecha</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center">
                                                <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                                            </td>
                                        </tr>
                                    ) : items.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground italic">
                                                No hay documentos subidos aún. Prueba a subir uno.
                                            </td>
                                        </tr>
                                    ) : (
                                        items.map((item) => (
                                            <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <FileText className="w-5 h-5 text-muted-foreground" />
                                                        <span className="font-medium text-sm">{item.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.status === "completed" && (
                                                        <div className="flex items-center gap-1.5 text-emerald-500 text-xs font-medium">
                                                            <CheckCircle className="w-4 h-4" /> Listado
                                                        </div>
                                                    )}
                                                    {item.status === "processing" && (
                                                        <div className="flex items-center gap-1.5 text-blue-500 text-xs font-medium animate-pulse">
                                                            <Clock className="w-4 h-4" /> Vectorizando
                                                        </div>
                                                    )}
                                                    {item.status === "error" && (
                                                        <div className="flex items-center gap-1.5 text-red-500 text-xs font-medium">
                                                            <AlertCircle className="w-4 h-4" /> Error en n8n
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="text-xs bg-white/5 px-2 py-1 rounded-md">{item.chunk_count || 0}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right text-sm text-muted-foreground">
                                                    {new Date(item.created_at).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
