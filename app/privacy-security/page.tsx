export default function PrivacySecurity() {
    return (
        <div className="bg-slate-50 min-h-screen text-slate-900 antialiased font-display relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-[10%] left-[-20%] w-[60%] h-[60%] rounded-full bg-brand/5 blur-[150px] animate-[pulse_10s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/5 blur-[120px] animate-[pulse_12s_ease-in-out_infinite_reverse]"></div>

            <style dangerouslySetInnerHTML={{
                __html: `
            .glass-panel {
                background: rgba(255, 255, 255, 0.9);
                backdrop-filter: blur(16px);
                border: 1px solid rgba(0, 0, 0, 0.05);
            }
        ` }} />
            <main className="flex-grow relative z-10">
            <section className="relative overflow-hidden pt-32 pb-16 lg:pt-40 lg:pb-24 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="flex flex-col gap-8 animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-bold uppercase tracking-widest w-fit shadow-sm">
                            <span className="flex h-2 w-2 rounded-full bg-brand animate-ping"></span>
                            Institutional Integrity
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-slate-900 to-slate-600 leading-[1.1] tracking-tighter drop-shadow-sm">
                            Privacy &amp; <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand to-blue-600">Trust</span>
                        </h1>
                        <p className="text-lg lg:text-2xl text-slate-600 leading-relaxed max-w-xl font-light">
                            Institutional integrity meets student data sovereignty. Nova 26 ensures your academic credentials are secure, verifiable, and entirely under your control.
                        </p>
                        <div className="flex flex-wrap gap-6 pt-4">
                            <button className="flex items-center justify-center rounded-2xl px-8 h-14 bg-primary text-white text-base font-black hover:scale-105 transition-all shadow-md">
                                View Whitepaper
                            </button>
                            <button className="flex items-center justify-center rounded-2xl px-8 h-14 border border-slate-300 text-slate-900 text-base font-bold hover:bg-slate-100 transition-all backdrop-blur-sm">
                                Technical Audit
                            </button>
                        </div>
                    </div>
                    <div className="relative group animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                        <div className="absolute -inset-1 bg-gradient-to-r from-brand to-blue-500 rounded-3xl blur opacity-10 group-hover:opacity-30 transition duration-1000 group-hover:duration-500"></div>
                        <div className="relative glass-panel rounded-3xl overflow-hidden shadow-xl p-2 border border-slate-200">
                            <div className="w-full aspect-video bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200 overflow-hidden relative">
                                <div className="absolute inset-0 bg-blue-100/50 mix-blend-overlay"></div>
                                <img alt="Secure Server Room" className="w-full h-full object-cover opacity-80 mix-blend-multiply filter contrast-125" data-alt="Modern server room with blue lighting representing security" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRagiDgh5Yzd7BLQy4xt-irKYX1AzfOUNyEwQZu4SnqHiCE27S9-l87knvtIb9TPiBTjF0yZ58SKNBV24dlAnThTfMPRePVPoQiF3YuialxClQsk581JODSCRHjuxCZU5QSg1KIfxAKfN_l9XC9JfCJreI7qVNM0dBFeFp2HR42j14kuHzsjRZ7BWP_bziBxTMddhiZ61sgL0eHsObWoXHkPHqqLThXI4XXAP12Fc9AYe_qyxbMT_imt8k8NVk_pVkCA8p9majgDVF" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-32 bg-transparent relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row gap-16 items-start">
                        <div className="md:w-1/3 sticky top-32">
                            <div className="p-5 rounded-3xl bg-blue-50 border border-blue-100 inline-block mb-8 shadow-sm">
                                <span className="material-symbols-outlined text-blue-600 text-5xl">shield_person</span>
                            </div>
                            <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">GDPR Compliance &amp; Protection</h2>
                            <p className="text-xl text-slate-600 leading-relaxed font-light">
                                Our protocol is designed from the ground up to respect EU data protection laws and international privacy frameworks, balancing transparency with individual rights.
                            </p>
                        </div>
                        <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="p-10 glass-panel rounded-3xl hover:border-brand/30 hover:bg-brand/5 hover:-translate-y-1 transition-all duration-300 shadow-sm">
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">EU-GDPR Alignment</h3>
                                <p className="text-base text-slate-600 leading-relaxed">
                                    Leveraging advanced cryptographic proofs to ensure compliance while maintaining the transparency of the blockchain ledger.
                                </p>
                            </div>
                            <div className="p-10 glass-panel rounded-3xl hover:border-brand/30 hover:bg-brand/5 hover:-translate-y-1 transition-all duration-300 shadow-sm">
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Data Residency</h3>
                                <p className="text-base text-slate-600 leading-relaxed">
                                    Encrypted PII remains in localized off-chain storage, ensuring data never leaves approved jurisdictions.
                                </p>
                            </div>
                            <div className="p-10 glass-panel rounded-3xl hover:border-brand/30 hover:bg-brand/5 hover:-translate-y-1 transition-all duration-300 shadow-sm">
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Encryption at Rest</h3>
                                <p className="text-base text-slate-600 leading-relaxed">
                                    All institutional records are encrypted using AES-256 before being indexed by the Nova 26 protocol.
                                </p>
                            </div>
                            <div className="p-10 glass-panel rounded-3xl hover:border-brand/30 hover:bg-brand/5 hover:-translate-y-1 transition-all duration-300 shadow-sm">
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Zero-Knowledge Proofs</h3>
                                <p className="text-base text-slate-600 leading-relaxed">
                                    Verify credentials without revealing the underlying sensitive data, fulfilling the 'data minimization' principle of the GDPR.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-32 border-y border-slate-200 relative overflow-hidden bg-white">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center mb-20 relative z-10">
                    <div className="p-5 rounded-3xl bg-slate-100 border border-slate-200 inline-block mb-8">
                        <span className="material-symbols-outlined text-slate-600 text-5xl">link_off</span>
                    </div>
                    <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">The Right to be Forgotten</h2>
                    <p className="text-xl text-slate-600 max-w-3xl leading-relaxed font-light">
                        Addressing the immutability paradox. We've pioneered a dual-layer architecture that allows for permanent deletion of academic records while maintaining the integrity of the blockchain.
                    </p>
                </div>
                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="flex flex-col gap-6 relative group">
                            <div className="text-brand font-black text-7xl opacity-10 group-hover:opacity-20 transition-opacity duration-300 -ml-2">01</div>
                            <h4 className="text-2xl font-bold text-slate-900">Salting &amp; Hashing</h4>
                            <p className="text-slate-600 text-lg leading-relaxed">Records are hashed with unique salts. Only the hash is stored on-chain, acting as a cryptographic fingerprint that contains no readable data.</p>
                        </div>
                        <div className="flex flex-col gap-6 relative group">
                            <div className="text-brand font-black text-7xl opacity-10 group-hover:opacity-20 transition-opacity duration-300 -ml-2">02</div>
                            <h4 className="text-2xl font-bold text-slate-900">Off-Chain Purging</h4>
                            <p className="text-slate-600 text-lg leading-relaxed">When a "deletion" is requested, the off-chain data and the salts are permanently shredded from our secure institutional nodes.</p>
                        </div>
                        <div className="flex flex-col gap-6 relative group">
                            <div className="text-brand font-black text-7xl opacity-10 group-hover:opacity-20 transition-opacity duration-300 -ml-2">03</div>
                            <h4 className="text-2xl font-bold text-slate-900">Orphaned Hashes</h4>
                            <p className="text-slate-600 text-lg leading-relaxed">The on-chain hash remains but becomes mathematically impossible to reverse-engineer or link back to an individual, effectively "forgetting" the data.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-32">
                <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-20">
                    <div className="lg:w-1/2 relative group">
                        <div className="absolute -inset-2 bg-gradient-to-br from-brand to-purple-400 rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-500"></div>
                        <img alt="Biometric Security" className="rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-full relative z-10 border border-slate-200 filter contrast-100" data-alt="Digital representation of a secure lock and user access" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYXKUo9yfhoQks8BNr3Hc-esQG-iq8UWErsEZTW-X8rEO_T8tRs6EjYcd2vRUxQmfuwOPavENacD0JRaR62puuuM6OOuIVey03pidCNtvllzSorheo_Tn_n2BUKxk0mm8ic2UhZNFVdjdJH-JgQEOj9SJLP6K3TMasOeVlkVeaS7_o_rORR2sffsSy_WsP_G2ag14ogHt3TdZC-tBjJKa5_Bu-uefY-mnATVvTrmoG0EaGEM0DbDdnrMdk-_0k62Vc8HJ93txpqksy" />
                    </div>
                    <div className="lg:w-1/2 flex flex-col gap-8">
                        <div className="p-5 rounded-3xl bg-purple-50 border border-purple-100 inline-block w-fit shadow-sm">
                            <span className="material-symbols-outlined text-purple-600 text-5xl">lock_person</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">Self-Sovereign Identity</h2>
                        <p className="text-xl text-slate-600 leading-relaxed font-light">
                            In the Nova 26 ecosystem, users are the sole custodians of their academic history. No central authority holds a "master key" to your accomplishments.
                        </p>
                        <ul className="space-y-8 mt-4">
                            <li className="flex items-start gap-5">
                                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mt-1 shrink-0 text-brand shadow-inner">
                                    <span className="material-symbols-outlined text-xl">check</span>
                                </div>
                                <div>
                                    <span className="font-bold text-xl text-slate-900 block mb-2">Zero Central Storage</span>
                                    <p className="text-base text-slate-600 leading-relaxed">Your certificates exist in your private digital wallet, not a central database prone to breaches.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-5">
                                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mt-1 shrink-0 text-brand shadow-inner">
                                    <span className="material-symbols-outlined text-xl">check</span>
                                </div>
                                <div>
                                    <span className="font-bold text-xl text-slate-900 block mb-2">Granular Permissions</span>
                                    <p className="text-base text-slate-600 leading-relaxed">Choose exactly who sees your data, for how long, and which specific credentials you wish to share.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-5">
                                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mt-1 shrink-0 text-brand shadow-inner">
                                    <span className="material-symbols-outlined text-xl">check</span>
                                </div>
                                <div>
                                    <span className="font-bold text-xl text-slate-900 block mb-2">Instant Portability</span>
                                    <p className="text-base text-slate-600 leading-relaxed">Take your verified credentials across borders and institutions without needing secondary validation.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
            </main>
        </div>
    );
}
