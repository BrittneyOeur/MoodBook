"use client";

import MainContent from "../maincontent/page";
import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AccountContext } from "@/app/components/Account";
import Layout from "@/app/components/Layout";

function Edit() {
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

    useEffect(() => {
        const storedEntry = localStorage.getItem("entryToEdit");
        if (storedEntry) {
            setCurrentEntry(JSON.parse(storedEntry));
        } else {
            router.push("/pages/savedentries"); // Redirect if no entry is found
        }
    }, []);

    // Updates the mood of the current entry when the user selects a new mood
    const handleMoodChange = (event) => {
        const newMood = event.target.value;
        setCurrentEntry((prevEntry) => ({
            ...prevEntry,
            mood: newMood,
            description: [], // Reset description when mood changes
        }));
    };

    // Updates the description list in currentEntry when a user checks or unchecks a checkbox
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

    const handleUpdate = async () => {
        if (!currentEntry._id) {
            console.error("No entry ID found for updating");
            return;
        }
    
        try {
            const session = await getSession();
            const token = session?.idToken?.jwtToken;
    
            if (!token) {
                console.error("No token found");
                return;
            }
    
            const res = await fetch("/api/entry", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    entryId: currentEntry._id,
                    date: currentEntry.date,
                    time: currentEntry.time,
                    mood: currentEntry.mood,
                    description: currentEntry.description,
                    activities: currentEntry.activities,
                }),
            });
    
            const result = await res.json();
    
            if (!res.ok) {
                throw new Error(result.error || "Failed to update entry in MongoDB");
            }
    
            setEntries((prevEntries) =>
                prevEntries.map((entry) =>
                    entry._id === currentEntry._id ? result.entry : entry
                )
            );
    
            setCurrentEntry({ mood: "", description: [], activities: [] });
            router.push("/pages/saved-entries");
        } catch (error) {
            console.error("Error updating entry:", error.message);
        }
    };

    // Prevent rendering MainContent before currentEntry data is set
    if (!isMounted || !currentEntry.date) {
        return null; 
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen sm:m-auto">
                <Layout>
                    <div className="bg-white w-full px-36 py-24 rounded-lg drop-shadow-[0_1.2px_1.2px_rgba(99,94,255,0.542)]">
                        <MainContent
                            mood={currentEntry.mood}
                            description={currentEntry.description}
                            activities={currentEntry.activities}
                            handleMoodChange={handleMoodChange}
                            handleDescriptionChange={handleDescriptionChange}
                            handleActivitiesChange={handleActivitiesChange}
                            handleSaveEntry={handleUpdate}
                        />
                    </div>
                </Layout>
            </div>
        </>
    );
};

export default Edit;
