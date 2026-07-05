export default function Card({
  title,
  right,
  children,
  className = "",
}: {
  title: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={"rounded-2xl p-4 " + className}
      style={{
        border: "1px solid var(--border-subtle)",
        backgroundColor: "var(--bg-secondary)",
      }}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          {title}
        </div>
        {right ? <div>{right}</div> : null}
      </div>
      {children}
    </div>
  );
}