import React, { useState } from "react";
import Axios from "axios";
import Cookies from "universal-cookie";
import { useRouter } from "next/router";

export default function Login() {
    const [loginInput, setLoginInput] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    const cookies = new Cookies();

    if (cookies.get("sessionToken")) router.push("/");

    const loginUser = (loginPayload) => {
        Axios.post(
            `${process.env.NEXT_PUBLIC_CRYPTO_API}/auth/signin`,
            loginPayload
        )
            .then((data) => {
                const token = data.data.sessionToken;
                console.log(data);
                cookies.set("sessionToken", token, {
                    path: "/",
                });

                router.push("/");
            })
            .catch((err) => {
                const message = err.response.data.error;
                setError(message);
            });
    };

    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                {/* <link
                    href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css"
                    rel="stylesheet"
                /> */}
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <style></style>
                <title>New Crypto Login</title>
            </head>
            <body className="bg-gray-100 min-w-screen min-h-screen">
                <div className="w-screen h-screen flex flex-row items-center justify-center">
                    <div className="flex flex-col items-center my-auto my-auto">
                        <p
                            className="text-center text-6xl md:text-9xl mb-4"
                            id="register_text"
                        >
                            Login
                        </p>
                        <form
                            className="flex flex-col items-center justify-between bg-white border border-gray-50 rounded mt-8 w-auto p-6"
                            onSubmit={(e) => {
                                e.preventDefault();
                                loginUser({
                                    username: loginInput,
                                    email: loginInput,
                                    password,
                                });
                            }}
                        >
                            <div className="flex flex-col justify-start items-start mb-1">
                                <label
                                    htmlFor="username"
                                    className="font-semibold"
                                >
                                    Username or Email
                                </label>
                                <input
                                    type="text"
                                    className="rounded p-2 bg-gray-100 focus:outline-none focus:ring focus:border-blue-300"
                                    id="username"
                                    onChange={(e) => {
                                        setLoginInput(e.target.value);
                                    }}
                                    required
                                />
                            </div>
                            <div className="flex flex-col justify-start items-start mb-1">
                                <label
                                    htmlFor="password"
                                    className="font-semibold"
                                >
                                    Password
                                </label>
                                <input
                                    type="password"
                                    className="rounded p-2 bg-gray-100 focus:outline-none focus:ring focus:border-blue-300"
                                    id="password"
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                    }}
                                    required
                                />
                            </div>
                            <button
                                className="p-4 py-2 my-2 font-semibold text-lg rounded-md text-white bg-blue-green"
                                type="submit"
                            >
                                Login
                            </button>
                            <p className="text-center">
                                Don't have an account?{" "}
                                <a
                                    href="/register"
                                    className="text-blue-green font-semibold"
                                >
                                    Register
                                </a>
                            </p>
                        </form>
                        {error && (
                            <div className="bg-red-50 border border-dashed border-red-300 rounded-md mt-2 max-w-prose mx-4">
                                <h2 className="my-auto mx-auto text-red-700 p-4 text-center">
                                    {error}
                                </h2>
                            </div>
                        )}
                    </div>
                </div>
            </body>
        </html>
    );
}
