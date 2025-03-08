"use client";

import Layout from "@/app/components/Layout";
import { useState, useEffect, useContext } from "react";
import "@/app/Calendar.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { AccountContext } from "@/app/components/Account"; // Import AccountContext for authentication

function Calendar() {
    const [entries, setEntries] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [entriesOnSelectedDate, setEntriesOnSelectedDate] = useState([]);

    const { getSession } = useContext(AccountContext);

    // Fetch entries from the database when the component loads
    useEffect(() => {
        async function fetchEntries() {
            try {
                const session = await getSession();
                const token = session?.idToken?.jwtToken;

                if (!token) {
                    console.error("No user token found.");
                    return;
                }

                const response = await fetch("/api/entry", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch entries");
                }

                const data = await response.json();
                setEntries(data.entries || []);
            } catch (error) {
                console.error("Error fetching entries:", error.message);
            }
        }

        fetchEntries();
    }, [getSession]);
    
    // Handle date click and filter entries for the selected date
    const handleDateClick = (info) => {
        const clickedDate = info.dateStr; // YYYY-MM-DD format from FullCalendar
        setSelectedDate(clickedDate);
        setSelectedEvent(null); // Clear selected event when selecting a new date
    
        const entriesForDate = entries.filter((entry) => {
            try {
                const parsedDate = new Date(entry.date);
                if (isNaN(parsedDate.getTime())) {
                    console.error("Invalid date:", entry.date);
                    return false;
                }
    
                const formattedEntryDate = parsedDate.toISOString().split("T")[0]; // Convert to YYYY-MM-DD
                return formattedEntryDate === clickedDate;
            } catch (error) {
                console.error("Error parsing date:", entry.date, error);
                return false;
            }
        });
    
        setEntriesOnSelectedDate(entriesForDate);
    };
    
    // Create event objects for FullCalendar
    const events = entries.map((entry) => {
        try {
            // Extract the date part from the long-form date string
            const parsedDate = new Date(entry.date);
            if (isNaN(parsedDate.getTime())) {
                console.error("Invalid date:", entry.date);
                return null; // Skip invalid dates
            }
    
            return {
                title: entry.mood,
                date: parsedDate.toISOString().split("T")[0], // Convert to YYYY-MM-DD
                description: entry.description?.join(", ") || "None",
                activities: entry.activities?.join(", ") || "None",
                className: "dot-event",
            };
        } catch (error) {
            console.error("Error parsing date:", entry.date, error);
            return null;
        }
    }).filter(Boolean); // Remove any null values from the array
    
    const clickEvent = (info) => {
        const eventDetails = {
            date: info.event.startStr,
            title: info.event.title,
            description: info.event.extendedProps.description,
            activities: info.event.extendedProps.activities,
        };

        setSelectedEvent(eventDetails); // Set the clicked event data
    };

    return (
        <div className="text-center px-24">
            <div className="flex flex-col items-center justify-center min-h-screen sm:m-auto">
                <Layout>
                    <div className="bg-white py-12 rounded-lg drop-shadow-[0_1.2px_1.2px_rgba(99,94,255,0.542)]">
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            selectable={true}
                            headerToolbar={{
                                start: 'prev next',
                                center: 'title',
                                end: 'today',
                            }}
                            dateClick={handleDateClick}
                            events={events}
                            height={"auto"}
                            unselectAuto={true}
                            eventClick={clickEvent}
                        />
    
                        {/* Display the selected event details */}
                        {selectedEvent ? (
                            <div className="mt-5">
                                <ul>
                                    <li><strong>Date:</strong> {selectedEvent.date}</li>
                                    <li><strong>Mood:</strong> {selectedEvent.title}</li>
                                    <li><strong>Description:</strong> {selectedEvent.description || "None"}</li>
                                    <li><strong>Activities:</strong> {selectedEvent.activities || "None"}</li>
                                </ul>
                            </div>
                        ) : (
                            // Display entries for the selected date if no event is selected
                            selectedDate && (
                                <div className="mt-5">
                                    <h3 className="text-xl">Entries for {selectedDate}</h3>
                                    {entriesOnSelectedDate.length > 0 ? (
                                        <ul>
                                            {entriesOnSelectedDate.map((entry) => (
                                                <li key={entry._id}>
                                                    <strong>Mood:</strong> {entry.mood} | 
                                                    <strong>Description:</strong> {entry.description?.join(", ") || "None"} | 
                                                    <strong>Activities:</strong> {entry.activities?.join(", ") || "None"}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No entries for this date.</p>
                                    )}
                                </div>
                            )
                        )}
                    </div>
                </Layout>
            </div>
        </div>
    );    
}

export default Calendar;