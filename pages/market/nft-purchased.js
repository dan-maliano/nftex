import Head from 'next/head'
import Link from 'next/link'
import { Fragment, useState, useRef,useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClone } from '@fortawesome/free-regular-svg-icons'
import { faTimesCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'
import Header from '../../components/header'
import Footer from '../../components/footer'
import Breadcrumbs from '../../components/breadcrumbs'
import ArtGallery4 from '../../components/explore/art-gallery4'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { TailSpin } from  'react-loader-spinner'
import Web3 from "web3"
import axios from 'axios'
import { useRouter } from 'next/router'
import SuccessDialog from '../../components/dialog/success'
import LoaderDialog from '../../components/dialog/loader'
import { useWeb3 } from '../../components/web3'
export default function NftPurchasedPage() {

    const web3Api = useWeb3();
  console.log(web3Api)
  
  
    //Craete function to listen the change in account changed and network changes
  
  
    //Create LoadAccounts Function
    const account =   web3Api.account;
    const router = useRouter();



    //Craete function to listen the change in account changed and network changes

    const providerChanged = (provider)=>{
        provider.on("accountsChanged",_=>window.location.reload());
        provider.on("chainChanged",_=>window.location.reload());

    }



    //Load Contracts Function
    const[nftContract,setNFtContract]= useState(null)
    const[marketContract,setMarketContract]= useState(null)
    const[nftAddress,setNFtAddress]= useState(null)
    const[marketAddress,setMarketAddress]= useState(null)
    const[purchasedItems,setpurchasedItems]= useState([])
    const[newPrice,setNewPrice]=useState(0)
    const[resellItems,setResellItems]= useState([])

const [isLoading,SetIsLoading]= useState(true)

    useEffect(()=>{
        const LoadContracts = async()=>{
            //Paths of Json File
            openLoaderModal()
            const nftContratFile =  await fetch("/abis/NFT.json");
            const marketContractFile = await fetch("/abis/NFTMarketPlace.json");

//Convert all to json
           const  convertNftContratFileToJson = await nftContratFile.json();
           const  convertMarketContractFileToJson = await marketContractFile.json();

//Get The ABI
           const markrtAbi = convertMarketContractFileToJson.abi;
           const nFTAbi = convertNftContratFileToJson.abi;


           const netWorkId =  await web3Api.web3.eth.net.getId();

           const nftNetWorkObject =  convertNftContratFileToJson.networks[netWorkId];
           const nftMarketWorkObject =  convertMarketContractFileToJson.networks[netWorkId];

           if(nftMarketWorkObject && nftMarketWorkObject){
            const nftAddress = nftNetWorkObject.address;
            setNFtAddress(nftAddress)
            const marketAddress = nftMarketWorkObject.address;
            setMarketAddress(marketAddress)

            const deployedNftContract = await new web3Api.web3.eth.Contract(nFTAbi,nftAddress);
            setNFtContract(deployedNftContract)
            const deployedMarketContract = await new web3Api.web3.eth.Contract(markrtAbi,marketAddress);
            setMarketContract(deployedMarketContract)

                                    //TODO:
      





            console.log(account);
            //Fetch all unsold items
            const data =  await deployedMarketContract.methods.getMyNFTPurchased().call({from:account})

            console.log(data)
               const items = await Promise.all(data.map(async item=>{
                const nftUrl = await deployedNftContract.methods.tokenURI(item.tokenId).call();
                console.log(nftUrl)
                console.log(item)
                const priceToWei = Web3.utils.fromWei((item.price).toString(),"ether")
                const metaData =  await axios.get(nftUrl);
              let myItem = {
                price:priceToWei,
                itemId : item.id,
                tokenId:item.tokenId,
                owner :item.owner,
                seller:item.seller,
                oldOwner :item.oldOwner,
                creator:item.creator,
                oldSeller :item.oldSeller,
  
                oldPrice:item.oldPrice,
                image:metaData.data.image,
                name:metaData.data.name,
                description:metaData.data.description,
                category:metaData.data.category,
  
                isResell:item.isResell,
                buttonTitle:"Process To Resell"
            }
            console.log(item)

            return myItem;
              }));
              

              setpurchasedItems(items);
              SetIsLoading(false)
              closeLoaderModal()

           
           }else{
              openSuccessModal()
           }


        }
        web3Api.web3&&account&&LoadContracts()

    },[account])
    //Resell Function

    const resellItemFunction = async(item,newPrice)=>{
      console.log(marketContract)
      console.log(nftAddress)


      if(marketContract){

        let marketFees = await marketContract.methods.gettheMarketFees().call()
        marketFees =marketFees.toString()
        const priceToWei = Web3.utils.toWei(newPrice,"ether")
        console.log(priceToWei);

      
   
        try{
            closePriceModal()
          await marketContract.methods.putItemToResell(nftAddress,item.itemId,priceToWei).send({from:account, value:marketFees});
          console.log("Resell NFt")
          router.push("/")

         }catch(e){
           console.log(e)

         }
       }

      
    
      
    }
    let [priceOpen, setPriceOpen] = useState(false)
    let inputPriceRef = useRef(null)
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
    }



const breadcrumbs = ["Explore", "Beautiful Artwork", "Purchased Items"]


return (
    <>
        <Head>
            <title>Purchased Items</title>
            <link rel="icon" href="/favicon.png" />
        </Head>

        <Header current={-1}></Header>

        <div className='main'>
            <div className='w-full 2xl:max-w-screen-2xl h-auto pt-[104px] m-auto'>
                <div className='flex flex-col mx-4 sm:mx-16 lg:mx-[9vw] space-y-6 py-12'>
                    <div className='flex flex-col space-y-6'>
                        <h1 className="page-title">Purchased Items</h1>
                        <div className='page-undertitle'>
                            This is a descriptive sub-headline that introduces the whole content of this text to the audience who is interested in reading about this topic.
                        </div>
                        <div className='resell-purchased-wrap flex flex-row items-center space-x-4'>
                            <div className='like-icon-wrap'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 504.66 560.71">
                                    <path d="M459.26,275.19c-24.83-.06-49.66-.06-74.49,.03-3.74,.01-5.13-.59-3.67-4.77,13.05-37.33,17.76-75.78,13.95-115.11-1.29-13.33-7.8-24.59-19.13-32.04-15.2-9.99-31.61-10.91-47.36-1.86-14.7,8.45-22.54,21.84-22.42,39.22,.07,10.02-.29,20-2.77,29.76-6.16,24.25-22.12,41.47-41.39,55.87-31.63,23.63-68.09,36.74-105.68,47.2-3.3,.92-5.2,.02-7.08-2.74-7.16-10.54-16.98-15.76-29.99-15.68-34.83,.24-69.66,.07-104.49,.09-10.99,0-14.74,3.74-14.74,14.67-.01,42.83,0,85.66,0,128.49,0,43.16-.01,86.32,.01,129.48,0,8.6,3.72,12.8,11.77,12.82,37.33,.08,74.66,.11,111.99-.05,7.96-.03,16.01-2.59,20.32-9.11,5.91-8.95,12.56-9.85,21.34-6.01,1.05,.46,2.26,.56,3.38,.88,27.66,7.74,55.66,13.88,84.51,14.11,47.83,.38,95.65,.18,143.48,.2,5.75,0,11.24-1.31,16.44-3.74,22.44-10.49,31.62-35.95,21.3-59.7-1.54-3.55-1.21-5.26,2.27-6.98,23.24-11.52,29.21-39.2,19.44-59.02-1.55-3.14-1.03-4.4,2.06-6.03,22-11.57,30.6-37.68,19.7-59.94-1.68-3.42-.74-4.46,2.21-5.9,11.38-5.58,19.11-14.75,22.55-26.72,8.51-29.62-12.72-57.37-43.51-57.44ZM115.89,537.99c-28.81,0-57.63-.1-86.44,.1-4.9,.03-6.19-1.59-6.17-6.3,.16-37.81,.09-75.61,.09-113.42,0-37.64,0-75.28,0-112.92,0-6.89,.02-6.91,6.91-6.91,28.65,0,57.29-.02,85.94,0,11.41,0,14.89,3.49,14.89,14.95,.02,69.78,.01,139.57,0,209.35,0,11.71-3.47,15.13-15.23,15.14Zm362.97-209.35c-3.93,8.25-10.98,12.31-20.13,12.34-17.67,.07-35.33-.03-53,.08-8.16,.05-12.62,5.26-11.7,13.27,.67,5.87,5.45,9.85,12.41,9.94,10.33,.14,20.67-.06,31,.1,9.37,.14,16.94,5.12,19.82,12.66,5.75,15.07-3.81,29.05-20.26,29.24-17.33,.2-34.66,.01-52,.09-6.61,.03-11.4,3.35-12.68,8.46-1.97,7.87,2.92,14.57,11.11,14.73,10.33,.21,20.67,0,31,.11,6.91,.08,13.23,1.83,17.69,7.64,5.3,6.89,6.68,14.25,2.98,22.47-4.05,9-11.46,12.18-20.56,12.27-17.33,.18-34.66,.03-52,.09-6.62,.03-11.41,3.77-12.35,9.37-1.25,7.47,3.66,13.75,11.28,13.9,10.5,.21,21-.03,31.5,.12,10.98,.16,19.21,6.19,21.85,15.71,3.59,12.96-6.99,26.22-21.51,26.7-7.33,.24-14.66,.06-22,.06-30.16,0-60.33-.1-90.49,.03-34.18,.15-67.78-4-100.78-12.94-7.23-1.96-14.41-4.15-21.71-5.86-3.87-.91-3.85-3.45-3.85-6.4,.02-31.5,.01-63,.01-94.49,0-30.83,.16-61.66-.15-92.49-.06-5.76,1.72-8.33,7.23-9.59,19.2-4.41,37.8-10.78,55.95-18.38,27.07-11.34,52.68-25.31,74.02-45.68,23.47-22.41,38.8-49.01,37.97-82.8-.11-4.48-.23-8.97,.73-13.44,2.1-9.82,10.84-17.21,20.55-17.14,9.72,.07,18.85,7.44,20.31,17.34,2.1,14.23,1.33,28.63,.68,42.91-.99,21.92-5.77,43.19-12.76,63.98q-4.08,12.15-16.54,12.16c-7.83,0-15.67-.05-23.5,.02-7.91,.07-12.78,4.5-12.84,11.52-.06,7.26,4.84,11.8,13.06,11.81,45.83,.04,91.66,0,137.49,.04,7.19,0,14.09,1.2,18.95,7.17,5.63,6.92,7.06,14.8,3.2,22.91ZM339.06,36.04c0,8.66-.13,17.32,.04,25.97,.13,6.35,5.4,11.29,11.6,11.3,6.04,.01,11.57-5.14,11.62-11.38,.14-16.81,.15-33.63,.01-50.44-.06-6.98-4.98-11.55-11.77-11.49-7.12,.06-11.4,4.25-11.5,11.57-.11,8.16-.03,16.31-.03,24.47h.02Zm66.08,59.97c4.81,4.36,10.51,4.38,15.61-.59,10.6-10.34,20.98-20.9,31.43-31.4,2.08-2.09,3.19-4.64,3.14-6.68,0-6.07-2.84-9.29-7.05-11.59-4.6-2.51-8.96-1.5-12.42,1.86-10.85,10.55-21.7,21.13-32.07,32.14-5.02,5.33-4.05,11.36,1.36,16.26Zm-123.89-.07c5.58,5.4,13.41,3.87,17.34-2.87,3.05-5.23,2.24-10.38-2.98-15.82-5.77-6-11.75-11.8-17.75-17.58-4.55-4.38-8.36-9.52-13.65-13.14-3.67-2.51-7.39-2.82-11.28-.66-4.04,2.24-6.74,5.39-6.81,11.07-.08,2.2,.9,4.83,2.99,6.93,10.67,10.73,21.27,21.55,32.15,32.07Zm-61.11,64.64c6.98,.11,13.97,.02,20.96,.03,6.82,0,13.64,0,20.46,0,.33,0,.67,0,1,0,7.8-.18,11.97-4.19,11.99-11.54,.02-6.97-4.65-11.68-12.04-11.73-14.14-.1-28.28-.11-42.41,0-7.33,.06-12.13,4.87-12.1,11.73,.03,7.17,4.4,11.4,12.15,11.52Zm206.76-11.62c-.03,7.17,4.09,11.47,11.39,11.61,7.15,.13,14.3,.03,21.45,.03v.02c3.49,0,6.98,0,10.47,0,3.66,0,7.32,.05,10.97-.02,7.8-.16,12.18-4.27,12.28-11.4,.09-6.83-4.63-11.74-12.03-11.82-14.46-.17-28.93-.17-43.39,0-6.63,.08-11.12,5.04-11.15,11.59ZM110.54,397.54c-.03-8.12-3.83-12.39-10.95-12.56-7.27-.17-12.18,4.4-12.21,12.15-.13,28.48-.13,56.97,0,85.45,.03,7.74,5.01,12.84,11.78,12.86,6.87,.02,11.35-4.99,11.38-12.94,.06-14.16,.02-28.32,.02-42.48,0-14.16,.04-28.32-.01-42.48Zm-11.64-33.31c6.18,.19,11.42-4.83,11.61-11.13,.22-7.22-3.98-11.86-10.89-12.03-7.04-.17-12.15,4.68-12.17,11.55-.02,5.86,5.47,11.43,11.45,11.61Z"/>
                                </svg>
                            </div>
                            <div className='resell-purchased__text flex-grow flex-col'>
                                <p className='text-white dark:text-gray-800 text-xl font-bold'>Good Job</p>
                              {!purchasedItems?  <p className='text-[#53CEC7] dark:text-gray-600 text-sm font-bold'>You Purchased {purchasedItems.length} NFTS</p>: <p className='text-[#53CEC7] dark:text-gray-600 text-sm font-bold'>Start To Purchased Items Now</p>}
                            </div>
                        </div>

                        {/* galleries */}
                        <ArtGallery4 galleries={purchasedItems}  closePriceModal={closePriceModal}>{{resellFucnction:resellItemFunction}}</ArtGallery4> 
                        <SuccessDialog show={successOpen} closeSuccessModal={closeSuccessModal}>{{modalIconUrl: "/assets/svg/attention-icon",msg:"PLease Connect MetaMask With Polygon NetWork",title:"Attention",buttonTitle:"Cancel"}}</SuccessDialog>
                        <LoaderDialog show={loaderOpen} openLoaderModal={openLoaderModal}></LoaderDialog>

                    </div>
                </div>
            </div>
        </div>
        
        <Footer></Footer>

    </>
)
}
