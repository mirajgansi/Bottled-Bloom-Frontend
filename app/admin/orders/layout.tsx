

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
        <main className="flex-1 ">
          {children}
        </main>
      </div>
  );
}
