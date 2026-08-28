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
import { Plus, Pencil, Trash2 } from "lucide-react";

interface RoadmapModule {
  id: string;
  title: string;
  icon_name: string;
  difficulty: string;
  duration: string;
  progress: number;
  topics: string[];
  topic_links: Record<string, string> | null;
  order_index: number;
}

const empty = {
  title: "",
  icon_name: "Cloud",
  difficulty: "Beginner",
  duration: "1 week",
  progress: 0,
  topicsInput: "",
  order_index: 0,
};

const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];
const ICONS = ["Terminal", "Network", "Github", "Cloud", "Container", "Ship", "Layers", "GitBranch", "Activity", "MessageSquare"];

const AdminPrepRoadmap = () => {
  const [items, setItems] = useState<RoadmapModule[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const { toast } = useToast();

  const fetchItems = async () => {
    const { data } = await supabase
      .from("roadmap_modules")
      .select("*")
      .order("order_index", { ascending: true });
    if (data) setItems(data as RoadmapModule[]);
  };

  useEffect(() => { fetchItems(); }, []);

  const parseTopics = (input: string) => {
    const entries = input
      .split(/\n|,/)
      .map((s) => s.trim())
      .filter(Boolean);
    const topics: string[] = [];
    const topic_links: Record<string, string> = {};
    entries.forEach((e) => {
      const [name, ...rest] = e.split("|");
      const topic = name.trim();
      if (!topic) return;
      topics.push(topic);
      const url = rest.join("|").trim();
      if (url) topic_links[topic] = url;
    });
    return { topics, topic_links };
  };

  const handleSave = async () => {
    if (!form.title) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }
    const { topics, topic_links } = parseTopics(form.topicsInput);
    const payload = {
      title: form.title,
      icon_name: form.icon_name,
      difficulty: form.difficulty,
      duration: form.duration,
      progress: Number(form.progress) || 0,
      topics,
      topic_links,
      order_index: Number(form.order_index) || 0,
    };

    if (editing) {
      const { error } = await supabase.from("roadmap_modules").update(payload).eq("id", editing);
      if (error) return toast({ title: "Update failed", description: error.message, variant: "destructive" });
      toast({ title: "Updated" });
    } else {
      const { error } = await supabase.from("roadmap_modules").insert(payload);
      if (error) return toast({ title: "Create failed", description: error.message, variant: "destructive" });
      toast({ title: "Added" });
    }
    setOpen(false);
    setEditing(null);
    setForm(empty);
    fetchItems();
  };

  const handleEdit = (m: RoadmapModule) => {
    setEditing(m.id);
    const links = m.topic_links || {};
    setForm({
      title: m.title,
      icon_name: m.icon_name,
      difficulty: m.difficulty,
      duration: m.duration,
      progress: m.progress,
      topicsInput: (m.topics || []).map((t) => (links[t] ? `${t} | ${links[t]}` : t)).join("\n"),
      order_index: m.order_index,
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("roadmap_modules").delete().eq("id", id);
    toast({ title: "Deleted" });
    fetchItems();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Prep Roadmap</h1>
          <p className="text-sm text-muted-foreground">
            Manage modules shown on the Prep Roadmap page.
          </p>
        </div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setEditing(null); setForm(empty); } }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Add Module</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Module" : "Add Module"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Title *</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Linux Fundamentals" />
                </div>
                <div>
                  <Label>Icon</Label>
                  <Select value={form.icon_name} onValueChange={(v) => setForm({ ...form, icon_name: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {ICONS.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                    </SelectContent>
                  </Select>
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
                <div>
                  <Label>Duration</Label>
                  <Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="2 weeks" />
                </div>
                <div>
                  <Label>Progress (%)</Label>
                  <Input type="number" min={0} max={100} value={form.progress} onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })} />
                </div>
                <div>
                  <Label>Order</Label>
                  <Input type="number" value={form.order_index} onChange={(e) => setForm({ ...form, order_index: Number(e.target.value) })} />
                </div>
              </div>
              <div>
                <Label>Topics with document links (one per line: Topic | https://link)</Label>
                <Textarea
                  rows={6}
                  value={form.topicsInput}
                  onChange={(e) => setForm({ ...form, topicsInput: e.target.value })}
                  placeholder={"Linux commands | https://docs.example.com/linux\nSSH | https://docs.example.com/ssh\nCron jobs"}
                />
                <p className="text-xs text-muted-foreground mt-1">Link optional. Topics with a link open the document in a new tab on the user roadmap.</p>
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
              <TableHead className="w-16">#</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Topics</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((m) => (
              <TableRow key={m.id}>
                <TableCell>{m.order_index}</TableCell>
                <TableCell className="font-medium">{m.title}</TableCell>
                <TableCell><Badge variant="outline">{m.difficulty}</Badge></TableCell>
                <TableCell>{m.duration}</TableCell>
                <TableCell>{m.progress}%</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {(m.topics || []).slice(0, 3).map((t) => (
                      <Badge key={t} variant="secondary" className="text-xs">
                        {t}{m.topic_links?.[t] ? " 🔗" : ""}
                      </Badge>
                    ))}
                    {(m.topics || []).length > 3 && (
                      <span className="text-xs text-muted-foreground">+{m.topics.length - 3}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(m)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(m.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No roadmap modules yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default AdminPrepRoadmap;
