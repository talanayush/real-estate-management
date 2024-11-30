import { AiFillPlayCircle } from "react-icons/ai";
import {SiEthereum} from "react-icons/si"
import {BsInfoCircle} from "react-icons/bs"
import Input from "./Input";
import Loader from "./Loader";
import { useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";
import { shortenAddress } from "../utils/shortenAddress";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Transactions from "./Transactions";

const commonStyles = "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white"; 

export default function Welcome(){
    const {connectWallet, currentAccount,formData, handleChange, sendTransactions,isLoading}= useContext(TransactionContext);

    const handleSubmit=(e)=>{
        
        const {addressTo,amount,keyword,message}= formData;
        e.preventDefault();

        if(!addressTo || !amount || !keyword || !message) return;
        console.log(formData);
        sendTransactions();

    }
    return(

        <>
        <Navbar></Navbar>
        <div className=" flex w-full justify-center items-center">

            <div className=" flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">

                <div className=" flex flex-1 justify-start flex-col mf:mr-10">
                    <h1 className=" text-3xl sm:text-5xl text-white text-gradient py-1">Send Crpto <br /> across the World</h1>
                    <p className=" text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
                      Explore the realestate touch with the crypto  
                    </p>
                    {
                        !currentAccount &&
                        (
                            <button
                                type="button"
                                onClick={connectWallet}
                                className=" flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 cursor-pointer rounded-full hover:bg-[#2546bd]"
                            >
                                <p className=" text-white text-base font-semibold">Connect Wallet</p>
                            </button>
                        )

                    }
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 w-full mt-10">
                        <div className={`rounded-tl-2xl ${commonStyles}`}>
                            Reliability
                        </div>
                        <div className={`${commonStyles}`}>
                            Security
                        </div>
                        <div className={`rounded-tr-2xl ${commonStyles}`}>
                            Ethereum
                        </div>
                        <div className={`rounded-bl-2xl ${commonStyles}`}>
                            Web 3.0
                        </div>
                        <div className={` ${commonStyles}`}>
                            Web 3.0
                        </div>
                        <div className={`rounded-br-2xl ${commonStyles}`}>
                            Web 3.0
                        </div>
                    </div>

                </div>
                <div className=" flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
                    <div className=" p-3 justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card white-glassmorphism">
                        <div className="flex justify-between items-start">
                            <div className=" w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                                <SiEthereum fontSize={21} color="#fff" />

                            </div>
                            <BsInfoCircle fontSize={17} color="#fff" />

                        </div>
                        <div>
                            <p className=" text-white font-light text-sm mt-8">
                                {shortenAddress(currentAccount)}   
                            </p>
                            <p className=" text-white font-semibold text-lg mt-1">
                                Ethereum   
                            </p>
                        </div>

                    </div>
                    <div className=" p-5 w-full flex-col justify-start items-center blue-glassmorphism">
                        <Input placeholder="Address To" name="addressTo" type="text" handleChange={handleChange} />
                        <Input placeholder="Amount (ETH)" name="amount" type="number" handleChange={handleChange} />
                        <Input placeholder="Keyword(Gif)" name="keyword" type="text" handleChange={handleChange} />
                        <Input placeholder="Enter Message" name="message" type="text" handleChange={handleChange} />

                        <div className="h-[1px] w-full bg-gray-400 my-2" />

                        {
                            isLoading ? (
                                <Loader />
                            ) : (
                                <button className=" text-white w-full nmt-2 border-[1px] p-2 border-[#3d4f7c] cursor-pointer rounded-full" type="button" onClick={handleSubmit}>
                                    Send Now
                                </button>
                            )
                        }

                    </div>
                    

                </div>
                

            </div>

        </div>
        <Transactions></Transactions>
        <Footer></Footer>
        </>
    );
}