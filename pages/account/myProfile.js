import Head from 'next/head'
import Link from 'next/link'
import { useState,useEffect,useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClone } from '@fortawesome/free-regular-svg-icons'
import { faCopy, faShareAlt } from '@fortawesome/free-solid-svg-icons'
import Header from '../../components/header'
import Footer from '../../components/footer'
import Breadcrumbs from '../../components/breadcrumbs'
import ArtGallery3 from '../../components/explore/art-gallery3'
import { useWeb3 } from '../../components/web3'
import Web3 from "web3"
import axios from 'axios'
import SuccessDialog from '../../components/dialog/success'
import LoaderDialog from '../../components/dialog/loader'
function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function myProfilePage() {


	
    const web3Api = useWeb3();
    console.log(web3Api)
    
    
      //Craete function to listen the change in account changed and network changes
    
    
      //Create LoadAccounts Function
      const account =   web3Api.account;

	 
		const[noProvider,setNoProvider] = useState(true);
	
	
	  
	
		//Create LoadAccounts Function
		const[accountBalance,setAccountBalance]= useState(0);
	
	
		const [isLoading,setIsLoading] = useState(true);
	
	
		//Load Contracts Function
		const[nftContract,setNFtContract]= useState(null)
		const[marketContract,setMarketContract]= useState(null)
		const[nftAddress,setNFtAddress]= useState(null)
		const[marketAddress,setMarketAddress]= useState(null)
		const[unsoldItems,setUnsoldItems]= useState([])
	
		const[tokenContract,setTokenContract]= useState(null)
		const[tokenBalance,setTokenBalnce] =useState("0");
		const [creatorCommissionValueInwei,setCreatorCommissionValueInwei]= useState(null)
	
  
  
	  //Load Contracts Function
	  const[creathedItems,setcreathedItems]= useState([])
	  const[soldItems,setSoldItems]= useState([])
  
  
	  useEffect(()=>{
		  const LoadContracts = async()=>{
		   //Paths of Json File
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

		

			 if(account){
			  const data =  await deployedMarketContract.methods.getMyItemCreated().call({from:account})
			  const items = await Promise.all(data.map(async item=>{
			   const nftUrl = await deployedNftContract.methods.tokenURI(item.tokenId).call();
			   console.log(nftUrl)
			   console.log(item)
			   const priceToWei = Web3.utils.fromWei((item.price).toString(),"ether")
			   const metaData =  await axios.get(nftUrl);

			   let classChange;

			   if((item.sold||item.soldFirstTime)){
				   classChange = "Sold"
				   
			   }else{
				classChange = "Created"
			   }

  
  //TODO: fix this object
			 let myItem = {
				 
				ClassChange:classChange,
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
                category:classChange,

                isResell:item.isResell,
                soldFirstTime:item.soldFirstTime

		   }
  
		   return myItem;
  
			 }))
  
		
			 setcreathedItems(items)
			 
			 }
			
		   
  
  
  
   
			 }else{
                openSuccessModal()

			 }
  
  
  
		  }
		  setIsLoading(false) 
		  web3Api.web3&&LoadContracts()
  
	  },[account])

	//   setIsLoading(false)




    const [current, setCurrent] = useState(0)  

    const breadcrumbs = ["My Profile"]
    const btnCategories = [  "Created","Sold"]
  
    const [data, setData] = useState(creathedItems);
    const [category, setCategory] = useState("Created");
    
    useEffect(() => {
      const filteredData = creathedItems.filter((d) => d.category === category);
    
      if (category === "Created") {
        setData(creathedItems);
      } else {
        setData(filteredData);
      }
    }, [creathedItems,category]);
    
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
        openSuccessModal()
    }
    return (
        <>
            <Head>
                <title>My Profile</title>
                <link rel="icon" href="/favicon.png" />
            </Head>

            <Header current={-1}></Header>

            <div className='main'>
                <div className='w-full 2xl:max-w-screen-2xl h-auto pt-[104px] m-auto'>
                    <div className='flex flex-col mx-4 sm:mx-16 lg:mx-[9vw] space-y-6 py-12'>
                        <h1 className='page-title'>My Profile</h1>

                        <div className='flex flex-col space-y-6'>
                            <div className='profile__cover'>
                                <div class='profile__cover-wrap'>
                                    <img src="/assets/jpg/cover-my-profile.jpg"></img>
                                </div>
                                <div className='profile__avatar'>
                                    <div className="profile__avatar-wrap">
                                        <img src="/assets/jpg/ava-my-profile.jpg"></img>
                                    </div>
                                </div>
                            </div>

                            <div className='profile-bottom-wrap pt-16'>

                                <div className='dark:text-gray-800 '>
                                    <div class="profile__info">
                                        <h1 className='profile__address-title'>Account Address</h1>
                                        <div className="profile__address-wrap">
                                            <div className='profile__address'>{account}</div>
                                            <div className="flex flex-row space-x-4 text-[#FAD804] text-2xl mr-3">
                                                <button className="copy-button"  onClick={() => {navigator.clipboard.writeText(`${account}`)}}
        >
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M4.5 6.25C4.5 5.2835 5.2835 4.5 6.25 4.5H13.25C14.2165 4.5 15 5.2835 15 6.25V9H17.75C18.7165 9 19.5 9.7835 19.5 10.75V17.75C19.5 18.7165 18.7165 19.5 17.75 19.5H10.75C9.7835 19.5 9 18.7165 9 17.75V15H6.25C5.2835 15 4.5 14.2165 4.5 13.25V6.25ZM9 13.5V10.75C9 9.7835 9.7835 9 10.75 9H13.5V6.25C13.5 6.11193 13.3881 6 13.25 6H6.25C6.11193 6 6 6.11193 6 6.25V13.25C6 13.3881 6.11193 13.5 6.25 13.5H9ZM10.75 10.5C10.6119 10.5 10.5 10.6119 10.5 10.75V17.75C10.5 17.8881 10.6119 18 10.75 18H17.75C17.8881 18 18 17.8881 18 17.75V10.75C18 10.6119 17.8881 10.5 17.75 10.5H10.75Z"/>
                                                    </svg>

                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='profile__list-head'>

                                        {/* categories */}
                                        <div className='filters-wrap flex flex-row space-x-2'>
                                            {btnCategories.map((item, index) => (
                                            <button key={"btn-category" + index.toString()} className={classNames(index === current ? 'filter-button_active filter-button' : 'filter-button', '')} onClick={() => {setCurrent(index)
                                                setCategory(item)
                                            }}>{item}</button>
                                            ))}
                                        </div>
            
                                        <div className='profile__list-count'>
                                            <div className='profile__count-title'>NFT Count</div>
                                            <div className='profile__count-number'>
                                                <p className=''>{creathedItems.length}</p>
                                            </div>
                                        </div>

                                    </div>
                                    
                                </div>
                            </div>

                            {/* galleries */}
                            {
                                    !data.length?                                <a className="empty-messege">
                                    NO NFTs At This Category
                                </a>:    <ArtGallery3 galleries={data}></ArtGallery3> 
                            }
                         
                        </div>
                    </div>
                </div>
            </div>
            <SuccessDialog show={successOpen} closeSuccessModal={closeSuccessModal}>{{modalIconUrl: "/assets/svg/attention-icon",msg:"PLease Connect MetaMask With Polygon NetWork",title:"Attention",buttonTitle:"Cancel"}}</SuccessDialog>

            <Footer></Footer>
        </>
    )
}
