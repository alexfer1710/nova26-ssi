export default function WebHubHome() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>


      {/* BEGIN: Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center text-center px-6 py-32 overflow-hidden bg-slate-50" data-purpose="hero">
        {/* Animated Background Gradients */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand/10 blur-[120px] animate-[pulse_8s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 blur-[100px] animate-[pulse_10s_ease-in-out_infinite_reverse]"></div>
        
        <div className="max-w-6xl mx-auto relative z-10 pt-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-8 backdrop-blur-sm animate-fade-in-up">
            <span className="flex h-2 w-2 rounded-full bg-success animate-ping"></span>
            <span className="text-xs font-bold tracking-widest text-primary uppercase">W3C Standard Compliant</span>
          </div>
          
          <h1 className="hero-title text-transparent bg-clip-text bg-gradient-to-b from-slate-900 via-slate-800 to-slate-600 text-6xl md:text-8xl lg:text-[7rem] font-black mb-8 tracking-tighter leading-[0.95] drop-shadow-sm">
            SOVEREIGN ACADEMIC <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand to-blue-600">ASSETS.</span>
          </h1>
          
          <p className="text-slate-600 text-xl md:text-2xl max-w-3xl mx-auto mb-14 font-light leading-relaxed">
            Transforming diplomas into liquid digital certificates, <strong className="text-slate-900 font-medium">owned by the student</strong> and cryptographically verified by institutions.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <button className="relative group bg-primary text-white px-10 py-5 rounded-full font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(67,56,202,0.4)]">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
              <span className="relative z-10 flex items-center gap-2">Join the program <span className="material-symbols-outlined text-lg">arrow_forward</span></span>
            </button>
            <button className="flex items-center gap-4 text-slate-800 font-bold text-lg group hover:text-brand transition-colors">
              <div className="w-14 h-14 rounded-full border border-slate-300 flex items-center justify-center group-hover:border-brand group-hover:bg-brand/10 transition-all shadow-sm group-hover:shadow-[0_0_15px_rgba(67,56,202,0.2)]">
                <span className="material-symbols-outlined text-3xl ml-1 group-hover:scale-110 transition-transform">play_arrow</span>
              </div>
              See how it works
            </button>
          </div>
        </div>
        
        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      </section>
      {/* END: Hero Section */}

      {/* BEGIN: Partner Footer */}
      <footer className="bg-white border-t border-gray-100 pt-12 pb-20" data-purpose="main-footer">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-gray-400 text-sm font-bold uppercase tracking-widest mb-10">Global Partner Institutions</p>
          {/* Logo Cloud */}
          <div className="flex flex-wrap items-center justify-center gap-12 grayscale opacity-60 hover:opacity-100 transition-opacity">
            {/* Spanish and Harvard University logos */}
            <div className="h-12 w-36 bg-contain bg-no-repeat bg-center" style={{ backgroundImage: 'url("/hvd-logo.svg")' }}></div>
            <div className="h-12 w-36 bg-contain bg-no-repeat bg-center" style={{ backgroundImage: 'url("/uab-logo.svg")' }}></div>
            <div className="h-12 w-36 bg-contain bg-no-repeat bg-center" style={{ backgroundImage: 'url("/upc-logo.svg")' }}></div>
            <div className="h-12 w-36 bg-contain bg-no-repeat bg-center" style={{ backgroundImage: 'url("/upm-logo.svg")' }}></div>
            <div className="h-12 w-36 bg-contain bg-no-repeat bg-center" style={{ backgroundImage: 'url("/ub-logo.svg")' }}></div>
            <div className="h-12 w-36 bg-contain bg-no-repeat bg-center" style={{ backgroundImage: 'url("/uc3m-logo.svg")' }}></div>
          </div>
          <div className="mt-20 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
            <p className="">© 2024 tfg Protocol. All rights reserved.</p>
            <div className="flex gap-8">
              <a className="hover:text-blue-600" href="#">Privacy Policy</a>
              <a className="hover:text-blue-600" href="#">Cookie Policy</a>
              <a className="hover:text-blue-600" href="#">Legal Notice</a>
            </div>
          </div>
        </div>
      </footer>
      {/* END: Partner Footer */}

      {/* BEGIN: Trust Triangle Bento Grid */}
      <section className="py-32 bg-white px-6 relative overflow-hidden" data-purpose="trust-triangle">
        {/* Subtle background grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <span className="text-brand font-bold tracking-widest uppercase text-sm mb-4 block">Ecosystem</span>
            <h2 className="text-5xl md:text-6xl font-black text-primary tracking-tighter">The Trust Triangle</h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-brand to-blue-400 mx-auto mt-8 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* The Issuer */}
            <div className="group relative bg-white p-12 rounded-[2.5rem] flex flex-col justify-between border border-gray-200 hover:border-transparent transition-all duration-500 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(67,56,202,0.3)] hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[100%] -z-10 group-hover:scale-150 transition-transform duration-700"></div>
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center mb-8 text-brand shadow-inner group-hover:scale-110 transition-transform duration-500">
                  <span className="material-symbols-outlined text-4xl">account_balance</span>
                </div>
                <h3 className="text-3xl font-black mb-4 tracking-tight text-primary">The University</h3>
                <p className="text-gray-500 leading-relaxed mb-8 text-lg font-medium">
                  Issue salted, hashed credentials that are mathematically verifiable. No more manual transcript requests.
                </p>
              </div>
              <a className="text-brand font-black tracking-widest text-sm uppercase flex items-center gap-2 group-hover:gap-4 transition-all" href="/portal-issuer">
                Go to Issuer App <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>
            
            {/* The Holder */}
            <div className="group relative bg-primary p-12 rounded-[2.5rem] flex flex-col justify-between border border-primary transition-all duration-500 shadow-xl shadow-primary/20 hover:shadow-[0_20px_50px_-10px_rgba(11,26,47,0.6)] hover:-translate-y-2 overflow-hidden">
              {/* Internal glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 text-white backdrop-blur-md border border-white/10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                  <span className="material-symbols-outlined text-4xl">fingerprint</span>
                </div>
                <h3 className="text-3xl font-black mb-4 tracking-tight text-white">The Student</h3>
                <p className="text-gray-300 leading-relaxed mb-8 text-lg font-medium">
                  Own your identity. Use Selective Disclosure to share only what you choose with potential employers.
                </p>
              </div>
              <a className="relative z-10 text-white font-black tracking-widest text-sm uppercase flex items-center gap-2 group-hover:gap-4 transition-all" href="/wallet-holder">
                Download Wallet App <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>
            
            {/* The Verifier */}
            <div className="group relative bg-white p-12 rounded-[2.5rem] flex flex-col justify-between border border-gray-200 hover:border-transparent transition-all duration-500 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(67,56,202,0.3)] hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 left-0 w-32 h-32 bg-gray-50 rounded-br-[100%] -z-10 group-hover:scale-150 transition-transform duration-700"></div>
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center mb-8 text-primary shadow-inner group-hover:scale-110 transition-transform duration-500">
                  <span className="material-symbols-outlined text-4xl">verified_user</span>
                </div>
                <h3 className="text-3xl font-black mb-4 tracking-tight text-primary">The Recruiter</h3>
                <p className="text-gray-500 leading-relaxed mb-8 text-lg font-medium">
                  Instantly validate authenticity without centralized databases or contacting institutions directly.
                </p>
              </div>
              <a className="text-primary font-black tracking-widest text-sm uppercase flex items-center gap-2 group-hover:gap-4 transition-all" href="/verify">
                Verify Now <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* END: Trust Triangle Bento Grid */}

      {/* BEGIN: How It Works */}
      <section id="how-it-works">
        <HowItWorksSection />
      </section>
      {/* END: How It Works */}
    </div>
  );
}

function HowItWorksSection() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
      <style dangerouslySetInnerHTML={{
        __html: `
            .step-line::after {
                content: '';
                position: absolute;
                left: 20px;
                top: 40px;
                bottom: -20px;
                width: 2px;
                background: repeating-linear-gradient(to bottom, #ec5b13 0, #ec5b13 4px, transparent 4px, transparent 8px);
            }
            .step-line-last::after {
                display: none;
            }
        ` }} />
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-4">The tfg Ecosystem</h2>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">Digital Credentials. <br /><span className="text-slate-500 dark:text-slate-400">Sovereign Identity.</span></h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Secure, decentralized credentialing powered by Polygon. Learn how Nova 26 transforms academic verification.
          </p>
        </div>
        {/* Vertical Step Structure */}
        <div className="space-y-12">
          {/* Step 1 */}
          <div className="relative flex gap-8 group">
            <div className="flex flex-col items-center">
              <div className="z-10 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white ring-8 ring-primary/10">
                <span className="material-symbols-outlined text-xl">school</span>
              </div>
              <div className="step-line w-full h-full relative"></div>
            </div>
            <div className="pb-12 border-b border-slate-200 dark:border-slate-800 flex-1">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                    <span className="text-primary">01.</span> Digital Issuance
                  </h3>
                  <p className="text-lg text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
                    Institutions issue cryptographically signed diplomas as <span className="font-semibold text-slate-900 dark:text-white">Verifiable Credentials (VCs)</span> anchored on the Polygon blockchain.
                  </p>
                  <div className="inline-flex items-start gap-3 p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">info</span>
                    <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                      <strong className="font-bold text-slate-900 dark:text-slate-200 not-italic">Technical Note:</strong> Utilizes DIDs (Decentralized Identifiers) for institutional identity verification.
                    </p>
                  </div>
                </div>
                <div className="w-full md:w-64 aspect-video md:aspect-square bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center border border-slate-300 dark:border-slate-700">
                  <div className="text-center p-6">
                    <span className="material-symbols-outlined text-6xl text-primary/40">apartment</span>
                    <p className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-500">Institution Node</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Step 2 */}
          <div className="relative flex gap-8 group">
            <div className="flex flex-col items-center">
              <div className="z-10 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white ring-8 ring-primary/10">
                <span className="material-symbols-outlined text-xl">devices</span>
              </div>
              <div className="step-line w-full h-full relative"></div>
            </div>
            <div className="pb-12 border-b border-slate-200 dark:border-slate-800 flex-1">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                    <span className="text-primary">02.</span> Sovereign Storage
                  </h3>
                  <p className="text-lg text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
                    Students receive and store their credentials in the <span className="font-semibold text-slate-900 dark:text-white">Nova 26 Desktop Wallet</span>. No central database holds your data—it is yours alone.
                  </p>
                  <div className="inline-flex items-start gap-3 p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">lock</span>
                    <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                      <strong className="font-bold text-slate-900 dark:text-slate-200 not-italic">Technical Note:</strong> Data is secured via Asymmetric Encryption, ensuring only the owner can access the private keys.
                    </p>
                  </div>
                </div>
                <div className="w-full md:w-64 aspect-video md:aspect-square bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center border border-slate-300 dark:border-slate-700">
                  <div className="text-center p-6">
                    <span className="material-symbols-outlined text-6xl text-primary/40">desktop_windows</span>
                    <p className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-500">Edge Storage</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Step 3 */}
          <div className="relative flex gap-8 group">
            <div className="flex flex-col items-center">
              <div className="z-10 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white ring-8 ring-primary/10">
                <span className="material-symbols-outlined text-xl">visibility_off</span>
              </div>
              <div className="step-line w-full h-full relative"></div>
            </div>
            <div className="pb-12 border-b border-slate-200 dark:border-slate-800 flex-1">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                    <span className="text-primary">03.</span> Selective Disclosure
                  </h3>
                  <p className="text-lg text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
                    When applying for jobs, share <span className="font-semibold text-slate-900 dark:text-white">only what is necessary</span> (e.g., GPA or Degree type) without revealing your full identity bundle.
                  </p>
                  <div className="inline-flex items-start gap-3 p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">shield</span>
                    <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                      <strong className="font-bold text-slate-900 dark:text-slate-200 not-italic">Technical Note:</strong> Employs Zero-Knowledge Proofs (ZKPs) to verify claims without exposing underlying data.
                    </p>
                  </div>
                </div>
                <div className="w-full md:w-64 aspect-video md:aspect-square bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center border border-slate-300 dark:border-slate-700">
                  <div className="text-center p-6">
                    <span className="material-symbols-outlined text-6xl text-primary/40">filter_alt</span>
                    <p className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-500">Privacy Layer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Step 4 */}
          <div className="relative flex gap-8 group">
            <div className="flex flex-col items-center">
              <div className="z-10 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white ring-8 ring-primary/10">
                <span className="material-symbols-outlined text-xl">verified</span>
              </div>
              <div className="step-line step-line-last w-full h-full relative"></div>
            </div>
            <div className="pb-12 flex-1">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                    <span className="text-primary">04.</span> Instant Verification
                  </h3>
                  <p className="text-lg text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
                    Recruiters verify the authenticity in seconds using our <span className="font-semibold text-slate-900 dark:text-white">Gateway</span>, confirming the math without contacting the university.
                  </p>
                  <div className="inline-flex items-start gap-3 p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">verified_user</span>
                    <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                      <strong className="font-bold text-slate-900 dark:text-slate-200 not-italic">Technical Note:</strong> Verification is performed against the blockchain anchor for immutable proof of state.
                    </p>
                  </div>
                </div>
                <div className="w-full md:w-64 aspect-video md:aspect-square bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center border border-slate-300 dark:border-slate-700">
                  <div className="text-center p-6">
                    <span className="material-symbols-outlined text-6xl text-primary/40">qr_code_scanner</span>
                    <p className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-500">Public Gateway</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Technical Architecture Recap */}
        <div className="mt-24 bg-slate-100 dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold mb-8 text-center">Protocol Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <p className="text-xs uppercase tracking-widest font-bold text-primary mb-2">Identity Layer</p>
              <p className="text-sm font-medium">Decentralized Identifiers (DIDs)</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <p className="text-xs uppercase tracking-widest font-bold text-primary mb-2">Security Protocol</p>
              <p className="text-sm font-medium">Asymmetric Encryption (RSA/ECC)</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <p className="text-xs uppercase tracking-widest font-bold text-primary mb-2">Privacy Layer</p>
              <p className="text-sm font-medium">Zero-Knowledge Proofs (ZKP)</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <p className="text-xs uppercase tracking-widest font-bold text-primary mb-2">Trust Anchor</p>
              <p className="text-sm font-medium">Polygon Blockchain (PoS)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}