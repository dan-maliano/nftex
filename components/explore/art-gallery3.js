import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'
import Link from 'next/link'

export default function ArtGallery3(props) {
    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4'>
            {props.galleries.map((item, index) => (
                <div key={item.itemId} className='nft-list__item w-full h-auto grid grid-cols-1 bg-[#12101c] border-2 border-[#161A42] dark:bg-white dark:border-2 dark:border-gray-200 rounded-2xl text-white dark:text-gray-800 '>
                    <div className='nft-list__item-wrap item-wrap_no-button grid grid-cols-1 p-4'>
                        <div className='nft-item__img bg-white rounded-xl'>
                        <Link href={{
                            pathname:`/market/${item.tokenId}/`,
                            query: {
                                id: `${item.itemId}`,
                               
                            }
                                }}>
                            <img src={item.image} alt={item.itemId} className='w-full h-auto'></img>
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
                            <button className="nft-item__link rounded-full border-2 border-[#2E357B] dark:border-0 dark:bg-[#325BC5] w-[1.75rem] h-[1.75rem] text-white">
                                <span>More</span>
                            </button>
                            </Link>
                        </div>
                        <p className="nft-item__category text-[#A2A6D0] text-sm">{item.category}</p>
                        <div className='nft-item__price flex flex-row py-4'>
                            <div className="rounded-full w-[1.5rem] text-center bg-[#325BC5] text-white">
                          
                                {/* <FontAwesomeIcon icon={faEthereum} className="" /> */}
                                <img src="/assets/svg/assets-logo.svg" alt="Polygon NFT" className=''></img>
                            </div>
                            <h1 className="flex-grow text-[#47DEF2] text-base ml-2">{item.price} Matic</h1>
                        </div>
                        <p className="nft-item__creator-title text-[#A2A6D0] text-xs">creator</p>
                        <p className="nft-item__creator-address text-sm truncate ...">{item.creator}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}