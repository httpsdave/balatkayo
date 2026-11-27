"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import ThanosDustImage from "./ThanosDustImage";

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

// FACADE (Balatkayo)
const BG_FACADE = "/malacanang.jpg";
const CENTER_FACADE = "/imelda.png";

// REALITY (Katotohanan)
const BG_REALITY = "/malacanang2.png";
const CENTER_REALITY = "/marocs.png";
const NEWSPAPER_1 = "/newspaper1.jpg";
const NEWSPAPER_2 = "/newspaper2.jpg";

const ESSAY_FACADE = {
  title: "The Image of Grandeur",
  subtitle: "",
  body: "",
};

const ESSAY_REALITY = {
  title: "The Changing Face of Power: Beauty, Bodies, and Representation",
  subtitle: "from Martial Law to the Digital Age",
  body: `Beauty is often treated as a personal choice, but who gets to decide what is beautiful? For Filipino women, this question extends beyond physical appearance to the expectations imposed by society, media, and those in positions of power. Growing up in the digital age, I have become increasingly aware of how social media can be both a platform for self-expression and a space for constant judgment. From beauty filters and curated photographs to unsolicited comments about physical appearance, the pressure to look a certain way remains difficult to escape. Looking back at the Martial Law period, I recognized that the relationship between beauty and power is a concept that has existed for a long time already; it just currently seems somewhat discreet. Although the ways women's bodies are judged and controlled have changed, the standards imposed on them continue to influence how they present and perceive themselves.

Beauty has never been entirely personal; it has always been political.

In The Mattering of National Bodies and Sexualities, Rolando B. Tolentino (2000) illustrates how the Marcoses used bodily images to reinforce their political authority. Ferdinand Marcos projected masculine strength and discipline, while Imelda Marcos embodied beauty, elegance, and extravagance. Her carefully cultivated femininity became part of the regime's political spectacle, projecting sophistication and national progress while ordinary Filipinos experienced poverty and repression. This contradiction becomes even more apparent in Imelda's war of beautification, which Benedicto (2015) examines in relation to urban displacement and the exclusion of marginalized communities. Meanwhile, Forbes (2015) discusses the regime's suppression of press freedom and the control of public narratives. The Marcoses did not simply dictate how the nation should look; they attempted to dictate what the nation was allowed to see. Their politics of appearance celebrated the beauty of the powerful while concealing the suffering of the masses.

This relationship between representation and control remains relevant in contemporary digital culture, although its mechanisms are different. Social media has given individuals greater opportunities to construct and establish their own images, but this freedom comes with constant exposure to judgment and comparison. Gill (2007) explains how contemporary media encourages women to monitor their appearances under the language of personal choice and empowerment. I see this in how beauty trends, filters, and social media profiles influence the way people perceive themselves and others. Gamboa et al. (2023) examined how social media use influences the way young Filipino women view their bodies and compare their appearances with others. Their research highlights how constant exposure to images and beauty standards online can contribute to body dissatisfaction and shape how women perceive their own appearance. Artificial intelligence further intensifies these pressures through tools that modify facial features, smooth skin, and generate idealized appearances. Dijkslag et al. (2024) found that beautifying augmented-reality filters can negatively affect young women's body satisfaction. Even generative AI can reproduce gender stereotypes (UNESCO, 2024). We are no longer simply comparing ourselves with other people, but we are also increasingly comparing ourselves with digitally manufactured ideals that do not even exist.

The connection between Martial Law and the digital age lies in how power influences which bodies and appearances are considered desirable and worthy of visibility. During the Marcos regime, beauty and femininity were deliberately incorporated into political propaganda, while media censorship and authoritarian control suppressed representations that challenged the government's desired image. Today, algorithms, commercial interests, beauty trends, and public opinion influence which representations receive attention and approval. As Banet-Weiser (2018) argues, messages of female empowerment can coexist with persistent misogyny. Women are encouraged to embrace individuality while simultaneously being pressured to conform to socially accepted standards. We have moved from a regime that manufactured an ideal image of the nation to a digital culture that encourages individuals to manufacture ideal versions of themselves. Nevertheless, these platforms can also become spaces of resistance, allowing women to challenge conventional beauty standards, reclaim their bodies, and represent themselves beyond prescribed ideals. I suppose that is one advantage that digital platforms offer, completely different from the little spaces of resistance and representation available during the Martial Law.

Ultimately, the comparison between Martial Law and the digital age does not suggest that their forms of oppression are equal. Rather, it demonstrates how the politics of the body persist even as the institutions and technologies that shape them change. The Marcos regime used beauty and femininity to construct an image of national progress that concealed political repression, while contemporary digital culture and AI can turn self-expression into another demand for conformity. Recognizing this connection encourages us to question not only how women's bodies are represented, but also who controls these representations and who benefits from them. If the body was once made a spectacle for the state, it must not become a product for the algorithm or a template for artificial perfection. True agency means having the freedom to represent oneself, redefine beauty, and exist without having one's worth determined by how closely one's body meets the expectations of others.`,
};

const REFERENCES_REALITY = [
  {
    text: "Banet-Weiser, S. (2018). Empowered: Popular Feminism and popular misogyny. Duke University Press.",
    url: "https://doi.org/10.1215/9781478002772",
  },
  {
    text: "Benedicto, B. (2014). The queer afterlife of the postcolonial city: (Trans)gender performance and the war of beautification. Antipode, 47(3), 580–597.",
    url: "https://doi.org/10.1111/anti.12101",
  },
  {
    text: "Dijkslag, I. R., Block Santos, L., Irene, G., & Ketelaar, P. (2024). To beautify or uglify! The effects of augmented reality face filters on body satisfaction moderated by self-esteem and self-identification. Computers in Human Behavior, 159, 108343.",
    url: "https://doi.org/10.1016/j.chb.2024.108343",
  },
  {
    text: "Juangco, J. R. G., Gamboa, A. J. R., Gamboa, M. K. P., Gamboa, P. A. M., Gamboa, R. A. P., Garcia, A. L. R., Garcia, D. M. T., Garcia, E. J. C., Garcia, J. A. N., Garcia, M. P. Z., Garcia, R. C. J., Gaviola, K. G. M., & Calma-Balderrama, N. (2023). A cross-sectional study on the association between social media addiction, body image, and social comparison among young adult Filipino women aged 18-25 years old in Metro Manila. Health Sciences Journal, 12(1), 1–1.",
    url: "https://www.ejournals.ph/article.php?id=20098",
  },
  {
    text: "Gill, R. (2007). Postfeminist media culture: Elements of a sensibility. European Journal of Cultural Studies, 10(2), 147–166.",
    url: "https://doi.org/10.1177/1367549407075898",
  },
  {
    text: "Tolentino, R.B. (2000). The mattering of national bodies and sexualities. Asian Studies, 36(1), 84-110.",
    url: "",
  },
  {
    text: "UNESCO. (2024). Generative AI: UNESCO study reveals alarming evidence of regressive gender stereotypes. Unesco.Org.",
    url: "https://www.unesco.org/en/articles/generative-ai-unesco-study-reveals-alarming-evidence-regressive-gender-stereotypes",
  },
];

export default function Home() {
  const [revealed, setRevealed] = useState(false);
  const [isDusting, setIsDusting] = useState(false);
  const essaySectionRef = useRef<HTMLElement>(null);
  const [essayVisible, setEssayVisible] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const lastClickTimeRef = useRef<number>(0);

  // Intersection observer for essay section
  useEffect(() => {
    if (!revealed) return;
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
  }, [revealed]);

  const essayContainerRef = useRef<HTMLDivElement>(null);
  const wordCoordsRef = useRef<{ el: HTMLElement; x: number; y: number }[]>([]);
  const activeWordsRef = useRef<Set<HTMLElement>>(new Set());

  const updateWordCoords = useCallback(() => {
    if (!essaySectionRef.current) return;
    const spans =
      essaySectionRef.current.querySelectorAll<HTMLElement>(".essay-word");
    const coords: { el: HTMLElement; x: number; y: number }[] = [];
    const sx = window.scrollX;
    const sy = window.scrollY;
    spans.forEach((el) => {
      const r = el.getBoundingClientRect();
      coords.push({
        el,
        x: r.left + r.width / 2 + sx,
        y: r.top + r.height / 2 + sy,
      });
    });
    wordCoordsRef.current = coords;
  }, []);

  useEffect(() => {
    if (!revealed) return;
    const timer = setTimeout(() => {
      updateWordCoords();
    }, 250);
    window.addEventListener("resize", updateWordCoords);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateWordCoords);
    };
  }, [revealed, essayVisible, updateWordCoords]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (wordCoordsRef.current.length === 0) {
        updateWordCoords();
      }
      const mx = e.pageX;
      const my = e.pageY;
      const RADIUS = 95;
      const R2 = RADIUS * RADIUS;
      const nextActive = new Set<HTMLElement>();

      for (let i = 0; i < wordCoordsRef.current.length; i++) {
        const item = wordCoordsRef.current[i];
        const dx = item.x - mx;
        const dy = item.y - my;
        if (dx * dx + dy * dy <= R2) {
          nextActive.add(item.el);
          if (!activeWordsRef.current.has(item.el)) {
            item.el.style.color = "#c41e3a";
          }
        }
      }

      activeWordsRef.current.forEach((el) => {
        if (!nextActive.has(el)) {
          el.style.color = "";
        }
      });

      activeWordsRef.current = nextActive;
    },
    [updateWordCoords]
  );

  const handleMouseLeave = useCallback(() => {
    activeWordsRef.current.forEach((el) => {
      el.style.color = "";
    });
    activeWordsRef.current.clear();
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (e.touches.length === 0) return;
      if (wordCoordsRef.current.length === 0) {
        updateWordCoords();
      }
      const touch = e.touches[0];
      const mx = touch.pageX;
      const my = touch.pageY;
      const RADIUS = 95;
      const R2 = RADIUS * RADIUS;
      const nextActive = new Set<HTMLElement>();

      for (let i = 0; i < wordCoordsRef.current.length; i++) {
        const item = wordCoordsRef.current[i];
        const dx = item.x - mx;
        const dy = item.y - my;
        if (dx * dx + dy * dy <= R2) {
          nextActive.add(item.el);
          if (!activeWordsRef.current.has(item.el)) {
            item.el.style.color = "#c41e3a";
          }
        }
      }

      activeWordsRef.current.forEach((el) => {
        if (!nextActive.has(el)) {
          el.style.color = "";
        }
      });

      activeWordsRef.current = nextActive;
    },
    [updateWordCoords]
  );

  const handleTouchEnd = useCallback(() => {
    activeWordsRef.current.forEach((el) => {
      el.style.color = "";
    });
    activeWordsRef.current.clear();
  }, []);

  // Single click/tap → instant toggle with 0ms delay
  // Quick double click/tap (< 280ms) → open full screen zoom
  const handleClick = useCallback(() => {
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTimeRef.current;
    lastClickTimeRef.current = now;

    if (timeSinceLastClick < 280) {
      // Quick double click: revert the first click's toggle and open full screen!
      setRevealed((prev) => !prev);
      setZoomed(true);
      return;
    }

    // Instant 1-click toggle (0ms latency)
    setRevealed((prev) => !prev);
  }, []);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomed(true);
  }, []);

  const essay = revealed ? ESSAY_REALITY : ESSAY_FACADE;
  const currentCenterSrc = revealed ? CENTER_REALITY : CENTER_FACADE;
  const currentCenterAlt = revealed
    ? "Katotohanan"
    : "Balatkayo";

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
            alt="Malacañang Palace"
            fill
            className="object-cover transition-opacity duration-1000 ease-in-out"
            style={{ opacity: revealed ? 0 : 1 }}
            priority
            sizes="100vw"
          />
          <Image
            src={BG_REALITY}
            alt="Malacañang Palace during Martial Law"
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
        <header className="absolute top-0 left-0 right-0 z-10 flex justify-end items-center px-6 md:px-12 py-3 md:py-4">
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
            className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold tracking-[0.25em] md:tracking-[0.4em] uppercase mb-1.5 md:mb-2 text-center transition-all duration-700"
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
            className="font-serif text-xs md:text-sm italic mb-3 md:mb-4 text-center transition-all duration-700 max-w-lg"
            style={{ color: revealed ? "#aaa" : "#e8d48b" }}
          >
            {revealed
              ? "What was hidden. What was endured."
              : "What was shown."}
          </p>

          {/* Framed painting container — A4 aspect, sized to fit viewport comfortably */}
          <div
            className={`painting-frame ${revealed ? "painting-frame-revealed" : ""} cursor-pointer`}
            style={{
              // Fit fully inside viewport: take the smaller of width/height constraints
              // A4 ratio = 1 : 1.414.
              width: "min(88vw, calc((100vh - 150px) / 1.414))",
              aspectRatio: "1 / 1.414",
            }}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            role="button"
            tabIndex={0}
            aria-label={
              revealed
                ? "Click to switch mode; double-click for full screen"
                : "Click to switch mode; double-click for full screen"
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setRevealed((prev) => !prev);
              }
            }}
          >
            {/* Quick full-screen expand button in corner */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setZoomed(true);
              }}
              className="absolute top-2 right-2 z-20 w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 text-white/70 hover:text-white flex items-center justify-center transition opacity-60 hover:opacity-100 backdrop-blur-xs"
              title="Full screen view (or double-click image)"
              aria-label="Full screen view"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
            </button>

            <ThanosDustImage
              revealed={revealed}
              facadeSrc={CENTER_FACADE}
              realitySrc={CENTER_REALITY}
              onDustingChange={setIsDusting}
            />
          </div>

          {/* Under image container in Balatkayo: "The Image of Grandeur" */}
          {!revealed && (
            <p
              className="font-serif text-sm md:text-base lg:text-lg italic tracking-[0.25em] uppercase mt-3 md:mt-4 text-center transition-all duration-700"
              style={{
                color: "#e8d48b",
                textShadow: "0 0 20px rgba(201, 168, 76, 0.35)",
              }}
            >
              The Image of Grandeur
            </p>
          )}
        </div>

        {/* Scroll indicator — only in Katotohanan */}
        {revealed && (
          <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 transition-opacity duration-700">
            <p
              className="font-typewriter text-[9px] tracking-[0.2em] uppercase transition-colors duration-700"
              style={{ color: "#666" }}
            >
              Scroll to read
            </p>
            <div
              className="w-4 h-7 rounded-full border flex items-start justify-center p-1 transition-colors duration-700"
              style={{
                borderColor: "rgba(139, 0, 0, 0.4)",
              }}
            >
              <div
                className="w-1 h-2 rounded-full animate-bounce transition-colors duration-700"
                style={{
                  backgroundColor: "#c41e3a",
                }}
              />
            </div>
          </div>
        )}

        {/* Balatkayo footer marker */}
        {!revealed && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10">
            <p className="font-typewriter text-[9px] tracking-[0.2em] uppercase text-[#5a4a2a]">
              © Dea Goze 2026
            </p>
          </div>
        )}
      </section>

      {/* ===== SECTION 2: Essay (Katotohanan) ===== */}
      {revealed && (
        <section
          ref={essaySectionRef}
          className="snap-section relative min-h-screen flex items-center justify-center py-20 md:py-32"
        >
          {/* Background for essay section */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Deep crimson / black base gradient */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, #0a0000 0%, #1a0404 20%, #2e0808 50%, #1a0404 80%, #0a0000 100%)",
              }}
            />

            {/* Historical Newspaper 1 - Upper section */}
            <div
              className="absolute top-0 left-0 w-full md:w-4/5 h-[55%] opacity-[0.09] mix-blend-screen"
              style={{
                maskImage:
                  "radial-gradient(ellipse at 35% 45%, black 20%, transparent 75%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse at 35% 45%, black 20%, transparent 75%)",
              }}
            >
              <Image
                src={NEWSPAPER_1}
                alt="Historical newspaper clipping - Martial Law"
                fill
                className="object-cover object-top grayscale contrast-125 brightness-95"
                sizes="100vw"
              />
            </div>

            {/* Historical Newspaper 2 - Lower section */}
            <div
              className="absolute bottom-0 right-0 w-full md:w-4/5 h-[55%] opacity-[0.09] mix-blend-screen"
              style={{
                maskImage:
                  "radial-gradient(ellipse at 65% 55%, black 20%, transparent 75%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse at 65% 55%, black 20%, transparent 75%)",
              }}
            >
              <Image
                src={NEWSPAPER_2}
                alt="Historical newspaper clipping - Censorship & Reality"
                fill
                className="object-cover object-center grayscale contrast-125 brightness-95"
                sizes="100vw"
              />
            </div>

            {/* Prominent dark red atmospheric glow */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 45%, rgba(196, 30, 58, 0.22) 0%, rgba(139, 0, 0, 0.12) 55%, transparent 80%)",
              }}
            />

            {/* Top and bottom seam fades */}
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0a0000] to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0a0000] to-transparent" />
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
            <div className="ornament-divider ornament-divider-revealed mb-10">
              <span className="font-serif text-lg text-[#c41e3a]">✦</span>
            </div>

            {/* Interactive Essay Container with word-by-word red hover */}
            <div
              ref={essayContainerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="cursor-default select-text"
            >
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-[#d4d4d4]">
                {essay.title.split(" ").map((word, idx) => (
                  <span
                    key={idx}
                    className="essay-word transition-colors duration-300"
                  >
                    {word}{" "}
                  </span>
                ))}
              </h2>

              {essay.subtitle && (
                <p className="font-serif text-base md:text-lg italic mb-10 text-[#999]">
                  {essay.subtitle.split(" ").map((word, idx) => (
                    <span
                      key={idx}
                      className="essay-word transition-colors duration-300"
                    >
                      {word}{" "}
                    </span>
                  ))}
                </p>
              )}

              {essay.body && (
                <div className="font-typewriter essay-text text-[#b0b0b0]">
                  {essay.body.split("\n\n").map((paragraph, i) => {
                    const isItalic =
                      paragraph.trim() ===
                      "Beauty has never been entirely personal; it has always been political.";
                    return (
                      <p key={i} className={`mb-6 ${isItalic ? "italic" : ""}`}>
                        {paragraph.split(" ").map((word, wordIdx) => (
                          <span
                            key={wordIdx}
                            className="essay-word transition-colors duration-300"
                          >
                            {word}{" "}
                          </span>
                        ))}
                      </p>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom ornament */}
            <div className="ornament-divider ornament-divider-revealed mt-10">
              <span className="font-typewriter text-[10px] tracking-[0.3em] uppercase text-[#666]">
                Never again
              </span>
            </div>

            {/* References Section */}
            <section className="mt-12 pt-8 border-t border-neutral-900">
              <h3 className="font-typewriter text-[10px] md:text-xs tracking-[0.25em] uppercase text-neutral-500 mb-6 font-semibold">
                REFERENCES
              </h3>
              <div className="space-y-4 font-typewriter text-[11px] md:text-xs text-neutral-400/80 leading-relaxed text-left">
                {REFERENCES_REALITY.map((ref, idx) => (
                  <p key={idx} className="pl-6 -indent-6">
                    {ref.text}
                    {ref.url && (
                      <>
                        {" "}
                        <a
                          href={ref.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-2 break-all opacity-70 hover:opacity-100 transition-opacity"
                        >
                          {ref.url}
                        </a>
                      </>
                    )}
                  </p>
                ))}
              </div>
            </section>

            {/* Footer */}
            <footer className="mt-16 text-center">
              <p className="font-typewriter text-[10px] tracking-[0.2em] uppercase text-[#444]">
                © Dea Goze 2026
              </p>
            </footer>
          </article>
        </section>
      )}
    </>
  );
}
