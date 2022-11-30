import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'
import Link from 'next/link'
import InputDialog from '../../components/dialog/input'
import LoaderDialog from '../../components/dialog/loader'
import SuccessDialog from '../../components/dialog/success'
import { useState,useEffect } from 'react'

export default function ArtGallery4(props) {


let [priceOpen, setPriceOpen] = useState(false)
let [loaderOpen, setLoaderOpen] = useState(false)
let [successOpen, setSuccessOpen] = useState(false)    

function closePriceModal() {
    
    setPriceOpen(false)
}

function openPriceModal() {
    setPriceOpen(true)
}

function closeLoaderModal() {
    setLoaderOpen(false)
}

function openLoaderModal() {
    closePriceModal()
    setLoaderOpen(true)

    setTimeout(purchaseSuccesss, 1000)
}

function closeSuccessModal() {
    closePriceModal()
    closeLoaderModal()
    setSuccessOpen(false)
}

function openSuccessModal() {
    setSuccessOpen(true)
}

function purchaseSuccesss() {
    closeLoaderModal()
    openSuccessModal()
}
    return (
        <div className='nft-list__wrap grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4'>
            {props.galleries.map((item, index) => (
                 <div key={item.itemId} className='nft-list__item w-full h-auto grid grid-cols-1 bg-[#12101c] border-2 border-[#161A42] dark:bg-white rounded-2xl text-white dark:text-gray-800 dark:border-2 dark:border-gray-200'>
                    <div className='nft-list__item-wrap grid grid-cols-1 p-4'>
                        <div className='nft-item__img bg-white rounded-xl'>
                        <Link href={{
                            pathname:`/market/${item.tokenId}/`,
                            query: {
                                id: `${item.itemId}`,
                               
                            }
                                }}>
                            <img src={item.image} alt={item.name} className='w-full h-auto'></img>
                            </Link>
                        </div>
                        <div className='flex flex-row'>
                            <h1 className="nft-item__name flex-grow text-base">{item.name}</h1>
                            <Link href={{
                            pathname:`/market/${item.tokenId}/`,
                            query: {
                                id: `${item.itemId}`,
                               
                            }
                                }}>
                            <button className="nft-item__link">
                                <span>More</span>
                            </button>
                            </Link>
                        </div>
                        <p className="nft-item__category text-[#A2A6D0] text-sm">{item.category}</p>
                        <div className='nft-item__price flex flex-row py-4'>
                            <div className="rounded-full w-[1.5rem] text-center bg-[#325BC5] text-white">
                                <img src="/assets/svg/assets-logo.svg" alt="Polygon NFT" className=''></img>
                            </div>
                            <h1 className="flex-grow text-[#47DEF2] text-base ml-2">{item.price } Matic</h1>
                        </div>
                        <p className="nft-item__creator-title text-[#A2A6D0] text-xs">Creator</p>
                        <p className="nft-item__creator-address text-sm truncate ... ">{item.creator} </p>
                    </div>                            
                    
                    <div className="nft-item__buy-wrap">
                        <button className='my-button buy-button rounded-full bg-gradient-to-b from-[#3461FF] to-[#8454EB] text-white text-base w-full px-4 py-2 shadow-md' onClick={openPriceModal}> {item.buttonTitle}</button>
                    </div>

                       {/* price input dialog  */}
       <InputDialog show={priceOpen} openPriceModal={openPriceModal} closePriceModal={closePriceModal} purchasingNft={openLoaderModal}>{{resellFucnction:props.children.resellFucnction,item:item}}</InputDialog>

                </div>
                
            ))}

{/* loader dialog  */}
<LoaderDialog show={loaderOpen} openLoaderModal={openLoaderModal}></LoaderDialog>

{/* success dialog  */}
{/* <SuccessDialog show={successOpen} closeSuccessModal={closeSuccessModal}>{{msg:"",title:"",buttonTitle:""}}</SuccessDialog> */}

        </div>

        
    )
}