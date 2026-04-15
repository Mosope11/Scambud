'use client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../supabase' 
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link' // Added for the terms link

export default function LoginPage() {
  const router = useRouter()
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    setOrigin(window.location.origin)
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) router.push('/')
    }
    checkUser()
  }, [router])

  return (
    <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center p-6 font-sans overflow-hidden relative">
      
      {/* BACKGROUND EFFECTS */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-red-600/10 blur-[130px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[130px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="w-full max-w-md bg-white/[0.02] border border-white/10 p-10 rounded-[48px] backdrop-blur-3xl shadow-2xl relative z-10">
        
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-3xl flex items-center justify-center font-black text-4xl italic mx-auto mb-6 shadow-[0_0_30px_rgba(220,38,38,0.3)] text-white">
            S
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white">
            Scam<span className="text-red-500">Bud</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-4">Security Protocol</p>
        </div>

        <Auth
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#ef4444',
                  brandAccent: '#dc2626',
                  inputText: 'white',
                  inputPlaceholder: '#475569',
                  inputBackground: 'rgba(255,255,255,0.03)',
                  inputBorder: 'rgba(255,255,255,0.1)',
                  dividerBackground: 'rgba(255,255,255,0.1)',
                }
              }
            },
            className: {
              button: 'rounded-2xl font-black uppercase tracking-widest text-[10px] py-4 transition-all hover:scale-[1.01] active:scale-[0.99] border-none shadow-lg mb-2',
              input: 'rounded-2xl border-white/5 bg-white/5 text-white py-4 px-6 mb-4 focus:ring-1 focus:ring-red-500/50 transition-all text-sm',
              label: 'text-[10px] uppercase font-black text-slate-500 tracking-widest mb-2 ml-1 block',
              anchor: 'text-xs text-slate-400 hover:text-red-500 transition-colors font-bold',
              message: 'text-xs text-red-400 font-bold bg-red-500/10 p-3 rounded-xl border border-red-500/20 mt-4',
            }
          }}
          providers={['google']}
          // CHANGED: Set this to false to show Email/Password inputs
          onlyThirdPartyProviders={false} 
          redirectTo={typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : ''}
        />

        <div className="mt-10 text-center">
          <Link href="/terms" className="group">
            <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.2em] leading-relaxed transition-colors group-hover:text-slate-400">
              By entering, you agree to the <br /> 
              <span className="text-slate-400 group-hover:text-red-500 underline decoration-red-500/30 underline-offset-4">Registry Terms of Conduct</span>
            </p>
          </Link>
        </div>
      </div>

      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none brightness-50"></div>
    </div>
  )
}