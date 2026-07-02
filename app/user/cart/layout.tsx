import { ToastContainer } from "react-toastify";


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-white">
          {children}
      </div>
  );
}
