import type { NextApiRequest, NextApiResponse } from 'next'

// get nft collections from wallet address
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json')
    headers.append('Authorization', process.env.NFT_PORT_API_KEY)
    const contract_address = req.query.contract_address
    const data: any = await fetch(`https://api.nftport.xyz/v0/nfts/${contract_address}?` + new URLSearchParams({
        ...req.query as any
    }), { headers: headers })
    const response = await data.json()
    res.status(200).json(response)
    return response
}
