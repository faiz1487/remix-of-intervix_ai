import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Question {
  id: string;
  role: string;
  topic: string;
  question: string;
  answer: string | null;
  hint: string | null;
  explanation: string;
  tags: string[];
  difficulty: string;
}

const empty = {
  role: "",
  topic: "",
  question: "",
  answer: "",
  hint: "",
  explanation: "",
  tagsInput: "",
  difficulty: "Intermediate",
};

const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

const AdminQuestions = () => {
  const [items, setItems] = useState<Question[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const { toast } = useToast();

  const fetchItems = async () => {
    const { data } = await supabase
      .from("interview_questions")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setItems(data as Question[]);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSave = async () => {
    const payload = {
      role: form.role,
      topic: form.topic,
      question: form.question,
      answer: form.answer || null,
      hint: form.hint || null,
      explanation: form.explanation,
      difficulty: form.difficulty,
      tags: form.tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    if (!payload.role || !payload.topic || !payload.question) {
      toast({ title: "Role, Topic and Question are required", variant: "destructive" });
      return;
    }

    if (editing) {
      const { error } = await supabase
        .from("interview_questions")
        .update(payload)
        .eq("id", editing);
      if (error) {
        toast({ title: "Update failed", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Question updated" });
    } else {
      const { error } = await supabase.from("interview_questions").insert(payload);
      if (error) {
        toast({ title: "Create failed", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Question added" });
    }
    setOpen(false);
    setEditing(null);
    setForm(empty);
    fetchItems();
  };

  const handleEdit = (q: Question) => {
    setEditing(q.id);
    setForm({
      role: q.role || "",
      topic: q.topic || "",
      question: q.question || "",
      answer: q.answer || "",
      hint: q.hint || "",
      explanation: q.explanation || "",
      difficulty: q.difficulty || "Intermediate",
      tagsInput: (q.tags || []).join(", "),
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("interview_questions").delete().eq("id", id);
    toast({ title: "Question deleted" });
    fetchItems();
  };

  const difficultyVariant = (d: string) =>
    d === "Beginner"
      ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
      : d === "Advanced"
      ? "bg-rose-500/15 text-rose-600 border-rose-500/30"
      : "bg-amber-500/15 text-amber-600 border-amber-500/30";

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Interview Questions</h1>
          <p className="text-sm text-muted-foreground">
            Manage interview questions shown to users.
          </p>
        </div>
        <Dialog
          open={open}
          onOpenChange={(o) => {
            setOpen(o);
            if (!o) {
              setEditing(null);
              setForm(empty);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Question" : "Add Question"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Role *</Label>
                  <Input
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    placeholder="Frontend, Backend..."
                  />
                </div>
                <div>
                  <Label>Topic *</Label>
                  <Input
                    value={form.topic}
                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                    placeholder="React, SQL..."
                  />
                </div>
              </div>
              <div className="hidden" />
              <div>
                <Label>Difficulty</Label>
                <Select
                  value={form.difficulty}
                  onValueChange={(v) => setForm({ ...form, difficulty: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DIFFICULTIES.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tags (comma separated)</Label>
                <Input
                  value={form.tagsInput}
                  onChange={(e) => setForm({ ...form, tagsInput: e.target.value })}
                  placeholder="hooks, performance, async"
                />
              </div>
              <div>
                <Label>Question *</Label>
                <Textarea
                  rows={3}
                  value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                />
              </div>
              <div>
                <Label>Hint</Label>
                <Textarea
                  rows={2}
                  value={form.hint}
                  onChange={(e) => setForm({ ...form, hint: e.target.value })}
                  placeholder="A small nudge in the right direction"
                />
              </div>
              <div>
                <Label>Answer</Label>
                <Textarea
                  rows={4}
                  value={form.answer}
                  onChange={(e) => setForm({ ...form, answer: e.target.value })}
                />
              </div>
              <div>
                <Label>Explanation</Label>
                <Textarea
                  rows={3}
                  value={form.explanation}
                  onChange={(e) => setForm({ ...form, explanation: e.target.value })}
                  placeholder="Why this answer is correct (markdown supported)"
                />
              </div>
              <Button onClick={handleSave} className="w-full">
                {editing ? "Update" : "Create"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Question</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((q) => (
              <TableRow key={q.id}>
                <TableCell>{q.role}</TableCell>
                <TableCell>{q.topic}</TableCell>
                <TableCell className="max-w-64 truncate">{q.question}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={difficultyVariant(q.difficulty)}>
                    {q.difficulty}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {(q.tags || []).slice(0, 3).map((t) => (
                      <Badge key={t} variant="secondary" className="text-xs">
                        {t}
                      </Badge>
                    ))}
                    {(q.tags || []).length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{q.tags.length - 3}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(q)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(q.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No questions yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default AdminQuestions;
