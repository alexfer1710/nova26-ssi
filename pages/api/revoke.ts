import fs from 'fs/promises';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { index, isRevoked, prefix } = req.body;
        
        if (typeof index !== 'number' || index < 0) {
            return res.status(400).json({ error: 'Invalid index' });
        }

        const fileName = prefix ? `${prefix}.json` : 'status-list.json';
        const filePath = path.join(process.cwd(), 'public', prefix ? 'status-lists' : '', fileName);
        
        let fileContent;
        try {
            fileContent = await fs.readFile(filePath, 'utf-8');
        } catch (e) {
            // File might not exist yet, default to 50 zeros
            fileContent = JSON.stringify({ bitstring: "0".repeat(50) });
        }

        const data = JSON.parse(fileContent);
        let bitstring = data.bitstring || "0".repeat(50);
        
        // Auto-pad string if the index is completely out of bounds
        if (index >= bitstring.length) {
            bitstring = bitstring.padEnd(index + 1, '0');
        }

        // Flip the bit (1 = Revoked, 0 = Valid)
        const char = isRevoked ? '1' : '0';
        bitstring = bitstring.substring(0, index) + char + bitstring.substring(index + 1);
        
        data.bitstring = bitstring;
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));

        return res.status(200).json({ success: true, bitstring });
    } catch (error) {
        console.error('Revocation Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
