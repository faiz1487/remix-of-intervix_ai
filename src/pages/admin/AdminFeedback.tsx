import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Star, MessageSquareHeart } from "lucide-react";

interface FeedbackRow {
  id: string;
  user_name: string;
  user_email: string;
  category: string;
  rating: number;
  message: string;
  created_at: string;
}

const AdminFeedback = () => {
  const [items, setItems] = useState<FeedbackRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("feedback")
        .select("id, user_name, user_email, category, rating, message, created_at")
        .order("created_at", { ascending: false });
      if (data) setItems(data as FeedbackRow[]);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return items;
    return items.filter(
      (f) =>
        f.message.toLowerCase().includes(q) ||
        f.user_email.toLowerCase().includes(q) ||
        f.user_name.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q)
    );
  }, [items, search]);

  const avg = items.length
    ? (items.reduce((s, f) => s + (f.rating || 0), 0) / items.length).toFixed(1)
    : "—";

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-1">
        <MessageSquareHeart className="h-5 w-5 text-primary" />
        <h1 className="text-2xl font-bold">Feedback & Suggestions</h1>
      </div>
      <p className="text-sm text-muted-foreground mb-6">Read-only view of what users have suggested.</p>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Total submissions</p>
          <p className="text-2xl font-bold">{items.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Average rating</p>
          <p className="text-2xl font-bold flex items-center gap-1">
            {avg} <Star className="h-4 w-4 text-primary fill-primary" />
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Last received</p>
          <p className="text-sm font-medium">
            {items[0] ? new Date(items[0].created_at).toLocaleString() : "—"}
          </p>
        </Card>
      </div>

      <Input
        placeholder="Search by user, email, category or text..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 max-w-md"
      />

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Suggestion</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No feedback yet.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="align-top">
                    <div className="font-medium">{f.user_name || "Anonymous"}</div>
                    <div className="text-xs text-muted-foreground">{f.user_email}</div>
                  </TableCell>
                  <TableCell className="align-top">
                    <Badge variant="secondary">{f.category}</Badge>
                  </TableCell>
                  <TableCell className="align-top whitespace-nowrap">{f.rating}/5</TableCell>
                  <TableCell className="align-top max-w-md">
                    <p className="text-sm whitespace-pre-wrap">{f.message}</p>
                  </TableCell>
                  <TableCell className="align-top text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(f.created_at).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default AdminFeedback;
