import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono, Figtree } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import SoftAurora from '@/components/SoftAurora';
import Navbar from "@/components/Navbar";

const figtree = Figtree({subsets:['latin'],variable:'--font-sans'});

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevEvent",
  description: "The Hub for Every Dev Event You Mustn't Miss",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("min-h-screen", "antialiased", schibstedGrotesk.variable, martianMono.variable, "font-sans", figtree.variable)}
    >
      <body className={`${schibstedGrotesk.variable} ${martianMono.variable} min-h-screen antialiased`}>

      <Navbar />
        <div className={"absolute inset-0 top-0 z-[-1] min-h-screen"}>
          <SoftAurora
              speed={0.3}
              scale={1.0}
              brightness={1}
              color1="#f7f7f7"
              color2="#e100ff"
              noiseFrequency={2.5}
              noiseAmplitude={1}
              bandHeight={0.6}
              bandSpread={1}
              octaveDecay={0.1}
              layerOffset={0}
              colorSpeed={1}
              enableMouseInteraction
              mouseInfluence={0.25}
          />
        </div>

        <main>
          {children}
        </main>

      </body>
    </html>
  );
}
