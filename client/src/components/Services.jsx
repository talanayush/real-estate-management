import { BsShieldFillCheck } from 'react-icons/bs';
import {BiSearchAlt} from 'react-icons/bi';
import {RiHeart2Fill} from 'react-icons/ri';
import ServiceCard from './ServiceCard';
export default function Services(){
    return(
        <div className=' flex flex-col md:flex-row w-full justify-center items-center pb-16'>
            <div className=' flex mf:flex-row flex-col items-center justify-between md:p-20 py-12 px-4'>
                <div className=' flex-1 flex flex-col justify-start items-start'>
                    <h1 className=' text-white text-3xl sm:text-5xl py-2 text-gradient'>Services That <br /> we provide</h1>
                </div>

            </div>

            <div className=' flex-1 flex flex-col justify-start items-center'>
                <ServiceCard 
                color="bg-[#2952E3]" 
                title="security Guranteed" 
                icon={<BsShieldFillCheck fontSize={21} className=' text-white'/>} 
                subtitle="Security Is Guranteed.We Always maintain privacy and quality of the product." 
                />
                <ServiceCard 
                color="bg-[#8945F8]" 
                title="security Guranteed" 
                icon={<BiSearchAlt fontSize={21} className=' text-white'/>} 
                subtitle="Security Is Guranteed.We Always maintain privacy and quality of the product." 
                />
                <ServiceCard 
                color="bg-[#F84550]" 
                title="security Guranteed" 
                icon={<RiHeart2Fill fontSize={21} className=' text-white'/>} 
                subtitle="Security Is Guranteed.We Always maintain privacy and quality of the product." 

                />
            
            </div>

        </div>
    );
}