import { TrendingDown, TrendingUp } from "lucide-react";

export default function TrendPill({
  positive = true,
}: {
  positive?: boolean;
}) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold"
      style={
        positive
          ? { backgroundColor: "rgba(201, 161, 93, 0.15)", color: "var(--gold-primary)" }
          : { backgroundColor: "rgba(225, 83, 83, 0.12)", color: "#E57373" }
      }
    >
      {positive ? (
        <TrendingUp className="h-4 w-4" style={{ color: "var(--gold-primary)" }} />
      ) : (
        <TrendingDown className="h-4 w-4" style={{ color: "#E57373" }} />
      )}
    </span>
  );
}