import { AiOutlineShoppingCart } from "react-icons/ai";
import { SiEthereum } from "react-icons/si";
import { useNavigate } from "react-router-dom";
export default function Home() {

    const navigate=useNavigate();

    return (

        <div className="flex flex-col w-full justify-center items-center h-screen text-white">
            {/* Advertisement Section */}
            <div className="text-center">
                <h1 className="text-4xl sm:text-6xl font-bold mb-4">
                    Real Estate Meets Crypto
                </h1>
                <p className="text-lg sm:text-xl font-light mb-8">
                    Discover a revolutionary way to invest, tokenize, and trade real estate assets.
                </p>
            </div>

            {/* Buttons */}
            <div className="flex space-x-5">
                <button
                    className="flex items-center bg-[#2952e3] p-4 rounded-full font-semibold text-lg hover:bg-[#2546bd] transition-colors"
                    onClick={() => navigate(`/marketplace`)}
                >
                    <AiOutlineShoppingCart className="mr-2 text-2xl" />
                    Marketplace
                </button>

                <button
                    className="flex items-center bg-[#56ccf2] p-4 rounded-full font-semibold text-lg hover:bg-[#2f80ed] transition-colors"
                    onClick={() => navigate(`/welcome`)}
                >
                    <SiEthereum className="mr-2 text-2xl" />
                    Send Tokens
                </button>
            </div>
        </div>
    );
}
