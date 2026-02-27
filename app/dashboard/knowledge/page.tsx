"use client";

import DashboardLayout from "@/components/dashboard-layout";
import { Upload, FileText, CheckCircle, Clock, AlertCircle, Database } from "lucide-react";
import { useState } from "react";

const knowledgeItems = [
    { name: "Preguntas Frecuentes.pdf", status: "completed", date: "2024-02-25", chunks: 24 },
    { name: "Politicas Empresa.docx", status: "processing", date: "2024-02-26", chunks: 0 },
    { name: "Catalogo_2024.pdf", status: "error", date: "2024-02-24", chunks: 12 },
];

export default function KnowledgePage() {
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = () => {
        setIsUploading(true);
        // Simulación de envío a n8n
        setTimeout(() => setIsUploading(false), 3000);
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
                        <Upload className="w-4 h-4" />
                        {isUploading ? "Procesando..." : "Subir Documento"}
                    </button>
                </div>

                <div className="grid gap-6">
                    {/* Dropzone mockup */}
                    <div className="glass-card border-dashed border-2 border-white/10 flex flex-col items-center justify-center py-12 text-center group cursor-pointer hover:border-primary/50 transition-colors">
                        <div className="p-4 bg-primary/10 rounded-full mb-4 group-hover:scale-110 transition-transform">
                            <Upload className="w-8 h-8 text-primary" />
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
                                    {knowledgeItems.map((item) => (
                                        <tr key={item.name} className="hover:bg-white/5 transition-colors group">
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
                                                <span className="text-xs bg-white/5 px-2 py-1 rounded-md">{item.chunks}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm text-muted-foreground">
                                                {item.date}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
