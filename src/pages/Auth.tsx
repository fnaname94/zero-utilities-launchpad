import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import { z } from "zod";

const emailSchema = z.string().trim().email("Email inválido").max(255);
const passwordSchema = z.string().min(6, "Mínimo 6 caracteres").max(128);
const nameSchema = z.string().trim().min(2, "Mínimo 2 caracteres").max(100);

const Auth = () => {
  const nav = useNavigate();
  const { user, loading } = useAuth();
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  useEffect(() => { document.title = "Acesso — Zero Utilitários"; }, []);
  useEffect(() => { if (!loading && user) nav("/admin"); }, [user, loading, nav]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      emailSchema.parse(email); passwordSchema.parse(password);
    } catch (err: any) {
      toast.error(err.errors?.[0]?.message || "Dados inválidos"); return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Bem-vindo!");
    nav("/admin");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      nameSchema.parse(fullName); emailSchema.parse(email); passwordSchema.parse(password);
    } catch (err: any) {
      toast.error(err.errors?.[0]?.message || "Dados inválidos"); return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${window.location.origin}/admin`, data: { full_name: fullName } },
    });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Conta criada! Peça a um admin para liberar seu acesso.");
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Zero Utilitários" className="h-20 w-auto" />
        </div>
        <Tabs defaultValue="login">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="signup">Criar conta</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4 mt-4">
              <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
              <div><Label>Senha</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
              <Button type="submit" disabled={busy} className="w-full bg-primary text-primary-foreground hover:bg-primary-glow font-bold">
                {busy ? "Entrando…" : "ENTRAR"}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4 mt-4">
              <div><Label>Nome completo</Label><Input value={fullName} onChange={(e) => setFullName(e.target.value)} required /></div>
              <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
              <div><Label>Senha</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
              <Button type="submit" disabled={busy} className="w-full bg-primary text-primary-foreground hover:bg-primary-glow font-bold">
                {busy ? "Criando…" : "CRIAR CONTA"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Após criar, um administrador precisa liberar seu acesso ao painel.
              </p>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};
export default Auth;
