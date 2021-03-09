import React, { useState } from "react";
import Axios from "axios";
import Cookies from "universal-cookie";

export default function Dashboard(props) {
    const [sendCoinWalletId, setSendCoinWalletId] = useState("");
    const [sendCoinAmount, setSendCoinAmount] = useState(0);
    const { authData } = props;

    const cookies = new Cookies();
    const sessionToken = cookies.get("sessionToken");

    const onSendCoinSubmit = (sendCoinData) => {
        Axios.post(
            `${process.env.NEXT_PUBLIC_CRYPTO_API}/blockchain/newBlock`,
            sendCoinData,
            {
                headers: {
                    Authorization: sessionToken,
                },
            }
        )
            .then((data) => {
                console.log(data);
            })
            .catch((err) => console.error(err));
    };

    console.log(authData);

    return (
        <div className="bg-white w-auto h-full flex flex-col m-4">
            <div className="bg-gray-200 m-2 w-auto rounded shadow-sm flex flex-row p-4 justify-start items-center">
                <h1>Send Coin</h1>
                <form
                    className="flex flex-col w-full"
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSendCoinSubmit({
                            amount: parseInt(sendCoinAmount),
                            sender: authData.publicKey,
                            recipient: sendCoinWalletId,
                        });
                    }}
                >
                    <textarea
                        type="text"
                        id="walletId"
                        onChange={(e) => {
                            setSendCoinWalletId(e.target.value);
                        }}
                    />
                    <input
                        type="text"
                        id="amount"
                        className="ml-4"
                        onChange={(e) => {
                            setSendCoinAmount(e.target.value);
                        }}
                    />
                    <button type="submit">send</button>
                </form>
            </div>
            <div className="bg-gray-100 m-2 w-auto h-auto rounded shadow-sm flex flex-row p-4 justify-start items-center">
                <div className="flex flex-col mr-auto font-red-hat-display">
                    <h6 className="text-gray-500 text-sm font-red-hat-display">
                        {authData.username} has:
                    </h6>
                    <h1 className="text-5xl">25800 coins</h1>
                </div>
            </div>
        </div>
    );
}
