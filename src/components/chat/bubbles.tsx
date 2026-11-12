import { cn } from "@/lib/utils";
import { Avatar } from "@/components/chat/avatar";

type BubbleSize = "md" | "sm";

const sizeClasses: Record<BubbleSize, string> = {
  /** 16/26 body, 24px side padding (ONB-01, 03, 04) */
  md: "px-6 py-4 text-base leading-[26px]",
  /** 15/24 body, 16px side padding (ONB-02 history stream) */
  sm: "px-4 py-[9.5px] text-[15px] leading-[24.38px]",
};

const tailClasses = {
  none: "",
  tl: "rounded-tl-[2px]",
  tr: "rounded-tr-[2px]",
  bl: "rounded-bl-[2px]",
  br: "rounded-br-[2px]",
  "bl-4": "rounded-bl-[4px]",
  "br-4": "rounded-br-[4px]",
} as const;

type Tail = keyof typeof tailClasses;

/** Purple bubble used by the guide (Hana) and other characters. */
export function GuideBubble({
  children,
  size = "md",
  tail = "bl",
  className,
}: {
  children: React.ReactNode;
  size?: BubbleSize;
  tail?: Tail;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-fit max-w-[490px] rounded-2xl bg-bubble-guide text-ink drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]",
        sizeClasses[size],
        size === "sm" && "text-ink-soft",
        tailClasses[tail],
        className
      )}
    >
      {children}
    </div>
  );
}

/** Light-blue bubble for the learner's own answers, right-aligned. */
export function UserBubble({
  children,
  size = "md",
  tail = "br-4",
  className,
}: {
  children: React.ReactNode;
  size?: BubbleSize;
  tail?: Tail;
  className?: string;
}) {
  return (
    <div className="flex w-full justify-end">
      <div
        className={cn(
          "w-fit max-w-[461px] rounded-2xl bg-surface-tint text-ink drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]",
          size === "md" ? "px-6 py-2 text-base leading-[26px]" : sizeClasses.sm,
          size === "sm" && "font-medium",
          tailClasses[tail],
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

/** Large identity row: 40px avatar + 17px name (ONB-01 greeting). */
export function GuideIdentity({ name, avatar }: { name: string; avatar: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-10 items-center justify-center rounded-full border border-line bg-bubble-guide p-px shadow-xs">
        <Avatar src={avatar} size={38} />
      </span>
      <span className="text-[17px] leading-[21.25px] font-semibold text-ink">
        {name}
      </span>
    </div>
  );
}

/** Small inline label: 20px avatar + 13px name (ONB-03, 04). */
export function GuideLabel({ name, avatar }: { name: string; avatar: string }) {
  return (
    <div className="flex items-center gap-1 px-1">
      <Avatar src={avatar} size={20} />
      <span className="text-[13px] leading-[19.5px] font-semibold text-muted-ink">
        {name}
      </span>
    </div>
  );
}

/**
 * Message group with the avatar in its own column (ONB-02 history stream).
 * Pass several bubbles as children; they stack with a 6px gap.
 */
export function GuideMessageGroup({
  name,
  avatar,
  children,
  dimmed = false,
}: {
  name: string;
  avatar: string;
  children: React.ReactNode;
  dimmed?: boolean;
}) {
  return (
    <div className={cn("flex w-full items-start gap-3", dimmed && "opacity-75")}>
      <span className="shrink-0 rounded-full border border-bubble-guide-line shadow-xs">
        <Avatar src={avatar} size={30} />
      </span>
      <div className="flex max-w-[461px] flex-col gap-1.5">
        <span className="h-[19.5px] text-[13px] leading-[19.5px] font-semibold text-muted-ink">
          {name}
        </span>
        {children}
      </div>
    </div>
  );
}
