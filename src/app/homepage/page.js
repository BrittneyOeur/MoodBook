"use client";

import MainContent from "../pages/maincontent/page";
import React, { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AccountContext } from "../components/Account";
import Layout from "../components/Layout";

function Homepage() {
    const [entries, setEntries] = useState([]);
    const [currentEntry, setCurrentEntry] = useState({ mood: "", description: [], activities: [] });
    const { getSession } = useContext(AccountContext);
    const router = useRouter();

    const handleMoodChange = (event) => {
        setCurrentEntry((prevEntry) => ({ ...prevEntry, mood: event.target.value }));
    };

    const handleDescriptionChange = (event) => {
        const { value, checked } = event.target;
        setCurrentEntry((prevEntry) => {
            let updatedDescriptions = checked
                ? [...prevEntry.description, value]
                : prevEntry.description.filter(item => item !== value);
            return { ...prevEntry, description: updatedDescriptions };
        });
    };

    const handleActivitiesChange = (event) => {
        const { value, checked } = event.target;
        setCurrentEntry((prevEntry) => {
            let updatedActivities = checked
                ? [...prevEntry.activities, value]
                : prevEntry.activities.filter(item => item !== value);
            return { ...prevEntry, activities: updatedActivities };
        });
    };

    const handleSave = async () => {
        try {
            const session = await getSession();
            const token = session?.idToken?.jwtToken;

            if (!token) {
                console.error("No token found");
                return;
            }

            // Make a POST request to save the entry
            const res = await fetch("/api/entry", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    date: new Date().toISOString(),
                    mood: currentEntry.mood,
                    description: currentEntry.description,
                    activities: currentEntry.activities,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to save entry to MongoDB");
            }

            const result = await res.json();

            // Update local storage and state after successful save
            setEntries((prevEntries) => {
                const updatedEntries = [...prevEntries, result.entry];
                localStorage.setItem("entries", JSON.stringify(updatedEntries));
                return updatedEntries;
            });

            // Reset the current entry for a new one
            setCurrentEntry({ mood: "", description: [], activities: [] });

            // Redirect to homepage after saving
            router.push("/pages/addentry");

        } catch (error) {
            console.error("Error saving entry:", error.message);
        }
    };

    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen sm:m-auto">
                <Layout>
                    <div className="bg-white w-full px-36 py-24 rounded-lg drop-shadow-[0_1.2px_1.2px_rgba(99,94,255,0.542)]">
                        <MainContent
                            date={new Date().toISOString()}
                            mood={currentEntry.mood}
                            description={currentEntry.description}
                            activities={currentEntry.activities}
                            handleMoodChange={handleMoodChange}
                            handleDescriptionChange={handleDescriptionChange}
                            handleActivitiesChange={handleActivitiesChange}
                            handleSaveEntry={handleSave}
                        />
                    </div>
                </Layout>
            </div>
        </>
    );
}

export default Homepage;