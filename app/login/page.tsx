'use client'
import { useState } from 'react'
import { supabase } from '../supabase' 
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false) // Toggle for Sign In vs Sign Up
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const authToast = toast.loading(isSignUp ? 'Creating account...' : 'Authenticating...')

    try {
      const { error } = isSignUp 
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password })

      if (error) throw error

      if (isSignUp) {
        toast.success('Check your email for the confirmation link!', { id: authToast })
      } else {
        toast.success('Access Granted', { id: authToast })
        router.push('/')
        router.refresh()
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed', { id: authToast })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) toast.error(error.message)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-200 flex items-center justify-center p-6 font-sans relative overflow-hidden">
      <Toaster position="top-right" />
      
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-red-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-10">
          <div className="inline-flex w-14 h-14 bg-red-600 rounded-2xl items-center justify-center font-black italic text-2xl text-white shadow-2xl shadow-red-900/40 mb-6">S</div>
          <h1 className="text-3xl font-black tracking-tighter uppercase text-white">Scam<span className="text-red-500">Bud</span></h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
            {isSignUp ? 'Initialize New Protocol' : 'Protocol Access Required'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="bg-white/[0.02] border border-white/10 rounded-[40px] p-8 backdrop-blur-2xl space-y-5">
          {/* Google Button */}
          <button 
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white text-black py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all hover:bg-slate-200 active:scale-[0.98]"
          >
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="G" />
            Continue with Google
          </button>

          <div className="flex items-center gap-4 my-4">
            <div className="h-[1px] bg-white/10 flex-1"></div>
            <span className="text-[10px] font-black text-slate-600 uppercase">OR</span>
            <div className="h-[1px] bg-white/10 flex-1"></div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest ml-1">Agent Email</label>
            <input 
              type="email" 
              placeholder="name@company.com" 
              className="w-full bg-black/60 border border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:border-red-500/40 transition-all text-white" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest ml-1">Security Key</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full bg-black/60 border border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:border-red-500/40 transition-all text-white" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-500 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white transition-all shadow-lg shadow-red-900/20 active:scale-[0.98]"
          >
            {loading ? 'PROCESSING...' : isSignUp ? 'CREATE ACCOUNT' : 'INITIALIZE ACCESS'}
          </button>

          <p className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest pt-2">
            {isSignUp ? "Already part of the protocol?" : "New to the registry?"} 
            <button 
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="ml-2 text-red-500 hover:underline"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </form>

        <p className="text-center mt-8 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
          Authorized Personnel Only • Secure Connection Active
        </p>
      </div>
    </div>
  )
}