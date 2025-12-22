"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  ChevronRight, ChevronLeft, Crown,
  TrendingUp, ArrowRightLeft, Wallet, Target, Zap,
  Calendar, Rocket, Users, Anchor, Ghost, Smile, Download,
  LayoutDashboard, type LucideIcon
} from "lucide-react";
import { SuiBackground } from "./SuiBackground";
import { useWrappedData } from "@/hooks/useWrappedData";
import { useNavigate, useParams } from "@tanstack/react-router";
import { toPng } from "html-to-image"
import { getSuiPriceFn, getTopAssetPriceFn } from "@/functions/getSuiPrice.ts";


type Asset = { symbol: string; amount: number };
type Interactor = { address: string; count: number };

type WrappedData = {
  totalVolumeUSD: number;
  inflow: number;
  outflow: number;
  peakDay: string;
  peakDayCount: number;
  biggestTxAmount: number;
  rankPercentile: number;
  archetype: string;
  topAssets: Asset[];
  topInteractors: Interactor[];
};

const slides = [
  "intro", "volume", "flow", "top-asset", "assets",
  "interactions", "peak", "biggest", "rank", "archetype", "summary",
] as const;


const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02
    }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

const itemVariants: Variants = {
  hidden: {
    y: 15,
    opacity: 0
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.215, 0.61, 0.355, 1.0]
    }
  }
};

export function useSuiPrice() {
  const [price, setPrice] = useState<number>(3.42);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const fetchedPrice = await getSuiPriceFn();
        if (fetchedPrice) {
          setPrice(fetchedPrice);
        }
      } catch (err) {
        console.error("Failed to load price from server", err);
      }
    };

    fetchPrice();
  }, []);

  return price;
}

export function useTopAssetPrice(nameOfAsset: string) {
  const [price, setPrice] = useState<number>(3.42);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const fetchedPrice = await getTopAssetPriceFn({ data: { name: nameOfAsset } });
        if (fetchedPrice) {
          setPrice(fetchedPrice);
        }
      } catch (err) {
        console.error("Failed to load price from server", err);
      }
    };

    fetchPrice();
  }, []);

  return price;
}

const WaterSplashBackground = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-[3rem]">
      <motion.div
        className="absolute -top-[10%] -left-[10%] w-[120%] h-[120%] opacity-[0.15] will-change-transform"
        animate={{
          rotate: 360,
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <linearGradient id="blobGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3D5DD9" />
              <stop offset="100%" stopColor="#00D1FF" />
            </linearGradient>
          </defs>
          <path
            fill="url(#blobGrad)"
            d="M45,-60C58,-52,70,-40,75,-25C80,-10,78,8,70,24C62,40,48,54,32,62C16,70,0,72,-16,68C-32,64,-48,54,-58,40C-68,26,-72,8,-68,-10C-64,-28,-52,-46,-38,-54C-24,-62,-12,-60,3,-63C18,-66,32,-68,45,-60Z"
            transform="translate(100 100)"
          />
        </svg>
      </motion.div>

      <motion.div
        className="absolute -bottom-[20%] -right-[20%] w-full h-full opacity-10 will-change-transform"
        animate={{
          rotate: -360,
          x: [0, 15, 0]
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path
            fill="#4DA2FF"
            d="M40,-50C52,-42,62,-30,65,-16C68,-2,64,14,56,28C48,42,36,54,22,60C8,66,-8,66,-22,60C-36,54,-48,42,-56,28C-64,14,-68,-2,-65,-16C-62,-30,-52,-42,-40,-50C-28,-58,-14,-62,0,-62C14,-62,28,-58,40,-50Z"
            transform="translate(100 100)"
          />
        </svg>
      </motion.div>
    </div>
  );
};

const Card = ({
  children,
  className = "",
  cardRef
}: {
  children: React.ReactNode;
  className?: string;
  cardRef?: React.RefObject<HTMLDivElement | null>;
}) => (
  <div
    ref={cardRef}
    className={`relative w-full h-[72vh] max-h-212.5 max-w-112.5 bg-white/90 backdrop-blur-xl rounded-[3rem] shadow-sm flex flex-col overflow-hidden border border-white/60 ${className}`}
  >
    <WaterSplashBackground />
    <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    <div className="relative z-20 w-full h-full flex flex-col p-6 md:p-10">
      {children}
    </div>
  </div>
);

const Label = ({ children, icon: Icon }: { children: React.ReactNode; icon?: LucideIcon }) => (
  <div className="flex items-center gap-2 mb-4 md:mb-6"> {/* Reduced margin on mobile */}
    <div className="bg-blue-50/80 p-1.5 md:p-2 rounded-full text-[#3D5DD9] border border-blue-100">
      {Icon ? <Icon size={14} /> : <div className="w-4 h-4 bg-[#3D5DD9] rounded-full" />}
    </div>
    <span className="font-mono-space text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-slate-600 font-bold">
      {children}
    </span>
  </div>
);

const ArchetypeGraphic = ({ type }: { type: string }) => {
  const baseType = type.replace(/ .*/, '').toUpperCase();
  const iconMap: Record<string, LucideIcon> = {
    'WHALE': Target, 'DEGEN': Zap, 'BANKER': Anchor, 'GHOST': Ghost, 'NORMIE': Smile,
  };
  const Icon = iconMap[baseType] || Smile;

  return (
    <div className="w-32 h-32 md:w-40 md:h-40 bg-linear-to-tr from-[#3D5DD9] to-[#00D1FF] rounded-4xl md:rounded-[2.5rem] flex items-center justify-center text-white shadow-xl shadow-blue-200/50 mb-6 md:mb-8 mx-auto rotate-3 hover:rotate-0 transition-transform duration-500 border-4 border-white/20">
      <Icon size={64} className="md:w-20 md:h-20" strokeWidth={1.5} />
    </div>
  );
};


export default function WrappedSlideshow() {
  const params = useParams({ from: '/wrapped/$address' });
  const navigation = useNavigate();
  const { status, data: rawData } = useWrappedData(params.address);
  const data = rawData as WrappedData;
  const suiPrice = useSuiPrice();
  const nameOfAsset = data?.topAssets?.[0]?.symbol?.toLowerCase() || 'sui';
  const topAssetPrice = useTopAssetPrice(nameOfAsset) || 3.42;
  const displayPrice = suiPrice || 3.42;

  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isSharing, setIsSharing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const navigate = (dir: number) => {
    const next = currentStep + dir;
    if (next >= 0 && next < slides.length) {
      setDirection(dir);
      setCurrentStep(next);
    }
  };

  const handleShare = useCallback(async () => {
    if (!cardRef.current) return;
    setIsSharing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2, style: { transform: 'scale(1)' } });
      const link = document.createElement("a");
      link.download = `sui-wrapped-2025.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Screenshot failed", err);
    } finally {
      setIsSharing(false);
    }
  }, []);

  if (status === 'INDEXING' || status === 'IDLE' || !data) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#F5F5F5]">
        <SuiBackground />
        <Card className="justify-center items-center">
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }}>
            <div className="w-24 h-24 bg-[#3D5DD9] rounded-full blur-3xl opacity-30 absolute" />
            <ArrowRightLeft size={48} className="text-[#3D5DD9] relative z-10" />
          </motion.div>
          <p className="font-mono-space text-xs mt-8 text-slate-700 uppercase tracking-widest font-bold">Syncing Chain Data...</p>
        </Card>
      </div>
    );
  }



  const slideKey = slides[currentStep];

  return (
    <div className="w-full h-dvh flex flex-col items-center justify-center bg-[#F5F5F5] text-[#111] overflow-hidden font-sans">
      <SuiBackground />

      <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-md z-50 flex gap-1.5 pointer-events-none">
        {slides.map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 bg-gray-300/40 rounded-full overflow-hidden backdrop-blur-xs"
          >
            <motion.div
              initial={false}
              animate={{
                width: i <= currentStep ? "100%" : "0%",
                backgroundColor: i === currentStep ? "#3D5DD9" : "#1e293b"
              }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="h-full"
            />
          </div>
        ))}
      </div>

      <div className="z-20 w-full flex justify-center items-center h-full p-4 relative -top-5">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentStep}
            custom={direction}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-md h-[70dvh] flex justify-center"
          >
            <Card cardRef={cardRef}>

              {slideKey === "intro" && (
                <div className="flex flex-col h-full justify-between py-4">
                  <motion.div variants={itemVariants}>
                    <div className="font-mono-space text-[10px] bg-[#111] text-white px-3 py-1 rounded-full inline-block mb-4">
                      SUI WRAPPED
                    </div>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <div className="font-clash font-bold text-[100px] md:text-[120px] leading-[0.85] tracking-tighter text-[#111] mb-2">
                      20<br /><span className="text-sui-gradient text-[120px] md:text-[150px]">25</span>
                    </div>
                    <div className="font-clash font-medium text-3xl md:text-4xl text-slate-500 tracking-tight">
                      ON-CHAIN
                    </div>
                  </motion.div>
                  <motion.div variants={itemVariants} className="w-full border-t border-gray-200 pt-6">
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="font-mono-space text-[9px] text-slate-500 uppercase mb-1 font-bold">Wallet</div>
                        <div className="font-mono-space text-[11px] bg-white/80 border border-gray-100 px-2 py-1 rounded text-slate-800 shadow-sm">
                          {params.address?.slice(0, 6)}...{params.address?.slice(-4)}
                        </div>
                      </div>
                      <ArrowRightLeft className="text-gray-300" size={24} />
                    </div>
                  </motion.div>
                </div>
              )}

              {slideKey === "volume" && (
                <div className="flex flex-col h-full justify-between">
                  <motion.div variants={itemVariants}><Label icon={TrendingUp}>Total Volume</Label></motion.div>
                  <motion.div variants={itemVariants} className="flex-1 flex flex-col justify-center">
                    <div className="font-clash font-bold text-[13vw] sm:text-[100px] leading-[0.9] tracking-tighter text-sui-gradient break-all drop-shadow-sm">
                      {Math.round(data.totalVolumeUSD).toLocaleString()}
                    </div>
                    <div className="font-clash text-4xl text-slate-500 font-medium mt-2">SUI</div>
                  </motion.div>
                  <motion.div variants={itemVariants} className="font-mono-space text-slate-500 font-bold text-xs border-t border-gray-200 pt-4">
                    VALUE IN USD ≈ ${(data.totalVolumeUSD * displayPrice).toLocaleString()}
                  </motion.div>
                </div>
              )}

              {slideKey === "flow" && (
                <div className="flex flex-col h-full justify-between">
                  <motion.div variants={itemVariants}><Label icon={ArrowRightLeft}>Money Flow</Label></motion.div>
                  <div className="flex-1 flex flex-col justify-center gap-8 md:gap-12">
                    <motion.div variants={itemVariants} className="bg-white/40 p-5 md:p-6 rounded-3xl border border-white/60">
                      <div className="font-mono-space text-xs text-green-600 uppercase mb-2 font-bold flex justify-between">
                        <span>Inflow</span><span>↗</span>
                      </div>
                      <div className="font-clash font-bold text-5xl md:text-6xl tracking-tight text-slate-900">
                        +{Math.round(data.inflow).toLocaleString()}
                      </div>
                      <div className="font-mono-space text-xs text-slate-500 mt-2 font-medium">
                        ≈ ${(data.inflow * displayPrice).toLocaleString()} USD
                      </div>
                    </motion.div>
                    <motion.div variants={itemVariants} className="bg-white/40 p-5 md:p-6 rounded-3xl border border-white/60">
                      <div className="font-mono-space text-xs text-red-500 uppercase mb-2 font-bold flex justify-between">
                        <span>Outflow</span><span>↘</span>
                      </div>
                      <div className="font-clash font-bold text-5xl md:text-6xl tracking-tight text-slate-400">
                        -{Math.round(data.outflow).toLocaleString()}
                      </div>
                      <div className="font-mono-space text-xs text-slate-400 mt-2">
                        ≈ ${(data.outflow * displayPrice).toLocaleString()} USD
                      </div>
                    </motion.div>
                  </div>
                </div>
              )}

              {slideKey === "top-asset" && (
                <div className="flex flex-col h-full">
                  <motion.div variants={itemVariants}><Label icon={Wallet}>Top Asset</Label></motion.div>
                  <motion.div variants={itemVariants} className="flex-1 flex flex-col justify-center items-center text-center relative">
                    <div className="absolute font-clash font-bold text-[200px] md:text-[300px] text-gray-200/50 select-none z-0 top-10">
                      {data.topAssets[0]?.symbol[0]}
                    </div>
                    <div className="relative z-10">
                      <div className="font-clash font-bold text-[60px] md:text-[80px] text-sui-gradient mb-4 tracking-tighter drop-shadow-sm">
                        {data.topAssets[0]?.symbol}
                      </div>
                      <div className="font-mono-space bg-[#111] text-white px-6 py-2 rounded-xl inline-block text-sm shadow-lg">
                        {data.topAssets[0]?.amount.toLocaleString()} TOKENS
                      </div>
                    </div>
                  </motion.div>
                  <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-md rounded-2xl p-6 flex justify-between items-center border border-white/50">
                    <span className="font-mono-space text-xs text-slate-500 font-bold">USD VALUE</span>
                    <span className="font-clash font-bold text-xl text-slate-900">${(data.topAssets[0]?.amount * topAssetPrice).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </motion.div>
                </div>
              )}

              {slideKey === "assets" && (
                <div className="flex flex-col h-full">
                  <motion.div variants={itemVariants} className="mb-4 md:mb-8">
                    <Label icon={Target}>Portfolio</Label>
                    <h2 className="font-clash font-bold text-4xl md:text-5xl mt-2 text-slate-900">Top 5</h2>
                  </motion.div>
                  <motion.div className="flex-1 flex flex-col gap-2 overflow-hidden"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {data.topAssets.slice(0, 5).map((asset, i) => (
                      <motion.div
                        variants={itemVariants}
                        key={asset.symbol}
                        className="flex items-center justify-between p-4 bg-white/60 rounded-2xl border border-gray-100/50"
                      >
                        <div className="flex items-center gap-3 md:gap-4">
                          <span className="font-mono-space text-xs font-bold text-slate-400 group-hover:text-[#3D5DD9] transition-colors">0{i + 1}</span>
                          <span className="font-clash font-semibold text-xl md:text-2xl uppercase text-slate-800">{asset.symbol}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-mono-space text-[10px] md:text-xs font-bold text-[#3D5DD9]">{asset.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              )}

              {slideKey === "interactions" && (
                <div className="flex flex-col h-full">
                  <motion.div variants={itemVariants} className="mb-4 md:mb-8">
                    <Label icon={Users}>Network</Label>
                    <h2 className="font-clash font-bold text-4xl md:text-5xl mt-2 text-slate-900">Top Friends</h2>
                  </motion.div>
                  <div className="flex-1 flex flex-col gap-2 overflow-y-auto overflow-x-auto no-scrollbar">
                    {data.topInteractors.slice(0, 5).map((person, i) => (
                      <motion.div
                        variants={itemVariants}
                        key={person.address}
                        className={`flex items-center justify-between p-4 rounded-2xl  ${i === 0 ? 'bg-[#111] text-white' : 'bg-white/70 shadow-md'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          {i === 0 && <Crown size={16} className="text-yellow-400 fill-yellow-400" />}
                          <div className="font-mono-space text-[10px] md:text-xs font-bold truncate w-24 md:w-32">{person.address.slice(0, 8)}...</div>
                        </div>
                        <div className={`font-clash font-medium text-xs md:text-sm ${i === 0 ? 'opacity-100' : 'opacity-70'}`}>{person.count} TXS</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {slideKey === "peak" && (
                <div className="flex flex-col h-full justify-center items-center text-center">
                  <motion.div variants={itemVariants}><Label icon={Calendar}>Peak Activity</Label></motion.div>
                  <motion.div variants={itemVariants} className="font-clash font-bold text-[60px] md:text-[80px] leading-none text-sui-gradient mb-4 drop-shadow-sm">
                    {new Date(data.peakDay).toLocaleDateString('en-US', { day: 'numeric' })}
                  </motion.div>
                  <motion.div variants={itemVariants} className="font-clash text-3xl md:text-4xl text-slate-800 uppercase tracking-wide">
                    {new Date(data.peakDay).toLocaleDateString('en-US', { month: 'long' })}
                  </motion.div>
                  <motion.div variants={itemVariants} className="mt-12 bg-white/80 border border-gray-200 px-6 py-3 rounded-full font-mono-space text-xs text-slate-600 font-bold shadow-sm backdrop-blur-sm">
                    {data.peakDayCount} TRANSACTIONS IN ONE DAY
                  </motion.div>
                </div>
              )}

              {slideKey === "biggest" && (
                <div className="flex flex-col h-full justify-center items-center text-center bg-[#111] -m-6 p-6 md:-m-10 md:p-10 text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                  <motion.div variants={itemVariants} className="relative z-10"><Label icon={Rocket}>Biggest Move</Label></motion.div>
                  <motion.div variants={itemVariants} className="font-clash font-bold text-[12vw] sm:text-[90px] leading-none text-white mb-2 relative z-10">
                    {Math.round(data.biggestTxAmount).toLocaleString()}
                  </motion.div>
                  <motion.div variants={itemVariants} className="font-mono-space text-[#3D5DD9] text-xl mb-12 font-bold relative z-10">
                    SUI TOKEN SENT
                  </motion.div>
                  <motion.div variants={itemVariants} className="w-full border-t border-gray-800 pt-6 relative z-10">
                    <div className="font-mono-space text-[9px] text-gray-400 uppercase mb-2 font-bold">Recipient</div>
                    <div className="font-mono-space text-[10px] text-gray-300 truncate bg-white/10 p-3 rounded-xl">{params.address}</div>
                  </motion.div>
                </div>
              )}

              {slideKey === "rank" && (
                <div className="flex flex-col h-full justify-center items-center text-center">
                  <motion.div variants={itemVariants}><Label icon={Crown}>Global Rank</Label></motion.div>
                  <motion.div variants={itemVariants} className="relative py-8">
                    <div className="font-clash font-bold text-[100px] md:text-[140px] leading-[0.8] text-slate-900 drop-shadow-sm">
                      {data.rankPercentile}<span className="text-3xl md:text-4xl text-[#3D5DD9] align-top">%</span>
                    </div>
                  </motion.div>
                  <motion.div variants={itemVariants} className="mt-8 max-w-60 font-mono-space text-xs text-slate-600 leading-relaxed font-medium bg-white/50 p-4 rounded-2xl backdrop-blur-sm">
                    YOU ARE IN THE TOP <span className="text-[#3D5DD9] font-bold">{data.rankPercentile}%</span> OF ALL SUI USERS
                  </motion.div>
                </div>
              )}

              {slideKey === "archetype" && (
                <div className="flex flex-col h-full justify-center items-center text-center">
                  <motion.div variants={itemVariants}><Label icon={Target}>Your Persona</Label></motion.div>
                  <motion.div variants={itemVariants}><ArchetypeGraphic type={data.archetype} /></motion.div>
                  <motion.div variants={itemVariants} className="font-clash font-bold text-3xl md:text-5xl mb-4 text-slate-900 drop-shadow-sm">
                    {data.archetype.replace(/ .*/, '')}
                  </motion.div>
                  <motion.div variants={itemVariants} className="font-mono-space text-slate-600 font-bold text-xs bg-white/60 border border-gray-200 px-4 py-2 rounded-lg uppercase tracking-widest backdrop-blur-sm">
                    {data.archetype.split(" ").slice(1, -1).join(" ")}
                  </motion.div>
                </div>
              )}

              {slideKey === "summary" && (
                <div className="flex flex-col h-full">
                  <motion.div variants={itemVariants} className="flex justify-between items-center mb-3 md:mb-6 shrink-0">
                    <h2 className="font-clash font-bold text-2xl md:text-3xl text-slate-800">2025 Wrapped</h2>
                    <div className="w-8 h-8 bg-[#111] rounded-full flex items-center justify-center text-white shadow-md">
                      <Smile size={16} />
                    </div>
                  </motion.div>

                  <div className="grid grid-cols-2 grid-rows-[2fr_1fr_0.8fr] gap-2 md:gap-3 h-full pb-2 md:pb-0 min-h-0">

                    <motion.div
                      variants={itemVariants}
                      className="col-span-2 bg-[#111] text-white rounded-3xl md:rounded-4xl p-5 md:p-8 flex flex-col justify-between relative overflow-hidden shadow-xl"
                    >
                      <div className="absolute top-0 right-0 p-4 md:p-8 opacity-20">
                        <Zap className="w-20 h-20 md:w-24 md:h-24" />
                      </div>
                      <div className="font-mono-space text-[9px] md:text-[10px] text-gray-300 font-bold uppercase tracking-wider">
                        Total Volume
                      </div>
                      <div>
                        <div className="font-clash font-bold text-4xl md:text-5xl text-white leading-none mb-1">
                          {Math.round(data.totalVolumeUSD).toLocaleString()}
                        </div>
                        <div className="font-mono-space text-[9px] md:text-[10px] text-gray-400 font-medium">
                          SUI TOKEN
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      className="bg-white/80 border border-gray-100 rounded-[1.2rem] md:rounded-3xl p-3 md:p-5 flex flex-col justify-between shadow-sm backdrop-blur-sm"
                    >
                      <div className="text-[#3D5DD9]">
                        <Wallet className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <div>
                        <div className="font-mono-space text-[7px] md:text-[8px] text-slate-500 uppercase font-bold mb-0.5">
                          Top Asset
                        </div>
                        <div className="font-clash font-bold text-lg md:text-xl text-slate-900 truncate">
                          {data.topAssets[0]?.symbol}
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      className="bg-white/80 border border-gray-100 rounded-[1.2rem] md:rounded-3xl p-3 md:p-5 flex flex-col justify-between shadow-sm backdrop-blur-sm"
                    >
                      <div className="font-mono-space text-[7px] md:text-[8px] text-slate-500 uppercase font-bold">
                        Rank
                      </div>
                      <div className="font-clash font-bold text-2xl md:text-3xl text-sui-gradient">
                        #{data.rankPercentile}
                      </div>
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      className="col-span-2 bg-linear-to-r from-[#3D5DD9] to-[#00D1FF] text-white rounded-[1.2rem] md:rounded-3xl p-3 md:p-5 flex items-center justify-between px-5 md:px-8 shadow-lg shadow-blue-200/50 h-full"
                    >
                      <div>
                        <div className="font-mono-space text-[8px] md:text-[9px] opacity-90 font-bold uppercase mb-0.5">
                          Persona
                        </div>
                        <div className="font-clash font-bold text-lg md:text-xl leading-none">
                          {data.archetype}
                        </div>
                      </div>
                      <Crown className="w-6 h-6 md:w-7 md:h-7 text-white opacity-80 shrink-0" />
                    </motion.div>

                  </div>
                </div>
              )}

            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="fixed bottom-8 flex flex-col items-center gap-4 z-50 w-full">
        <div className="flex gap-4 w-full justify-center">
          <button
            type="button"
            title="backButton"
            onClick={() => navigate(-1)}
            disabled={currentStep === 0}
            className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:scale-110 active:scale-95 disabled:opacity-30 disabled:scale-100 transition-all text-slate-800 border border-white/50 backdrop-blur-md"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            type="button"
            title="nextButton"
            onClick={() => currentStep === slides.length - 1 ? handleShare() : navigate(1)}
            disabled={currentStep === slides.length - 1 && isSharing}
            className="w-14 h-14 md:w-16 md:h-16 bg-[#111] text-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:scale-110 active:scale-95 disabled:opacity-30 disabled:scale-100 transition-all"
          >
            {isSharing ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : currentStep === slides.length - 1 ? (
              <Download size={24} />
            ) : (
              <ChevronRight size={24} />
            )}
          </button>
        </div>

        <AnimatePresence>
          {slideKey === 'summary' && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={() => navigation({ to: `/dashboard/${params.address}` })}
              className="w-44 md:w-50 bg-white border border-gray-200 text-slate-900 font-mono-space font-bold text-xs py-3 md:py-4 rounded-2xl shadow-lg hover:bg-gray-50 flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <LayoutDashboard size={14} /> VIEW DASHBOARD
            </motion.button>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}