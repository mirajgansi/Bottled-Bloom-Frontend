import { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string | number;
  sub?: string;
  color?: "blue" | "green" | "yellow" | "purple" | "red";
  Icon?: LucideIcon;
};

const bgStyles = {
  blue: "bg-blue-50 hover:bg-blue-100 hover:border-blue-300",
  green: "bg-green-50 hover:bg-green-100 hover:border-green-300",
  yellow: "bg-yellow-50 hover:bg-yellow-100 hover:border-yellow-300",
  purple: "bg-purple-50 hover:bg-purple-100 hover:border-purple-300",
  red: "bg-red-50 hover:bg-red-100 hover:border-red-300",
};

export default function StatCard({
  title,
  value,
  sub,
  color = "blue",
  Icon,
}: StatCardProps) {
  return (
    <div
      className={`
        group
        rounded-2xl
        border
        p-5
        shadow-sm
        transition-all duration-300
        hover:shadow-xl
        hover:-translate-y-1
        cursor-pointer
        ${bgStyles[color]}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between " >
        <p className="text-sm text-gray-600">{title}</p>

        {Icon && (
          <div className="rounded-lg bg-white p-2 shadow-sm">
            <Icon className="h-5 w-5 text-gray-700" />
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mt-4 text-3xl font-bold text-black">
        {value}
      </div>

      {/* Sub text */}
      {sub && (
        <p className="mt-2 text-sm text-gray-600">
          {sub}
        </p>
      )}
    </div>
  );
}
