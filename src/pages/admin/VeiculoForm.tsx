import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { RequireAdmin } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, X, Star } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const cats = [
  { v: "van", l: "Van" }, { v: "furgao", l: "Furgão" }, { v: "caminhao", l: "Caminhão" },
  { v: "pickup", l: "Pickup" }, { v: "escolar", l: "Escolar" }, { v: "outro", l: "Outro" },
];

const VeiculoForm = () => {
  const { id } = useParams();
  const isNew = !id || id === "novo";
  const nav = useNavigate();
  const { user } = useAuth();

  const [busy, setBusy] = useState(false);
  const [photos, setPhotos] = useState<{ id?: string; url: string; position: number }[]>([]);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    brand: "", model: "", year: new Date().getFullYear(), color: "",
    price: "" as string | number, km: 0, description: "",
    category: "van", fuel: "", transmission: "", engine: "", seats: "" as string | number,
    features: "" as string, cover_image: "", status: "ativo", featured: false,
  });

  useEffect(() => {
    document.title = isNew ? "Novo veículo — Admin" : "Editar veículo — Admin";
    if (isNew) return;
    (async () => {
      const { data } = await supabase.from("vehicles").select("*").eq("id", id!).maybeSingle();
      if (data) {
        setForm({
          brand: data.brand, model: data.model, year: data.year, color: data.color || "",
          price: data.price ?? "", km: data.km ?? 0, description: data.description || "",
          category: data.category, fuel: data.fuel || "", transmission: data.transmission || "",
          engine: data.engine || "", seats: data.seats ?? "", features: (data.features || []).join(", "),
          cover_image: data.cover_image || "", status: data.status, featured: data.featured,
        });
      }
      const { data: ph } = await supabase.from("vehicle_photos").select("*").eq("vehicle_id", id!).order("position");
      setPhotos(ph || []);
    })();
  }, [id, isNew]);

  const upd = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const uploadPhoto = async (file: File, vehicleId: string) => {
    const ext = file.name.split(".").pop();
    const path = `${vehicleId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("vehicle-photos").upload(path, file);
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from("vehicle-photos").getPublicUrl(path);
    return publicUrl;
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (isNew) { toast.error("Salve o veículo antes de adicionar fotos."); return; }
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        if (file.size > 5 * 1024 * 1024) { toast.error(`${file.name}: máximo 5MB`); continue; }
        const url = await uploadPhoto(file, id!);
        const position = photos.length;
        const { data, error } = await supabase.from("vehicle_photos").insert({ vehicle_id: id!, url, position }).select().single();
        if (error) throw error;
        setPhotos((p) => [...p, data]);
        if (!form.cover_image) {
          await supabase.from("vehicles").update({ cover_image: url }).eq("id", id!);
          upd("cover_image", url);
        }
      }
      toast.success("Fotos enviadas");
    } catch (e: any) { toast.error(e.message); } finally { setUploading(false); }
  };

  const removePhoto = async (p: { id?: string; url: string }) => {
    if (!p.id) return;
    await supabase.from("vehicle_photos").delete().eq("id", p.id);
    setPhotos((arr) => arr.filter((x) => x.id !== p.id));
    if (form.cover_image === p.url) {
      const next = photos.find((x) => x.id !== p.id)?.url || "";
      await supabase.from("vehicles").update({ cover_image: next }).eq("id", id!);
      upd("cover_image", next);
    }
  };

  const setCover = async (url: string) => {
    await supabase.from("vehicles").update({ cover_image: url }).eq("id", id!);
    upd("cover_image", url);
    toast.success("Capa atualizada");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.brand.trim() || !form.model.trim()) { toast.error("Marca e modelo são obrigatórios"); return; }
    setBusy(true);
    const payload = {
      brand: form.brand.trim(), model: form.model.trim(), year: Number(form.year),
      color: form.color || null, price: form.price === "" ? null : Number(form.price),
      km: Number(form.km) || 0, description: form.description || null,
      category: form.category as any, fuel: form.fuel || null, transmission: form.transmission || null,
      engine: form.engine || null, seats: form.seats === "" ? null : Number(form.seats),
      features: form.features ? form.features.split(",").map((s) => s.trim()).filter(Boolean) : [],
      status: form.status as any, featured: form.featured, cover_image: form.cover_image || null,
    };
    if (isNew) {
      const { data, error } = await supabase.from("vehicles").insert({ ...payload, created_by: user!.id }).select().single();
      setBusy(false);
      if (error) { toast.error(error.message); return; }
      toast.success("Veículo criado! Agora adicione fotos.");
      nav(`/admin/veiculos/${data.id}`);
    } else {
      const { error } = await supabase.from("vehicles").update(payload).eq("id", id!);
      setBusy(false);
      if (error) { toast.error(error.message); return; }
      toast.success("Veículo atualizado");
    }
  };

  return (
    <RequireAdmin>
      <Link to="/admin/veiculos" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
      </Link>
      <h1 className="text-3xl font-black mb-6">{isNew ? "Novo veículo" : "Editar veículo"}</h1>

      <form onSubmit={submit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="font-bold">Informações básicas</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label>Marca *</Label><Input value={form.brand} onChange={(e) => upd("brand", e.target.value)} required /></div>
              <div><Label>Modelo *</Label><Input value={form.model} onChange={(e) => upd("model", e.target.value)} required /></div>
              <div><Label>Ano</Label><Input type="number" value={form.year} onChange={(e) => upd("year", e.target.value)} /></div>
              <div><Label>Cor</Label><Input value={form.color} onChange={(e) => upd("color", e.target.value)} /></div>
              <div><Label>Preço (R$)</Label><Input type="number" step="0.01" value={form.price} onChange={(e) => upd("price", e.target.value)} placeholder="Em branco = Consulte" /></div>
              <div><Label>KM</Label><Input type="number" value={form.km} onChange={(e) => upd("km", e.target.value)} /></div>
              <div>
                <Label>Categoria</Label>
                <Select value={form.category} onValueChange={(v) => upd("category", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{cats.map((c) => <SelectItem key={c.v} value={c.v}>{c.l}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => upd("status", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo (publicado)</SelectItem>
                    <SelectItem value="rascunho">Rascunho (oculto)</SelectItem>
                    <SelectItem value="vendido">Vendido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Descrição</Label><Textarea rows={4} value={form.description} onChange={(e) => upd("description", e.target.value)} /></div>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="font-bold">Detalhes técnicos</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label>Combustível</Label><Input value={form.fuel} onChange={(e) => upd("fuel", e.target.value)} placeholder="Diesel, Flex, Gasolina…" /></div>
              <div><Label>Câmbio</Label><Input value={form.transmission} onChange={(e) => upd("transmission", e.target.value)} placeholder="Manual, Automático…" /></div>
              <div><Label>Motor</Label><Input value={form.engine} onChange={(e) => upd("engine", e.target.value)} placeholder="2.2 16V" /></div>
              <div><Label>Lugares</Label><Input type="number" value={form.seats} onChange={(e) => upd("seats", e.target.value)} /></div>
            </div>
            <div><Label>Opcionais (separe por vírgula)</Label><Textarea rows={2} value={form.features} onChange={(e) => upd("features", e.target.value)} placeholder="Ar-condicionado, Direção hidráulica, Vidros elétricos" /></div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold mb-4">Fotos</h3>
            {isNew ? (
              <p className="text-sm text-muted-foreground">Salve o veículo primeiro para enviar fotos.</p>
            ) : (
              <>
                <label className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-smooth">
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">{uploading ? "Enviando…" : "Clique para enviar (máx. 5MB cada)"}</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} disabled={uploading} />
                </label>
                {photos.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                    {photos.map((p) => (
                      <div key={p.id} className="relative group aspect-square rounded overflow-hidden border border-border">
                        <img src={p.url} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-smooth flex flex-col items-center justify-center gap-1">
                          <Button type="button" size="sm" variant="secondary" onClick={() => setCover(p.url)} className="text-xs">
                            <Star className="w-3 h-3 mr-1" /> Capa
                          </Button>
                          <Button type="button" size="sm" variant="destructive" onClick={() => removePhoto(p)} className="text-xs">
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                        {form.cover_image === p.url && (
                          <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded">CAPA</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="font-bold">Publicação</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="featured">Destaque na home</Label>
              <Switch id="featured" checked={form.featured} onCheckedChange={(v) => upd("featured", v)} />
            </div>
            <Button type="submit" disabled={busy} className="w-full bg-primary text-primary-foreground hover:bg-primary-glow font-bold">
              {busy ? "Salvando…" : isNew ? "CRIAR VEÍCULO" : "SALVAR ALTERAÇÕES"}
            </Button>
          </Card>
        </div>
      </form>
    </RequireAdmin>
  );
};
export default VeiculoForm;
