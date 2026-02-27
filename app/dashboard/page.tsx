import DashboardLayout from "@/components/dashboard-layout";
import { MessageSquare, Database, Zap, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
    { name: "Total Leads/Chats", value: "1,284", icon: MessageSquare, trend: "+12%" },
    { name: "Conocimiento (Chunks)", value: "542", icon: Database, trend: "+5" },
    { name: "Automatizaciones", value: "3 Activas", icon: Zap, trend: "Estable" },
];

export default function DashboardPage() {
    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Bienvenido de nuevo</h1>
                    <p className="text-muted-foreground">Aquí tienes el resumen de tus automatizaciones IA.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {stats.map((stat) => (
                        <div key={stat.name} className="glass-card hover:translate-y-[-4px]">
                            <div className="flex items-center justify-between">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <stat.icon className="w-6 h-6 text-primary" />
                                </div>
                                <span className="text-xs font-medium text-emerald-500 px-2 py-1 bg-emerald-500/10 rounded-full">
                                    {stat.trend}
                                </span>
                            </div>
                            <div className="mt-4">
                                <p className="text-sm text-muted-foreground">{stat.name}</p>
                                <p className="text-2xl font-bold">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="glass-card">
                        <h3 className="text-lg font-semibold mb-4">Últimas Conversaciones</h3>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold">
                                            C{i}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Cliente #{i + 100}</p>
                                            <p className="text-xs text-muted-foreground">Hace 5 minutos</p>
                                        </div>
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card premium-gradient overflow-hidden relative">
                        <div className="relative z-10">
                            <h3 className="text-lg font-semibold mb-2">Agente RAG Optimizado</h3>
                            <p className="text-sm text-muted-foreground mb-4">Tu agente IA está usando la última base de datos vectorial para responder con precisión.</p>
                            <button className="px-4 py-2 bg-white text-black rounded-lg font-medium text-sm hover:bg-white/90 transition-colors">
                                Ver Detalles
                            </button>
                        </div>
                        <Zap className="absolute -right-8 -bottom-8 w-40 h-40 text-primary/10 rotate-12" />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
