"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  FiX,
  FiSmartphone,
  FiMonitor,
  FiHeadphones,
  FiEdit3,
  FiSpeaker,
  FiCheck,
} from "react-icons/fi";
import { MdKeyboard } from "react-icons/md";

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
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      onClick={onClick}
      className="cursor-pointer bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-400 transition group"
    >
      <div className="relative w-full h-48 overflow-hidden bg-black/40">
        <Image
          src={gadget.image}
          alt={gadget.name}
          fill
          sizes="400px"
          className="object-contain group-hover:scale-105 transition duration-500"
        />
        <span className="absolute top-3 left-3 flex items-center gap-1.5 text-xs bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-purple-300">
          <Icon className="text-sm" /> {gadget.category}
        </span>
      </div>
      <div className="p-5">
        <h3 className="text-base font-semibold">{gadget.name}</h3>
        <p className="text-gray-500 text-xs mt-1">
          Tap to view full specifications
        </p>
      </div>
    </motion.div>
  );
}

function GadgetModal({
  gadget,
  onClose,
}: {
  gadget: GadgetItem;
  onClose: () => void;
}) {
  const Icon = gadget.icon;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center px-6 py-10 overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-2xl w-full bg-[#111117] border border-white/10 rounded-2xl overflow-hidden my-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-purple-500/60 rounded-full text-xl transition"
        >
          <FiX />
        </button>

        <div className="relative w-full h-72 md:h-80 bg-black/60">
          <Image
            src={gadget.image}
            alt={gadget.name}
            fill
            sizes="672px"
            className="object-contain"
          />
        </div>

        <div className="p-6 md:p-8">
          <span className="inline-flex items-center gap-1.5 text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full mb-3">
            <Icon className="text-sm" /> {gadget.category}
          </span>
          <h3 className="text-2xl font-semibold mb-5 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {gadget.name}
          </h3>

          <div className="space-y-3">
            {gadget.specs.map((spec, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FiCheck className="text-purple-300 text-xs" />
                </span>
                <p className="text-gray-300 text-sm leading-relaxed">{spec}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function GadgetsPage() {
  const [selected, setSelected] = useState<GadgetItem | null>(null);

  return (
    <section className="py-16 px-6 max-w-6xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold mb-4 text-center"
      >
        My <span className="text-purple-400">Gadgets</span>
      </motion.h1>
      <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
        A look at the devices and tools I use daily for coding, gaming, content creation, and research work.
      </p>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {gadgets.map((gadget, i) => (
          <GadgetCard
            key={gadget.name}
            gadget={gadget}
            index={i}
            onClick={() => setSelected(gadget)}
          />
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <GadgetModal gadget={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}