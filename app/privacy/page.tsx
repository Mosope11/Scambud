export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-300 p-8 md:p-20 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Privacy <span className="text-red-500">Policy</span></h1>
        
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white uppercase tracking-widest text-sm">1. Data Collection</h2>
          <p className="text-sm leading-relaxed">We collect your Google profile information (Name, Email, Profile Picture) via Supabase Auth to prevent spam and ensure accountability for reports.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white uppercase tracking-widest text-sm">2. Use of Information</h2>
          <p className="text-sm leading-relaxed">Your User ID is linked to your reports so we can moderate the platform. We do not share your personal email publicly on the registry unless need be.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white uppercase tracking-widest text-sm">3. Cookies</h2>
          <p className="text-sm leading-relaxed">We use cookies purely for authentication sessions to keep you logged into the platform.</p>
        </section>

        <a href="/" className="inline-block text-xs font-black text-red-500 hover:text-white transition-colors uppercase tracking-widest mt-10">← Return to Dashboard</a>
      </div>
    </div>
  )
}