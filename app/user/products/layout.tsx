export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full min-h-screen bg-gray-50 px-6">
      {children}
    </main>
  );
}
