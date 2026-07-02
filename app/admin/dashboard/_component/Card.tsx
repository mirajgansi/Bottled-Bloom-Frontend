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
    <div className={"rounded-2xl border border-gray-100 bg-white p-4 shadow-sm " + className}>
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-semibold text-gray-800">{title}</div>
        {right ? <div>{right}</div> : null}
      </div>
      {children}
    </div>
  );
}