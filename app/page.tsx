'use client'
import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import toast, { Toaster } from 'react-hot-toast'

export default function Home() {
  const [scammerName, setScammerName] = useState('')
  const [target, setTarget] = useState('')
  const [details, setDetails] = useState('')
  const [category, setCategory] = useState('General')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [myReports, setMyReports] = useState<any[]>([])

  const categories = ["General", "Bank Fraud", "WhatsApp/Telegram", "Fake Job", "Online Shopping"]

  // FETCH USER SPECIFIC REPORTS (FOR STATUS UPDATES)
  const fetchMyReports = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // 1. Fetch from pending_reports (Status: 'pending' or 'rejected')
        const { data: pendingData } = await supabase
          .from('pending_reports')
          .select('*')
          .eq('user_id', user.id)

        // 2. Fetch from reports (Status: 'approved')
        const { data: approvedData } = await supabase
          .from('reports')
          .select('*')
          .eq('user_id', user.id)
        
        // Combine them into one list
        setMyReports([
          ...(pendingData?.map(r => ({ ...r, status: r.status || 'pending' })) || []),
          ...(approvedData?.map(r => ({ ...r, status: 'approved' })) || [])
        ])
      }
    } catch (err) {
      console.error("Fetch reports error:", err)
    }
  }

  useEffect(() => {
    fetchMyReports()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    localStorage.clear()
    window.location.replace('/login')
  }

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const loadingToast = toast.loading('Encrypting report...')
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Authentication required")

      let imagePath = null
      if (file) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('Evidence')
          .upload(fileName, file)

        if (uploadError) throw uploadError
        const { data: urlData } = supabase.storage.from('Evidence').getPublicUrl(fileName)
        imagePath = urlData.publicUrl
      }

      const { error } = await supabase
        .from('pending_reports')
        .insert([{ 
          scammer_name: scammerName,
          target, 
          details, 
          category, 
          image_url: imagePath, 
          user_id: user.id, 
          user_email: user.email,
          status: 'pending' // Explicitly set starting status
        }])
      
      if (error) throw error

      toast.success('Reported to Admin for Review! 🚀', { id: loadingToast })
      setScammerName(''); setTarget(''); setDetails(''); setFile(null)
      fetchMyReports() 
      
    } catch (err: any) {
      toast.error(err.message || 'Network Error', { id: loadingToast })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery) return;
    const loadingToast = toast.loading('Searching registry...')

    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .or(`target.ilike.%${searchQuery}%,details.ilike.%${searchQuery}%`)
      
      toast.dismiss(loadingToast)
      if (error) throw error

      setResults(data || [])
      if (data?.length === 0) {
        toast('Clean Record: No reports found', { icon: '✅' })
      } else {
        toast.success(`Found ${data.length} records`)
      }
    } catch (error: any) {
      toast.error(`Query Failed: ${error.message}`)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-200 selection:bg-red-500/30 font-sans pb-20 overflow-x-hidden">
      <Toaster position="top-right" />

      {/* Decorative Blurs */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-600/5 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] pointer-events-none" />

      {/* Navbar */}
      <nav className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50 px-4 py-4 md:px-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center font-black italic text-white shadow-lg shadow-red-900/20">S</div>
            <span className="text-xl font-bold tracking-tighter uppercase text-white">Scam<span className="text-red-500 font-black">Bud</span></span>
          </div>
          <button onClick={handleSignOut} className="text-[10px] font-black uppercase tracking-widest text-red-500 border border-red-500/20 px-4 py-2 rounded-xl hover:bg-red-500/10 transition-all">
            Sign Out
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 md:px-6 mt-8 md:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 relative">
        
        {/* REPORT FORM SECTION */}
        <section className="lg:col-span-5 order-2 lg:order-1">
          <div className="bg-white/[0.02] border border-white/10 rounded-[32px] p-6 md:p-8 backdrop-blur-md sticky top-24">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3 text-white tracking-tighter uppercase">
              <span className="w-1 h-5 bg-red-500 rounded-full" /> Flag Incident
            </h2>
            
            <form onSubmit={handleReport} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Category</label>
                <select 
                  className="w-full bg-black/60 border border-white/5 rounded-xl px-4 py-4 text-sm outline-none focus:border-red-500/40"
                  onChange={(e) => setCategory(e.target.value)}
                  value={category}
                >
                  {categories.map(c => <option key={c} value={c} className="bg-black">{c}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Scammer Name</label>
                <input type="text" value={scammerName} placeholder="Full Name or Alias" className="w-full bg-black/60 border border-white/5 rounded-xl px-4 py-4 text-sm outline-none focus:border-red-500/40" onChange={(e) => setScammerName(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Identifier</label>
                <input type="text" value={target} placeholder="Phone, Handle or Account" className="w-full bg-black/60 border border-white/5 rounded-xl px-4 py-4 text-sm outline-none focus:border-red-500/40" onChange={(e) => setTarget(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Details</label>
                <textarea value={details} placeholder="Briefly explain the scam..." className="w-full bg-black/60 border border-white/5 rounded-xl px-4 py-4 h-24 text-sm outline-none focus:border-red-500/40 resize-none" onChange={(e) => setDetails(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest block">Evidence (Proof)</label>
                <div className="relative border-2 border-dashed border-white/5 rounded-xl p-4 text-center hover:bg-white/5 transition-all cursor-pointer">
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    {file ? `Selected: ${file.name}` : "Click to Upload Screenshot"}
                  </span>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-500 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-white transition-all">
                {loading ? 'PROCESSING...' : 'SUBMIT REPORT'}
              </button>
            </form>

            {/* MY REPORTS STATUS SECTION */}
            <div className="mt-10 pt-10 border-t border-white/5">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Your Submissions</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {myReports.length > 0 ? myReports.map(r => (
                        <div key={r.id} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                            <div className="flex flex-col">
                              <span className="text-[11px] font-mono text-slate-300 truncate w-32">{r.target}</span>
                              {r.status === 'rejected' && (
                                <span className="text-[8px] text-red-500/50 uppercase font-black italic tracking-tighter">Review Failed</span>
                              )}
                            </div>
                            <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-md tracking-wider ${
                              r.status === 'approved' ? 'bg-green-500/20 text-green-500' : 
                              r.status === 'rejected' ? 'bg-red-500/20 text-red-500' : 
                              'bg-yellow-500/20 text-yellow-500 animate-pulse'
                            }`}>
                                {r.status}
                            </span>
                        </div>
                    )) : <p className="text-[10px] text-slate-600 italic uppercase">No history found.</p>}
                </div>
            </div>
          </div>
        </section>

        {/* SEARCH & REGISTRY FEED */}
        <section className="lg:col-span-7 order-1 lg:order-2 space-y-6">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-2 flex gap-2 backdrop-blur-md">
            <input 
              type="text" placeholder="Search suspicious names or numbers..." 
              className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-white" 
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
            <button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-bold text-xs text-white uppercase tracking-widest">Query</button>
          </div>

          <div className="space-y-4">
            {results.length > 0 ? results.map((r) => (
              <div key={r.id} className="bg-white/[0.02] border border-white/5 p-6 rounded-[32px] hover:bg-white/[0.04] transition-all">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-mono font-bold text-red-500 tracking-tighter">{r.target}</h3>
                  <span className="text-[9px] font-black bg-white/5 px-3 py-1 rounded-full uppercase border border-white/5">{r.category}</span>
                </div>
                {r.scammer_name && <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Alias: {r.scammer_name}</p>}
                <p className="text-slate-400 text-sm italic leading-relaxed">"{r.details}"</p>
                {r.image_url && <img src={r.image_url} alt="Proof" className="mt-4 rounded-2xl border border-white/5 max-h-48 w-full object-cover" />}
              </div>
            )) : (
              <div className="py-20 text-center border-2 border-dashed border-white/[0.03] rounded-[32px]">
                <p className="text-slate-700 text-xs font-bold uppercase tracking-widest italic">ScamBud Registry is ready to scan.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="max-w-6xl mx-auto px-4 py-10 mt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-slate-600 tracking-widest uppercase">
        <p>© 2026 SCAMBUD PROTOCOL</p>
        <div className="flex gap-8">
          <a href="/terms" className="hover:text-red-500 transition-colors">Terms of Service</a>
          <a href="/privacy" className="hover:text-red-500 transition-colors">Privacy Policy</a>
        </div>
      </footer>
    </div>
  )
}