/* Plans shown in the paywall (D-PAY-01) and in Settings › Subscription (D-SET-02). */
export type PlanId = "free" | "individual" | "premium";

export const plans: {
  id: PlanId;
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: { label: string; soon?: boolean }[];
  highlighted?: boolean;
  cta: string;
}[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    description: "3 demo lessons in Work",
    features: [],
    cta: "Current plan",
  },
  {
    id: "individual",
    name: "Individual",
    price: "$7.99",
    period: "/ month",
    features: [{ label: "All lessons and sections" }, { label: "Mistake review" }, { label: "Full progress" }],
    highlighted: true,
    cta: "Choose Individual",
  },
  {
    id: "premium",
    name: "Premium",
    price: "$11.99",
    period: "/ month",
    features: [{ label: "Everything in Individual" }, { label: "Extra features (coming soon)", soon: true }],
    cta: "Choose Premium",
  },
];
