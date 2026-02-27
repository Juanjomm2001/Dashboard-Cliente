"use client";

import DashboardLayout from "@/components/dashboard-layout";
import { User, Building, Shield, Bell, Save, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const supabase = createClient();

    useEffect(() => {
        async function fetchSettings() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data } = await supabase
                        .from('profiles')
                        .select('*, tenants(*)')
                        .eq('id', user.id)
                        .single();
                    setProfile(data);
                }
            } catch (err) {
                console.error("Error fetching settings:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchSettings();
    }, [supabase]);

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
                    <p className="text-muted-foreground">Gestiona tu perfil y las preferencias de tu cuenta.</p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {/* Profile Section */}
                        <div className="glass-card">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-primary/10 rounded-xl">
                                    <User className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold">Perfil de Usuario</h3>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm text-muted-foreground">Nombre Completo</label>
                                    <input
                                        type="text"
                                        readOnly
                                        value={profile?.full_name || ""}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 outline-none focus:ring-1 focus:ring-primary"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-muted-foreground">Rol</label>
                                    <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm uppercase font-mono">
                                        {profile?.role || "admin"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tenant Section */}
                        <div className="glass-card">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-blue-500/10 rounded-xl">
                                    <Building className="w-6 h-6 text-blue-500" />
                                </div>
                                <h3 className="text-xl font-semibold">Información de Empresa (Tenant)</h3>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm text-muted-foreground">Nombre de Empresa</label>
                                    <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 font-medium">
                                        {profile?.tenants?.name || "Sin Empresa"}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-muted-foreground">Tenant UUID</label>
                                    <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xs font-mono break-all">
                                        {profile?.tenant_id}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Subscription mockup */}
                        <div className="glass-card premium-gradient overflow-hidden relative">
                            <div className="relative z-10">
                                <h3 className="text-lg font-semibold mb-2">Plan Premium</h3>
                                <p className="text-sm text-muted-foreground mb-4 font-medium opacity-80">
                                    Tu empresa tiene acceso a todas las automatizaciones de n8n y agentes RAG ilimitados.
                                </p>
                            </div>
                            <Shield className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5" />
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
