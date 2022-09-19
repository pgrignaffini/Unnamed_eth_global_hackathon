import { useEffect, useState } from "react"
import NFTCompactCard from "./NFTCompactCard"
import { XCircleIcon, PlusCircleIcon } from '@heroicons/react/solid'
import { useQuery } from "react-query"
import { useAccount, useNetwork } from "wagmi"
import type { Item } from '../../types'
import { useAppContext } from "../context/AppContext"

function TradeModal({ nft }: { nft: Item | null | undefined }) {

    const { address } = useAccount()
    const { chain } = useNetwork()
    const connectedChain = chain?.name.toLowerCase() || 'ethereum'
    // @ts-ignore
    const { sdk } = useAppContext()

    const [filteredData, setFilteredData] = useState({ data: [] })
    const [wordEntered, setWordEntered] = useState("");

    const submitTrade = async (nftMaker: [], nftTaker: []) => {
        const res = await sdk.createSwap({
            ethMaker: "100000000000", //amount in wei placed by the creator of the swap (mandatory)
            taker: nft?.owner, //address of the taker (counterparty) of the swap. If you provide the value '0x0000000000000000000000000000000000000000' the swap can be closed by everyone (mandatory)
            ethTaker: "100000000000", //amount in wei placed by the taker of the swap (mandatory)
            swapEnd: 0, //number of days of validity of the swap. If not specified the value will be zero. Zero value means no time limit. (optional)
            assetsMaker: nftMaker, //Array of ERC721/1155/20 tokens placed by the creator of the swap. The default value is an empty array. The SDK provides utility methods to build this array. (optional)
            assetsTaker: nftTaker, //Array of ERC721/1155/20 tokens placed by the taker (counterparty) of the swap. The default value is an empty array. The SDK provides utility methods to build this array. (optional)
            referralAddress: '0x0000000000000000000000000000000000000000' //Can be an address of an account or a smart contract. Referral address utility will be explained in the next sections (optional)
        },
        )
        console.log("Res: " + res)
    }

    // const handleFilter = async (event: { target: { value: string } }) => {
    //     const searchWord = event.target.value.toLowerCase()
    //     setWordEntered(searchWord);
    //     if (searchWord === "") {
    //         setFilteredData({ data: [] })
    //     } else (searchWord.length > 4) {
    //         await searchCollections(searchWord)
    //     }
    // }

    const options = { method: 'GET', headers: { Accept: 'application/json', 'X-API-Key': 'test' } };
    const [nftCollection, setNftCollection] = useState<Item[]>([])
    const [selectedNFTs, setSelectedNFTs] = useState<Item[]>([])

    const { data, isLoading } = useQuery('trading-nfts', () => fetchNFTs(), {
        select: (data) => data?.nfts?.map((nft: Item) => ({
            image: nft?.cached_file_url || nft?.file_url || nft?.metadata?.image || nft?.metadata?.ipfs_image,
            name: nft?.metadata?.name,
            contract_address: nft?.contract_address,
            token_id: nft?.token_id,
            owner: nft?.owner,
        }
        )),
        onSuccess: (data) => {
            setNftCollection(data)
        }
    })

    const fetchNFTs = async () => {
        const response = await fetch(`/api/nfts/wallet/${address}?chain=${connectedChain}&include=metadata`, options)
        const data = await response.json()
        return data
    }

    // const fetchNFTs = async () => {
    //     const response = await fetch(`/api/nfts/wallet/0xc839eC222F6EC940980227B39B2ef0715EEF1718?chain=${connectedChain}&include=metadata`, options)
    //     const data = await response.json()
    //     return data
    // }

    return (
        <div>
            <input type="checkbox" id="trade-modal" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box max-w-7xl bg-white bg-opacity-50 backdrop-blur-xl p-10 scrollbar-hide">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2 flex flex-col space-y-6">
                            <p className="font-poppins text-xl font-semibold">Selected NFTs:</p>
                            {/* Left side with NFT to trade */}
                            <div className="carousel p-4 bg-transparent">
                                {selectedNFTs.map((nft, index) => (
                                    <div className="carousel-item p-2 w-32 space-x-4 relative">
                                        <XCircleIcon className="w-8 z-10 top-0 right-0 text-error absolute cursor-pointer" onClick={() => {
                                            for (let i = 0; i < selectedNFTs.length; i++) {
                                                if (selectedNFTs[i]?.name === nft.name) {
                                                    selectedNFTs.splice(i, 1)
                                                    setSelectedNFTs([...selectedNFTs])
                                                    setNftCollection([...nftCollection, nft])
                                                    break
                                                }
                                            }
                                        }} />
                                        <NFTCompactCard key={index} src={nft?.image || ""} name={nft?.name ?? "name not found"} />
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-center">
                                <div className="bg-transparent border rounded-md p-1 w-full">
                                    <div className="inline-flex flex-col flex-start justify-center relative text-base-100">
                                        <div className="flex items-center">
                                            <input type="text" className="placeholder:text-base-100 placeholder:italic p-5 pl-8 h-8 bg-transparent outline-none"
                                                placeholder="Search NFT..." />
                                            <svg className="w-4 h-4 absolute left-2.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="font-poppins text-xl font-semibold">Your NFTs:</p>
                            <div className="overflow-y-scroll h-">
                                <div className="grid grid-cols-5 gap-3 p-4">
                                    {nftCollection?.map((nft, index) => (
                                        <div className="relative" >
                                            <PlusCircleIcon className="w-8 z-10 top-0 right-0 text-success absolute cursor-pointer" onClick={() => {
                                                setSelectedNFTs([...selectedNFTs, nft])
                                                for (let i = 0; i < nftCollection.length; i++) {
                                                    if (nftCollection[i]?.name === nft.name) {
                                                        console.log("selected: " + JSON.stringify(nft.name))
                                                        nftCollection.splice(i, 1)
                                                        setNftCollection([...nftCollection])
                                                        break
                                                    }
                                                }
                                            }} />
                                            <NFTCompactCard key={index} src={nft?.image || ""} name={nft?.name ?? "name not found"} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="col-span-1 justify-center">
                            {/* Right side with NFT to obtain */}
                            <div className="flex flex-col items-center space-y-3">
                                <p className="font-poppins text-2xl">NFT to trade:</p>
                                <div className="card card-normal w-96 glass shadow-xl cursor-pointer">
                                    <figure className="px-10 pt-10">
                                        <img src={nft?.cached_file_url || nft?.file_url || nft?.metadata?.ipfs_image || nft?.metadata?.image} className="rounded-xl object-cover" />
                                    </figure>
                                    <div className="card-body items-center text-center">
                                        <h2 className="card-title">{nft?.name}</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-action">
                                <button className="btn btn-primary"
                                    onClick={async () => {
                                        const selectedNFTsArray = new sdk.AssetsArray()
                                        for (let i = 0; i < selectedNFTs.length; i++) {
                                            selectedNFTsArray.addERC721Asset(selectedNFTs[i]?.contract_address, selectedNFTs[i]?.token_id)
                                        }
                                        const nftToTrade = new sdk.AssetsArray()
                                        nftToTrade.addERC721Asset(nft?.contract_address, nft?.token_id)
                                        await submitTrade(selectedNFTsArray, nftToTrade)
                                    }}>
                                    Submit Offer
                                </button>
                                <label htmlFor="trade-modal" className="btn btn-secondary">
                                    Close
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TradeModal
