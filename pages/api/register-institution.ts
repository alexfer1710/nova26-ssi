import fs from 'fs/promises';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, prefix, publicKeyBase64 } = req.body;

        if (!name || !prefix || !publicKeyBase64) {
            return res.status(400).json({ error: 'Missing required fields: name, prefix, or publicKeyBase64' });
        }

        const didsDir = path.join(process.cwd(), 'public', 'dids');
        const statusListsDir = path.join(process.cwd(), 'public', 'status-lists');
        const registryPath = path.join(process.cwd(), 'public', 'registry.json');

        // Ensure directories exist (in case git doesn't track empty dirs)
        await fs.mkdir(didsDir, { recursive: true });
        await fs.mkdir(statusListsDir, { recursive: true });

        // 1. Create DID Document
        const didDocument = {
            "@context": [
                "https://www.w3.org/ns/did/v1",
                "https://w3id.org/security/suites/ed25519-2020/v1"
            ],
            "id": `did:nova26:${prefix}`,
            "verificationMethod": [
                {
                    "id": `did:nova26:${prefix}#key-1`,
                    "type": "Ed25519VerificationKey2020",
                    "controller": `did:nova26:${prefix}`,
                    "publicKeyMultibase": publicKeyBase64
                }
            ],
            "assertionMethod": [
                `did:nova26:${prefix}#key-1`
            ]
        };
        await fs.writeFile(
            path.join(didsDir, `${prefix}.json`),
            JSON.stringify(didDocument, null, 2)
        );

        // 2. Create Status List (Bitstring of 50 zeros)
        const statusList = {
            bitstring: "0".repeat(50)
        };
        await fs.writeFile(
            path.join(statusListsDir, `${prefix}.json`),
            JSON.stringify(statusList, null, 2)
        );

        // 3. Update Registry
        let registryData: any = {};
        try {
            const fileContent = await fs.readFile(registryPath, 'utf-8');
            registryData = JSON.parse(fileContent);
        } catch (e) {
            // File might not exist or is malformed, start fresh
            registryData = {};
        }

        registryData[publicKeyBase64] = {
            name: name,
            did: `did:nova26:${prefix}`,
            statusListUrl: `/status-lists/${prefix}.json`
        };

        await fs.writeFile(registryPath, JSON.stringify(registryData, null, 2));

        return res.status(200).json({ 
            success: true, 
            message: `Institution ${name} fully registered.` 
        });
    } catch (error) {
        console.error('Registration Error:', error);
        return res.status(500).json({ error: 'Internal server error during registration' });
    }
}
