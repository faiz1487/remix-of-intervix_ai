import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Search, Sparkles, X, Send, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ModuleHeader from "@/components/modules/ModuleHeader";
import { streamChat, type Msg } from "@/lib/chat";
import { toast } from "sonner";

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
  className?: string;
}

interface FilterOption {
  key: string;
  label: string;
  options: string[];
}

interface ModulePageLayoutProps<T> {
  title: string;
  description: string;
  icon: React.ReactNode;
  data: T[];
  columns: Column<T>[];
  searchKeys: (keyof T)[];
  filters?: FilterOption[];
  actions?: (row: T) => React.ReactNode;
  pageSize?: number;
  loading?: boolean;
}

const ITEMS_PER_PAGE = 10;

function ModulePageLayout<T extends { id: string }>({
  title,
  description,
  icon,
  data,
  columns,
  searchKeys,
  filters = [],
  actions,
  pageSize = ITEMS_PER_PAGE,
  loading = false,
}: ModulePageLayoutProps<T>) {
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [aiOpen, setAiOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Filter + search
  const filtered = data.filter((row) => {
    const matchesSearch = search === "" || searchKeys.some((key) => {
      const val = row[key];
      if (Array.isArray(val)) return val.some(v => String(v).toLowerCase().includes(search.toLowerCase()));
      return String(val ?? "").toLowerCase().includes(search.toLowerCase());
    });
    const matchesFilters = Object.entries(filterValues).every(([key, value]) => {
      if (!value || value === "__all__") return true;
      const rowVal = row[key as keyof T];
      if (Array.isArray(rowVal)) return rowVal.includes(value);
      return String(rowVal) === value;
    });
    return matchesSearch && matchesFilters;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => { setPage(1); }, [search, filterValues]);

  const sendAi = async (text: string) => {
    if (!text.trim() || aiLoading) return;
    const userMsg: Msg = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setAiInput("");
    setAiLoading(true);

    let assistantSoFar = "";
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: [...messages, userMsg],
        onDelta: upsert,
        onDone: () => setAiLoading(false),
        onError: (err) => { toast.error(err); setAiLoading(false); },
      });
    } catch {
      toast.error("Something went wrong.");
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex relative">
      <div className="aurora" />
      {/* Main content */}
      <div className={`flex-1 relative z-[1] page-enter transition-all duration-300 ${aiOpen ? "mr-[400px]" : ""}`}>
        <ModuleHeader
          title={title}
          description={description}
          icon={icon}
          className="glass border-b border-border/30 px-6 py-4 sticky top-0 z-10"
          action={
            <Button
              onClick={() => setAiOpen(!aiOpen)}
              className="btn-shine press bg-gradient-primary text-primary-foreground gap-2 shadow-glow hover:-translate-y-0.5 transition-transform"
            >
              <Sparkles className="w-4 h-4" />
              Ask Intervixa AI
            </Button>
          }
        />


        {/* Filters */}
        <div className="px-6 py-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          {filters.map((f) => (
            <Select key={f.key} value={filterValues[f.key] || "__all__"} onValueChange={(v) => setFilterValues((prev) => ({ ...prev, [f.key]: v }))}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={f.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All {f.label}</SelectItem>
                {f.options.map((o) => (
                  <SelectItem key={o} value={o}>{o}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
          <span className="text-sm text-muted-foreground ml-auto">{filtered.length} results</span>
        </div>

        {/* Table */}
        <div className="px-6 pb-6">
          <Card className="overflow-hidden animate-fade-in shadow-card">

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((col) => (
                      <TableHead key={String(col.key)} className={col.className}>{col.label}</TableHead>
                    ))}
                    {actions && <TableHead className="w-32">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map((row) => (
                    <TableRow key={row.id} className="row-hover">
                      {columns.map((col) => (
                        <TableCell key={String(col.key)} className={col.className}>
                          {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? "")}
                        </TableCell>
                      ))}
                      {actions && <TableCell>{actions(row)}</TableCell>}
                    </TableRow>
                  ))}
                  {paginated.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={columns.length + (actions ? 1 : 0)} className="text-center text-muted-foreground py-12">
                        No data found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* AI Sidebar */}
      <AnimatePresence>
        {aiOpen && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-[400px] bg-card border-l border-border/30 flex flex-col z-20"
          >
            <div className="px-4 py-3 border-b border-border/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="font-display font-bold text-sm">Intervixa AI</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setAiOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground text-sm pt-8">
                  <Sparkles className="w-8 h-8 text-primary mx-auto mb-3 opacity-50" />
                  <p>Ask me anything about {title.toLowerCase()}!</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[90%] rounded-xl px-3 py-2 text-sm ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm prose-invert max-w-none [&_p]:text-foreground [&_li]:text-foreground [&_strong]:text-primary">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}
              {aiLoading && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-xl px-3 py-2 flex items-center gap-2">
                    <Loader2 className="w-3 h-3 text-primary animate-spin" />
                    <span className="text-xs text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="border-t border-border/30 px-4 py-3 flex gap-2">
              <Input
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") sendAi(aiInput); }}
                placeholder="Ask about this data..."
                className="text-sm"
              />
              <Button size="icon" onClick={() => sendAi(aiInput)} disabled={!aiInput.trim() || aiLoading} className="bg-gradient-primary text-primary-foreground shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ModulePageLayout;
