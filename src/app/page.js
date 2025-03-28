"use client"

import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import AddEntry from "./pages/addentry/page";
import { AccountContext } from "./components/Account";

export default function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true); // Added loading state for session check
    const { getSession } = useContext(AccountContext);

    useEffect(() => {
        // Check if the user is logged in
        const checkSession = async () => {
            try {
                await getSession(); // This will check if a session is available
                setIsLoggedIn(true);  // User is logged in
            } catch (err) {
                setIsLoggedIn(false);  // User is not logged in
            } finally {
                setLoading(false); // Session check is done, regardless of outcome
            }
        };

        checkSession();
    }, []);

    return (
        <div className="bg-grey-100 flex flex-col items-center justify-center min-h-screen sm:m-auto font-[family-name:var(--font-geist-sans)]">
            {(isLoggedIn) && (
                <AddEntry />
            )}

            <div className="bg-white px-32 py-14 rounded-lg drop-shadow-[0_1.2px_1.2px_rgba(99,94,255,0.542)]">
            {(!isLoggedIn) && (
                <div>
                    <h1 className="text-5xl font-extrabold text-indigo-500 text-center">Mood Book</h1>
                    <h2 className="text-3xl text-center text-indigo-400">Digital daily mood tracker</h2>
                </div>
            )}
            {(!isLoggedIn) && (
                <div className="flex flex-col items-center mt-7 gap-3">
                    <Link href="/pages/registration">
                        <button
                            className="bg-gradient-to-r from-indigo-500 via-indigo-400 to-violet-300 text-lg font-bold text-white p-2 w-64 rounded-md drop-shadow-[0_1.2px_1.2px_rgba(99,94,255,0.542)]"
                        >
                            Try it out!
                        </button>
                    </Link>
                    <Link href="/pages/login">
                        <button 
                            className="text-lg font-bold bg-white p-2 rounded-md border w-64 hover:text-indigo-400 transition ease-in-out delay-50 drop-shadow-[0_1.2px_1.2px_rgba(99,94,255,0.542)]"
                        >
                            Sign In
                        </button>
                    </Link>
                </div>
            )}
            </div>
        </div>
    );
}