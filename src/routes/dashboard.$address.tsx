import { createFileRoute } from '@tanstack/react-router';
import { useState, useMemo, useRef, useCallback } from "react";
import {
    ArrowLeft, Share2, RefreshCcw, TrendingUp,
    ArrowUpRight, ArrowDownLeft, Wallet, Zap,
    MoreHorizontal, Download,
    Clock, Hash, Ghost, Users, Crown, X, Smile,
    Loader2
} from "lucide-react";
import { useWrappedData } from "@/hooks/useWrappedData";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toPng } from 'html-to-image';
import { motion, AnimatePresence } from 'framer-motion';
import { useSuiPrice } from '@/components/WrappedSlideshow';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const Route = createFileRoute('/dashboard/$address')({
    component: DashboardPage,
});

type Transaction = {
    hash: string;
    type: 'SEND' | 'RECEIVE' | 'SWAP' | 'MINT';
    amount: number;
    symbol: string;
    timestamp: number;
    address: string;
    success: boolean;
};

type MonthlyStat = { name: string; value: number; };
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
    monthlyActivity?: MonthlyStat[];
    recentTransactions?: Transaction[];
    txCount?: number;
};

const WaterSplashBackground = () => (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-4xl">
        <motion.div
            className="absolute -top-[20%] -left-[20%] w-[140%] h-[140%] opacity-20"
            animate={{ rotate: 360, scale: [1, 1.1, 0.9, 1], x: [0, 20, -20, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" className='stop2' />
                        <stop offset="100%" className='stop1' />
                    </linearGradient>
                </defs>
                <path fill="url(#grad1)" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,79.6,-46.3C87.4,-33.5,90.1,-18,87.9,-3.3C85.7,11.4,78.6,25.3,69.5,37.6C60.4,49.9,49.3,60.6,36.4,68.2C23.5,75.8,8.8,80.3,-4.6,78.3C-18,76.3,-30.1,67.8,-41.5,59.3C-52.9,50.8,-63.6,42.3,-71.3,31.5C-79,20.7,-83.7,7.6,-81.4,-4.4C-79.1,-16.4,-69.8,-27.3,-59.9,-37.2C-50,-47.1,-39.5,-56,-27.8,-64.5C-16.1,-73,-3.2,-81.1,8.3,-79.7C19.8,-78.3,30.5,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
            </svg>
        </motion.div>
    </div>
);


const SummaryCard = ({ data, cardRef }: { data: WrappedData, cardRef: any }) => (
    <div
        ref={cardRef}
        className="relative w-87.5 h-150 bg-white rounded-4xl shadow-2xl flex flex-col overflow-hidden border border-white/60 p-6"
    >
        <WaterSplashBackground />
        <div className="relative z-10 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-clash font-bold text-2xl text-slate-800">2025 Wrapped</h2>
                <div className="w-8 h-8 bg-[#111] rounded-full flex items-center justify-center text-white shadow-md">
                    <Smile size={16} />
                </div>
            </div>

            <div className="grid grid-cols-2 grid-rows-4 gap-3 flex-1">
                <div className="col-span-2 row-span-2 bg-[#111] text-white rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 p-6 opacity-20"><Zap size={80} /></div>
                    <div className="font-mono text-[9px] text-gray-300 font-bold uppercase tracking-wider">Total Volume</div>
                    <div>
                        <div className="font-clash font-bold text-4xl text-white">{Math.round(data.totalVolumeUSD).toLocaleString()}</div>
                        <div className="font-mono text-[9px] text-gray-400 mt-2 font-medium">SUI TOKEN</div>
                    </div>
                </div>

                <div className="bg-white/80 border border-gray-100 rounded-[1.2rem] p-4 flex flex-col justify-between shadow-sm backdrop-blur-sm">
                    <div className="text-[#3D5DD9]"><Wallet size={20} /></div>
                    <div>
                        <div className="font-mono text-[7px] text-slate-500 uppercase font-bold mb-1">Top Asset</div>
                        <div className="font-clash font-bold text-lg text-slate-900">{data.topAssets[0]?.symbol}</div>
                    </div>
                </div>

                <div className="bg-white/80 border border-gray-100 rounded-[1.2rem] p-4 flex flex-col justify-between shadow-sm backdrop-blur-sm">
                    <div className="font-mono text-[7px] text-slate-500 uppercase font-bold">Rank</div>
                    <div className="font-clash font-bold text-2xl text-[#3D5DD9]">#{data.rankPercentile}</div>
                </div>

                <div className="col-span-2 bg-linear-to-r from-[#3D5DD9] to-[#00D1FF] text-white rounded-[1.2rem] p-4 flex items-center justify-between px-6 shadow-lg">
                    <div>
                        <div className="font-mono text-[8px] opacity-90 font-bold uppercase">Persona</div>
                        <div className="font-clash font-bold text-lg">{data.archetype}</div>
                    </div>
                    <Crown size={24} className="text-white opacity-80" />
                </div>
            </div>

            <div className="mt-4 text-center">
                <p className="font-mono text-[8px] text-slate-400 uppercase tracking-widest">sui-wrapped-five.vercel.app</p>
            </div>
        </div>
    </div>
);

// const DateFilterSelect = ({ onSelect }: { onSelect: (val: string) => void }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [selected, setSelected] = useState("All Months");
//     const options = ["All Months", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

//     const handleSelect = (opt: string) => {
//         setSelected(opt);
//         onSelect(opt);
//         setIsOpen(false);
//     }

//     return (
//         <div className="relative">
//             <button
//                 onClick={() => setIsOpen(!isOpen)}
//                 className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all border border-slate-200 shadow-sm"
//             >
//                 <Calendar size={14} className="text-slate-400" />
//                 {selected}
//                 <ChevronDown size={14} className={cn("transition-transform text-slate-400", isOpen && "rotate-180")} />
//             </button>

//             {isOpen && (
//                 <>
//                     <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
//                     <div className="absolute right-0 top-full mt-2 w-40 max-h-60 overflow-y-auto bg-white border border-slate-100 rounded-xl shadow-xl z-20 py-1 animate-in fade-in zoom-in-95 duration-100">
//                         {options.map((opt) => (
//                             <button
//                                 key={opt}
//                                 onClick={() => handleSelect(opt)}
//                                 className="w-full text-left px-4 py-2 text-xs font-mono text-slate-600 hover:bg-slate-50 hover:text-[#3D5DD9] flex justify-between items-center"
//                             >
//                                 {opt}
//                                 {selected === opt && <Check size={12} className="text-[#3D5DD9]" />}
//                             </button>
//                         ))}
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// };

export default function DashboardPage() {
    const suiPrice = useSuiPrice();
    const displayPrice = suiPrice || 3.42;
    const { address } = Route.useParams();

    const { status, data: rawData } = useWrappedData(address);
    const data = rawData as WrappedData;

    //   const [monthFilter, setMonthFilter] = useState("All Months");
    const monthFilter = "All Months"
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    const chartRef = useRef<HTMLDivElement>(null);
    const summaryRef = useRef<HTMLDivElement>(null);


    const handleDownloadChart = useCallback(async () => {
        setIsDownloading(true);
        if (!chartRef.current) { setIsDownloading(false); return; }

        try {
            const dataUrl = await toPng(chartRef.current, { backgroundColor: '#ffffff', pixelRatio: 2 });
            const link = document.createElement('a');
            link.download = `suiwrapped-activity-chart.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Failed to download chart', err);
        } finally {
            setIsDownloading(false)
        }
    }, [chartRef]);

    const handleDownloadSummary = useCallback(async () => {
        if (!summaryRef.current) return;
        setIsDownloading(true);
        try {
            await new Promise(r => setTimeout(r, 100));
            const dataUrl = await toPng(summaryRef.current, { pixelRatio: 2, style: { transform: 'scale(1)' } });
            const link = document.createElement('a');
            link.download = `suiwrapped-summary-2025.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Failed to download summary', err);
        } finally {
            setIsDownloading(false);
        }
    }, [summaryRef]);


    const chartData = useMemo(() => {
        if (!data?.monthlyActivity) return [];
        if (monthFilter === "All Months") return data.monthlyActivity;
        return data.monthlyActivity.filter(d => d.name === monthFilter);
    }, [data, monthFilter]);

    const transactions = data?.recentTransactions || [];
    const totalTxCount = data?.txCount || 0;

    if (status === 'INDEXING' || status === 'IDLE' || !data) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-[#F5F7FA]">
                <div className="flex flex-col items-center animate-pulse">
                    <div className="w-12 h-12 border-4 border-[#3D5DD9] border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="font-mono text-xs text-slate-400 uppercase tracking-widest">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5F7FA] font-sans text-slate-900 pb-20 selection:bg-[#3D5DD9] selection:text-white">

            <AnimatePresence>
                {isShareModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    >
                        <div className="flex flex-col items-center gap-6">
                            <button
                                type='button'
                                title='share'
                                onClick={() => setIsShareModalOpen(false)}
                                className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <h3 className="text-white font-clash text-2xl font-bold">Your 2025 Summary</h3>

                            <div className="shadow-2xl rounded-4xl">
                                <SummaryCard data={data} cardRef={summaryRef} />
                            </div>

                            <button
                                onClick={handleDownloadSummary}
                                disabled={isDownloading}
                                className="flex items-center gap-2 px-8 py-4 bg-[#3D5DD9] hover:bg-[#2b4bc2] text-white rounded-2xl font-bold shadow-xl shadow-blue-500/30 transition-all active:scale-95"
                            >
                                {isDownloading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Download size={20} />
                                        Download Image
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <header className="sticky top-0 z-50 bg-[#F5F7FA]/80 backdrop-blur-xl border-b border-slate-200 px-4 md:px-8 py-4">
                <div className="max-w-350 mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <button
                            title='history'
                            onClick={() => window.history.back()}
                            className="p-2 hover:bg-white rounded-xl transition-all text-slate-400 hover:text-slate-900 hover:shadow-sm"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="font-clash font-bold text-xl md:text-2xl flex items-center gap-2 text-slate-900">
                                SuiWrap <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#3D5DD9] text-[10px] font-bold border border-blue-100 uppercase tracking-wider">Dashboard</span>
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                        {/* <DateFilterSelect onSelect={setMonthFilter} /> */}

                        <button
                            type='button'
                            title='shareModal'
                            onClick={() => setIsShareModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all text-xs font-bold shadow-sm"
                        >
                            <Share2 size={14} /> Share
                        </button>

                        <button
                            type='button'
                            title='reload'
                            onClick={() => window.location.reload()}
                            className="flex items-center gap-2 px-4 py-2 bg-[#3D5DD9] text-white rounded-xl hover:bg-[#2b4bc2] transition-all text-xs font-bold shadow-lg shadow-blue-500/20"
                        >
                            <RefreshCcw size={14} /> Replay
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-350 mx-auto p-4 md:p-8 space-y-6">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative group hover:border-blue-100 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <span className="font-mono text-[10px] uppercase font-bold text-slate-400">Total Volume</span>
                            <span className="text-slate-400 bg-slate-50 p-1.5 rounded-lg">$</span>
                        </div>
                        <div className="font-clash font-bold text-3xl mb-1 text-slate-900">
                            {Math.round(data.totalVolumeUSD).toLocaleString()} <span className="text-sm text-slate-400 font-sans">SUI</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                            ≈ ${(data.totalVolumeUSD * displayPrice).toLocaleString()} USD
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-blue-100 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <span className="font-mono text-[10px] uppercase font-bold text-slate-400">Transactions</span>
                            <div className="bg-blue-50 p-1.5 rounded-lg text-[#3D5DD9]"><TrendingUp size={14} /></div>
                        </div>
                        <div className="font-clash font-bold text-3xl mb-1 text-slate-900">
                            {totalTxCount > 0 ? totalTxCount : data.peakDayCount + 10}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-[10px] text-green-600 font-mono font-bold">LIFETIME</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm border-l-4 border-l-green-400 hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <span className="font-mono text-[10px] uppercase font-bold text-slate-400">Inflow</span>
                            <div className="p-1.5 bg-green-50 rounded-lg"><ArrowDownLeft size={14} className="text-green-600" /></div>
                        </div>
                        <div className="font-clash font-bold text-3xl text-green-600 mb-1">
                            +{Math.round(data.inflow).toLocaleString()} <span className="text-sm text-green-600/50">SUI</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                            ≈ ${(data.inflow * displayPrice).toLocaleString()}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm border-l-4 border-l-red-400 hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <span className="font-mono text-[10px] uppercase font-bold text-slate-400">Outflow</span>
                            <div className="p-1.5 bg-red-50 rounded-lg"><ArrowUpRight size={14} className="text-red-600" /></div>
                        </div>
                        <div className="font-clash font-bold text-3xl text-red-500 mb-1">
                            -{Math.round(data.outflow).toLocaleString()} <span className="text-sm text-red-500/50">SUI</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                            ≈ ${(data.outflow * displayPrice).toLocaleString()}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

                    <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="font-clash font-bold text-lg text-slate-900">Activity Overview</h3>
                                <p className="text-[10px] text-slate-400 font-mono uppercase">TRANSACTIONS PER MONTH ({monthFilter})</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type='button'
                                    title='download chart'
                                    onClick={handleDownloadChart}
                                    className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-[#3D5DD9] transition-colors"
                                >
                                    {isDownloading ? <Loader2 size={16} className='animate-spin' /> : <Download size={16} />}
                                </button>
                                <button title='more' className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-[#3D5DD9] transition-colors"><MoreHorizontal size={16} /></button>
                            </div>
                        </div>

                        <div ref={chartRef} className="h-75 w-full bg-white p-2 rounded-xl">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="activityColor" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3D5DD9" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#3D5DD9" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#94a3b8"
                                        tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
                                        axisLine={false}
                                        tickLine={false}
                                        dy={10}
                                    />
                                    <YAxis
                                        stroke="#94a3b8"
                                        tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
                                        axisLine={false}
                                        tickLine={false}
                                        dx={-10}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        itemStyle={{ color: '#3D5DD9', fontSize: '12px', fontFamily: 'monospace', fontWeight: 'bold' }}
                                        labelStyle={{ color: '#64748b', fontSize: '10px', marginBottom: '4px' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#3D5DD9"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#activityColor)"
                                        animationDuration={1000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-linear-to-br from-[#3D5DD9] to-[#0040E5] p-8 rounded-3xl flex flex-col justify-between relative overflow-hidden shadow-xl shadow-blue-500/20 text-white group">
                        <div className="absolute -top-5 -right-5 opacity-20 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                            <Zap size={180} />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2 opacity-80">
                                <Zap size={16} />
                                <span className="font-mono text-[10px] uppercase tracking-widest">Archetype</span>
                            </div>
                            <h2 className="font-clash font-bold text-4xl mb-1">{data.archetype.split(' ')[0]}</h2>
                            <p className="text-blue-100 text-xs font-mono opacity-80">
                                {data.archetype.split(' ').slice(1).join(' ')}
                            </p>
                        </div>
                        <div className="relative z-10 mt-8">
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] uppercase font-bold text-blue-100">Global Rank</span>
                                    <span className="text-xl font-bold">{data.rankPercentile}%</span>
                                </div>
                                <div className="w-full bg-black/20 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-white h-full rounded-full" style={{ width: `${100 - data.rankPercentile}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col h-125">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="font-clash font-bold text-lg text-slate-900">Top Connections</h3>
                                <p className="text-[10px] text-slate-400 font-mono">MOST INTERACTED WALLETS</p>
                            </div>
                            <div className="bg-blue-50 p-1.5 rounded-lg text-[#3D5DD9]"><Users size={16} /></div>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 space-y-3 no-scrollbar">
                            {data.topInteractors?.map((interactor, i) => (
                                <div key={i} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${i === 0 ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                            {i === 0 ? '♛' : i + 1}
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-slate-700 font-mono">
                                                {interactor.address.slice(0, 4)}...{interactor.address.slice(-4)}
                                            </div>
                                            <div className="text-[9px] text-slate-400">
                                                Wallet
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-slate-900">{interactor.count}</div>
                                        <div className="text-[8px] text-slate-400 uppercase font-bold">Txns</div>
                                    </div>
                                </div>
                            ))}
                            {(!data.topInteractors || data.topInteractors.length === 0) && (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                    <Ghost size={24} className="mb-2 opacity-50" />
                                    <span className="text-xs font-mono">No connections found</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col h-125">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="font-clash font-bold text-lg text-slate-900">Recent Transactions</h3>
                                <p className="text-[10px] text-slate-400 font-mono">LIVE ON-CHAIN DATA</p>
                            </div>
                            <div className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-500">
                                {transactions.length} ITEMS
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-white z-10">
                                    <tr>
                                        <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-2">Type</th>
                                        <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hash / Time</th>
                                        <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right pr-2">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {transactions.map((tx, i) => (
                                        <tr key={tx.hash || i} className="group hover:bg-slate-50 transition-colors">
                                            <td className="py-3 pl-2 align-middle">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg ${tx.type === 'RECEIVE' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                                        }`}>
                                                        {tx.type === 'RECEIVE' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-700">{tx.type}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 align-middle">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-1 text-xs font-mono text-slate-600">
                                                        <Hash size={10} className="text-slate-400" />
                                                        {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                                                        <Clock size={10} />
                                                        {new Date(tx.timestamp).toLocaleString()}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 text-right pr-2 align-middle">
                                                <div className={`text-sm font-bold font-mono ${tx.type === 'RECEIVE' ? 'text-green-600' : 'text-slate-900'
                                                    }`}>
                                                    {tx.type === 'RECEIVE' ? '+' : '-'}{tx.amount.toLocaleString(undefined, { maximumFractionDigits: 4 })} {tx.symbol}
                                                </div>
                                                <div className="text-[10px] text-slate-400">
                                                    ≈ ${(tx.amount * displayPrice).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {transactions.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                                    <Ghost size={32} className="mb-2 opacity-50" />
                                    <span className="text-xs font-mono">No recent transactions found</span>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

            </main>
        </div>
    );
}