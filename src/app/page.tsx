"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";

// Zoom modal component
function ZoomModal({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-[90vw] max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="max-w-[90vw] max-h-[90vh] object-contain rounded shadow-2xl"
        />
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-black/70 text-white text-sm flex items-center justify-center hover:bg-black transition"
          aria-label="Close zoom"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

// --- Placeholder Unsplash images ---
// FACADE (luxury / opulence)
const BG_FACADE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80&auto=format&fit=crop";
const CENTER_FACADE =
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80&auto=format&fit=crop";

// REALITY (poverty / harsh truth)
const BG_REALITY =
  "https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=1920&q=80&auto=format&fit=crop";
const CENTER_REALITY =
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&q=80&auto=format&fit=crop";

// --- Placeholder essay content ---
const ESSAY_FACADE = {
  title: "The Image of Grandeur",
  subtitle:
    "An exploration of the carefully curated display of wealth and power during the Marcos era in the Philippines.",
  body: `The Marcos regime, spanning from 1965 to 1986, was remarkable not only for its duration but for the elaborate theater of opulence it constructed. Ferdinand and Imelda Marcos fashioned themselves as the embodiment of Filipino aspiration—beautiful, cultured, and impossibly wealthy. The Malacañang Palace became a stage upon which they performed their vision of national greatness, hosting lavish state dinners where crystal chandeliers cast golden light over tables laden with European delicacies.

Imelda Marcos, in particular, became the architect of this grand illusion. Her collection of three thousand pairs of shoes became legendary, but it was merely a footnote in an inventory of excess that included vast real estate holdings, priceless art collections, and jewelry that could ransom nations. The Cultural Center of the Philippines, her pet project, rose from reclaimed land along Manila Bay—a monument to the idea that culture could be purchased and displayed like any other commodity.

State-controlled media broadcast images of a thriving nation. Infrastructure projects—highways, bridges, convention centers—were unveiled with great ceremony. International celebrities and heads of state were invited to witness the spectacle. The Manila Film Festival, the grand balls, the state visits—each was choreographed to reinforce the narrative that the Philippines, under Marcos, was ascending to its rightful place among the world's great nations.

Behind the gleaming facades of new buildings and the dazzling smiles of the First Couple lay a carefully maintained machinery of image. Every photograph was curated, every public appearance stage-managed. The conjugal dictatorship, as it came to be known, understood that power was not merely exercised—it was performed. And in this performance, the Marcos family were consummate actors, their every gesture designed to project an aura of divine right and inevitable destiny.

This exhibit invites you to look beyond the gilded surface. Hover over the image above. See what was hidden behind the curtain of silk and gold. The truth has always been there, waiting to be seen.`,
};

const ESSAY_REALITY = {
  title: "The Hidden Truth",
  subtitle:
    "The reality of martial law: systematic torture, enforced disappearances, and a nation plundered from within.",
  body: `Behind every chandelier was a detention cell. For every state banquet, thousands went hungry. The Marcos regime's greatest achievement was not its infrastructure or its cultural projects—it was the systematic suppression of truth. When Ferdinand Marcos declared Martial Law on September 21, 1972, he did not merely suspend civil liberties—he inaugurated an era of state terror that would claim the lives, freedom, and dignity of tens of thousands of Filipinos.

The human rights organization Amnesty International documented over 3,257 known extrajudicial killings during the Marcos years. More than 35,000 were tortured. Some 77,000 were detained, many without charges, in military camps where electric shock, water torture, and sexual violence were routine interrogation methods. The desaparecidos—the disappeared—number in the hundreds, their families left with nothing but silence and the unending ache of not knowing.

While Imelda shopped in New York and Rome, entire communities in the provinces were displaced by military operations. Indigenous peoples in the Cordilleras and Mindanao were driven from their ancestral lands. Student activists were pulled from their dormitories in the dead of night. Journalists who dared to write the truth were imprisoned or killed. Labor leaders who organized for fair wages found themselves facing military tribunals.

The economic plunder was equally devastating. The Marcos family and their cronies systematically looted the national treasury, amassing an estimated five to ten billion dollars in ill-gotten wealth. Coconut and sugar monopolies devastated farmers. Behest loans enriched allies while burdening the nation with crippling debt. By the time the Marcoses fled to Hawaii in 1986, the Philippines was one of the poorest nations in Asia, its economy hollowed out by two decades of kleptocracy.

This is what was hidden behind the gold frames and crystal chandeliers. This is the Philippines that the world was not meant to see. Remember: the most dangerous lie is the one wrapped in beauty.`,
};

export default function Home() {
  const [revealed, setRevealed] = useState(false);
  const essaySectionRef = useRef<HTMLElement>(null);
  const [essayVisible, setEssayVisible] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up any pending click timeout on unmount
  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  // Intersection observer for essay section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEssayVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    const el = essaySectionRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  // Single click/tap → toggle reveal after delay
  // Double click/tap → zoom current image immediately without toggling
  const handleClick = useCallback(() => {
    if (clickTimeoutRef.current) {
      // Second click inside the timeout window -> cancel single-click toggle and zoom!
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      setZoomed(true);
    } else {
      // First click: wait for potential second click before toggling
      clickTimeoutRef.current = setTimeout(() => {
        setRevealed((prev) => !prev);
        clickTimeoutRef.current = null;
      }, 280);
    }
  }, []);

  const essay = revealed ? ESSAY_REALITY : ESSAY_FACADE;
  const currentCenterSrc = revealed ? CENTER_REALITY : CENTER_FACADE;
  const currentCenterAlt = revealed
    ? "The reality behind the facade"
    : "Luxurious mansion interior";

  return (
    <>
      {/* Grain overlay for vintage effect */}
      <div className="grain-overlay" />

      {/* Zoom modal */}
      {zoomed && (
        <ZoomModal
          src={currentCenterSrc}
          alt={currentCenterAlt}
          onClose={() => setZoomed(false)}
        />
      )}

      {/* ===== SECTION 1: Hero with background + framed image ===== */}
      <section className="snap-section relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
        {/* Background images - crossfade */}
        <div className="absolute inset-0 z-0">
          <Image
            src={BG_FACADE}
            alt="Luxurious interior"
            fill
            className="object-cover transition-opacity duration-1000 ease-in-out"
            style={{ opacity: revealed ? 0 : 1 }}
            priority
            sizes="100vw"
          />
          <Image
            src={BG_REALITY}
            alt="Reality of poverty"
            fill
            className="object-cover transition-opacity duration-1000 ease-in-out"
            style={{ opacity: revealed ? 1 : 0 }}
            sizes="100vw"
          />
          {/* Dark overlay */}
          <div
            className="absolute inset-0 transition-all duration-1000 ease-in-out"
            style={{
              background: revealed
                ? "linear-gradient(to bottom, rgba(10,0,0,0.75), rgba(10,0,0,0.9))"
                : "linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.85))",
            }}
          />
        </div>

        {/* Top bar — Philippines year on the right only */}
        <header className="absolute top-0 left-0 right-0 z-10 flex justify-end items-center px-6 md:px-12 py-5">
          <p
            className="font-typewriter text-[10px] md:text-xs tracking-[0.2em] uppercase transition-colors duration-700"
            style={{ color: revealed ? "#888" : "#c9a84c" }}
          >
            Philippines · 1972–1986
          </p>
        </header>

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center px-4 w-full max-w-4xl">
          {/* Title */}
          <h1
            className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold tracking-[0.3em] md:tracking-[0.5em] uppercase mb-3 text-center transition-all duration-700"
            style={{
              color: revealed ? "#c41e3a" : "#c9a84c",
              textShadow: revealed
                ? "0 0 40px rgba(196, 30, 58, 0.3)"
                : "0 0 40px rgba(201, 168, 76, 0.3)",
            }}
          >
            {revealed ? "KATOTOHANAN" : "BALATKAYO"}
          </h1>

          {/* Subtitle */}
          <p
            className="font-serif text-sm md:text-base italic mb-6 text-center transition-all duration-700 max-w-lg"
            style={{ color: revealed ? "#aaa" : "#e8d48b" }}
          >
            {revealed
              ? "What was hidden. What was endured."
              : "What was shown. What was hidden."}
          </p>

          {/* Framed painting container — A4 aspect, sized to fit viewport */}
          <div
            className={`painting-frame ${revealed ? "painting-frame-revealed" : ""} cursor-pointer`}
            style={{
              // Fit fully inside viewport: take the smaller of width/height constraints
              // A4 ratio = 1 : 1.414. On mobile use 88vw wide, on desktop constrain by height.
              width: "min(88vw, calc((100vh - 220px) / 1.414))",
              aspectRatio: "1 / 1.414",
            }}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            aria-label={
              revealed
                ? "Double-click to zoom; click to see the facade"
                : "Double-click to zoom; click to reveal the truth"
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setRevealed((prev) => !prev);
              }
            }}
          >
            <div className="relative w-full h-full overflow-hidden bg-black">
              <Image
                src={CENTER_FACADE}
                alt="Luxurious mansion interior"
                fill
                className="object-cover transition-opacity duration-800 ease-in-out"
                style={{ opacity: revealed ? 0 : 1 }}
                sizes="(max-width: 768px) 88vw, 500px"
              />
              <Image
                src={CENTER_REALITY}
                alt="The reality behind the facade"
                fill
                className="object-cover transition-opacity duration-800 ease-in-out"
                style={{ opacity: revealed ? 1 : 0 }}
                sizes="(max-width: 768px) 88vw, 500px"
              />
            </div>
          </div>


        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <p
            className="font-typewriter text-[9px] tracking-[0.2em] uppercase transition-colors duration-700"
            style={{ color: revealed ? "#666" : "#8b6914" }}
          >
            Scroll to read
          </p>
          <div
            className="w-5 h-8 rounded-full border flex items-start justify-center p-1 transition-colors duration-700"
            style={{
              borderColor: revealed
                ? "rgba(139, 0, 0, 0.4)"
                : "rgba(201, 168, 76, 0.4)",
            }}
          >
            <div
              className="w-1 h-2 rounded-full animate-bounce transition-colors duration-700"
              style={{
                backgroundColor: revealed ? "#c41e3a" : "#c9a84c",
              }}
            />
          </div>
        </div>
      </section>

      {/* ===== SECTION 2: Essay ===== */}
      <section
        ref={essaySectionRef}
        className="snap-section relative min-h-screen flex items-center justify-center py-20 md:py-32"
      >
        {/* Background for essay section */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 transition-colors duration-1000"
            style={{
              background: revealed
                ? "linear-gradient(to bottom, #0a0000, #1a0a0a, #0a0000)"
                : "linear-gradient(to bottom, #0a0a0a, #141210, #0a0a0a)",
            }}
          />
        </div>

        <article
          className="relative z-10 w-full max-w-2xl mx-auto px-6 md:px-8"
          style={{
            opacity: essayVisible ? 1 : 0,
            transform: essayVisible ? "translateY(0)" : "translateY(40px)",
            transition: "opacity 1s ease-out, transform 1s ease-out",
          }}
        >
          {/* Essay ornament divider */}
          <div
            className={`ornament-divider ${revealed ? "ornament-divider-revealed" : ""} mb-10`}
          >
            <span
              className="font-serif text-lg transition-colors duration-700"
              style={{ color: revealed ? "#c41e3a" : "#c9a84c" }}
            >
              ✦
            </span>
          </div>

          {/* Essay title */}
          <h2
            className="font-serif text-3xl md:text-4xl font-bold mb-4 transition-colors duration-700"
            style={{ color: revealed ? "#d4d4d4" : "#e8d48b" }}
          >
            {essay.title}
          </h2>

          {/* Essay subtitle */}
          <p
            className="font-serif text-base md:text-lg italic mb-10 transition-colors duration-700"
            style={{ color: revealed ? "#999" : "#c9a84c" }}
          >
            {essay.subtitle}
          </p>

          {/* Essay body */}
          <div
            className="font-typewriter essay-text transition-colors duration-700"
            style={{ color: revealed ? "#b0b0b0" : "#c8c0a8" }}
          >
            {essay.body.split("\n\n").map((paragraph, i) => (
              <p key={i} className="mb-6">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Bottom ornament */}
          <div
            className={`ornament-divider ${revealed ? "ornament-divider-revealed" : ""} mt-10`}
          >
            <span
              className="font-typewriter text-[10px] tracking-[0.3em] uppercase transition-colors duration-700"
              style={{ color: revealed ? "#666" : "#8b6914" }}
            >
              {revealed ? "Never again" : "Look closer"}
            </span>
          </div>

          {/* Footer */}
          <footer className="mt-16 text-center">
            <p
              className="font-typewriter text-[10px] tracking-[0.2em] uppercase transition-colors duration-700"
              style={{ color: revealed ? "#444" : "#5a4a2a" }}
            >
              Balatkayo · 2024
            </p>
          </footer>
        </article>
      </section>
    </>
  );
}
