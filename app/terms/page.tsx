export default function Terms() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-300 p-8 md:p-20 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Terms of <span className="text-red-500">Service</span></h1>
        
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white uppercase tracking-widest text-sm">1. Nature of Service</h2>
          <p className="text-sm leading-relaxed">ScamBud is a crowdsourced registry. We do not verify the absolute truth of every report. Data is provided "as is" for informational purposes only.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white uppercase tracking-widest text-sm">2. User Conduct</h2>
          <p className="text-sm leading-relaxed">By submitting a report, you swear that the information is accurate. False reporting or "doxing" for personal vendettas will result in a permanent ban and legal action taken agains you.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white uppercase tracking-widest text-sm">3. Liability</h2>
          <p className="text-sm leading-relaxed">ScamBud and its creators are not liable for any financial decisions, loss of data, or interactions that occur based on the information found in this registry.</p>
        </section>

        <a href="/" className="inline-block text-xs font-black text-red-500 hover:text-white transition-colors uppercase tracking-widest mt-10">← Return to Dashboard</a>
      </div>
    </div>
  )
}