import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";


interface Job {
  id: string;
  title: string;
  company_name: string;
  location: string;
  skills_required: string[];
  apply_link: string;
  source?: string;
}

const emptyJob = { title: "", company_name: "", location: "", skills_required: "", apply_link: "" };

const AdminJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyJob);
  const [syncing, setSyncing] = useState(false);
  const { toast } = useToast();

  const handleSync = async (window: "hour" | "day" = "day") => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke("sync-jobs", { body: { window } });
      if (error) throw error;
      toast({
        title: "Job sync complete",
        description: `${data?.inserted ?? 0} new job${data?.inserted === 1 ? "" : "s"} added from LinkedIn & Naukri (${window === "hour" ? "last 1 hour" : "last 24 hours"}).`,
      });
      fetchJobs();
    } catch (e) {
      toast({
        title: "Sync failed",
        description: e instanceof Error ? e.message : "Could not fetch latest jobs.",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };


  const fetchJobs = async () => {
    const { data } = await supabase.from("jobs").select("*").order("created_at", { ascending: false });
    if (data) setJobs(data);
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleSave = async () => {
    const payload = {
      title: form.title,
      company_name: form.company_name,
      location: form.location,
      skills_required: form.skills_required.split(",").map((s) => s.trim()).filter(Boolean),
      apply_link: form.apply_link,
    };

    if (editing) {
      await supabase.from("jobs").update(payload).eq("id", editing);
      toast({ title: "Job updated" });
    } else {
      await supabase.from("jobs").insert(payload);
      toast({ title: "Job added" });
    }
    setOpen(false);
    setEditing(null);
    setForm(emptyJob);
    fetchJobs();
  };

  const handleEdit = (job: Job) => {
    setEditing(job.id);
    setForm({ ...job, skills_required: job.skills_required?.join(", ") || "" });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("jobs").delete().eq("id", id);
    toast({ title: "Job deleted" });
    fetchJobs();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Job Management</h1>
          <p className="text-sm text-muted-foreground">Auto-syncs the latest DevOps &amp; Cloud Engineer roles posted in the last 24 hours on LinkedIn and Naukri.</p>
        </div>
        <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => handleSync("hour")} disabled={syncing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
          Last 1 hour
        </Button>
        <Button variant="outline" onClick={() => handleSync("day")} disabled={syncing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Fetching..." : "Last 24 hours"}
        </Button>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setEditing(null); setForm(emptyJob); } }}>

          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Add Job</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Edit Job" : "Add Job"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Job Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div><Label>Company Name</Label><Input value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} /></div>
              <div><Label>Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
              <div><Label>Skills (comma-separated)</Label><Input value={form.skills_required} onChange={(e) => setForm({ ...form, skills_required: e.target.value })} /></div>
              <div><Label>Apply Link</Label><Input value={form.apply_link} onChange={(e) => setForm({ ...form, apply_link: e.target.value })} /></div>
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
              <TableHead>Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Skills</TableHead>
              <TableHead>Source</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium">{job.title}</TableCell>
                <TableCell>{job.company_name}</TableCell>
                <TableCell>{job.location}</TableCell>
                <TableCell className="max-w-48 truncate">{job.skills_required?.join(", ")}</TableCell>
                <TableCell>
                  <Badge variant={job.source && job.source !== "manual" ? "default" : "secondary"} className="capitalize text-xs">
                    {job.source || "manual"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(job)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(job.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {jobs.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No jobs yet</TableCell></TableRow>
            )}

          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

// Need Card import
import { Card } from "@/components/ui/card";

export default AdminJobs;
