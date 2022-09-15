import type { NextApiRequest, NextApiResponse } from 'next'

//get nfts from contract address
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json')
    headers.append('Authorization', process.env.NFT_PORT_API_KEY)
    const address = req.query.contract_address
    // @ts-ignore
    const data = await fetch(`https://api.nftport.xyz/v0/nfts/${address}?` + new URLSearchParams({
        ...req.query
    }), { headers: headers })
    const response = await data.json()
    res.status(200).json(response)
    return response
}