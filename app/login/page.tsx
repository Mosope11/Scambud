'use client'
import { useState } from 'react'
import { supabase } from '../supabase' 
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react' // Run 'npm install lucide-react' if you haven't!

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const authToast = toast.loading(isSignUp ? 'Creating account...' : 'Authenticating...')
    
    try {
      const { error } = isSignUp 
        ? await supabase.auth.signUp({ 
            email, 
            password,
          })
        : await supabase.auth.signInWithPassword({ email, password })

      if (error) throw error

      if (isSignUp) {
        toast.success('Account created! Sign in now.', { id: authToast })
        setIsSignUp(false) // Switch to login mode
      } else {
        toast.success('Access Granted', { id: authToast })
        router.push('/')
        router.refresh()
      }
    } catch (error: any) {
      toast.error(error.message, { id: authToast })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) toast.error(error.message)
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <Toaster position="top-right" />
      
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 blur-[120px]" />
      </div>

      <div className="w-full max-w-[400px] relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 bg-red-600 rounded-xl items-center justify-center font-bold text-xl mb-4 shadow-lg shadow-red-600/20">S</div>
          <h1 className="text-2xl font-bold tracking-tight uppercase">Scam<span className="text-red-500">Bud</span></h1>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">
            {isSignUp ? 'New Protocol' : 'Authorized Access Only'}
          </p>
        </div>

        <div className="bg-gray-900/40 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl">
          <button 
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 rounded-xl font-bold text-xs uppercase transition-transform active:scale-95"
          >
            Continue with Google
          </button>

          <div className="flex items-center gap-4 my-6">
            <div className="h-px bg-white/10 flex-1"></div>
            <span className="text-[10px] text-gray-600 font-bold">OR</span>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="text-[9px] uppercase font-bold text-gray-500 tracking-wider mb-1 block ml-1">Email</label>
              <input 
                type="email" 
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-red-500/50 outline-none transition-all" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>

            <div>
              <label className="text-[9px] uppercase font-bold text-gray-500 tracking-wider mb-1 block ml-1">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-red-500/50 outline-none transition-all pr-12" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-500 py-3 rounded-xl font-bold text-xs uppercase tracking-widest mt-2 transition-all active:scale-[0.98]"
            >
              {loading ? 'WAIT...' : isSignUp ? 'CREATE ACCOUNT' : 'LOGIN'}
            </button>
          </form>

          <p className="text-center text-[10px] font-bold text-gray-500 uppercase mt-6">
            {isSignUp ? "Already a member?" : "New here?"} 
            <button 
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="ml-2 text-red-500 hover:text-red-400 font-black transition-colors"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </main>
  )
}