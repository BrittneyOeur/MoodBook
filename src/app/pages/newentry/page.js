"use client";

import MainContent from "../maincontent/page";
import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AccountContext } from "@/app/components/Account";
import Layout from "@/app/components/Layout";

function NewEntry() {
    const [entries, setEntries] = useState([]);
    const [currentEntry, setCurrentEntry] = useState({ mood: "", description: [], activities: [] });
    const [isMounted, setIsMounted] = useState(false); // Prevent SSR mismatch
    const { getSession } = useContext(AccountContext);
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted) {
            const savedEntries = localStorage.getItem("entries");
            if (savedEntries) {
                try {
                    setEntries(JSON.parse(savedEntries));
                } catch (error) {
                    console.error("Failed to parse saved entries:", error);
                }
            }
        }
    }, [isMounted]);

    // Updates the mood of the current entry when the user selects a new mood
    const handleMoodChange = (event) => {
        // Creates new object and copies everything from prevEntry,
        // updates only the mood property to the new value event.target.value
        setCurrentEntry((prevEntry) => ({ ...prevEntry, mood: event.target.value }));
    };

    // Updates the description list in currentEntry when a user checks or unchecks a checkbox
    const handleDescriptionChange = (event) => {
        // Object destructuring to extract value and checked from event.target
        // value = gets the value of the checkbox (e.g., "Cooking")
        // checked = gets true if the checkbox is checked, false if unchecked
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
        console.log("--- Current Entry Before Saving:", currentEntry);

        try {
            const session = await getSession();
            const token = session?.idToken?.jwtToken;

            if (!token) {
                console.error("No token found");
                return;
            }

            const res = await fetch("/api/entry", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    date: new Date(), 
                    time: currentEntry.time, // Store the current time when entry is created
                    mood: currentEntry.mood,
                    description: currentEntry.description,
                    activities: currentEntry.activities,
                }),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || "Failed to save entry to MongoDB");
            }

            console.log("--- NEW ENTRY SAVED: ", result);
            setEntries([...entries, result.entry]);
            setCurrentEntry({ mood: "", description: [], activities: [] });
            router.push("/pages/addentry");
        } catch (error) {
            console.error("Error saving entry:", error.message);
        }
    };

    if (!isMounted) {
        return null; // Avoid rendering on the server
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen sm:m-auto">
                <Layout>
                    <div className="bg-white w-full px-36 py-24 rounded-lg drop-shadow-[0_1.2px_1.2px_rgba(99,94,255,0.542)]">
                        <MainContent
                            date={new Date().toDateString()}
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
};

export default NewEntry;