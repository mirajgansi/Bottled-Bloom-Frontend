import { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string | number;
  sub?: string;
  color?: "blue" | "green" | "yellow" | "purple" | "red";
  Icon?: LucideIcon;
};

const colorStyles = {
  blue: {
    backgroundColor: "var(--bg-elevated)",
    border: "1px solid var(--border-subtle)",
    hoverBorder: "var(--border-strong)",
  },
  green: {
    backgroundColor: "rgba(201, 161, 93, 0.12)",
    border: "1px solid rgba(201, 161, 93, 0.3)",
    hoverBorder: "var(--gold-primary)",
  },
  yellow: {
    backgroundColor: "rgba(232, 194, 122, 0.12)",
    border: "1px solid rgba(232, 194, 122, 0.3)",
    hoverBorder: "var(--gold-bright)",
  },
  purple: {
    backgroundColor: "rgba(122, 90, 46, 0.15)",
    border: "1px solid rgba(122, 90, 46, 0.35)",
    hoverBorder: "var(--gold-deep)",
  },
  red: {
    backgroundColor: "rgba(225, 83, 83, 0.1)",
    border: "1px solid rgba(225, 83, 83, 0.3)",
    hoverBorder: "#E57373",
  },
};

export default function StatCard({
  title,
  value,
  sub,
  color = "blue",
  Icon,
}: StatCardProps) {
  const styles = colorStyles[color];

  return (
    <div
      className="group rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      style={{
        backgroundColor: styles.backgroundColor,
        border: styles.border,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = styles.hoverBorder;
        e.currentTarget.style.boxShadow = "0 12px 30px -10px rgba(0,0,0,0.5)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = styles.border.split(" ")[2] ?? styles.border;
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {title}
        </p>

        {Icon && (
          <div
            className="rounded-lg p-2"
            style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}
          >
            <Icon className="h-5 w-5" style={{ color: "var(--gold-primary)" }} />
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mt-4 text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
        {value}
      </div>

      {/* Sub text */}
      {sub && (
        <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
          {sub}
        </p>
      )}
    </div>
  );
}