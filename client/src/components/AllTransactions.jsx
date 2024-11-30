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

export default function AllTransactions(){
    
    return(

        <>
        <Navbar></Navbar>

        <Transactions></Transactions>
        <Footer></Footer>
        </>
    );
}