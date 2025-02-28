"use client"

import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import AddEntry from "./pages/addentry/page";
import { AccountContext } from "./components/Account";
import Status from "./components/Status";

export default function Home() {
    const [hasEntries, setHasEntries] = useState(false);
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
        
        /*
        if (typeof window !== "undefined") {
            const entries = localStorage.getItem("entries");
            console.log("Entries in localStorage:", entries, typeof entries);
    
            if (entries) {
                try {
                    // Converts to an object
                    const parsedEntries = JSON.parse(entries);
                    console.log("Parsed entries:", parsedEntries, typeof parsedEntries);
    
                    // Ensure parsedEntries is an array
                    let safeEntries = [];
    
                    if (Array.isArray(parsedEntries)) {
                        safeEntries = parsedEntries;
                    } 
                    
                    else if (typeof parsedEntries === "object") {
                        console.log("Entries stored as object, extracting values...");
                         // Extract values if stored as object
                        safeEntries = Object.values(parsedEntries);
                    }
    
                    console.log("Final safeEntries:", safeEntries, Array.isArray(safeEntries));
    
                    if (safeEntries.length > 0) {
                        setHasEntries(true);
                        
                    }
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                }
            }
        }
    }, [getSession]);  
    */ 
    }, []);

    return (
        <div className="bg-grey-100 flex flex-col items-center justify-center min-h-screen sm:m-auto font-[family-name:var(--font-geist-sans)]">
            {(isLoggedIn) && (
                <AddEntry />
            )}

            <div className="bg-white px-32 py-14 rounded-lg drop-shadow-[0_1.2px_1.2px_rgba(99,94,255,0.542)]">
            {(!isLoggedIn) && (
                <div className="pb-6">
                    <h1 className="text-5xl font-extrabold text-indigo-400 text-center">Mood Book</h1>
                    <h2 className="text-3xl text-center text-indigo-300">Digital daily mood tracker</h2>
                </div>
            )}
            {(!isLoggedIn) && (
                <div className="flex flex-col items-center gap-3">
                    <Link href="/pages/registration">
                        <button
                            className="bg-gradient-to-r from-indigo-500 via-indigo-400 to-violet-300 text-lg text-white p-2 w-64 rounded-md drop-shadow-[0_1.2px_1.2px_rgba(99,94,255,0.542)]"
                        >
                            Try it out!
                        </button>
                    </Link>
                    <Link href="/pages/login">
                        <button 
                            className="text-lg bg-white p-2 rounded-md border w-64 hover:text-indigo-400 transition ease-in-out delay-50 drop-shadow-[0_1.2px_1.2px_rgba(99,94,255,0.542)]"
                        >
                            Sign In
                        </button>
                    </Link>
                    {/*
                    <div className="flex gap-4">
                        <p className="text-gray-400 text-sm">Not registered?</p>
                        <a href="/pages/registration" className="text-indigo-400 text-sm">Register</a>
                    </div>
                    */}
                </div>
            )}
            </div>
        </div>
    );
}