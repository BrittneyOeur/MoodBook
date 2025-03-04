"use client"

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { CognitoUserPool } from "amazon-cognito-identity-js";

import Layout from "@/app/components/Layout";
import { AccountContext } from "@/app/components/Account";

function ChangeEmail() {
    const [newEmail, setNewEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    const { getSession } = useContext(AccountContext);

    // Cognito User Pool
    const poolData = {
        UserPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
        ClientId: process.env.NEXT_PUBLIC_CLIENT_ID
    };

    const userPool = new CognitoUserPool(poolData);

    const handleEmailChange = async (e) => {
        setNewEmail(e.target.value);
    };

    const handleSubmit = async () => {
        if (!newEmail) {
            setError("Please enter an valid email address.");
            return;
        }

        try {
            const session = getSession();
            const user = userPool.getCurrentUser();

            if (!user) {
                setError("User not found.");
                return;
            }

            user.getSession((err, session) => {
                if (err) {
                    setError("Error fetching session.");
                    console.error(err);
                    return;
                }

                user.updateAttributes([{ Name: "email", Value: newEmail }], (err, result) => {
                    if (err) {
                        setError("Error updating email.");
                        console.error(err);
                    }

                    else {
                        setMessage("Email updated successfully. Check your inbox for verification.");
                        setTimeout(() => router.push("/pages/verification"), 3000);
                    }
                });
            });
        } catch (err) {
            setError("Failed to update email.");
            console.error(err);
        }
    };

    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen sm:m-auto">
                <Layout>
                    <div className="bg-white w-full px-36 py-24 rounded-lg drop-shadow-[0_1.2px_1.2px_rgba(99,94,255,0.542)]">
                        <h1>Enter the new email address:</h1>
                        <label 
                            htmlFor="confirm-password" 
                            className="text-indigo-500"
                        >
                            Change Email:
                        </label>
                        <input
                            className="w-full px-2 py-1 mt-1 border rounded-md outline outline-2 outline-indigo-300 focus:outline-indigo-700"
                            type="email"
                            id="change-email"
                            onChange={handleEmailChange}
                            required
                        />
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 rounded-md bg-indigo-400 text-white font-bold hover:bg-indigo-300 transition duration-200"
                        >
                            Update Email
                        </button>
                            {message && <p className="text-green-500 mt-2">{message}</p>}
                            {error && <p className="text-red-500 mt-2">{error}</p>}
                    </div>
                </Layout>
            </div>
        </>
    )
};

export default ChangeEmail;