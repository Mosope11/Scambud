'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import toast, { Toaster } from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react'
import { sendApprovalEmail } from '../actions/email'

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passcode, setPasscode] = useState('')
  const [showPasscode, setShowPasscode] = useState(false)
  const [pending, setPending] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  
  // 1. Double Security Check: Checks both LocalStorage AND Supabase Auth
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      const authStatus = localStorage.getItem('scambud_admin')
      
      if (authStatus === 'true' && user) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
        localStorage.removeItem('scambud_admin') // Clean up if session is dead
      }
    }
    checkAuth()
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (passcode === 'Sopeis2cool') {
      localStorage.setItem('scambud_admin', 'true')
      setIsAuthenticated(true)
      toast.success('Access Granted, Oga Mi')
    } else {
      toast.error('Invalid Access Code')
    }
  }

  const fetchPending = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('pending_reports').select('*').order('created_at', { ascending: false })
    if (!error) setPending(data || [])
    setLoading(false)
  }

  useEffect(() => {
    if (isAuthenticated) fetchPending()
  }, [isAuthenticated])

  const handleAction = async (report: any, action: 'approve' | 'reject') => {
    if (action === 'approve') {
      // 1. Move to the live 'reports' table
      const { error } = await supabase.from('reports').insert([{
        target: report.target, 
        details: report.details, 
        category: report.category, 
        image_url: report.image_url,
        user_id: report.user_id
      }])
      
      if (error) {
        console.log("DATABASE ERROR:", error);
        return toast.error(`Move failed: ${error.message}`); 
      }

      // 2. Send the notification email if they have one
      if (report.user_email) {
        try {
          await sendApprovalEmail(report.user_email, report.target)
          toast.success('Approval email sent!')
        } catch (err) {
          console.error("Email error:", err)
        }
      }
    }

    // 3. Delete from the pending list
    await supabase.from('pending_reports').delete().eq('id', report.id)
    toast.success(action === 'approve' ? 'Live on Registry' : 'Discarded')
    fetchPending()
  }

  // 4. Secure Logout Function
  const handleLogout = async () => {
    localStorage.removeItem('scambud_admin') // Remove admin access
    await supabase.auth.signOut()           // Sign out of Google
    window.location.href = "/login"         // Hard redirect to clear all states
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-slate-200 flex items-center justify-center p-6">
        <Toaster position="top-center" />
        <div className="w-full max-w-md bg-white/[0.03] border border-white/10 p-10 rounded-[32px] backdrop-blur-xl shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center font-black text-3xl italic mx-auto mb-4 shadow-lg shadow-red-900/20 text-white">S</div>
            <h1 className="text-2xl font-black uppercase tracking-tighter text-white">Admin <span className="text-red-500 underline">Portal</span></h1>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input 
                type={showPasscode ? "text" : "password"} 
                placeholder="Enter Access Code"
                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-red-500/50 transition-all text-center font-bold text-white"
                onChange={(e) => setPasscode(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                {showPasscode ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <button type="submit" className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-slate-200 transition-all uppercase text-xs tracking-widest">
              Authorize
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-6 md:p-12 font-sans">
      <Toaster position="top-center" />
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-8 mb-12">
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase italic text-white">Control <span className="text-yellow-500 underline">Room</span></h1>
            <button 
              onClick={handleLogout}
              className="text-[10px] text-slate-500 font-bold hover:text-red-500 mt-2 uppercase tracking-widest transition-colors"
            >
              Terminate Session (Logout)
            </button>
          </div>
          <button onClick={fetchPending} disabled={loading} className="w-full md:w-auto bg-white/5 hover:bg-white/10 px-8 py-3 rounded-2xl text-xs font-bold transition-all border border-white/10 uppercase tracking-widest">
            {loading ? 'Syncing...' : 'Refresh Feed'}
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pending.length > 0 ? pending.map((item) => (
             <div key={item.id} className="bg-white/[0.03] border border-white/10 rounded-[32px] p-6 flex flex-col justify-between backdrop-blur-sm">
                <div>
                   <div className="flex justify-between items-start mb-6">
                      <span className="text-[9px] bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full font-black uppercase tracking-tighter border border-yellow-500/20">Review Required</span>
                      <span className="text-[9px] text-slate-600 font-mono">{item.user_email || 'No Email'}</span>
                   </div>
                   <h3 className="text-xl font-mono font-bold text-red-500 mb-2">{item.target}</h3>
                   <p className="text-sm text-slate-400 italic mb-6">"{item.details}"</p>
                   {item.image_url && (
                     <img src={item.image_url} className="w-full h-40 object-cover rounded-2xl mb-6 grayscale hover:grayscale-0 transition-all border border-white/5" alt="Proof" />
                   )}
                </div>
                <div className="flex gap-3">
                   <button onClick={() => handleAction(item, 'approve')} className="flex-1 bg-green-600 hover:bg-green-500 py-3 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all shadow-lg shadow-green-900/20">Approve</button>
                   <button onClick={() => handleAction(item, 'reject')} className="flex-1 bg-white/5 hover:bg-red-600 py-3 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all border border-white/10">Reject</button>
                </div>
             </div>
          )) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[40px]">
              <p className="text-slate-600 text-sm font-bold uppercase tracking-widest">Queue Clear. No reports pending.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}