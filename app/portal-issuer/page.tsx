"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function PortalIssuer() {
    const [issuerKey, setIssuerKey] = useState<string | null>(null);
    const [showKeyModal, setShowKeyModal] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        university: "",
        degree: "",
        type: "",
        gpa: "",
        birthdate: ""
    });
    const [isIssuing, setIsIssuing] = useState(false);
    
    // Registration State
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
    const [regName, setRegName] = useState("");
    const [regPrefix, setRegPrefix] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);

    // Dynamic Context
    const [issuerContext, setIssuerContext] = useState<{name: string, did: string, statusListUrl: string} | null>(null);

    useEffect(() => {
        const savedKey = sessionStorage.getItem("nova26_issuer_key");
        const savedCtx = sessionStorage.getItem("nova26_issuer_ctx");
        if (savedKey && savedCtx) {
            const ctx = JSON.parse(savedCtx);
            setIssuerKey(savedKey);
            setIssuerContext(ctx);
            setFormData(prev => ({ ...prev, university: ctx.name }));
            setShowKeyModal(false);
        }
    }, []);

    const deriveIssuerContext = async (privKeyText: string) => {
        try {
            const b64 = privKeyText.replace(/(-----(BEGIN|END).*?-----)/g, '').replace(/\s+/g, '');
            const der = Uint8Array.from(atob(b64), c => c.charCodeAt(0)).buffer;
            const privKey = await crypto.subtle.importKey(
                "pkcs8", der, { name: "Ed25519" }, false, ["sign"]
            );
            
            const msg = new TextEncoder().encode("nova26-auth");
            const signature = await crypto.subtle.sign("Ed25519", privKey, msg);

            const res = await fetch('/registry.json');
            const registry = await res.json();

            for (const pubKeyB64 of Object.keys(registry)) {
                try {
                    const pubDer = Uint8Array.from(atob(pubKeyB64), c => c.charCodeAt(0)).buffer;
                    const pubKey = await crypto.subtle.importKey(
                        "spki", pubDer, { name: "Ed25519" }, false, ["verify"]
                    );
                    const isValid = await crypto.subtle.verify("Ed25519", pubKey, signature, msg);
                    if (isValid) {
                        return registry[pubKeyB64];
                    }
                } catch(e) {}
            }
            return null;
        } catch(e) {
            console.error("Key import failed", e);
            return null;
        }
    };

    const handleKeyUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (res) => {
                const keyText = res.target?.result as string;
                const ctx = await deriveIssuerContext(keyText);
                if (ctx) {
                    setIssuerKey(keyText);
                    setIssuerContext(ctx);
                    setFormData(prev => ({ ...prev, university: ctx.name }));
                    sessionStorage.setItem("nova26_issuer_key", keyText);
                    sessionStorage.setItem("nova26_issuer_ctx", JSON.stringify(ctx));
                    setShowKeyModal(false);
                } else {
                    alert("Unregistered Key. Please register your institution first.");
                }
            };
            reader.readAsText(file);
        }
    };

    const handleRegistration = async () => {
        if (!regName || !regPrefix) return;
        setIsRegistering(true);
        try {
            const keyPair = await crypto.subtle.generateKey(
                { name: "Ed25519" },
                true,
                ["sign", "verify"]
            ) as CryptoKeyPair;

            // Export Private Key to PKCS8
            const privKeyBuffer = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
            const privKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(privKeyBuffer)));
            const privKeyPem = `-----BEGIN PRIVATE KEY-----\n${privKeyBase64.match(/.{1,64}/g)?.join('\n')}\n-----END PRIVATE KEY-----`;

            // Export Public Key to SPKI for Registry
            const pubKeyBuffer = await crypto.subtle.exportKey("spki", keyPair.publicKey);
            const pubKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(pubKeyBuffer)));

            // Trigger Private Key Download
            const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(privKeyPem);
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", `${regPrefix}-private-key.pem`);
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();

            // Provision via API
            const res = await fetch('/api/register-institution', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: regName,
                    prefix: regPrefix,
                    publicKeyBase64: pubKeyBase64
                })
            });

            if (res.ok) {
                alert("Institution Registered Successfully. Please log in with your new Private Key.");
                setAuthMode('login');
                setRegName("");
                setRegPrefix("");
            } else {
                alert("Registration failed. Please check the backend.");
            }
        } catch (error) {
            console.error("Registration error:", error);
            alert("An error occurred during registration.");
        } finally {
            setIsRegistering(false);
        }
    };

    // --- ECDSA-SD-2023 CORE ENGINE (JCS + SHA-256) ---


    const canonicalize = (obj: any): string => {
        if (typeof obj !== 'object' || obj === null) return JSON.stringify(obj);
        if (Array.isArray(obj)) return `[${obj.map(canonicalize).join(',')}]`;
        const keys = Object.keys(obj).sort();
        const parts = keys.map(k => `${JSON.stringify(k)}:${canonicalize(obj[k])}`);
        return `{${parts.join(',')}}`;
    };

    const sha256 = async (message: string) => {
        const msgUint8 = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    };

    const generateSignature = async (payloadStr: string, keyPem: string) => {
        try {
            const b64 = keyPem.replace(/(-----(BEGIN|END).*?-----)/g, '').replace(/\s+/g, '');
            const der = Uint8Array.from(atob(b64), c => c.charCodeAt(0)).buffer;
            const key = await crypto.subtle.importKey(
                "pkcs8",
                der,
                { name: "Ed25519" },
                false,
                ["sign"]
            );
            const signature = await crypto.subtle.sign(
                "Ed25519",
                key,
                new TextEncoder().encode(payloadStr)
            );
            return btoa(String.fromCharCode(...new Uint8Array(signature)));
        } catch (err) {
            console.error(err);
            return null;
        }
    };

    const handleIssue = async () => {
        setIsIssuing(true);
        const studentIndex = Math.floor(1000 + Math.random() * 9000);

        const generateSalt = () => Array.from(crypto.getRandomValues(new Uint8Array(8)))
            .map(b => b.toString(16).padStart(2, '0')).join('');


        // STEP 1: Granular Claim Generation
        const claims = {
            name: { value: formData.name, salt: generateSalt(), hash: "" },
            university: { value: formData.university, salt: generateSalt(), hash: "" },
            degree: { value: formData.degree, salt: generateSalt(), hash: "" },
            type: { value: formData.type, salt: generateSalt(), hash: "" },
            gpa: { value: formData.gpa, salt: generateSalt(), hash: "" },
            birthdate: { value: formData.birthdate, salt: generateSalt(), hash: "" }
        };

        for (const key in claims) {
            const field = claims[key as keyof typeof claims];
            field.hash = await sha256(field.value + field.salt);
        }

        // Step 2: W3C Metadata
        const credentialBase = {
            "@context": [
                "https://www.w3.org/2018/credentials/v1",
                "https://nova26.id/credentials/v1"
            ],
            "id": `http://university.example.com/credentials/${studentIndex}`,
            "type": ["VerifiableCredential", "UniversityDegreeCredential"],
            "issuer": issuerContext!.did,
            "validFrom": new Date().toISOString()
        };

        // NEW: Auto-Generate Holder Wallet Keys on the fly
        const keyPair = await crypto.subtle.generateKey(
            { name: "Ed25519" },
            true,
            ["sign", "verify"]
        ) as CryptoKeyPair;

        const privKeyBuffer = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
        const privKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(privKeyBuffer)));
        const privKeyPem = `-----BEGIN PRIVATE KEY-----\n${privKeyBase64.match(/.{1,64}/g)?.join('\n')}\n-----END PRIVATE KEY-----`;

        const pubKeyBuffer = await crypto.subtle.exportKey("spki", keyPair.publicKey);
        const pubKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(pubKeyBuffer)));

        const combinedWalletFile = `-----BEGIN PUBLIC KEY BASE64-----\n${pubKeyBase64}\n-----END PUBLIC KEY BASE64-----\n\n${privKeyPem}`;

        // Step 3: ECDSA-SD Signing Payload 
        // We MUST include the same fields here that the Verifier will use to audit
        const signingPayload = {
            id: credentialBase.id,
            type: credentialBase.type,
            issuer: credentialBase.issuer,
            holderPublicKey: pubKeyBase64,
            claimHashes: Object.values(claims).map(c => c.hash)
        };

        const canonicalPayload = canonicalize(signingPayload);
        const digestStr = await sha256(canonicalPayload);

        let signatureBase64 = null;
        if (issuerKey) {
            signatureBase64 = await generateSignature(digestStr, issuerKey);
        }

        if (!signatureBase64) {
            alert("Error: Issuer Private Key missing or invalid Ed25519 PKCS8 format.");
            setIsIssuing(false);
            return;
        }

        // Step 4: Final Assembly with official Cryptosuite labels
        const credential = {
            ...credentialBase,
            "credentialSubject": {
                "id": `did:nova26:student-${studentIndex}`,
                "holderPublicKey": pubKeyBase64,
                "claims": claims
            },
            "credentialSchema": {
                "id": "https://nova26.id/schemas/university-degree-v1.json",
                "type": "JsonSchemaValidator2018"
            },
            "credentialStatus": {
                "id": `https://nova26.id/status/${issuerContext!.did.split(':').pop()}-list#${studentIndex}`,
                "type": "BitstringStatusListEntry",
                "statusPurpose": "revocation",
                "statusListIndex": `${studentIndex}`,
                "statusListCredential": issuerContext!.statusListUrl
            },
            "proof": {
                "type": "DataIntegrityProof",
                "cryptosuite": "ecdsa-sd-2023", // Official Suite Name
                "created": new Date().toISOString(),
                "proofPurpose": "assertionMethod",
                "verificationMethod": `${issuerContext!.did}#key-1`,
                "proofValue": signatureBase64
            }
        };

        setTimeout(() => {
            const firstName = formData.name.trim().split(/\s+/)[0] || "student";
            const formattedName = firstName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            
            // Download Diploma
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(credential, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", `diploma-${formattedName}.json`);
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();

            // Download Wallet Key
            const walletDataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(combinedWalletFile);
            const walletAnchor = document.createElement('a');
            walletAnchor.setAttribute("href", walletDataStr);
            walletAnchor.setAttribute("download", `wallet-${formattedName}.pem`);
            document.body.appendChild(walletAnchor);
            walletAnchor.click();
            walletAnchor.remove();

            setIsIssuing(false);
            setFormData({ name: "", university: issuerContext?.name || "", degree: "", type: "", gpa: "", birthdate: "" });
        }, 1500);
    };




    // Example Button for your UI:
    // <button onClick={() => toggleCredentialStatus(5, true)}>Revoke ID #5</button>
    if (showKeyModal) {
        return (
            <main className="min-h-screen bg-surface-container-lowest font-body pt-28 pb-12 px-8 flex flex-col items-center w-full">
                <div className="max-w-4xl w-full flex flex-col gap-12">
                    <div className="text-center space-y-4">
                        <h1 className="font-headline text-primary font-black tracking-tight text-5xl">Issuer Access</h1>
                        <p className="text-secundary text-sm max-w-2xl mx-auto">
                            Securely authenticate this node to begin issuing and cryptographically signing verifiable credentials.
                        </p>
                    </div>

                    <div className="flex gap-4 justify-center mb-4">
                        <button 
                            onClick={() => setAuthMode('login')} 
                            className={`font-bold text-sm px-6 py-2 rounded-full transition-colors ${authMode === 'login' ? 'bg-brand text-white' : 'bg-surface-container-high text-secundary hover:bg-surface-container-highest'}`}
                        >
                            Log In
                        </button>
                        <button 
                            onClick={() => setAuthMode('register')} 
                            className={`font-bold text-sm px-6 py-2 rounded-full transition-colors ${authMode === 'register' ? 'bg-brand text-white' : 'bg-surface-container-high text-secundary hover:bg-surface-container-highest'}`}
                        >
                            Register New Institution
                        </button>
                    </div>

                    {authMode === 'login' ? (
                        <div className="w-full relative group">
                            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/30 transition-all duration-500"></div>
                            <label className="relative flex flex-col items-center justify-center w-full h-80 border-2 border-dashed border-primary/50 hover:border-primary rounded-[32px] bg-surface-container/80 backdrop-blur-md cursor-pointer transition-colors overflow-hidden">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6 gap-4">
                                    <div className="p-4 bg-primary/10 rounded-full group-hover:scale-110 transition-transform duration-300">
                                        <span className="material-symbols-outlined text-primary text-5xl">key_visualizer</span>
                                    </div>
                                    <div className="text-center">
                                        <p className="mb-2 text-lg text-on-surface font-headline font-bold">Identity Required</p>
                                        <p className="text-xs text-on-surface-variant">Drop your <code className="bg-black/10 px-1 py-0.5 rounded font-mono">.pem</code> or <code className="bg-black/10 px-1 py-0.5 rounded font-mono">.key</code> file to authorize this node.</p>
                                    </div>
                                </div>
                                <input type="file" className="hidden" accept=".key,.pem" onChange={handleKeyUpload} />
                            </label>
                        </div>
                    ) : (
                        <div className="w-full relative group">
                            <div className="absolute inset-0 bg-brand/20 blur-xl rounded-full transition-all duration-500"></div>
                            <div className="relative flex flex-col w-full border-2 border-dark rounded-[32px] bg-surface-container-lowest backdrop-blur-md p-10 overflow-hidden">
                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-secundary">Institution Name</label>
                                        <input
                                            className="w-full bg-white border border-dark rounded-lg px-4 py-3 text-sm text-primary focus:outline-none focus:border-brand transition-colors"
                                            placeholder="e.g. Universitat de Barcelona"
                                            value={regName}
                                            onChange={(e) => setRegName(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-secundary">Institution Prefix</label>
                                        <input
                                            className="w-full bg-white border border-dark rounded-lg px-4 py-3 text-sm text-primary focus:outline-none focus:border-brand transition-colors"
                                            placeholder="e.g. ub"
                                            value={regPrefix}
                                            onChange={(e) => setRegPrefix(e.target.value)}
                                        />
                                    </div>
                                    
                                    <button
                                        onClick={handleRegistration}
                                        disabled={isRegistering || !regName || !regPrefix}
                                        className={`mt-4 w-full ${isRegistering ? 'bg-brand/50' : 'bg-brand'} text-white font-headline font-bold py-4 tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 rounded-xl`}
                                    >
                                        <span className="material-symbols-outlined text-lg">{isRegistering ? 'hourglass_empty' : 'vpn_key'}</span>
                                        {isRegistering ? 'GENERATING IDENTITY...' : 'GENERATE IDENTITY'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen font-body pt-10 pb-12 px-8 flex flex-col items-center bg-background w-full">
            <div className="max-w-5xl w-full flex flex-col gap-10">
                <div className="flex justify-between items-start w-full">
                    <div className="flex flex-col gap-4 text-left">
                        <h1 className="font-headline text-primary font-black tracking-tight text-4xl">Nova 26 Issuer</h1>
                        <p className="text-secundary text-sm max-w-2xl mt-1">
                            Authority Dashboard for <strong>{issuerContext ? issuerContext.did : "Unknown Identity"}</strong>. Implementing the
                            <span className="text-(var(--color-brand)) font-bold"> ecdsa-sd-2023</span> suite for high-assurance selective disclosure.
                        </p>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href="/portal-issuer/revocation" className="font-extrabold text-sm text-brand hover:underline cursor-pointer flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">gavel</span>
                            Revocation Registry
                        </Link>
                        <button
                            onClick={() => {
                                setIssuerKey(null);
                                setIssuerContext(null);
                                sessionStorage.removeItem("nova26_issuer_key");
                                sessionStorage.removeItem("nova26_issuer_ctx");
                                setShowKeyModal(true);
                            }}
                            className="font-extrabold text-sm text-red-500 hover:underline cursor-pointer flex items-center gap-1 bg-transparent border-none p-0 outline-none"
                        >
                            <span className="material-symbols-outlined text-sm">logout</span>
                            Log Out
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 w-full">
                    {/* LEFT COLUMN: FORM */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-6 bg-white border border-dark rounded-xl p-8">
                        <div className="flex items-center gap-3 border-b border-dark pb-4">
                            <span className="material-symbols-outlined text-primary">verified_user</span>
                            <h2 className="text-primary font-headline font-bold text-xl tracking-tight">Generate Credential</h2>
                        </div>

                        <div className="flex flex-col gap-4 mt-2">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-secundary">Graduate Full Name</label>
                                <input
                                    className="w-full bg-white border border-dark rounded-lg px-4 py-3 text-sm text-primary focus:outline-none focus:border-brand transition-colors"
                                    placeholder="Joseph Smith"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-secundary">University</label>
                                <input
                                    className="w-full bg-surface-container-highest border border-dark rounded-lg px-4 py-3 text-sm text-primary focus:outline-none opacity-60 cursor-not-allowed"
                                    placeholder="University Name"
                                    value={formData.university}
                                    disabled={true}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-secundary">Major/Area</label>
                                    <input
                                        className="w-full bg-white border border-dark rounded-lg px-4 py-3 text-sm text-primary focus:outline-none focus:border-brand transition-colors"
                                        placeholder="Computer Science"
                                        value={formData.degree}
                                        onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-secundary">Level</label>
                                    <input
                                        className="w-full bg-white border border-dark rounded-lg px-4 py-3 text-sm text-primary focus:outline-none focus:border-brand transition-colors"
                                        placeholder="Bachelor"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-secundary">GPA</label>
                                    <input
                                        className="w-full bg-white border border-dark rounded-lg px-4 py-3 text-sm text-primary focus:outline-none focus:border-brand transition-colors"
                                        placeholder="4.00"
                                        value={formData.gpa}
                                        onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-secundary">Date</label>
                                    <input
                                        className="w-full bg-white border border-dark rounded-lg px-4 py-3 text-sm text-primary focus:outline-none focus:border-brand transition-colors"
                                        type="date"
                                        value={formData.birthdate}
                                        onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleIssue}
                            disabled={isIssuing || !formData.name}
                            className={`mt-6 w-full ${isIssuing ? 'bg-brand/20' : 'bg-brand'} text-background font-headline font-bold py-4 tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 shadow-md`}
                        >
                            <span className="material-symbols-outlined text-lg">{isIssuing ? 'lock_reset' : 'verified_user'}</span>
                            {isIssuing ? 'CRYPTOGRAPHIC SIGNING...' : 'AUTHORIZE DIPLOMA'}
                        </button>
                    </div>

                    {/* RIGHT COLUMN: SECURITY INFO */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-8.5">
                        <div className="bg-white border border-dark rounded-xl p-8 shadow-sm">
                            <h3 className="text-primary font-headline font-bold text-md mb-4 tracking-tight">Privacy-First Architecture</h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-xs text-secundary">
                                    <span className="material-symbols-outlined text-brand text-2xl">shield_locked</span>
                                    <span>By using <strong>ecdsa-sd-2023</strong>, we ensure that individual claim fingerprints are signed.
                                        This allows the Holder to present only necessary data without invalidating the
                                        University's master signature.</span>
                                </li>
                            </ul>
                        </div>
                        <div className="bg-white border border-dark rounded-xl p-8 shadow-sm">
                            <h3 className="text-primary font-headline font-bold text-md mb-4 tracking-tight">Deterministic Serialization</h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-xs text-secundary">
                                    <span className="material-symbols-outlined text-brand text-2xl">inventory_2</span>
                                    <span><strong>JCS Canonicalization:</strong> Guarantees that regardless of the operating system, JSON properties are universally alphabetized and stripped of spaces. This ensures the cryptographic hashing engines always produce mathematically identical results during verification.</span>
                                </li>
                            </ul>
                        </div>
                        <div className="bg-white border border-dark rounded-xl p-8 shadow-sm">
                            <h3 className="text-primary font-headline font-bold text-md mb-4 tracking-tight">Certificate Revocation List</h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-xs text-secundary">
                                    <span className="material-symbols-outlined text-brand text-2xl">vpn_key</span>
                                    <span><strong>Bitstring Status:</strong> Embeds an anonymous index pointer inside the credential. This allows Verifiers to check revocation status instantly against a public zero-knowledge dataset without ever having to ping or notify the University.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}