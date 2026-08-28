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

interface ScenarioQuestion {
  id: string;
  title: string | null;
  description: string | null;
  scenario: string;
  technology: string;
  difficulty: string;
  tags: string[];
  hint: string | null;
  answer: string | null;
  explanation: string;
}

const empty = {
  title: "",
  description: "",
  scenario: "",
  technology: "",
  difficulty: "Intermediate",
  tagsInput: "",
  hint: "",
  answer: "",
  explanation: "",
};

const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

const AdminScenarioQuestions = () => {
  const [items, setItems] = useState<ScenarioQuestion[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const { toast } = useToast();

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from("scenario_questions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Failed to load", description: error.message, variant: "destructive" });
      return;
    }
    if (data) setItems(data as ScenarioQuestion[]);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSave = async () => {
    const payload = {
      title: form.title || null,
      description: form.description || null,
      scenario: form.scenario,
      technology: form.technology,
      difficulty: form.difficulty,
      tags: form.tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      hint: form.hint || null,
      answer: form.answer || null,
      explanation: form.explanation,
    };

    if (!payload.scenario || !payload.technology) {
      toast({ title: "Scenario and Technology are required", variant: "destructive" });
      return;
    }

    if (editing) {
      const { error } = await supabase
        .from("scenario_questions")
        .update(payload)
        .eq("id", editing);
      if (error) {
        toast({ title: "Update failed", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Scenario updated" });
    } else {
      const { error } = await supabase.from("scenario_questions").insert(payload);
      if (error) {
        toast({ title: "Create failed", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Scenario added" });
    }
    setOpen(false);
    setEditing(null);
    setForm(empty);
    fetchItems();
  };

  const handleEdit = (q: ScenarioQuestion) => {
    setEditing(q.id);
    setForm({
      title: q.title || "",
      description: q.description || "",
      scenario: q.scenario || "",
      technology: q.technology || "",
      difficulty: q.difficulty || "Intermediate",
      tagsInput: (q.tags || []).join(", "),
      hint: q.hint || "",
      answer: q.answer || "",
      explanation: q.explanation || "",
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("scenario_questions").delete().eq("id", id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Scenario deleted" });
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
          <h1 className="text-2xl font-bold">Scenario Questions</h1>
          <p className="text-sm text-muted-foreground">
            Manage interview scenario questions shown to users.
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
              Add Scenario
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Scenario" : "Add Scenario"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Production Outage in Microservices"
                />
              </div>
              <div>
                <Label>Short Description</Label>
                <Textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="One-liner shown on the card"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Technology *</Label>
                  <Input
                    value={form.technology}
                    onChange={(e) => setForm({ ...form, technology: e.target.value })}
                    placeholder="React, Node.js, AWS..."
                  />
                </div>
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
              </div>
              <div>
                <Label>Tags (comma separated)</Label>
                <Input
                  value={form.tagsInput}
                  onChange={(e) => setForm({ ...form, tagsInput: e.target.value })}
                  placeholder="system-design, debugging, performance"
                />
              </div>
              <div>
                <Label>Scenario / Problem *</Label>
                <Textarea
                  rows={4}
                  value={form.scenario}
                  onChange={(e) => setForm({ ...form, scenario: e.target.value })}
                  placeholder="Describe the scenario the candidate must solve..."
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
                  placeholder="The ideal answer (markdown supported)"
                />
              </div>
              <div>
                <Label>Explanation</Label>
                <Textarea
                  rows={3}
                  value={form.explanation}
                  onChange={(e) => setForm({ ...form, explanation: e.target.value })}
                  placeholder="Why this answer is correct / what to learn"
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
              <TableHead>Title</TableHead>
              <TableHead>Technology</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((q) => (
              <TableRow key={q.id}>
                <TableCell className="max-w-xs truncate font-medium">
                  {q.title || q.scenario.slice(0, 60)}
                </TableCell>
                <TableCell>{q.technology}</TableCell>
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
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(q.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground py-8"
                >
                  No scenario questions yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default AdminScenarioQuestions;
