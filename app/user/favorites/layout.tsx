

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
<main className="max-w mx-auto bg-white">
  {children}
</main>
  );
}