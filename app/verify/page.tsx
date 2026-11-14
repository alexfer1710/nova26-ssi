"use client";

import { useState } from "react";
type ValidationResult = {
    field: string;
    originalLabel: string;
    status: 'Verified' | 'Zero-Knowledge Verified' | 'Tampered' | 'Missing Signature';
    value?: string; // If revealed
};

export default function VerifyPage() {
    const [fileData, setFileData] = useState<any>(null);
    const [issuerStatus, setIssuerStatus] = useState<string | null>(null);
    const [results, setResults] = useState<ValidationResult[]>([]);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isRevoked, setIsRevoked] = useState(false);
    const [isCompromised, setIsCompromised] = useState(false);

    const getLabel = (key: string) => {
        switch (key) {
            case 'name': return 'Full Legal Name';
            case 'university': return 'Issuing University';
            case 'degree': return 'Degree Earned';
            case 'type': return 'Degree Level';
            case 'gpa': return 'Grade Point Average';
            case 'birthdate': return 'Date of Birth';
            default: return key;
        }
    }

    // --- ECDSA-SD-2023 CORE ENGINE (JCS + SHA-256) ---
    const sha256 = async (message: string) => {
        const msgUint8 = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    };

    const canonicalize = (obj: any): string => {
        if (typeof obj !== 'object' || obj === null) return JSON.stringify(obj);
        if (Array.isArray(obj)) return `[${obj.map(canonicalize).join(',')}]`;
        const keys = Object.keys(obj).sort();
        const parts = keys.map(k => `${JSON.stringify(k)}:${canonicalize(obj[k])}`);
        return `{${parts.join(',')}}`;
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const payload = JSON.parse(e.target?.result as string);
                setFileData(payload);
                setErrorMsg(null);
                setIsRevoked(false);
                setIsCompromised(false);
                await auditPresentation(payload);
            } catch (err) {
                setErrorMsg("Invalid JSON format. Please upload a valid presentation file.");
            }
        };
        reader.readAsText(file);
    };

    const auditPresentation = async (vp: any) => {
        setIsVerifying(true);
        setErrorMsg(null);
        try {
            // 1. Navigate the W3C VP Structure
            const vc = vp.verifiableCredential?.[0];
            if (!vc) throw new Error("No credential found in presentation");

            const claims = vc.credentialSubject.claims;

            // 2. Audit Issuer Identity (Dynamic lookup in Registry)
            const registryRes = await fetch('/registry.json');
            const registry = await registryRes.json();

            let issuerPubKeyB64 = null;
            let registryName = null;
            for (const key of Object.keys(registry)) {
                if (registry[key].did === vc.issuer) {
                    issuerPubKeyB64 = key;
                    registryName = registry[key].name;
                    break;
                }
            }

            if (!issuerPubKeyB64) {
                throw new Error("SECURITY ALERT: Issuer DID not found in Nova 26 Global Registry.");
            }

            setIssuerStatus(`Verified Identity (${registryName})`);

            // 2.5 Check Revocation Status
            let revokedFlag = false;
            if (vc.credentialStatus && vc.credentialStatus.statusListCredential) {
                revokedFlag = await checkRevocation(parseInt(vc.credentialStatus.statusListIndex), vc.credentialStatus.statusListCredential);
                setIsRevoked(revokedFlag);
            }

            // 3. Reconstruct the "Signing Experiment"
            // We must rebuild the EXACT array of hashes the University signed
            // Note: The order must match the Issuer's original signing order
            const reconstructedHashes = await Promise.all(
                Object.keys(claims).map(async (key) => {
                    const claim = claims[key];

                    // IF REVEALED: Recalculate hash from raw value + salt
                    if (claim.value && claim.salt) {
                        return await sha256(claim.value + claim.salt);
                    }
                    // IF HIDDEN: Use the hash provided in the 'sd-hash' format
                    else if (claim.hash) {
                        return claim.hash;
                    }

                    throw new Error(`Incomplete claim data for ${key}`);
                })
            );

            // 4. Rebuild the Signing Payload
            // This MUST match the Issuer's signingPayload structure exactly
            const signingPayload = {
                id: vc.id,
                type: vc.type,
                issuer: vc.issuer,
                holderPublicKey: vc.credentialSubject.holderPublicKey,
                claimHashes: reconstructedHashes
            };

            // 5. Mathematical Verification (Issuer)
            const canonicalPayload = canonicalize(signingPayload);
            const localDigest = await sha256(canonicalPayload);

            let signatureValid = false;
            try {
                const pubKeyB64 = issuerPubKeyB64.replace(/(-----(BEGIN|END).*?-----)/g, '').replace(/\s+/g, '');
                const der = Uint8Array.from(atob(pubKeyB64), c => c.charCodeAt(0)).buffer;
                const cryptoKey = await crypto.subtle.importKey("spki", der, { name: "Ed25519" }, false, ["verify"]);

                const sigBytes = Uint8Array.from(atob(vc.proof.proofValue), c => c.charCodeAt(0));
                const msgBytes = new TextEncoder().encode(localDigest);

                signatureValid = await crypto.subtle.verify("Ed25519", cryptoKey, sigBytes, msgBytes);
            } catch (err) {
                console.error("Issuer Verification Failed:", err);
            }

            // 6. Holder Protection (VP Stamp Verification)
            let vpValid = false;
            if (vp.proof && vp.proof.proofValue) {
                try {
                    const clonedVp = { ...vp };
                    delete clonedVp.proof;
                    const canonicalVp = canonicalize(clonedVp);
                    const vpDigest = await sha256(canonicalVp);

                    const pubKeyB64 = vp.proof.publicKeyBase64;
                    if (!pubKeyB64 || pubKeyB64 !== vc.credentialSubject.holderPublicKey) {
                        setIsCompromised(true);
                        throw new Error("SECURITY ALERT: Holder Public Key mismatch. The presenter is NOT the authorized owner of this credential!");
                    }
                    const der = Uint8Array.from(atob(pubKeyB64), c => c.charCodeAt(0)).buffer;
                    const cryptoKey = await crypto.subtle.importKey("spki", der, { name: "Ed25519" }, false, ["verify"]);

                    const sigBytes = Uint8Array.from(atob(vp.proof.proofValue), c => c.charCodeAt(0));
                    const msgBytes = new TextEncoder().encode(vpDigest);

                    vpValid = await crypto.subtle.verify("Ed25519", cryptoKey, sigBytes, msgBytes);
                } catch (err) {
                    console.error("Holder Verification Failed:", err);
                }
            }
            if (vpValid && issuerStatus?.includes('Verified')) {
                setIssuerStatus(`Verified Identity (${registryName})\nVerified Holder Stamp${revokedFlag ? ' (REVOKED)' : ''}`);
            } else if (!vpValid && issuerStatus?.includes('Verified')) {
                setIssuerStatus(`Verified Identity (${registryName})\nINVALID OR COMPROMISED HOLDER STAMP`);
            }

            // 6. Map Results for UI
            const auditResults: ValidationResult[] = Object.keys(claims).map(key => {
                const claim = claims[key];
                const isHidden = claim.format === "sd-hash";

                let status: ValidationResult['status'] = 'Tampered';
                if (signatureValid) {
                    status = isHidden ? 'Zero-Knowledge Verified' : 'Verified';
                }

                return {
                    field: key,
                    originalLabel: getLabel(key),
                    status,
                    value: isHidden ? undefined : claim.value
                };
            });

            setResults(auditResults);
        } catch (error: any) {
            console.error(error);
            setErrorMsg(error.message || "Missing or invalid properties in VP. Cannot verify.");
        } finally {
            setIsVerifying(false);
        }
    };

    // UI Helpers
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Verified': return 'bg-success/15 text-success border-success/70';
            case 'Zero-Knowledge Verified': return 'bg-hidden/15 text-hidden border-hidden/70';
            case 'Tampered': return 'bg-error/15 text-error border-error/70 animate-pulse';
            default: return 'bg-surface-variant/50 text-on-surface-variant border-outline-variant/30';
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Verified': return 'check_circle';
            case 'Zero-Knowledge Verified': return 'lock';
            case 'Tampered': return 'warning';
            default: return 'help';
        }
    }

    // Inside your verification workflow
    const checkRevocation = async (statusListIndex: number, statusListUrl: string) => {
        // Fetch the public file (just like querying a blockchain public state)
        const res = await fetch(statusListUrl);
        const data = await res.json();

        // Check if the bit at the student's index is a "1"
        const isRevoked = data.bitstring[statusListIndex] === "1";

        return isRevoked;
    };

    return (
        <main className="min-h-screen bg-surface-container-lowest font-body pt-28 pb-12 px-8 flex flex-col items-center">
            <div className="max-w-4xl w-full flex flex-col gap-12">
                <div className="text-center space-y-4">
                    <h1 className="font-headline text-primary font-black tracking-tight text-5xl">Verifier Portal</h1>
                    <p className="text-secundary text-sm max-w-2xl mx-auto">
                        Upload a <span className="font-bold text-primary">presentation.json</span> generated by the Wallet Holder to cryptographically audit the claims.
                    </p>
                </div>

                {!fileData ? (
                    <div className="w-full relative group">
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/30 transition-all duration-500"></div>
                        <label className="relative flex flex-col items-center justify-center w-full h-80 border-2 border-dashed border-primary/50 hover:border-primary rounded-[32px] bg-surface-container/80 backdrop-blur-md cursor-pointer transition-colors overflow-hidden">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6 gap-4">
                                <div className="p-4 bg-primary/10 rounded-full group-hover:scale-110 transition-transform duration-300">
                                    <span className="material-symbols-outlined text-primary text-5xl">cloud_upload</span>
                                </div>
                                <div className="text-center">
                                    <p className="mb-2 text-lg text-on-surface font-headline font-bold">Click to upload Verifiable Presentation</p>
                                    <p className="text-xs text-on-surface-variant">Must be a valid .json file generated from Selective Disclosure</p>
                                </div>
                            </div>
                            <input type="file" className="hidden" accept=".json" onChange={handleFileUpload} />
                        </label>
                        {errorMsg && <p className="text-red-400 text-center mt-4 font-bold">{errorMsg}</p>}
                    </div>
                ) : (
                    <div className="w-full flex flex-col gap-6 animate-fade-in-up">
                        {/* Summary Header */}
                        {isRevoked && (
                            <div className="bg-error/10 border-2 border-error text-error p-6 rounded-xl flex items-center gap-4 animate-pulse">
                                <span className="material-symbols-outlined text-4xl">warning</span>
                                <div>
                                    <h3 className="font-headline font-black text-xl">SECURITY ALERT: CREDENTIAL REVOKED</h3>
                                    <p className="font-bold text-sm">The University has permanently revoked this diploma via the Bitstring Status List.</p>
                                </div>
                            </div>
                        )}

                        {isCompromised && (
                            <div className="bg-error/10 border-2 border-error text-error p-6 rounded-xl flex items-center gap-4 animate-pulse">
                                <span className="material-symbols-outlined text-4xl">gavel</span>
                                <div>
                                    <h3 className="font-headline font-black text-xl">SECURITY ALERT: IDENTITY COMPROMISED</h3>
                                    <p className="font-bold text-sm">The public key used to sign this presentation does not match the legal owner registered on the diploma. This credential may be stolen.</p>
                                </div>
                            </div>
                        )}

                        <div className={`bg-surface-container-high rounded-xl p-8 border ${isRevoked || isCompromised ? 'border-error' : 'border-dark'} flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden`}>
                            {isVerifying && <div className="absolute inset-0 bg-surface-container/60 flex items-center justify-center backdrop-blur-sm z-50"><span className="text-primary font-bold animate-pulse text-lg">Running Cryptographic Audit...</span></div>}
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-dark">
                                    <span className="material-symbols-outlined text-3xl text-primary">verified</span>
                                </div>
                                <div>
                                    <h3 className="text-xs font-label uppercase tracking-widest text-primary mb-1">Cryptographic Audit Result</h3>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${isRevoked || isCompromised ? 'bg-error' : (issuerStatus?.includes('Verified') ? 'bg-success' : 'bg-error')} animate-pulse`}></div>
                                        <span className={`text-lg font-headline font-bold ${isRevoked || isCompromised ? 'text-error' : (issuerStatus?.includes('Verified') ? 'text-success' : 'text-error')} whitespace-pre-line`}>{issuerStatus}</span>
                                    </div>
                                    <p className="text-xs text-on-surface-variant mt-1">Trust Anchor: <span className="font-mono text-primary/70">Nova 26 Global Registry</span></p>
                                </div>
                            </div>

                            <button
                                onClick={() => setFileData(null)}
                                className="px-6 py-3 rounded-xl border border-dark text-primary hover:bg-white/5 transition-colors text-sm font-bold flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-sm">restart_alt</span>
                                TEST NEW PAYLOAD
                            </button>
                        </div>

                        {/* Claims Breakdown Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {results.map((result, idx) => (
                                <div key={idx} className={`p-6 rounded-xl border flex flex-col gap-4 transition-all duration-500 bg-surface-container-lowest ${getStatusStyle(result.status)}`}>
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase tracking-widest opacity-80">{result.originalLabel}</span>
                                            {result.value ? (
                                                <span className="text-lg font-headline font-bold mt-1 text-success">{result.value}</span>
                                            ) : (
                                                <span className="text-lg font-headline font-bold mt-1 italic opacity-80">Value Hidden</span>
                                            )}
                                        </div>
                                        <div className="p-2 rounded-full bg-surface-container-lowest border border-surface flex items-center justify-center">
                                            <span className="material-symbols-outlined text-xl">{getStatusIcon(result.status)}</span>
                                        </div>
                                    </div>

                                    <div className="h-px w-full bg-success border-[.25px]"></div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-mono opacity-60">Status:</span>
                                        <span className="text-xs font-bold tracking-wide">{result.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Raw Debug Data */}
                        <div className="mt-8">
                            <h4 className="text-xs font-label uppercase tracking-widest text-secundary mb-4 ">Incoming JSON Presentation</h4>
                            <div className="bg-transparent rounded-xl p-6 overflow-hidden border-1 border-dark">
                                <pre className="text-[10px] font-mono text-primary/60 whitespace-pre-wrap break-all custom-scrollbar overflow-y-auto max-h-60">
                                    {JSON.stringify(fileData, null, 2)}
                                </pre>
                            </div>
                        </div>

                    </div>
                )}
            </div>
            {/* Custom Tailwind animation definitions implicitly relying on existing global Tailwind classes */}
        </main>
    );
}
