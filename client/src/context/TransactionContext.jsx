import { createContext, useEffect, useState } from "react";
import { ethers } from 'ethers';
import { contractABI, contractAddress } from "../utils/constant";

export const TransactionContext = createContext();

const { ethereum } = window;

const getEthereumContract = async () => {
    const { ethereum } = window;

    if (!ethereum) {
        alert("Please connect to MetaMask!");
        return null;
    }

    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

    return transactionContract;
};



export const TransactionProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState("");
    const [formData, setformData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
    const [isLoading, setLoading] =useState(false);
    const [transactionCount,setTransactionCount]= useState(localStorage.getItem('transactionCount'));
    const [transactions,setTransactions]= useState([]);
    const handleChange = (e, name) => {
        setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
    };

    const getAllTransactions = async ()=>{
        try{
            if(!ethereum) return alert("Please Install MetaMask");
            const transactionContract = await  getEthereumContract();
            const availableTransactions= await transactionContract.getAllTransactions(); 
            const structuredTransactions= availableTransactions.map((transaction)=>({
                addressTo: transaction.receiver,
                addressFrom: transaction.sender,
                timestamp: new Date(Number(transaction.timestamp) *1000).toLocaleString(),
                message: transaction.message,
                keyword: transaction.keyword,
                amount: Number(transaction.amount)/(10 ** 18),
            }));
            setTransactions(structuredTransactions);
        }
        catch(error){
            console.log(error);
        }
    }

    const checkIfWalletIsConnected = async () => {
        try {
            if (!ethereum) return alert("Please connect to MetaMask");

            const accounts = await ethereum.request({ method: 'eth_accounts' });
            if (accounts.length) {
                setCurrentAccount(accounts[0]);
                getAllTransactions();
            } else {
                console.log("No Accounts Found");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const checkIfTransactionsExist= async ()=>{
        try{
            const transactionContract = await  getEthereumContract();
            const transactionCount = await transactionContract.getTransactionCount();
            window.localStorage.setItem("transactionCount",transactionCount);
        }
        catch(error){
            console.log(error);
            alert("An error occurred. Please try again.");
        }
    }

    const connectWallet = async () => {
        try {
            if (!ethereum) return alert("Please connect to MetaMask");
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);
            throw new Error("No Ethereum Object");
        }
    };

    const sendTransactions = async () => {
        try {
            if (!ethereum) return alert("Please connect to MetaMask");
            
            const { addressTo, amount, keyword, message } = formData;
            console.log(formData);
            
            const transactionContract = await  getEthereumContract();
            
            // Parse the amount into Wei (Hexadecimal format)

            const parsedAmount = amount*1000000000000000000;
            console.log(parsedAmount);
            // Send transaction with proper hexadecimal value
            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208', // 21000 gas in hex (this is the default value)
                    value: parsedAmount.toString(16), // Convert to hex string
                }]
            });
            console.log("Transaction sent!");
            console.log(transactionContract);
            // Call smart contract function to record transaction
            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);
            console.log("Smart contract function called!");
    
            setLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
    
            // Wait for the transaction to be mined
            await transactionHash.wait();
    
            setLoading(false);
            console.log(`Success - ${transactionHash.hash}`);
    
            // Update transaction count
            const transactionCount = await transactionContract.getTransactionCount();
            console.log(transactionCount.toString());
            setTransactionCount(Number(transactionCount));
    
        } catch (error) {
            console.log(error);
            alert("An error occurred. Please try again.");
        }
    };

    useEffect(() => {
        checkIfWalletIsConnected();
        checkIfTransactionsExist();
    }, []);

    return (
        <TransactionContext.Provider value={{ connectWallet,transactions,isLoading, currentAccount, formData, setformData, handleChange, sendTransactions }}>
            {children}
        </TransactionContext.Provider>
    );
};
