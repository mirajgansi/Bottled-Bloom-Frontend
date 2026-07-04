export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full min-h-screen px-6">
      {children}
    </main>
  );
}
