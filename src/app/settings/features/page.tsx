"use client";

import { ArrowUp, ChevronDown, Inbox, ListFilter, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { SettingsPage } from "@/components/settings/settings-nav";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createFeature, loadFeatureBoard, setFeatureVote } from "@/lib/features";
import { cn } from "@/lib/utils";

type Status = "Planned" | "Under review" | "In progress" | "Done";
type Idea = {
  id: string;
  title: string;
  body: string;
  votes: number;
  createdAt: number;
  status?: Status;
};

const statuses: Status[] = ["Planned", "Under review", "In progress", "Done"];

function asStatus(value: string | null): Status | undefined {
  return statuses.find((status) => status === value);
}

const statusStyles: Record<Status, string> = {
  Planned: "bg-sky-50 text-sky-800",
  "Under review": "bg-slate-100 text-text-secondary",
  "In progress": "bg-amber-50 text-amber-800",
  Done: "bg-success-tint text-success",
};

/** D-SET-04 · Feature board, D-SET-05 · Suggest a feature (modal), D-SET-06 · empty filter */
export default function FeatureBoard() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [voted, setVoted] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [sort, setSort] = useState<"top" | "new">("top");
  const [status, setStatus] = useState<"all" | Status>("all");
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    let cancelled = false;
    loadFeatureBoard().then((result) => {
      if (cancelled) return;
      if ("error" in result) {
        setLoadError(result.error);
        setReady(true);
        return;
      }
      setIdeas(
        result.ideas.map((idea) => {
          const ideaStatus = asStatus(idea.status);
          return {
            id: idea.id,
            title: idea.title,
            body: idea.body,
            votes: idea.votes,
            createdAt: idea.createdAt,
            ...(ideaStatus ? { status: ideaStatus } : {}),
          };
        })
      );
      setVoted(new Set(result.voted));
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const list = useMemo(
    () =>
      ideas
        .filter((i) => status === "all" || i.status === status)
        .sort((a, b) => (sort === "top" ? b.votes - a.votes : b.createdAt - a.createdAt)),
    [ideas, sort, status]
  );

  const toggleVote = async (id: string) => {
    const has = voted.has(id);
    setVoted((current) => {
      const next = new Set(current);
      if (has) next.delete(id);
      else next.add(id);
      return next;
    });
    setIdeas((all) => all.map((idea) => (idea.id === id ? { ...idea, votes: idea.votes + (has ? -1 : 1) } : idea)));
    const ok = await setFeatureVote(id, !has);
    if (ok) return;
    setVoted((current) => {
      const next = new Set(current);
      if (has) next.add(id);
      else next.delete(id);
      return next;
    });
    setIdeas((all) => all.map((idea) => (idea.id === id ? { ...idea, votes: idea.votes + (has ? 1 : -1) } : idea)));
    setLoadError("Couldn't save that vote.");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || saving) return;
    setSaving(true);
    setLoadError("");
    const created = await createFeature(title.trim(), body.trim());
    setSaving(false);
    if (!created) {
      setLoadError("Couldn't save that idea.");
      return;
    }
    const createdStatus = asStatus(created.status);
    setIdeas((all) => [
      ...all,
      {
        id: created.id,
        title: created.title,
        body: created.body,
        votes: created.votes,
        createdAt: created.createdAt,
        ...(createdStatus ? { status: createdStatus } : {}),
      },
    ]);
    setVoted((current) => new Set(current).add(created.id));
    setTitle("");
    setBody("");
    setOpen(false);
    setSort("new");
    setStatus("all");
  };

  return (
    <SettingsPage
      title="Suggest a feature"
      description="Vote for ideas you want. We read every one."
      width={720}
      action={
        <Button className="h-10 gap-1 rounded-[10px] px-4 font-normal" onClick={() => setOpen(true)}>
          <Plus className="size-4" aria-hidden />
          Suggest a feature
        </Button>
      }
    >
      <div className="flex items-center justify-between">
        <div role="tablist" aria-label="Sort features" className="flex rounded-[12px] bg-slate-100 p-1">
          {(["top", "new"] as const).map((s) => (
            <button
              key={s}
              role="tab"
              aria-selected={sort === s}
              onClick={() => setSort(s)}
              className={cn(
                "h-8 rounded-[9px] px-4 font-display text-sm font-medium capitalize outline-none focus-visible:ring-2 focus-visible:ring-ring",
                sort === s ? "bg-white text-text-primary shadow-xs" : "text-text-secondary"
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <label className="relative flex h-10 items-center gap-2 rounded-[10px] px-3 font-display text-sm text-text-primary focus-within:ring-2 focus-within:ring-ring hover:bg-surface-page">
          <ListFilter className="size-4 text-text-secondary" aria-hidden />
          <span className="sr-only">Filter by status</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "all" | Status)}
            className="appearance-none bg-transparent pr-5 outline-none"
          >
            <option value="all">All statuses</option>
            {statuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 size-4" aria-hidden />
        </label>
      </div>

      {loadError ? (
        <p role="alert" className="text-sm text-error">
          {loadError}
        </p>
      ) : null}

      {!ready ? (
        <p className="py-16 text-center text-sm text-text-secondary">Loading ideas</p>
      ) : list.length === 0 ? (
        <div className="flex flex-col items-center gap-1.5 py-16 text-center">
          <Inbox className="size-9 text-icon-default" strokeWidth={1.5} aria-hidden />
          <h2 className="pt-3 font-display text-[15px] font-semibold text-text-primary">Nothing here yet</h2>
          <p className="text-sm text-text-secondary">No ideas with this status yet.</p>
          <button
            type="button"
            onClick={() => setStatus("all")}
            className="mt-2 rounded-sm text-sm text-text-primary underline underline-offset-2 outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Show all ideas
          </button>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {list.map((i) => {
            const isVoted = voted.has(i.id);
            return (
              <li key={i.id} className="flex gap-4 rounded-[16px] border border-line bg-white p-5">
                <button
                  type="button"
                  aria-pressed={isVoted}
                  aria-label={`Vote for ${i.title}, ${i.votes} votes`}
                  onClick={() => toggleVote(i.id)}
                  className={cn(
                    "flex size-16 shrink-0 flex-col items-center justify-center rounded-[12px] border font-display outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isVoted ? "border-brand-primary bg-surface-tint text-text-primary" : "border-line bg-white text-text-secondary hover:bg-surface-page"
                  )}
                >
                  <ArrowUp className={cn("size-4", isVoted && "text-text-primary")} strokeWidth={2} aria-hidden />
                  <span className="text-sm leading-5 font-semibold text-text-primary">{i.votes}</span>
                </button>
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-[15px] leading-6 font-semibold text-text-primary">{i.title}</h2>
                  {i.body && <p className="line-clamp-2 pt-1 text-sm leading-[21px] text-text-secondary">{i.body}</p>}
                  {i.status && (
                    <span className={cn("mt-3 inline-block rounded-full px-2 py-0.5 font-display text-xs font-medium", statusStyles[i.status])}>
                      {i.status}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <form onSubmit={submit} className="flex flex-col gap-5 p-2">
            <DialogHeader>
              <DialogTitle>Suggest a feature</DialogTitle>
              <DialogDescription>Check the list first – someone may have suggested it already.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <Label htmlFor="idea-title" className="font-semibold">Title</Label>
              <Input
                id="idea-title"
                autoFocus
                maxLength={80}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Short and clear, e.g. Dark mode"
                aria-describedby="idea-count"
              />
              <span id="idea-count" className="self-end text-xs text-text-secondary">{title.length}/80</span>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="idea-body" className="font-semibold">
                Description <span className="font-normal text-text-secondary">(optional)</span>
              </Label>
              <Textarea
                id="idea-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="What problem would this solve for you?"
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost" className="h-10 rounded-[10px] px-4 font-normal text-text-secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={!title.trim() || saving}
                className="h-10 rounded-[10px] px-4 disabled:bg-slate-100 disabled:text-slate-400 disabled:opacity-100"
              >
                Submit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </SettingsPage>
  );
}
