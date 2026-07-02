import { Geist, Geist_Mono } from "next/font/google";
import Header from "./_components/header/Header";
import { handleWhoami } from "@/lib/actions/auth-actions";
import { AuthProvider } from "@/context/AuthContext";
import UserSocketClient from "../_componets/SocketBridge";
import AuthBridge from "./_components/AuthBridge";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const result = await handleWhoami();
  const user = result?.success ? result.data : null;

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <AuthProvider>
          <AuthBridge user={user} />
          <UserSocketClient />
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}