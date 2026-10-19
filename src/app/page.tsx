import { Providers } from "@/components/providers/Providers";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Journey } from "@/components/sections/Journey";
import { Media } from "@/components/sections/Media";
import { Skills } from "@/components/sections/Skills";
import { Work } from "@/components/sections/Work";
import { SceneCanvas } from "@/components/three/SceneCanvas";
import { Cursor } from "@/components/ui/Cursor";
import { Marquee } from "@/components/ui/Marquee";
import { Navbar } from "@/components/ui/Navbar";
import { Preloader } from "@/components/ui/Preloader";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { marqueeWords } from "@/data/portfolio";

export default function Home() {
  return (
    <Providers>
      <a
        href="#main"
        className="sr-only z-100 rounded-full bg-fg px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Skip to content
      </a>
      <Preloader />
      <SceneCanvas />
      <div className="grain" aria-hidden />
      <ScrollProgress />
      <Cursor />
      <Navbar />

      <main id="main">
        <Hero />
        <About />
        <Marquee words={marqueeWords} />
        <Work />
        <Skills />
        <Journey />
        <Media />
        <Contact />
      </main>

      <Footer />
    </Providers>
  );
}
