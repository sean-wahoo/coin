import React from "react";
import Cookies from "universal-cookie";
import Navbar from "../components/Navbar";
import Head from "next/head";
import useSWR from "swr";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";
import Dashboard from "../components/Dashboard";

const cookies = new Cookies();

export default function Index() {
    const router = useRouter();
    const sessionToken = cookies.get("sessionToken");
    const fetcher = () =>
        jwt.verify(sessionToken, process.env.NEXT_PUBLIC_SECRET_JWT_KEY);
    const { data: verified, error } = useSWR(
        `${process.env.NEXT_PUBLIC_CRYPTO_API}`,
        fetcher
    );

    if (error) {
        if (error.name == "TokenExpiredError") {
            cookies.remove("sessionToken");
            router.push("/login");
            return;
        }
    }
    if (!verified) return <>loading</>;

    if (verified) {
        return (
            <html lang="en">
                <Head>
                    <title>New Crypto & API</title>
                    <script
                        src="https://kit.fontawesome.com/eb9214e190.js"
                        crossOrigin="anonymous"
                    ></script>
                </Head>
                <body>
                    <Navbar authData={verified} />
                    <Dashboard authData={verified} />
                </body>
            </html>
        );
    }
}
