"use client";

import { useState, useEffect } from "react";

// Types to keep our selective disclosure strictly typed
type ClaimKey = "name" | "university" | "degree" | "type" | "gpa" | "birthdate";

export default function WalletHolder() {
    const [holderKey, setHolderKey] = useState<string>("");
    const [holderPubKey, setHolderPubKey] = useState<string>("");
    const [showKeyModal, setShowKeyModal] = useState(true);
    const [diploma, setDiploma] = useState<any>(null);
    const [selectedClaims, setSelectedClaims] = useState<Record<ClaimKey, boolean>>({
        name: true,
        university: true,
        degree: true,
        type: true,
        gpa: false,
        birthdate: false,
    });
    // Persistence of the holder key on the browser
    useEffect(() => {
        const savedKey = sessionStorage.getItem("nova26_holder_key");
        const savedPubKey = sessionStorage.getItem("nova26_holder_pub");
        if (savedKey) {
            setHolderKey(savedKey);
            if (savedPubKey) setHolderPubKey(savedPubKey);
            setShowKeyModal(false);
        }
    }, []);

    // Upload holder key
    const handleKeyUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (res) => {
                const keyText = res.target?.result as string;
                setHolderKey(keyText);
                
                // Extract embedded public key if available
                const pubKeyMatch = keyText.match(/-----BEGIN PUBLIC KEY BASE64-----[\r\n]+([a-zA-Z0-9+/=]+)[\r\n]+-----END PUBLIC KEY BASE64-----/);
                const pubKey = pubKeyMatch ? pubKeyMatch[1] : "";
                if (pubKey) setHolderPubKey(pubKey);

                sessionStorage.setItem("nova26_holder_key", keyText);
                sessionStorage.setItem("nova26_holder_pub", pubKey);
                setShowKeyModal(false);
            };
            reader.readAsText(file);
        }
    };



    // Upload diploma 
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (res) => {
                try {
                    const json = JSON.parse(res.target?.result as string);
                    setDiploma(json);
                } catch (err) {
                    alert("Invalid JSON file.");
                }
            };
            reader.readAsText(file);
        }
    };

    const toggleClaim = (claim: ClaimKey) => {
        setSelectedClaims(prev => ({ ...prev, [claim]: !prev[claim] }));
    };

    // STEP 1: Hashing function
    const sha256 = async (message: string) => {
        const msgUint8 = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    };

    // STEP 2: Canonicalization function
    const canonicalize = (obj: any): string => {
        if (typeof obj !== 'object' || obj === null) return JSON.stringify(obj);
        if (Array.isArray(obj)) return `[${obj.map(canonicalize).join(',')}]`;
        const keys = Object.keys(obj).sort();
        const parts = keys.map(k => `${JSON.stringify(k)}:${canonicalize(obj[k])}`);
        return `{${parts.join(',')}}`;
    };

    // STEP 3: Generate signature
    const generateSignature = async (payloadStr: string, keyPem: string) => {
        try {
            // Only extract the PRIVATE KEY block, ignoring the embedded PUBLIC KEY
            const privMatch = keyPem.match(/-----BEGIN PRIVATE KEY-----\n([\s\S]*?)\n-----END PRIVATE KEY-----/);
            const rawB64 = privMatch ? privMatch[1] : keyPem; // fallback to full replacement if old format
            const b64 = rawB64.replace(/(-----(BEGIN|END).*?-----)/g, '').replace(/\s+/g, '');
            const der = Uint8Array.from(atob(b64), c => c.charCodeAt(0)).buffer;
            const key = await crypto.subtle.importKey("pkcs8", der, { name: "Ed25519" }, false, ["sign"]);
            const signature = await crypto.subtle.sign("Ed25519", key, new TextEncoder().encode(payloadStr));
            return btoa(String.fromCharCode(...new Uint8Array(signature)));
        } catch (err) {
            console.error("Error signing:", err);
            return null;
        }
    };

    // The Core SD-Logic: Value + salt for revealed claims, hash for hidden claims
    const computeSDClaims = () => {
        if (!diploma) return {};
        const result: Record<string, any> = {};
        const sourceClaims = diploma.credentialSubject.claims;

        (Object.keys(sourceClaims) as ClaimKey[]).forEach((key) => {
            if (selectedClaims[key]) {
                result[key] = {
                    value: sourceClaims[key].value,
                    salt: sourceClaims[key].salt
                };
            } else {
                result[key] = {
                    format: "sd-hash",
                    hash: sourceClaims[key].hash
                };
            }
        });
        return result;
    };

    // STEP 4: Compute live payload
    const computeLivePayload = () => {
        if (!diploma) return null;
        return {
            "@context": ["https://www.w3.org/2018/credentials/v1"],
            "type": "VerifiablePresentation",
            "holder": diploma.credentialSubject.id,
            "verifiableCredential": [
                {
                    ...diploma,
                    "credentialSubject": {
                        "id": diploma.credentialSubject.id,
                        "holderPublicKey": diploma.credentialSubject.holderPublicKey,
                        "claims": computeSDClaims()
                    }
                }
            ]
        };
    };

    const handleDownload = async () => {
        if (!diploma || !holderKey) return;

        const basePresentation = computeLivePayload();
        if (!basePresentation) return;

        const canonicalVp = canonicalize(basePresentation);
        const vpDigestStr = await sha256(canonicalVp);
        const holderStamp = await generateSignature(vpDigestStr, holderKey);

        const presentation: any = {
            ...basePresentation,
            "proof": {
                "type": "DataIntegrityProof",
                "cryptosuite": "ecdsa-sd-2023",
                "created": new Date().toISOString(),
                "proofPurpose": "authentication",
                "challenge": "xyz-987-abc",
                "proofValue": holderStamp
            }
        };

        if (holderPubKey) {
            presentation.proof.publicKeyBase64 = holderPubKey;
        }

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(presentation, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `verifiable_presentation.json`);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    if (!diploma) {
        return (
            <main className="min-h-screen bg-surface-container-lowest font-body pt-28 pb-12 px-8 flex flex-col items-center w-full">
                <div className="max-w-4xl w-full flex flex-col gap-12">
                    <div className="text-center space-y-4">
                        <h1 className="font-headline text-primary font-black tracking-tight text-5xl">Digital Wallet Access</h1>
                        <p className="text-secundary text-sm max-w-2xl mx-auto">
                            Securely unlock your credentials to choose what information you'd like to selectively disclose.
                        </p>
                    </div>

                    <div className="w-full relative group">
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/30 transition-all duration-500"></div>
                        <label className="relative flex flex-col items-center justify-center w-full h-80 border-2 border-dashed border-primary/50 hover:border-primary rounded-[32px] bg-surface-container/80 backdrop-blur-md cursor-pointer transition-colors overflow-hidden">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6 gap-4">
                                <div className="p-4 bg-primary/10 rounded-full group-hover:scale-110 transition-transform duration-300">
                                    <span className="material-symbols-outlined text-primary text-5xl">account_balance_wallet</span>
                                </div>
                                <div className="text-center">
                                    <p className="mb-2 text-lg text-on-surface font-headline font-bold">Open Your Nova 26 Wallet</p>
                                    <p className="text-xs text-on-surface-variant">Upload your <code className="bg-black/10 px-1 py-0.5 rounded font-mono">diploma.json</code> to begin selective disclosure.</p>
                                </div>
                            </div>
                            <input type="file" className="hidden" accept=".json" onChange={handleFileUpload} />
                        </label>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-surface-container-lowest font-body pt-10 pb-12 px-8 flex flex-col gap-10 w-full">
            {/* Header */}
            <div className="border-x-20 border-transparent w-full">
                <h1 className="font-headline text-primary font-black tracking-tight text-4xl">Your Nova 26 Wallet</h1>
                <div className="flex flex-col md:flex-row justify-between items-end gap-4 w-full">
                    <div className="w-full md:w-11/12 flex justify-between items-end">
                        <p className="text-secundary text-sm mt-4 ">
                            Choose exactly which fields from your University Diploma you wish to share with this Verifier. <br />
                            Unselected fields remain cryptographically hidden, ensuring minimal data exposure while retaining rigorous mathematical proof of authenticity.
                        </p>
                    </div>
                    <div className="w-full md:w-1/12 flex justify-end items-end">
                        <button onClick={() => setDiploma(null)} className="font-extrabold text-sm text-brand hover:underline cursor-pointer">Switch Credential</button>
                    </div>
                </div>
            </div>

            {/* Panels Container */}
            <div className="flex flex-col md:flex-row gap-6 w-full">
                {/* Left side: Selector Panel */}
                <div className="w-full md:w-4/12 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-light flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                        </div>
                        <h2 className="text-xs font-label uppercase tracking-[0.2em] text-primary">Available Claims</h2>
                    </div>
                    {/* All Claims */}
                    <div className="bg-white rounded-xl p-6 border border-dark flex flex-col gap-4">
                        {(Object.keys(diploma.credentialSubject.claims) as ClaimKey[]).map((key) => {
                            const isSelected = selectedClaims[key];
                            return (
                                <div key={key} className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-300 ${isSelected ? 'bg-primary/10 border-dark' : 'bg-white border-light hover:border-dark'}`}>
                                    {/* Each claim */}
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-lg border transition-colors duration-300 ${isSelected ? 'bg-primary/10 border-transparent text-primary' : 'bg-surface-container-high border-light text-secundary'}`}>
                                            <span className="material-symbols-outlined">{key === 'gpa' ? 'grade' : key === 'university' ? 'account_balance' : key === 'degree' ? 'school' : key === 'birthdate' ? 'calendar_month' : 'person'}</span>
                                        </div>
                                        {/* Claim Key */}
                                        <div>
                                            {/*Claim key */}
                                            <h3 className={`font-headline font-bold text-sm tracking-wide transition-colors uppercase ${isSelected ? 'text-primary' : 'text-secundary'}`}>
                                                {key}
                                            </h3>
                                            {/*Claim value */}
                                            <p className={`text-xs max-w-[200px] truncate opacity-80 ${isSelected ? 'text-secundary' : 'text-slate-400 italic'}`} title={isSelected ? diploma.credentialSubject.claims[key].value : 'Private'}>
                                                {isSelected ? diploma.credentialSubject.claims[key].value : 'Private'}
                                            </p>
                                        </div>
                                    </div>
                                    {/* Toggle Button */}
                                    <label className="relative inline-flex items-center cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={isSelected}
                                            onChange={() => toggleClaim(key)}
                                        />
                                        {/*Button itself */}
                                        <div className="w-14 h-7 bg-light border border-light peer-focus:outline-light rounded-full peer peer-checked:after:translate-x-7 peer-checked:after:border-light after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-brand"></div>
                                    </label>
                                </div>
                            )
                        })}
                    </div>

                    <div className={`mt-2 border-2 border-dashed rounded-xl p-6 transition-all text-center flex flex-col items-center justify-center ${holderKey ? 'border-green-400 bg-green-50' : 'border-[var(--color-border-dark)] bg-white hover:border-primary'}`}>
                        {holderKey ? (
                            <div className="flex flex-col items-center gap-2">
                                <span className="material-symbols-outlined text-green-500 text-3xl">check_circle</span>
                                <span className="text-sm font-bold text-green-700">Wallet Authenticated</span>
                                <button onClick={() => { setHolderKey(""); setHolderPubKey(""); sessionStorage.removeItem("nova26_holder_key"); sessionStorage.removeItem("nova26_holder_pub"); }} className="text-xs text-green-600 hover:text-green-800 underline">Remove Key</button>
                            </div>
                        ) : (
                            <label className="w-full flex flex-col items-center cursor-pointer group">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors duration-300">
                                    <span className="material-symbols-outlined text-primary">key</span>
                                </div>
                                <h3 className="font-headline font-bold text-primary mb-1 group-hover:text-brand transition-colors">Authenticate Wallet</h3>
                                <p className="text-xs text-on-surface-variant max-w-[200px]">Drop your <code className="bg-black/10 px-1 py-0.5 rounded font-mono">.pem</code> file to enable presentation signing.</p>
                                <input type="file" className="hidden" accept=".key,.pem" onChange={handleKeyUpload} />
                            </label>
                        )}
                    </div>
                    {/* Download Button */}
                    <button
                        disabled={!holderKey}
                        onClick={handleDownload}
                        className={`mt-2 w-full text-background font-headline py-5 rounded-xl text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${!holderKey ? 'bg-slate-300 opacity-50 cursor-not-allowed' : 'bg-brand hover:brightness-90'}`}
                    >
                        <span className="material-symbols-outlined">download</span>
                        Download Presentation
                    </button>
                </div>

                {/* Right side: Previews */}
                <div className="w-full md:w-8/12 flex flex-col gap-8">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-light flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary text-sm">visibility</span>
                            </div>
                            <h2 className="text-xs font-label uppercase tracking-[0.2em] text-primary">Visual Output Preview</h2>
                        </div>
                        {/* Visual output preview */}
                        <div className="w-full bg-white rounded-xl p-8 relative border border-dark transition-all duration-500 min-h-[400px]">
                            <div className="relative z-10 flex justify-between items-start mb-12">
                                <div>
                                    <span className="text-primary font-headline font-black text-2xl tracking-tighter">NOVA 26</span>
                                    <p className="text-[10px] uppercase tracking-widest text-on-surface opacity-60">Verified Credentials</p>
                                </div>
                                <div className="px-3 py-1.5 bg-light rounded-full flex items-center gap-2 border border-white/5">
                                    <span className="material-symbols-outlined text-[14px] text-success">verified_user</span>
                                    <span className="text-[10px] font-bold text-on-surface tracking-widest">VERIFIED_NODE</span>
                                </div>
                            </div>
                            {/* Visual output items */}
                            <div className="relative z-10 grid grid-cols-2 gap-y-10 gap-x-8">
                                {(Object.keys(diploma.credentialSubject.claims) as ClaimKey[]).map((key) => (
                                    <div key={key} className="flex flex-col gap-1">
                                        <span className="text-[10px] uppercase tracking-widest text-primary font-bold">{key}</span>
                                        <span className={`text-lg font-headline font-bold transition-all duration-600 ${selectedClaims[key] ? 'text-on-surface' : 'text-surface-container-highest blur-[4px] select-none scale-95 origin-left'}`}>
                                            {selectedClaims[key] ? diploma.credentialSubject.claims[key].value : 'HIDDEN FIELD'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            {/* Issuer DID */}
                            <div className="relative z-10 mt-12 pt-6 border-t border-slate-100 flex justify-between items-center opacity-60">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">verified</span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Issuer: {diploma.issuer}</span>
                                </div>
                                <div className="bg-slate-50 px-3 py-1 rounded text-[9px] font-mono tracking-widest text-slate-400">
                                    ID: {diploma.id.split('/').pop()}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cryptographic payload */}
                    <div className="flex flex-col gap-3 flex-1 min-h-[300px]">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-light flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary text-sm">code</span>
                            </div>
                            <h2 className="text-xs font-label uppercase tracking-[0.2em] text-primary">Cryptographic Payload</h2>
                        </div>
                        <div className="flex-1 bg-transparent rounded-xl p-6 border border-dark overflow-hidden max-h-[400px]">
                            <pre className="text-[10px] font-mono text-primary/60 whitespace-pre-wrap break-all custom-scrollbar overflow-y-auto h-[350px]">
                                {JSON.stringify(computeLivePayload(), null, 2)}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </main >
    );
}