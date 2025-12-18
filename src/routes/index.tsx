import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Wallet, Coffee } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const [address, setAddress] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (address.length > 5) {
      navigate({ to: `/wrapped/${address}` })
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center relative overflow-hidden font-sans text-slate-900 selection:bg-[#3D5DD9] selection:text-white">
      
      {/* --- BACKGROUND --- */}
      {/* 1. Subtle Grid Pattern */}
      <div className="absolute inset-0 h-full w-full bg-[#FAFAFA] bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* 2. Soft Radial Glow (Center) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_50%,#3D5DD908,transparent)] pointer-events-none"></div>

      {/* --- MAIN CONTENT --- */}
      <div className="z-10 w-full max-w-2xl px-6 flex flex-col items-center text-center">
        
        {/* HEADER SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12 space-y-6"
        >
          <h1 className="text-7xl md:text-8xl font-black tracking-tighter text-slate-900 leading-[0.9]">
            Sui<span className="text-[#3D5DD9]">Wrap</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl font-medium max-w-md mx-auto leading-relaxed">
            Get deep insights on your Sui transactions. <br className="hidden md:block"/>
            Unwrap your on-chain story.
          </p>
        </motion.div>

        {/* INPUT CARD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <div className="bg-white p-3 rounded-[24px] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] border border-slate-200/60 ring-4 ring-slate-50">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Wallet className="h-5 w-5 text-slate-400 group-focus-within:text-[#3D5DD9] transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Enter Sui Wallet Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#3D5DD9] focus:ring-4 focus:ring-[#3D5DD9]/10 outline-none transition-all font-mono text-sm text-slate-800 placeholder:text-slate-400 placeholder:font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={!address}
                className="group w-full bg-[#111] hover:bg-[#3D5DD9] text-white py-4 rounded-xl font-bold text-base shadow-xl shadow-slate-200 hover:shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 overflow-hidden"
              >
                <span>Get Wrapped</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

            </form>
          </div>
        </motion.div>

        {/* FOOTER / CREDITS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-16 flex flex-col items-center gap-4"
        >
          <div className="flex items-center gap-3 text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            Powered by Sui
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
          </div>
          
          <a 
            href="https://x.com/dannyclassi_c" 
            target="_blank" 
            rel="noreferrer"
            className="group flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-[#3D5DD9] transition-colors"
          >
            built with <Coffee size={12} className="group-hover:text-amber-600 transition-colors" /> by <code className="underline decoration-slate-300 underline-offset-4 group-hover:decoration-[#3D5DD9]">DevDanny</code>
          </a>
        </motion.div>

      </div>
    </div>
  )
}