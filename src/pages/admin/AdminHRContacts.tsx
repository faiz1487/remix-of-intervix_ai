import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, RefreshCw, Loader2, Upload } from "lucide-react";

const parseCsv = (text: string): string[][] => {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') { cell += '"'; i++; } else quoted = false;
      } else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") { row.push(cell); cell = ""; }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); cell = "";
      if (row.some((c) => c.trim() !== "")) rows.push(row);
      row = [];
    } else cell += ch;
  }
  row.push(cell);
  if (row.some((c) => c.trim() !== "")) rows.push(row);
  return rows;
};

interface HRContact {
  id: string;
  name: string;
  company: string;
  email: string;
  linkedin: string;
  role_focus?: string | null;
  experience?: string | null;
}

const empty = { name: "", company: "", email: "", linkedin: "", role_focus: "", experience: "" };

const AdminHRContacts = () => {
  const [items, setItems] = useState<HRContact[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleCsv = async (file: File) => {
    setUploading(true);
    try {
      const rows = parseCsv(await file.text());
      if (rows.length < 2) throw new Error("CSV is empty");
      const header = rows[0].map((h) => h.trim().toLowerCase().replace(/[\s_-]/g, ""));
      const idx = (...keys: string[]) => header.findIndex((h) => keys.includes(h));
      const iName = idx("name", "hrname", "contactname", "fullname");
      const iCompany = idx("company", "companyname", "organization");
      const iEmail = idx("email", "emailid", "mail");
      const iLinkedin = idx("linkedin", "linkedinurl", "profile", "linkedinprofile");
      const iRole = idx("rolefocus", "role", "designation", "title");
      const iNotes = idx("notes", "note", "remarks");
      const iExp = idx("experience", "exp", "yearsofexperience", "experiencerequired");
      if (iName === -1 && iEmail === -1) throw new Error("CSV must have at least a 'name' or 'email' column");

      const get = (r: string[], i: number) => (i >= 0 ? (r[i] ?? "").trim() : "");
      const payload = rows.slice(1)
        .map((r) => ({
          name: get(r, iName),
          company: get(r, iCompany),
          email: get(r, iEmail),
          linkedin: get(r, iLinkedin),
          role_focus: get(r, iRole),
          experience: get(r, iExp),
          notes: get(r, iNotes),
        }))
        .filter((r) => r.name || r.email)
        .map((r) => ({ ...r, name: r.name || r.email, company: r.company || "—" }));

      if (!payload.length) throw new Error("No valid rows found");
      const { error } = await supabase.from("hr_contacts").insert(payload);
      if (error) throw error;
      toast({ title: `Imported ${payload.length} contact(s)` });
      fetchData();
    } catch (e) {
      toast({ title: "CSV import failed", description: e instanceof Error ? e.message : "Unknown error", variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const fetchData = async () => {
    const { data } = await supabase.from("hr_contacts").select("*").order("created_at", { ascending: false });
    if (data) setItems(data);
  };

  useEffect(() => { fetchData(); }, []);

  const syncContacts = async (window: "hour" | "day") => {
    setSyncing(window);
    try {
      const { data, error } = await supabase.functions.invoke("sync-hr-contacts", { body: { window } });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast({
        title: `Imported ${data?.inserted ?? 0} HR contact(s)`,
        description: data?.message || `Scanned ${data?.found ?? 0} LinkedIn posts.`,
      });
      fetchData();
    } catch (e) {
      toast({ title: "Sync failed", description: e instanceof Error ? e.message : "Unknown error", variant: "destructive" });
    } finally {
      setSyncing(null);
    }
  };


  const handleSave = async () => {
    if (editing) {
      await supabase.from("hr_contacts").update(form).eq("id", editing);
      toast({ title: "Contact updated" });
    } else {
      await supabase.from("hr_contacts").insert(form);
      toast({ title: "Contact added" });
    }
    setOpen(false); setEditing(null); setForm(empty); fetchData();
  };

  const handleEdit = (c: HRContact) => {
    setEditing(c.id);
    setForm({ name: c.name, company: c.company, email: c.email || "", linkedin: c.linkedin || "", role_focus: c.role_focus || "", experience: c.experience || "" });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("hr_contacts").delete().eq("id", id);
    toast({ title: "Contact deleted" }); fetchData();
  };

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold">HR Contacts</h1>
        <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" disabled={!!syncing} onClick={() => syncContacts("hour")}>
          {syncing === "hour" ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
          Last 1 hour
        </Button>
        <Button variant="outline" disabled={!!syncing} onClick={() => syncContacts("day")}>
          {syncing === "day" ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
          Fetch HR emails (24h)
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleCsv(f); }}
        />
        <Button variant="outline" disabled={uploading} onClick={() => fileRef.current?.click()}>
          {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
          Upload CSV
        </Button>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setEditing(null); setForm(empty); } }}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add Contact</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Edit Contact" : "Add Contact"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>Company</Label><Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></div>
              <div><Label>Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div><Label>LinkedIn</Label><Input value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} /></div>
              <div><Label>Role</Label><Input placeholder="e.g. DevOps Engineer" value={form.role_focus} onChange={(e) => setForm({ ...form, role_focus: e.target.value })} /></div>
              <div><Label>Experience</Label><Input placeholder="e.g. 3-5 years" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} /></div>
              <Button onClick={handleSave} className="w-full">{editing ? "Update" : "Create"}</Button>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>LinkedIn</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>{c.company}</TableCell>
                <TableCell>{c.role_focus || "—"}</TableCell>
                <TableCell>{c.experience || "—"}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell className="max-w-32 truncate">{c.linkedin}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(c)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No contacts yet</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default AdminHRContacts;
