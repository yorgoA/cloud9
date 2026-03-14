import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function GalleryPage() {
  const t = await getTranslations("gallery");

  const supabase = await createClient();
  const { data: images } = await supabase
    .from("gallery_images")
    .select("*")
    .order("sort_order");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const bucket = "gallery";

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <header className="text-center">
        <h1 className="font-serif text-4xl font-medium text-[#5D4037] sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 font-sans text-[#5D4037]">{t("subtitle")}</p>
      </header>

      {!images?.length ? (
        <GlassCard className="mt-16 p-12 text-center text-stone-600">
          {t("comingSoon")}
        </GlassCard>
      ) : (
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img) => {
            const src = `${supabaseUrl}/storage/v1/object/public/${bucket}/${img.path}`;
            return (
              <GlassCard key={img.id} className="overflow-hidden p-0">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={src}
                    alt={img.caption ?? t("alt")}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                {img.caption && (
                  <p className="p-4 font-sans text-sm text-stone-600">
                    {img.caption}
                  </p>
                )}
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
