import React, { useState, useRef, useEffect } from "react";
import Cookies from "universal-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faWallet,
    faShoppingCart,
    faCog,
    faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { config } from "@fortawesome/fontawesome-svg-core";
import { useRouter } from "next/router";
const jwt = require("jsonwebtoken");

export default function Navbar(props) {
    const { authData } = props;
    const listener = useRef();
    config.autoAddCss = false;
    const [dropdown, setDropdown] = useState(false);
    const cookies = new Cookies();
    const sessionToken = cookies.get("sessionToken");
    const router = useRouter();
    let isAuth;
    if (sessionToken) {
        jwt.verify(
            sessionToken,
            process.env.NEXT_PUBLIC_SECRET_JWT_KEY,
            (err, decoded) => {
                if (err) {
                    if (err.name == "TokenExpiredError") {
                        cookies.remove("sessionToken");
                        router.push("/login");
                        return;
                    }
                }
                isAuth = decoded;
            }
        );
    }

    const userDataArea = isAuth ? (
        <div className="flex flex-col items-start absolute right-0 top-0 p-4 px-4 bg-gray-200 w-auto select-none text-xl">
            <span
                className="cursor-pointer text-right flex flex-row items-center pr-4 "
                onClick={() => setDropdown(!dropdown)}
            >
                <FontAwesomeIcon icon={faUserCircle} className="mr-3" />
                {isAuth.username}
            </span>
        </div>
    ) : (
        <div className="p-4 text-xl content-end">
            <a className="px-2" href="/login">
                Login
            </a>
            <a className="px-2" href="/register">
                Register
            </a>
        </div>
    );

    const handleClick = (e) => {
        if (listener.current?.contains(e.target)) {
            return;
        }
        setDropdown(false);
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    });

    const logout = () => {
        cookies.remove("sessionToken");
        router.push("/login");
    };

    return (
        <>
            <nav className="flex flex-row items-center bg-gray-200 relative">
                {userDataArea}
                <p className="opacity-0 text-xl p-4">dummy</p>
            </nav>
            {dropdown && (
                <div
                    className="bg-gray-50 border-gray-400 shadow absolute flex flex-col items-center m-2 p-4 w-min w-auto right-2 rounded-xl select-none "
                    id="dropdown"
                    ref={listener}
                >
                    <FontAwesomeIcon
                        size="3x"
                        icon={faUserCircle}
                        color="darkgray"
                    />
                    <h1 className="text-2xl text-gray-900">
                        {authData.username}
                    </h1>
                    <div className="text-gray-400 flex flex-row inline text-sm text-center whitespace-nowrap mb-2">
                        {authData.email}
                    </div>
                    <div className="flex flex-row justify-around items-center font-medium">
                        <div className="flex flex-col justify-center items-center ml-4 mr-2 text-center">
                            <FontAwesomeIcon
                                icon={faWallet}
                                size="2x"
                                className="bg-gray-200 p-4 rounded-full box-content hover:bg-gray-300 transition cursor-pointer"
                            />
                            Wallet
                        </div>
                        <div className="flex flex-col justify-center items-center mx-2">
                            <FontAwesomeIcon
                                icon={faShoppingCart}
                                size="2x"
                                className="bg-gray-200 p-4 rounded-full box-content hover:bg-gray-300 transition cursor-pointer"
                            />
                            Transactions
                        </div>
                        <div className="flex flex-col justify-center items-center ml-2 mr-4">
                            <FontAwesomeIcon
                                icon={faCog}
                                size="2x"
                                className="bg-gray-200 p-4 rounded-full box-content hover:bg-gray-300 transition cursor-pointer"
                            />
                            Settings
                        </div>
                    </div>
                    <h1
                        className="text-red-800 hover:underline text-xl mt-2 cursor-pointer"
                        onClick={logout}
                    >
                        Logout
                    </h1>
                </div>
            )}
        </>
    );
}
