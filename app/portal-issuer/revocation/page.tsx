"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function RevocationRegistry() {
    const [revokeIndex, setRevokeIndex] = useState("");
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [issuerContext, setIssuerContext] = useState<{ name: string, did: string, statusListUrl: string } | null>(null);

    useEffect(() => {
        const savedCtx = sessionStorage.getItem("nova26_issuer_ctx");
        if (savedCtx) {
            setIssuerContext(JSON.parse(savedCtx));
        }
    }, []);

    const toggleCredentialStatus = async (studentIndex: number, revoke: boolean) => {
        if (!issuerContext) return alert("Error: Unknown Issuer Context.");
        try {
            const res = await fetch('/api/revoke', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    index: studentIndex,
                    isRevoked: revoke,
                    prefix: issuerContext.did.split(':').pop()
                })
            });
            if (res.ok) {
                setStatusMessage({
                    type: 'success',
                    text: `SUCCESS: Credential at index ${studentIndex} is now mathematically REVOKED across the network.`
                });
            } else {
                setStatusMessage({
                    type: 'error',
                    text: `Failed to update status for index ${studentIndex}.`
                });
            }
        } catch (error) {
            console.error("Ledger update failed", error);
            setStatusMessage({
                type: 'error',
                text: `Ledger update failed: ${error}`
            });
        }
    };

    return (
        <main className="min-h-screen font-body pt-10 pb-12 px-8 flex flex-col items-center bg-background w-full">
            <div className="max-w-5xl w-full flex flex-col gap-10">
                <div className="flex justify-between items-start w-full">
                    <div className="flex flex-col gap-4 text-left">
                        <h1 className="font-headline text-primary font-black tracking-tight text-4xl">Revocation Registry</h1>
                        <p className="text-secundary text-sm max-w-2xl mt-1">
                            Manage the W3C Bitstring Status List. Instantly revoke credentials across the entire <strong>Nova 26</strong> network using a privacy-preserving integer index.
                        </p>
                    </div>
                    <Link href="/portal-issuer" className="font-extrabold text-sm text-brand hover:underline cursor-pointer flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Back to Issuer
                    </Link>
                </div>

                <div className="w-full flex flex-col gap-6 bg-white border border-dark rounded-xl p-8">
                    <div className="flex items-center gap-3 border-b border-dark pb-4">
                        <span className="material-symbols-outlined text-primary">gavel</span>
                        <h2 className="text-primary font-headline font-bold text-xl tracking-tight">Revoke Credential by Index</h2>
                    </div>

                    <div className="flex flex-col gap-4 mt-2">
                        <p className="text-sm text-secundary">
                            Enter the unique <code className="bg-black/5 px-1 rounded">statusListIndex</code> assigned to the credential during issuance.
                            Flipping this bit to 1 will immediately cause all mathematical verification audits to fail network-wide.
                        </p>

                        <div className="flex gap-4 items-center bg-surface-container-lowest p-4 rounded-xl border border-dark mt-4">
                            <input
                                type="number"
                                placeholder="Enter Index (e.g. 6405)"
                                value={revokeIndex}
                                onChange={(e) => setRevokeIndex(e.target.value)}
                                className="flex-1 bg-white border border-dark rounded-lg px-4 py-3 text-sm text-primary focus:outline-none focus:border-brand transition-colors"
                            />
                            <button
                                onClick={() => {
                                    if (revokeIndex) toggleCredentialStatus(parseInt(revokeIndex), true);
                                }}
                                className="bg-error/10 text-error hover:bg-error/20 font-bold px-8 py-3 rounded-lg text-sm transition-colors border border-error/20 flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined">block</span>
                                REVOKE CREDENTIAL
                            </button>
                        </div>

                        {statusMessage && (
                            <div className={`p-4 rounded-lg mt-2 text-sm font-bold flex items-center gap-2 ${statusMessage.type === 'success' ? 'bg-success/10 text-success border border-success/20' : 'bg-error/10 text-error border border-error/20'}`}>
                                <span className="material-symbols-outlined">{statusMessage.type === 'success' ? 'check_circle' : 'error'}</span>
                                {statusMessage.text}
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white border border-dark rounded-xl p-8 shadow-sm">
                    <h3 className="text-primary font-headline font-bold text-md mb-4 tracking-tight">How the Bitstring Status List Works</h3>
                    <ul className="space-y-4">
                        <li className="flex gap-3 text-xs text-secundary">
                            <span className="material-symbols-outlined text-brand text-2xl">vpn_key</span>
                            <span><strong>Zero-Knowledge Revocation:</strong> The Status List is a dense array of bits (1s and 0s). By maintaining this list publicly, Verifiers can check if a specific credential index has been flipped to 1 (revoked) without ever knowing the identity of the student or pinging the university database.</span>
                        </li>
                    </ul>
                </div>

            </div>
        </main>
    );
}
