import { GlassCard } from "@/components/ui/GlassCard";

export default function ConceptPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <header className="text-center">
        <h1 className="font-serif text-4xl font-medium text-[#5D4037] sm:text-5xl">
          Our concept
        </h1>
        <p className="mt-4 font-sans text-[#5D4037]">
          Where the sky meets your cup
        </p>
      </header>

      <div className="mt-16 space-y-8">
        <GlassCard className="p-6 sm:p-10">
          <h2 className="font-serif text-2xl font-medium text-stone-800">The story</h2>
          <p className="mt-4 font-sans leading-relaxed text-stone-600">
            Cloud9 was born from a simple idea: what if your coffee break felt like a little escape?
            We wanted a space that feels soft, dreamy, and a world away from the rush—somewhere you
            can slow down, sip something wonderful, and leave feeling a little lighter.
          </p>
        </GlassCard>

        <GlassCard className="p-6 sm:p-10">
          <h2 className="font-serif text-2xl font-medium text-stone-800">The café</h2>
          <p className="mt-4 font-sans leading-relaxed text-stone-600">
            Our café is designed to feel like stepping into a cloud—airy, calm, and inviting. Soft
            curves, natural light, and a palette of creams and sky blues create a place where
            every visit feels special. Whether you&apos;re here for a quick takeaway or a long
            catch-up, we hope you leave feeling on cloud nine.
          </p>
        </GlassCard>

        <GlassCard className="p-6 sm:p-10">
          <h2 className="font-serif text-2xl font-medium text-stone-800">The coffee</h2>
          <p className="mt-4 font-sans leading-relaxed text-stone-600">
            We source our beans with care and craft each drink to be as beautiful as it is delicious.
            From our signature Cloud Blend to seasonal specials, every cup is made with the same
            attention to detail and a touch of magic.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
