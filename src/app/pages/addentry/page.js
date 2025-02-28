"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AccountContext } from "@/app/components/Account";
import Layout from "@/app/components/Layout";

function AddEntry() {
    const { getSession } = useContext(AccountContext);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        getSession()
            .then((session) => {
                if (session) {
                    console.log("Session retrieved.");
                    setUser(session);
                }
            })
            .catch((err) => {
                console.error("Error getting session:", err);
                router.push("/"); // Redirect to login if not authenticated
            })
            .finally(() => setLoading(false));
    }, [getSession, router]);

    const handleNewEntry = () => {
        router.push("/pages/newentry"); // Redirects to the entry creation page
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen sm:m-auto">
            <Layout>
                <div className="bg-white w-full px-36 py-24 rounded-lg drop-shadow-[0_1.2px_1.2px_rgba(99,94,255,0.542)]">
                    <div className="justify-center">
                        <h1 className="indigo-500 text-3xl font-bold mb-4 text-center">Add a new entry</h1>
                            <button
                                onClick={handleNewEntry}
                                className="text-lg bg-indigo-400 text-white hover:bg-indigo-500 p-2 w-64 rounded-md transition ease-in-out delay-50"
                            >
                                New Entry
                            </button>
                    </div>    
                </div>
            </Layout>
        </div>

    );
}

export default AddEntry;
