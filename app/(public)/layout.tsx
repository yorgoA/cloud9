import { CloudBackground } from "@/components/cloud/CloudBackground";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CloudBackground />
      <div className="relative flex h-screen flex-col overflow-hidden">
        <Header />
        <main className="min-h-0 flex-1 overflow-y-auto pt-16">{children}</main>
        <Footer />
      </div>
    </>
  );
}
