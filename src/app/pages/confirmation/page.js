"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CognitoIdentityProviderClient, ConfirmSignUpCommand, ResendConfirmationCodeCommand } from "@aws-sdk/client-cognito-identity-provider";

const REGION = process.env.NEXT_PUBLIC_REGION;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;

const client = new CognitoIdentityProviderClient({ region: REGION });

function Confirmation() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [confirmationCode, setConfirmationCode] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResending, setIsResending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");
        setMessage("");

        try {
            const confirmSignUpCommand = new ConfirmSignUpCommand({
                ClientId: CLIENT_ID,
                Username: email,
                ConfirmationCode: confirmationCode
            });

            await client.send(confirmSignUpCommand);

            alert("Account confirmed! Please log in.");
            router.push("/pages/login");
        } catch (err) {
            console.error("Confirmation error: ", err);
            setError("Invalid code or email. Please try again.");
        }
        setIsSubmitting(false);
    };

    const handleResendCode = async () => {
        if (!email) {
            setError("Please enter your email first.");
            return;
        }

        setIsResending(true);
        setError("");
        setMessage("");

        try {
            const resendCommand = new ResendConfirmationCodeCommand({
                ClientId: CLIENT_ID,
                Username: email
            });

            await client.send(resendCommand);

            setMessage("A new confirmation code has been sent to your email.")
        } catch(err) {
            console.error("Resend error: ", err);
            setError("Failed to resend the confirmation code. Please try again.");
        }
        setIsResending(false);
    };

    return (
        <>
        <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-white px-36 py-10 rounded-lg drop-shadow-[0_1.2px_1.2px_rgba(99,94,255,0.542)]">
            <h1 className="text-4xl text-indigo-500 text-center font-bold">Confirm Your Email</h1>
            <p className="text-indigo-500 text-center"></p>
            <form
                onSubmit={handleSubmit}
                className="w-96"
            >
                <div className="mt-4">
                    <label className="text-indigo-500 font-bold">Email: </label>
                    <input
                        className="w-full px-2 py-1 mt-1 border rounded-md outline-indigo-300 focus:outline-indigo-400"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mt-4">
                    <label className="text-indigo-500 font-bold">Confirmation Code:</label>
                    <input
                        className="w-full px-2 py-1 mt-1 border rounded-md outline-indigo-300 focus:outline-indigo-400"
                        type="text"
                        value={confirmationCode}
                        onChange={(e) => setConfirmationCode(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="text-red-500 mt-2">{error}</p>}
                {message && <p className="text-green-500 mt-2">{message}</p>}
                <div>
                    <button
                        className="bg-indigo-500 text-white font-bold w-full mt-5 p-2 rounded-md"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Confirming..." : "Confirm"}
                    </button>
                    <button
                        className="bg-indigo-400 text-white font-bold w-full mt-5 p-2 rounded-md"
                        onClick={handleResendCode}
                        disabled={isResending}
                    >
                        {isResending ? "Resending..." : "Resend confirmation code"}
                    </button>
                </div> 
            </form>
        </div>
        </div>
        </>
    );
};

export default Confirmation;