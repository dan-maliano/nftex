
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'
import Link from 'next/link'

import {
    FacebookShareCount,
    HatenaShareCount,
    OKShareCount,
    PinterestShareCount,
    RedditShareCount,
    TumblrShareCount,
    VKShareCount
  } from "react-share";
export default function ArtPreview (props) {
    return (
        <div className='art-prev flex flex-col lg:flex-row items-center space-x-0 space-y-8 lg:space-x-8 lg:space-y-0  dark:bg-white dark:border-2 dark:border-gray-200 p-6'>
            <div className='art-prev__img-wrap flex-none w-full lg:w-[30%]'>
                <img src={props.children.item.image} className='w-full art-prev__img'></img>
            </div>

            <div className='flex-1 w-full flex flex-col lg:flex-row space-x-0 space-y-8 lg:space-x-8 lg:space-y-0'>
                <div className='art-prev__info flex-grow text-white dark:text-gray-800'>
                    <h1 className='art-prev__title'>{props.children.item.name}</h1>

                    <h4 className='art-prev__category'>{props.children.item.category}</h4>

                    <p className='art-prev__description'>{props.children.item.description}</p>
                    <div className='art-prev__price'>
                        <div className="art-prev__price-icon">
                            {/* <FontAwesomeIcon icon={faEthereum} className="" /> */}
                            <img src="/assets/svg/assets-logo.svg" alt="Polygon NFT" className=''></img>
                        </div>
                        <h1 className="flex-grow text-[#47DEF2] text-base ml-2">{props.children.item.price}Matic</h1>
                    </div>

                    <div className='art-prev__users grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <div className='art-prev__user-wrap flex-1 flex flex-col space-y-6'>
                            <div className='flex flex-row space-x-4'>
                                <div className='art-prev__user-ava'></div>
                                <div className='art-prev__user-info'>
                                    <p className=''>Sell By</p>
                                    <p className='text-ellipsis overflow-hidden whitespace-nowrap'>{props.children.item.seller}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className='art-prev__user-wrap flex-1 flex flex-col space-y-6'>
                            <div className='flex flex-row space-x-4'>
                                <div className='art-prev__user-ava'></div>
                                <div className='art-prev__user-info'>
                                    <p className=''>Created By</p>
                                    <p className='text-ellipsis overflow-hidden whitespace-nowrap'>{props.children.item.creator}</p>
                                </div>
                            </div>
                        </div>
                        {props.children.item.sold?"":      <button className='my-button py-2 shadow-md' onClick={()=>props.children.buyFunction(props.children.item)}>BUY NOW</button>
}
                    </div>
                </div>
            </div>
        </div>
    )
}