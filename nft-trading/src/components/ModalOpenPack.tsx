import React from 'react'
import CardPack from './CardPack'
import { useState } from "react"
import ShowCard from './ShowCard'

function ModalOpenPack() {

    const [opened, setOpened] = useState(false)

    return (
        <>
            <label htmlFor="my-modal-6" className="modal-button">
                <div className='shadow-2xl cursor-pointer flex justify-center items-center rounded-full w-32 h-32 bg-gradient-to-bl from-white via-yellow-200 to-secondary'>
                    <p className='font-poppins text-lg'>Claim</p>
                </div>
            </label>
            <input type="checkbox" id="my-modal-6" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box w-auto max-w-5xl">
                    <div className='mt-5'>
                        {!opened &&
                            <div className='flex flex-col space-y-4'>
                                <h3 className="font-bold text-lg text-center">Click on the pack to open it</h3>
                                <div className='flex justify-center'>
                                    <button onClick={() => setOpened(true)}>
                                        <CardPack />
                                    </button>
                                </div>
                            </div>}
                        {opened &&
                            (
                                <div className='flex flex-col space-y-4'>
                                    <h3 className="font-bold text-lg text-center">Click on the cards to reveal them</h3>
                                    <div className='grid grid-cols-5 gap-4 p-5'>
                                        <ShowCard src="/cards/card2.png" />
                                        <ShowCard src="/cards/card3.png" />
                                        <ShowCard src="/cards/card4.png" />
                                        <ShowCard src="/cards/card5.png" />
                                        <ShowCard src="/cards/card6.png" />
                                        <ShowCard src="/cards/card7.png" />
                                        <ShowCard src="/cards/card8.png" />
                                        <ShowCard src="/cards/card9.png" />
                                        <ShowCard src="/cards/card10.png" />
                                        <ShowCard src="/cards/card11.png" />
                                    </div>
                                </div>)}
                    </div>
                    <div className="modal-action">
                        <label htmlFor="my-modal-6" className="btn">Done</label>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ModalOpenPack
