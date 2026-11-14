export default function HolderGuide() {
    return (
        <div className="bg-slate-50 min-h-[90vh] text-slate-900 font-display transition-colors duration-300 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand/5 blur-[120px] animate-[pulse_8s_ease-in-out_infinite]"></div>
            
            <main className="max-w-5xl mx-auto px-6 py-32 relative z-10 animate-fade-in-up">
                <div className="text-center mb-20">
                    <h1 className="text-transparent bg-clip-text bg-gradient-to-b from-slate-900 to-slate-600 text-5xl md:text-7xl font-black mb-6 tracking-tighter drop-shadow-sm">How to Use Nova 26</h1>
                    <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
                        Welcome to your sovereign academic identity. Here is a step-by-step guide on how to securely manage and share your verified credentials.
                    </p>
                </div>
                
                <div className="space-y-12">
                    {/* Step 1 */}
                    <section className="bg-white border border-slate-200 p-10 rounded-3xl shadow-sm hover:shadow-[0_20px_50px_-10px_rgba(67,56,202,0.15)] hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-brand to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="w-16 h-16 rounded-2xl bg-brand/10 text-brand flex items-center justify-center font-black text-2xl border border-brand/20 shadow-inner flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                                1
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Create Your Wallet</h2>
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    Download the wallet app and generate your <strong className="text-slate-900">Ed25519 cryptographic keys</strong> locally. Your private key never leaves your device. This establishes your Decentralized Identifier (DID) which you will use to receive credentials.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Step 2 */}
                    <section className="bg-white border border-slate-200 p-10 rounded-3xl shadow-sm hover:shadow-[0_20px_50px_-10px_rgba(59,130,246,0.15)] hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-black text-2xl border border-blue-500/20 shadow-inner flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                                2
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Receive Credentials</h2>
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    Share your public DID with your university (Issuer). They will cryptographically sign your academic transcript and issue it directly to your wallet. Once received, the credential is mathematically verifiable.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Step 3 */}
                    <section className="bg-white border border-slate-200 p-10 rounded-3xl shadow-sm hover:shadow-[0_20px_50px_-10px_rgba(168,85,247,0.15)] hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-black text-2xl border border-purple-500/20 shadow-inner flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                                3
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Selective Disclosure</h2>
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    When a recruiter requests verification, you don't need to send your entire transcript. Using <strong className="text-slate-900">Zero-Knowledge Proofs</strong>, you can generate a tailored presentation that reveals only the required fields (e.g., Degree Type) while hiding sensitive data (e.g., GPA or Birthdate).
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Step 4 */}
                    <section className="bg-white border border-slate-200 p-10 rounded-3xl shadow-sm hover:shadow-[0_20px_50px_-10px_rgba(34,197,94,0.15)] hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-success to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="w-16 h-16 rounded-2xl bg-success/10 text-success flex items-center justify-center font-black text-2xl border border-success/20 shadow-inner flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                                4
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Share with Verifiers</h2>
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    Send the generated presentation file to the recruiter. They can instantly verify the authenticity, issuer identity, and un-tampered state of your selective claims using the Nova 26 public verification gateway.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
