"use client";

import { ArrowUp, ChevronDown, FilterX, Inbox, ListFilter, Plus } from "lucide-react";
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
  "In progress": "bg-amber-50 text-amber-800 max-md:bg-rose-50 max-md:text-rose-700",
  Done: "bg-success-tint text-success",
};

const statusDots: Record<Status, string> = {
  Planned: "bg-sky-500",
  "Under review": "bg-slate-400",
  "In progress": "bg-rose-400",
  Done: "bg-success",
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
      back
      action={
        <Button className="h-10 gap-1 rounded-[10px] px-4 font-normal" onClick={() => setOpen(true)}>
          <Plus className="size-4" aria-hidden />
          Suggest a feature
        </Button>
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
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
        <div className="flex flex-col items-center gap-1.5 rounded-[20px] bg-surface-tint px-6 py-16 text-center md:rounded-none md:bg-transparent md:px-0">
          <span className="relative flex size-16 items-center justify-center rounded-full bg-white text-icon-default">
            <Inbox className="size-7" strokeWidth={1.5} aria-hidden />
            <span aria-hidden className="absolute top-3 right-3 size-2 rounded-full bg-action-accent" />
          </span>
          <h2 className="pt-3 font-display text-lg font-semibold text-text-primary">Nothing here yet</h2>
          <p className="max-w-[260px] text-sm leading-5 text-text-secondary">
            No ideas with this status yet. Help us decide what to ship next!
          </p>
          <button
            type="button"
            onClick={() => setStatus("all")}
            className="mt-2 flex items-center gap-1.5 rounded-sm text-sm text-text-primary underline underline-offset-2 outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <FilterX className="size-4" aria-hidden />
            Show all ideas
          </button>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {list.map((i) => {
            const isVoted = voted.has(i.id);
            return (
              <li key={i.id} className="flex gap-3 rounded-[16px] border border-line bg-white p-4 md:gap-4 md:p-5">
                <button
                  type="button"
                  aria-pressed={isVoted}
                  aria-label={`Vote for ${i.title}, ${i.votes} votes`}
                  onClick={() => toggleVote(i.id)}
                  className={cn(
                    "flex size-12 shrink-0 flex-col items-center justify-center rounded-[12px] border font-display outline-none focus-visible:ring-2 focus-visible:ring-ring md:size-16",
                    isVoted ? "border-brand-primary bg-surface-tint text-text-primary" : "border-transparent bg-surface-tint text-text-secondary md:border-line md:bg-white md:hover:bg-surface-page"
                  )}
                >
                  <ArrowUp className={cn("size-4", isVoted && "text-text-primary")} strokeWidth={2} aria-hidden />
                  <span className="text-sm leading-5 font-semibold text-text-primary">{i.votes}</span>
                </button>
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-[15px] leading-6 font-semibold text-text-primary">{i.title}</h2>
                  {i.body && <p className="line-clamp-2 pt-1 text-sm leading-[21px] text-text-secondary">{i.body}</p>}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {isVoted && (
                      <span className="font-display text-xs font-medium text-brand-secondary-text md:hidden">You upvoted</span>
                    )}
                    {i.status && (
                      <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-display text-xs font-medium", statusStyles[i.status])}>
                        <span aria-hidden className={cn("size-1.5 rounded-full md:hidden", statusDots[i.status])} />
                        {i.status}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-md:top-auto max-md:bottom-0 max-md:left-0 max-md:max-w-none max-md:translate-x-0 max-md:translate-y-0 max-md:rounded-t-3xl max-md:rounded-b-none sm:max-w-[560px]">
          <form onSubmit={submit} className="flex flex-col gap-5 p-2">
            <span aria-hidden className="mx-auto h-1 w-10 rounded-full bg-slate-200 md:hidden" />
            <DialogHeader>
              <DialogTitle>Suggest a feature</DialogTitle>
              <DialogDescription>Check the list first – someone may have suggested it already.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="idea-title" className="font-semibold">
                  Title <span className="text-error">*</span>
                </Label>
                <span id="idea-count" className="text-xs text-text-secondary">{title.length}/80</span>
              </div>
              <Input
                id="idea-title"
                autoFocus
                maxLength={80}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Short and clear, e.g. Dark mode"
                aria-describedby="idea-count"
              />
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
            <DialogFooter className="flex-row">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="h-11 flex-1 rounded-[12px] border-0 bg-surface-tint font-normal text-text-primary">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={!title.trim() || saving}
                className="h-11 flex-1 rounded-[12px] disabled:bg-slate-200 disabled:text-slate-500 disabled:opacity-100"
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
