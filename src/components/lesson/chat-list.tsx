import { Check } from "lucide-react";

import { Avatar } from "@/components/chat/avatar";
import { characters } from "@/lib/characters";
import { cn } from "@/lib/utils";

/** Second column of the lesson screen: unit header + the two chats. */
export function ChatList({
  unit,
  unitTitle,
  scenarioProgress,
  progressLabel,
  activePreview = "Your manager",
  done = false,
}: {
  unit: string;
  unitTitle: string;
  scenarioProgress: string;
  /** e.g. "3/6" — shown on the active chat once a step is done */
  progressLabel?: string;
  /** Second line of the active chat, e.g. "✓ Done" after the lesson */
  activePreview?: string;
  /** Lesson finished: green "Done" chip + check badge */
  done?: boolean;
}) {
  return (
    <section
      aria-label="Chats"
      className="sticky top-0 flex h-screen w-[280px] shrink-0 flex-col border-r border-slate-200 bg-white"
    >
      <header className="border-b border-slate-200/60 px-5 pt-6 pb-[17px] font-display">
        <p className="text-[13px] leading-[19.5px] font-semibold tracking-[0.65px] text-text-secondary uppercase">
          {unit}
        </p>
        <h2 className="pt-[5px] text-base leading-6 font-bold text-text-primary">{unitTitle}</h2>
        <p className="text-[13px] leading-[19.5px] text-text-secondary">{scenarioProgress}</p>
      </header>

      <ul className="flex flex-col gap-2 p-3">
        <ChatRow
          name={characters.hana.name}
          avatar={characters.hana.avatar}
          preview="Tip: Notice how Tanaka-san ends with ますか…"
          status="online"
        />
        <ChatRow
          name={characters.yuki.name}
          avatar={characters.yuki.avatar}
          preview={activePreview}
          status="unread"
          active
          badge={progressLabel}
          done={done}
        />
      </ul>
    </section>
  );
}

function ChatRow({
  name,
  avatar,
  preview,
  status,
  active,
  badge,
  done,
}: {
  name: string;
  avatar: string;
  preview: string;
  status: "online" | "unread";
  active?: boolean;
  badge?: string;
  done?: boolean;
}) {
  return (
    <li>
      <button
        type="button"
        aria-current={active ? "true" : undefined}
        className={cn(
          "flex w-full items-center gap-3 rounded-2xl border p-[13px] text-left font-display outline-none focus-visible:ring-2 focus-visible:ring-ring",
          active ? "border-[#b8d5fa]/80 bg-surface-tint" : "border-transparent hover:bg-surface-page"
        )}
      >
        <span className="relative shrink-0">
          <span
            className={cn(
              "block rounded-full",
              active ? "shadow-[0_0_0_2px_white]" : "shadow-[0_0_0_1px_#e2e8f0]"
            )}
          >
            <Avatar src={avatar} size={48} />
          </span>
          {status === "online" || done ? (
            <span className="absolute right-0 bottom-0 flex size-3.5 items-center justify-center rounded-full border-2 border-white bg-success">
              {done && <Check className="size-2 text-white" strokeWidth={4} aria-hidden />}
            </span>
          ) : (
            <span className="absolute right-0 bottom-0 flex size-3.5 items-center justify-center rounded-full border-2 border-white bg-action-accent">
              <span className="size-1 rounded-full bg-white" />
            </span>
          )}
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="flex items-center justify-between gap-2">
            <span
              className={cn(
                "truncate text-sm leading-5 text-text-primary",
                active ? "font-bold" : "font-semibold"
              )}
            >
              {name}
            </span>
            {done ? (
              <span className="flex items-center gap-0.5 rounded-full bg-success-tint px-1.5 py-0.5 text-[11px] leading-4 font-semibold text-success">
                <Check className="size-3" strokeWidth={3} aria-hidden />
                Done
              </span>
            ) : badge && (
              <span className="rounded-full bg-white/70 px-1.5 py-0.5 text-xs leading-4 font-semibold text-text-secondary">
                {badge}
              </span>
            )}
          </span>
          <span className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "truncate text-[13px] leading-[19.5px]",
              active ? "font-medium text-text-primary/80" : "text-text-secondary"
            )}
          >
            {preview}
          </span>
          {done && badge && <span className="text-xs leading-4 font-semibold text-text-secondary">{badge}</span>}
          </span>
        </span>
      </button>
    </li>
  );
}
