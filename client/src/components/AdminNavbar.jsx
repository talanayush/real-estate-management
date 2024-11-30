import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
// import NavbarItem from "./NavbarItem";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { account } from "./appwrite";
export default function Navbar() {
    const [toggleMenu, setToggleMenu] = useState();

    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    async function getUser() {
        if (!user) {
            console.log("User Info display request!");

            try {
                const userData = await account.get();
                setUser(userData);
                console.log(userData);
            } catch (error) {
                console.error("Failed to fetch user data", error);
            }
        }
    }

    async function handleLogout() {
        try {
            await account.deleteSession("current");
            console.log("Logged out successfully");
            setUser(null);
            navigate("/");
        } catch (error) {
            console.error("Failed to logout", error);
        }
    }

    async function handleLogin() {
        navigate("/login");
    }

    useEffect(() => {
        getUser();
    }, []);

    const NavbarItem = ({ title, route }) => (
        <li className="mx-4 cursor-pointer">
            <Link to={route} className="hover:text-gray-300">
                {title}
            </Link>
        </li>
    );
    
    return (
        <nav className="w-full flex md:justify-center justify-between items-center pt-8 ">
            <div className=" md:flex-[0.5] flex-initial justify-center items-center">
                <img src="" alt="" />
            </div>
            <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
                {[
                    { title: "Approve Requests", route: "/admin/marketplace" },
                    { title: "Transactions", route: "/allTransactions" },
                    
                ].map((item, index) => (
                    <NavbarItem
                        key={item.title + index}
                        title={item.title}
                        route={item.route}
                    />
                ))}
                <li className="bg-[#2952e3] py-2 px-3 mx-4 cursor-pointer rounded-2xl hover:bg-[#2546bd]">
                    {user ? (
                        <div className="flex items-center space-x-4">
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <button onClick={handleLogin}>Login</button>
                        </div>
                    )}
                </li>
            </ul>
            <div className=" flex-relative ">
                {toggleMenu ? (
                    <AiOutlineClose
                        fontSize={28}
                        className=" text-white md:hidden cursor-pointer "
                        onClick={() => setToggleMenu(false)}
                    />
                ) : (
                    <HiMenuAlt4
                        fontSize={28}
                        className=" text-white md:hidden cursor-pointer "
                        onClick={() => setToggleMenu(true)}
                    />
                )}
                {toggleMenu && (
                    <ul
                        className=" z-10 fixed top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none
                    
                     flex flex-col  justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in"
                    >
                        <li className=" text-xl w-full m-2 ">
                            <AiOutlineClose
                                onClick={() => setToggleMenu(false)}
                            />
                        </li>
                        {["Market", "Exchange", "Tutorial", "Wallets"].map(
                            (item, index) => (
                                <NavbarItem
                                    key={item + index}
                                    title={item}
                                    classProps=" my-2 text-lg"
                                />
                            )
                        )}
                    </ul>
                )}
            </div>
        </nav>
    );
}
