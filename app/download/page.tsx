export default function Download() {
  return (
    <div className="bg-slate-50 min-h-[90vh] text-slate-900 font-display transition-colors duration-300 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand/5 blur-[120px] animate-[pulse_8s_ease-in-out_infinite]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/5 blur-[100px] animate-[pulse_10s_ease-in-out_infinite_reverse]"></div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .glass-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }
      `}} />
      <div className="relative flex min-h-screen w-full flex-col z-10 pt-20">
        <div className="layout-container flex h-full grow flex-col">

          {/* Main Content Section */}
          <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 md:py-24">
            <div className="max-w-5xl w-full flex flex-col items-center text-center animate-fade-in-up">
              <div className="mb-8 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <span className="material-symbols-outlined text-6xl text-brand drop-shadow-sm">verified_user</span>
              </div>
              
              <h1 className="text-transparent bg-clip-text bg-gradient-to-b from-slate-900 to-slate-600 text-5xl md:text-7xl font-black leading-tight tracking-tighter mb-6 drop-shadow-sm">
                Get Your Sovereign Wallet
              </h1>
              <p className="text-slate-600 text-lg md:text-2xl max-w-3xl leading-relaxed mb-16 font-light">
                For security and true data ownership, the Nova 26 wallet is a standalone edge application. Your academic credentials <strong className="text-slate-900 font-medium">never leave your control</strong>.
              </p>

              {/* Download Buttons Area */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl relative">
                
                {/* Windows Download */}
                <div className="glass-card p-10 rounded-3xl flex flex-col items-center text-center hover:border-brand/30 transition-all duration-500 cursor-pointer group shadow-lg hover:shadow-[0_20px_50px_-10px_rgba(67,56,202,0.15)] hover:-translate-y-2">
                  <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 group-hover:bg-brand/10 border border-slate-200">
                    <span className="material-symbols-outlined text-5xl text-slate-400 group-hover:text-brand transition-colors">window</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-2 text-slate-900 tracking-tight">Windows</h3>
                  <p className="text-sm text-slate-500 mb-8 font-mono bg-slate-100 px-3 py-1 rounded-full">v2.4.1 • .exe</p>
                  
                  <button className="w-full bg-slate-900 text-white hover:bg-brand hover:text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 transform group-hover:scale-[1.02] active:scale-95 text-lg shadow-md">
                    <span className="material-symbols-outlined">download</span>
                    Download for Windows
                  </button>
                </div>

                {/* MacOS Download */}
                <div className="glass-card p-10 rounded-3xl flex flex-col items-center text-center hover:border-brand/30 transition-all duration-500 cursor-pointer group shadow-lg hover:shadow-[0_20px_50px_-10px_rgba(67,56,202,0.15)] hover:-translate-y-2">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-bl-[100%] -z-10 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 group-hover:bg-brand/10 border border-slate-200 relative z-10">
                    <span className="material-symbols-outlined text-5xl text-slate-400 group-hover:text-brand transition-colors">laptop_mac</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-2 text-slate-900 tracking-tight">macOS</h3>
                  <p className="text-sm text-slate-500 mb-8 font-mono bg-slate-100 px-3 py-1 rounded-full">v2.4.1 • .dmg</p>
                  
                  <button className="w-full bg-brand hover:bg-[#312e81] text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 transform group-hover:scale-[1.02] active:scale-95 text-lg shadow-md relative overflow-hidden">
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
                    <span className="material-symbols-outlined relative z-10">download</span>
                    <span className="relative z-10">Download for macOS</span>
                  </button>
                </div>
              </div>

              <div className="mt-20 flex flex-col items-center gap-6">
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Other platforms coming soon</p>
                <div className="flex gap-8 opacity-40">
                  <span className="material-symbols-outlined text-3xl hover:opacity-100 hover:text-slate-900 transition-all cursor-not-allowed" title="Linux">terminal</span>
                  <span className="material-symbols-outlined text-3xl hover:opacity-100 hover:text-slate-900 transition-all cursor-not-allowed" title="iOS">phone_iphone</span>
                  <span className="material-symbols-outlined text-3xl hover:opacity-100 hover:text-slate-900 transition-all cursor-not-allowed" title="Android">ad_units</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}