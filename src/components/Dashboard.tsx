"use client";
import { useMemo } from "react";
import {
    ArrowLeft, Share2, RefreshCcw, TrendingUp,
    ArrowUpRight, ArrowDownLeft, Wallet, Zap,
    MoreHorizontal, Activity
} from "lucide-react";

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

const SUI_PRICE_MOCK = 3.42;

export default function Dashboard({ data, onReplay }: { data: WrappedData, onReplay: () => void }) {

    const chartPoints = useMemo(() => {
        if (!data.topAssets.length) return "";
        const maxAmount = Math.max(...data.topAssets.map(a => a.amount));
        return data.topAssets.map((asset, i) => {
            const x = (i / (data.topAssets.length - 1 || 1)) * 100;
            const y = 100 - ((asset.amount / maxAmount) * 70);
            return `${x},${y}`;
        }).join(" ");
    }, [data.topAssets]);

    return (
        <div className="min-h-screen bg-[#050505] font-sans text-white pb-20 overflow-x-hidden">

            <header className="sticky top-0 z-50 bg-[#050505]/90 backdrop-blur-md border-b border-white/10 px-4 md:px-8 py-4">
                <div className="max-w-350 mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <button
                            title="replay"
                            onClick={onReplay}
                            className="p-2 hover:bg-white/10 rounded-xl transition-all text-slate-400 hover:text-white"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="font-clash font-bold text-xl md:text-2xl flex items-center gap-2">
                            SuiWrap
                        </h1>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#111] rounded-lg border border-white/5 text-xs font-mono text-slate-400">
                            All Months
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-[#111] border border-white/5 text-white rounded-lg hover:bg-[#222] transition-all text-xs font-bold">
                            <Share2 size={14} /> Share Wrap
                        </button>
                        <button
                            onClick={onReplay}
                            className="flex items-center gap-2 px-4 py-2 bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] transition-all text-xs font-bold"
                        >
                            <RefreshCcw size={14} /> Replay Wrapped
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-350 mx-auto p-4 md:p-8 space-y-6">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">

                    {/* Total Volume */}
                    <div className="bg-[#0A0A0A] p-6 rounded-2xl border border-white/10 relative group">
                        <div className="flex justify-between items-start mb-4">
                            <span className="font-bold text-sm text-slate-400">Total Volume</span>
                            <span className="text-slate-500">$</span>
                        </div>
                        <div className="font-clash font-bold text-2xl md:text-3xl mb-1">
                            {Math.round(data.totalVolumeUSD).toLocaleString()} <span className="text-sm text-slate-500">SUI</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                            ≈ ${(data.totalVolumeUSD * SUI_PRICE_MOCK).toLocaleString()} USD
                        </div>
                    </div>

                    {/* Transactions */}
                    <div className="bg-[#0A0A0A] p-6 rounded-2xl border border-white/10">
                        <div className="flex justify-between items-start mb-4">
                            <span className="font-bold text-sm text-slate-400">Transactions</span>
                            <Activity size={16} className="text-slate-500" />
                        </div>
                        <div className="font-clash font-bold text-2xl md:text-3xl mb-1">
                            {data.topInteractors.reduce((a, b) => a + b.count, 0) + 42}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                            Lifetime Interactions
                        </div>
                    </div>

                    {/* Inflow */}
                    <div className="bg-[#0A0A0A] p-6 rounded-2xl border border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5"><ArrowDownLeft size={48} className="text-green-500" /></div>
                        <div className="flex justify-between items-start mb-4">
                            <span className="font-bold text-sm text-slate-400">2025 Inflow</span>
                            <span className="text-green-500">$</span>
                        </div>
                        <div className="font-clash font-bold text-2xl md:text-3xl text-green-500 mb-1">
                            +{Math.round(data.inflow).toLocaleString()} <span className="text-sm text-green-500/50">SUI</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                            Received
                        </div>
                    </div>

                    {/* Outflow */}
                    <div className="bg-[#0A0A0A] p-6 rounded-2xl border border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5"><ArrowUpRight size={48} className="text-red-500" /></div>
                        <div className="flex justify-between items-start mb-4">
                            <span className="font-bold text-sm text-slate-400">2025 Outflow</span>
                            <span className="text-red-500">$</span>
                        </div>
                        <div className="font-clash font-bold text-2xl md:text-3xl text-red-500 mb-1">
                            -{Math.round(data.outflow).toLocaleString()} <span className="text-sm text-red-500/50">SUI</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                            Sent
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

                    <div className="lg:col-span-2 space-y-6">

                        {/* Top Asset & Personality */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                            <div className="bg-[#0A0A0A] p-6 rounded-2xl border border-white/10 flex flex-col justify-between h-40">
                                <div className="flex justify-between items-start">
                                    <span className="font-bold text-sm text-slate-400">Top Asset</span>
                                    <Wallet size={16} className="text-slate-500" />
                                </div>
                                <div>
                                    <div className="font-clash font-bold text-4xl">{data.topAssets[0]?.symbol || "SUI"}</div>
                                    <div className="text-xs text-slate-500 font-mono mt-1">{data.topAssets[0]?.amount.toLocaleString()} Tokens</div>
                                </div>
                            </div>

                            <div className="bg-[#0A0A0A] p-6 rounded-2xl border border-white/10 flex flex-col justify-between h-40">
                                <div className="flex justify-between items-start">
                                    <span className="font-bold text-sm text-slate-400">Personality</span>
                                    <Zap size={16} className="text-slate-500" />
                                </div>
                                <div>
                                    <div className="font-clash font-bold text-3xl text-white">{data.archetype}</div>
                                    <div className="text-xs text-slate-500 font-mono mt-1">Based on your activity</div>
                                </div>
                            </div>
                        </div>

                        {/* Activity Chart */}
                        <div className="bg-[#0A0A0A] p-6 rounded-2xl border border-white/10">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="font-bold text-lg text-white">Monthly Activity</h3>
                                <div className="flex gap-2">
                                    <div className="p-1.5 bg-[#7c3aed] rounded-md"><TrendingUp size={14} className="text-white" /></div>
                                    <div className="p-1.5 bg-[#222] rounded-md text-slate-400"><MoreHorizontal size={14} /></div>
                                </div>
                            </div>

                            <div className="h-64 w-full relative">
                                {data.topAssets.length > 0 ? (
                                    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                                        {[0, 25, 50, 75, 100].map(y => (
                                            <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#222" strokeWidth="0.5" strokeDasharray="2" />
                                        ))}
                                        <path
                                            d={`M0,${100} ${chartPoints}`}
                                            fill="none"
                                            stroke="#7c3aed"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            vectorEffect="non-scaling-stroke"
                                        />
                                        <path
                                            d={`M0,100 ${chartPoints} L100,100 Z`}
                                            fill="url(#purpleGradient)"
                                            opacity="0.3"
                                        />
                                        <defs>
                                            <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.5" />
                                                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-600 font-mono text-sm">Not enough data to graph</div>
                                )}

                                <div className="flex justify-between text-[10px] text-slate-600 mt-4 font-mono uppercase">
                                    <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Dec</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Transaction List */}
                    <div className="bg-[#0A0A0A] p-6 rounded-2xl border border-white/10 h-full min-h-125 flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg text-white">2025 Transactions</h3>
                            <span className="text-[10px] text-slate-500">{data.topInteractors.length} Total</span>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 space-y-4 no-scrollbar">
                            {data.topInteractors.map((_interactor, i) => (
                                <div key={i} className="flex justify-between items-center group cursor-default hover:bg-white/5 p-2 rounded-lg transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${i % 2 === 0 ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                                            {i % 2 === 0 ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-white mb-0.5">
                                                {i % 2 === 0 ? "Sent SOL" : "Received SOL"}
                                            </div>
                                            <div className="text-[10px] text-slate-500 font-mono">
                                                {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`text-xs font-bold font-mono ${i % 2 === 0 ? 'text-red-500' : 'text-green-500'}`}>
                                        {i % 2 === 0 ? '-' : '+'}{(Math.random() * 2).toFixed(4)} SOL
                                    </div>
                                </div>
                            ))}

                            {data.topInteractors.length === 0 && (
                                <div className="text-center text-slate-600 py-10 font-mono text-xs">No transactions found</div>
                            )}
                        </div>
                    </div>

                </div>

            </main>
        </div>
    );
}