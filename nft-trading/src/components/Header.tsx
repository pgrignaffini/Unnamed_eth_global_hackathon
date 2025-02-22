import Link from "next/link"
import SearchBar from "./SearchBar"
import ThemeSelector from "./ThemeSelector"
import { useConnectModal, useAccountModal, useChainModal } from '@rainbow-me/rainbowkit'
import { useAccount, useNetwork } from 'wagmi'
import { signIn, signOut, useSession } from "next-auth/react";
import { UserCircleIcon, StarIcon, PhotographIcon } from '@heroicons/react/outline'
import UserMenu from "./UserMenu"
import makeBlockie from "ethereum-blockies-base64"

function Header() {

    const { openConnectModal } = useConnectModal();
    const { openAccountModal } = useAccountModal();
    const { openChainModal } = useChainModal();
    const { isConnected, address } = useAccount();
    const { chain } = useNetwork()

    console.log("Connected to: ", chain)

    const { data: session, status } = useSession();
    console.log(session)

    return (
        <header className="fixed top-0 right-0 left-0 p-7 z-50 max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
                <Link href={"/"}>
                    <a className="font-bold text-2xl text-base-100">Bazaar<span className="text-primary-focus">Market</span></a>
                </Link>
                <div className="hidden md:inline-flex">
                    <SearchBar placeholder="Search an address" />
                </div>
                <div className="hidden xl:flex xl:space-x-7">
                    <Link href={"/collections"}>
                        <a className="text-base-100 text-xl font-poppins">Collections</a>
                    </Link>
                    <Link href={"/"}>
                        <a className="text-base-100 text-xl font-poppins">Featured</a>
                    </Link>
                    <Link href={"/"}>
                        <a className="text-base-100 text-xl font-poppins">FAQ</a>
                    </Link>
                </div>
                {isConnected ?
                    (<>
                        <button className="btn btn-sm btn-outline btn-primary normal-case" onClick={openAccountModal}><p>Profile</p></button>
                        <button className="btn btn-sm btn-outline btn-primary normal-case" onClick={openChainModal}><p>Chain</p></button>

                    </>)
                    :
                    (<button className="p-2 rounded-md bg-gradient-to-tr from-primary to-secondary shadow-md" onClick={openConnectModal}>
                        <p className="lg:inline font-poppins text-inherit">Connect wallet</p>
                    </button>)
                }
                {session &&
                    (<div className="flex space-x-2 items-center">
                        <button className="btn btn-sm btn-outline btn-primary normal-case" onClick={() => signOut()}>
                            <p>Sign Out</p>
                        </button>
                        <img src={session?.user?.image as string} className="peer rounded-full w-8 h-8 cursor-pointer" />
                        <UserMenu />
                    </div>)}
                {isConnected && !session &&
                    (<div className="flex space-x-2 items-center">
                        <button className="btn btn-sm btn-outline btn-primary ml-3 normal-case" onClick={() => signIn("discord")}>
                            Sign In
                        </button>
                        <img src={makeBlockie(address as string)} className="peer rounded-full w-8 h-8 cursor-pointer" />
                        <UserMenu />
                    </div>)
                }
                <div className="hidden lg:inline-block">
                    <ThemeSelector />
                </div>
            </div>
            <div className="divider" />
        </header>
    )
}

export default Header
