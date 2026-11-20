import { PathwayView } from "@/components/pathway/pathway-view";
import { StripeReturn } from "@/components/plans/stripe-return";

/**
 * D-PTH-01 · Pathway and D-PTH-02 · Free plan.
 * The saved account plan decides the layout. `?plan=free` does not override a paid plan.
 */
export default function PathwayPage() {
  return (
    <>
      <StripeReturn />
      <PathwayView />
    </>
  );
}
