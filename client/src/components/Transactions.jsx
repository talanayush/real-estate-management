import { useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";

import dummy from "../utils/dummy.js"; 

import { shortenAddress } from "../utils/shortenAddress";


import TransactionCard from "./TransactionCard";
export default function Transactions(){

    const {currentAccount,transactions} =useContext(TransactionContext);
    return(
        <div className=" flex w-full justify-center items-center 2xl:px-20 gradient-bg-transactions">

            <div className=" flex flex-col md:p-12 py-12 px-4" >
                {currentAccount ? (
                    <h3 className="text-white text-3xl text-center my-2">Latest Transactions</h3>
                ) : (
                    <h3 className="text-white text-3xl text-center my-2">Connect Your Acoount to See the transactions</h3>
                )}
                <div className=" flex flex-wrap justify-center items-center mt-10">
                    {transactions.map((transaction,i)=>(
                        <TransactionCard key={i} {...transaction} />
                    ))}
                </div>
            </div>

        </div>
    );
}