import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { CloudBackground } from "@/components/cloud/CloudBackground";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { LocaleHtml } from "@/components/layout/LocaleHtml";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "fr")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <LocaleHtml locale={locale} />
      <CloudBackground />
      <div className="relative flex h-screen flex-col overflow-hidden">
        <Header />
        <main className="min-h-0 flex-1 overflow-y-auto pt-16">{children}</main>
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
