import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";

interface CompanyQuestion {
  id: string;
  company: string;
  role: string;
  location: string;
  skills: string[];
  question: string;
  answer: string | null;
  difficulty: string;
  document_link: string | null;
}

const empty = {
  company: "",
  role: "",
  location: "",
  skillsInput: "",
  question: "",
  answer: "",
  difficulty: "Intermediate",
  document_link: "",
};

const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

const AdminCompanyQuestions = () => {
  const [items, setItems] = useState<CompanyQuestion[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const { toast } = useToast();

  const fetchItems = async () => {
    const { data } = await supabase
      .from("company_questions")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setItems(data as CompanyQuestion[]);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSave = async () => {
    if (!form.company || !form.question) {
      toast({ title: "Company and Question are required", variant: "destructive" });
      return;
    }
    const payload = {
      company: form.company,
      role: form.role,
      location: form.location,
      skills: form.skillsInput.split(",").map((s) => s.trim()).filter(Boolean),
      question: form.question,
      answer: form.answer || "",
      difficulty: form.difficulty,
      document_link: form.document_link || "",
    };

    if (editing) {
      const { error } = await supabase.from("company_questions").update(payload).eq("id", editing);
      if (error) return toast({ title: "Update failed", description: error.message, variant: "destructive" });
      toast({ title: "Updated" });
    } else {
      const { error } = await supabase.from("company_questions").insert(payload);
      if (error) return toast({ title: "Create failed", description: error.message, variant: "destructive" });
      toast({ title: "Added" });
    }
    setOpen(false);
    setEditing(null);
    setForm(empty);
    fetchItems();
  };

  const handleEdit = (q: CompanyQuestion) => {
    setEditing(q.id);
    setForm({
      company: q.company || "",
      role: q.role || "",
      location: q.location || "",
      skillsInput: (q.skills || []).join(", "),
      question: q.question || "",
      answer: q.answer || "",
      difficulty: q.difficulty || "Intermediate",
      document_link: q.document_link || "",
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("company_questions").delete().eq("id", id);
    toast({ title: "Deleted" });
    fetchItems();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Company-wise Questions</h1>
          <p className="text-sm text-muted-foreground">
            Manually managed company interview questions shown in the Interview Questions module.
          </p>
        </div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setEditing(null); setForm(empty); } }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Add Entry</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Entry" : "Add Entry"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Company *</Label>
                  <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Google, Amazon..." />
                </div>
                <div>
                  <Label>Role</Label>
                  <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="SDE, Frontend..." />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Bangalore, Remote..." />
                </div>
                <div>
                  <Label>Difficulty</Label>
                  <Select value={form.difficulty} onValueChange={(v) => setForm({ ...form, difficulty: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {DIFFICULTIES.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Skills (comma separated)</Label>
                <Input value={form.skillsInput} onChange={(e) => setForm({ ...form, skillsInput: e.target.value })} placeholder="React, Node.js, SQL" />
              </div>
              <div>
                <Label>Question *</Label>
                <Textarea rows={3} value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
              </div>
              <div>
                <Label>Answer</Label>
                <Textarea rows={4} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} />
              </div>
              <div>
                <Label>Document Link</Label>
                <Input value={form.document_link} onChange={(e) => setForm({ ...form, document_link: e.target.value })} placeholder="https://..." />
              </div>
              <Button onClick={handleSave} className="w-full">{editing ? "Update" : "Create"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Skills</TableHead>
              <TableHead>Question</TableHead>
              <TableHead>Document</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((q) => (
              <TableRow key={q.id}>
                <TableCell className="font-medium">{q.company}</TableCell>
                <TableCell>{q.role || "—"}</TableCell>
                <TableCell>{q.location || "—"}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {(q.skills || []).slice(0, 3).map((s) => (
                      <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                    ))}
                    {(q.skills || []).length > 3 && (
                      <span className="text-xs text-muted-foreground">+{q.skills.length - 3}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="max-w-64 truncate">{q.question}</TableCell>
                <TableCell>
                  {q.document_link ? (
                    <a href={q.document_link} target="_blank" rel="noopener noreferrer" className="text-primary inline-flex items-center gap-1 text-xs">
                      Open <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : "—"}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(q)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(q.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No company questions yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default AdminCompanyQuestions;
