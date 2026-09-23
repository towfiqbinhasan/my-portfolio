"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  FiSmartphone,
  FiMonitor,
  FiHeadphones,
  FiEdit3,
  FiSpeaker,
  FiCheck,
} from "react-icons/fi";
import { MdKeyboard } from "react-icons/md";
import { PageBackdrop, PageHeader, GlowCard } from "@/components/PageShell";
import { Lightbox, lightboxItem } from "@/components/Carousel";

type GadgetItem = {
  name: string;
  category: string;
  icon: React.ElementType;
  image: string;
  specs: string[];
};

const gadgets: GadgetItem[] = [
  {
    name: "Samsung S25 Ultra",
    category: "Smartphone",
    icon: FiSmartphone,
    image: "/gadgets/samsung-s25-ultra.jpg",
    specs: [
      "Screen: 6.9-inch huge and very bright display",
      "Speed: Super fast Snapdragon 8 Elite chip for gaming and apps",
      "Camera: 200MP main camera for the best photos and zoom",
      "Design: Strong Titanium frame with comfortable curved corners",
      "Battery: 5,000 mAh (lasts all day) with fast charging",
      "Extras: Comes with an S-Pen and smart AI features",
    ],
  },
  {
    name: "Asus TUF Gaming A15",
    category: "Laptop",
    icon: FiMonitor,
    image: "/gadgets/asus-tuf-a15.gif",
    specs: [
      "Power: Fast AMD processor",
      "Graphics: Powerful NVIDIA RTX (RTX 3050 / 4060) for smooth gaming and high-quality visuals",
      "Screen: 15.6-inch, very smooth for games",
      "Body: Very tough and durable, military-grade build",
      "Battery: Lasts longer than most gaming laptops",
    ],
  },
  {
    name: "Redmi Note 10 Pro",
    category: "Smartphone",
    icon: FiSmartphone,
    image: "/gadgets/redmi-note-10-pro.jpg",
    specs: [
      "Display: 6.67-inch AMOLED with 120Hz refresh rate — very bright and smooth",
      "Camera: 108MP main camera for high-detail photos",
      "Processor: Snapdragon 732G, good for daily tasks and casual gaming",
      "Battery: 5020mAh with 33W fast charging",
      "Body: Sleek glass design that feels premium in hand",
    ],
  },
  {
    name: "Haylou GT7 Neo",
    category: "Audio",
    icon: FiHeadphones,
    image: "/gadgets/haylou-gt7-neo.jpg",
    specs: [
      "Excellent Sound: 8mm dynamic drivers for clear audio and punchy bass",
      "Stable Connection: Bluetooth 5.2 for faster connection and fewer drops",
      "Long Battery Life: Up to 6.5 hours playtime, 22 hours total with the case",
      "Clear Calls: AI Call Noise Cancellation reduces background noise",
      "Low Latency Mode: Dedicated Gaming Mode syncs audio and video perfectly",
    ],
  },
  {
    name: "Huion Graphics Tablet",
    category: "Peripheral",
    icon: FiEdit3,
    image: "/gadgets/huion-tablet.jpg",
    specs: [
      "H640P (Budget King): Most popular, affordable choice for beginners — no screen",
      "Inspiroy 2 S (Latest): Slim model with improved shortcut buttons — no screen",
      "Kamvas 13 (Best Value): Draw directly on the display, best for professionals",
      "Battery-Free Pen: Included pen never needs charging, supports 8192 pressure levels",
    ],
  },
  {
    name: "Microlab Speaker",
    category: "Audio",
    icon: FiSpeaker,
    image: "/gadgets/microlab-speaker.jpg",
    specs: [
      "Wireless Connection: Bluetooth 5.0 for easy playback from phone, tablet, or laptop",
      "Clear & Deep Sound: Wooden cabinets deliver clearer sound and deeper bass than plastic speakers",
      "Modern Design & Lights: RGB lights (G-series) that change color with the music",
      "Easy Controls: Remote control or front panel buttons for volume, track skip, and Bluetooth/FM switching",
    ],
  },
  {
    name: "Ajazz AF98 Plus",
    category: "Peripheral",
    icon: MdKeyboard,
    image: "/gadgets/ajazz-af98-plus.jpg",
    specs: [
      "3-Way Connection: USB cable, Bluetooth, or 2.4G Wireless dongle for lag-free gaming",
      "Compact 97-Key Design: Includes Numpad but takes less desk space than a full-size keyboard",
      "Big Battery & RGB: 4000mAh battery lasting weeks, with 18 RGB lighting modes",
      "Premium Feel: Membrane keyboard designed to feel mechanical — quiet, smooth, and comfortable",
    ],
  },
];

function GadgetCard({
  gadget,
  index,
  onClick,
}: {
  gadget: GadgetItem;
  index: number;
  onClick: () => void;
}) {
  const Icon = gadget.icon;
  return (
    <GlowCard delay={index * 0.08}>
      <button
        type="button"
        onClick={onClick}
        aria-label={gadget.name}
        className="btn-press block w-full cursor-pointer text-left"
      >
        <div className="relative h-44 w-full overflow-hidden bg-black/40 sm:h-48">
          <Image
            src={gadget.image}
            alt={gadget.name}
            fill
            sizes="(max-width: 640px) 100vw, 400px"
            className="object-contain p-4 transition-transform duration-700 ease-out group-hover:scale-110"
          />
          {/* Scrim so the chip stays readable over any product shot */}
          <span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/10 to-transparent"
          />
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[11px] text-purple-200 ring-1 ring-white/10 backdrop-blur transition-all duration-500 group-hover:bg-purple-500/30 group-hover:text-white group-hover:ring-purple-400/50">
            <Icon className="text-sm transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6" /> {gadget.category}
          </span>
          <span aria-hidden className="carousel-sheen pointer-events-none absolute inset-0" />
        </div>

        <div className="relative p-5">
          <h3 className="text-base font-semibold leading-snug text-white">{gadget.name}</h3>
          <p className="mt-1.5 text-xs text-gray-500 transition-colors duration-300 group-hover:text-purple-300">
            Tap to view full specifications
          </p>
          <span
            aria-hidden
            className="mt-3 block h-px w-8 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-500 group-hover:w-16"
          />
        </div>
      </button>
    </GlowCard>
  );
}

function GadgetDetails({ gadget }: { gadget: GadgetItem }) {
  const Icon = gadget.icon;
  return (
    <>
      <motion.div
        {...lightboxItem(0)}
        className="relative h-56 w-full bg-[#08080c] xs:h-64 sm:h-72 md:h-80"
      >
        <Image
          src={gadget.image}
          alt={gadget.name}
          fill
          sizes="(min-width: 1024px) 896px, 100vw"
          className="object-contain p-5 sm:p-8"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0e0e14] to-transparent"
        />
      </motion.div>

      <div className="relative border-t border-white/5 p-5 sm:p-7 md:p-8">
        <motion.div {...lightboxItem(1)}>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-400/25 bg-purple-500/10 px-3 py-1 text-[11px] uppercase tracking-wider text-purple-200">
            <Icon className="text-sm" /> {gadget.category}
          </span>
          <h3 className="mt-3 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-2xl font-semibold leading-snug text-transparent sm:text-3xl">
            {gadget.name}
          </h3>
        </motion.div>

        {/* Two columns from sm up, so the longer spec lines stay short and scannable */}
        <div className="mt-6 grid gap-2.5 border-t border-white/5 pt-6 sm:grid-cols-2 sm:gap-3">
          {gadget.specs.map((spec, i) => (
            <motion.div
              key={spec}
              {...lightboxItem(2 + i)}
              className="group/spec flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3.5 transition duration-300 hover:-translate-y-0.5 hover:border-purple-400/30 hover:bg-white/[0.06]"
            >
              <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/40 to-pink-500/40 ring-1 ring-purple-400/30 transition duration-300 group-hover/spec:scale-110 group-hover/spec:ring-purple-400/60">
                <FiCheck className="text-[11px] text-purple-50" />
              </span>
              <p className="min-w-0 break-words text-sm leading-[1.8] text-gray-300">{spec}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function GadgetsPage() {
  const [selected, setSelected] = useState<GadgetItem | null>(null);

  return (
    <section className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <PageBackdrop />

      <PageHeader
        eyebrow="Everyday tech"
        title="My"
        accent="Gadgets"
        description="A look at the devices and tools I use daily for coding, gaming, content creation, and research work."
      />

      <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {gadgets.map((gadget, i) => (
          <GadgetCard
            key={gadget.name}
            gadget={gadget}
            index={i}
            onClick={() => setSelected(gadget)}
          />
        ))}
      </div>

      <Lightbox
        open={selected !== null}
        onClose={() => setSelected(null)}
        contentKey={selected?.name}
        wide
      >
        {selected && <GadgetDetails gadget={selected} />}
      </Lightbox>
    </section>
  );
}
