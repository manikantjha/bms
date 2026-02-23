import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import { LocalBusinessJsonLd } from "@/components/seo/json-ld";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LocalBusinessJsonLd />
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
