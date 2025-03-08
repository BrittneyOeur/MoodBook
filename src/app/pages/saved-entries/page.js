"use client";

import { useState, useEffect, useContext } from "react";
import { AccountContext } from "@/app/components/Account";
import { useRouter } from "next/navigation";
import Layout from "@/app/components/Layout";
import { Tabs, Tab, Box } from "@mui/material";
import PropTypes from "prop-types";

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
}
  
CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};
  
function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
}

function SavedEntries() {
    const { getSession } = useContext(AccountContext);
    const currentMonth = new Date().getMonth(); // Returns 0-11
    const currentYear = new Date().getFullYear(); // Current year

    const [entries, setEntries] = useState([]);
    const [selectedTab, setSelectedTab] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [entryToDelete, setEntryToDelete] = useState(null);

    const router = useRouter();
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const filteredEntries = entries.filter((entry) => {
        const entryDate = new Date(entry.date);
        return entryDate.getMonth() === selectedTab && entryDate.getFullYear() === selectedYear;
    });

    const handleChange = (event, newValue) => {
        setSelectedTab(newValue)
    };

    // Function to confirm deletion
    const confirmDelete = (entryId) => {
        setEntryToDelete(entryId);
        setIsModalOpen(true);
    };

    // Deletes an specific entry
    const deleteEntry = async (entryId) => {
        try {
            if (!entryId) {
                console.error("Entry ID is undefined");
                return;
            }
    
            const session = await getSession();
            const token = session?.idToken?.jwtToken;
    
            if (!token) {
                console.error("No token found");
                return;
            }
    
            const res = await fetch("/api/entry", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ entryId }),
            });
    
            const result = await res.json();
    
            if (!res.ok) {
                throw new Error(result.error || "Failed to delete entry from MongoDB");
            }

            // Remove the deleted entry from the state
            setEntries((prevEntries) => prevEntries.filter((entry) => entry._id !== entryId));
        } catch (error) {
            console.error("Error deleting entry:", error.message);
        }
    };

    // Updates an specific entry
    const updateEntry = async (entryId, updatedData) => {
        try {
            if (!entryId) {
                console.error("Entry ID is undefined");
                return;
            }
    
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
                body: JSON.stringify({ entryId, ...updatedData }),
            });
    
            const result = await res.json();
    
            if (!res.ok) {
                throw new Error(result.error || "Failed to update entry in MongoDB");
            }
    
            localStorage.setItem("entryToEdit", JSON.stringify(result.entry));
            router.push("/pages/edit");
        } catch (error) {
            console.error("Error updating entry:", error.message);
        }
    };    

    // Fetches entries
    useEffect(() => {
        async function fetchEntries() {
            try {
                const session = await getSession();
                const token = session?.idToken?.jwtToken;

                if (!token) {
                    console.error("No user token found.");
                    setEntries([]);
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
    }, [getSession, router.pathname]);


    return (
        <div className="text-center p-5">
            <div className="flex flex-col items-center justify-center min-h-screen sm:m-auto">
                <Layout>
                    <div className="bg-white w-full py-12 rounded-lg drop-shadow-[0_1.2px_1.2px_rgba(99,94,255,0.542)]">
                        <h1 className="text-4xl text-indigo-400 mb-6 font-bold">Saved Entries</h1>

                        {/* Year Dropdown */}
                        <div className="flex justify-center mb-4">
                            <select 
                                id="year-select" 
                                className="border rounded p-2 text-indigo-400 font-bold"
                                value={selectedYear} 
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                            >
                                {Array.from({ length: 10 }, (_, i) => currentYear - 5 + i).map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>

                        <div className="bg-indigo-400">
                            <div className="bg-white">
                                <Box sx={{ width: '100%' }}>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                        <Tabs 
                                            value={selectedTab} 
                                            onChange={handleChange}
                                            sx={{
                                                "& .MuiTabs-indicator": { backgroundColor: "#7F9CF5" }, 
                                                "& .MuiTab-root": { color: "#667EEA", fontFamily: "inherit" },
                                                "& .Mui-selected": { color: "#7F9CF5" },
                                            }}
                                        >
                                            {months.map((month, index) => (
                                                <Tab key={index} label={month} {...a11yProps(index)} />
                                            ))}
                                        </Tabs>
                                    </Box>
                                    {months.map((month, index) => (
                                        <CustomTabPanel key={index} value={selectedTab} index={index}>
                                            {filteredEntries.length > 0 ? (
                                                filteredEntries.map((entry) => (
                                                    <div key={entry._id} className="border p-3 my-2 w-full rounded-md">
                                                        <div className="text-center">
                                                            <p><strong>Date:</strong> {entry.date}</p>
                                                            <p><strong>Time:</strong> {entry.time}</p>
                                                            <p><strong>Mood:</strong> {entry.mood}</p>
                                                            <p><strong>Description:</strong> {entry.description?.join(", ") || "None"}</p>
                                                            <p><strong>Activities:</strong> {entry.activities?.join(", ") || "None"}</p>
                                                        </div>
                                                        <div className="flex justify-center py-4 text-center gap-4">
                                                            <button 
                                                                className="bg-indigo-400 hover:bg-indigo-300 text-white px-5 py-2 font-bold rounded-md transition duration-100 ease-in-out" 
                                                                onClick={() => updateEntry(entry._id, entry)}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button 
                                                                className="bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 font-bold rounded-md transition duration-100 ease-in-out"
                                                                onClick={() => confirmDelete(entry._id)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p>No entries found for {months[selectedTab]}.</p>
                                            )}
                                        </CustomTabPanel>
                                    ))}
                                </Box>
                            </div>
                        </div>
                    </div>
                </Layout>
            </div>

            {/* Delete Confirmation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-lg w-96 text-center">
                        <h2 className="text-xl font-bold">Confirm Deletion</h2>
                        <p className="mt-2 text-lg">
                            Are you sure you want to delete this entry?
                        </p>
                        <div className="flex justify-center gap-4 mt-4">
                            <button 
                                className="bg-red-500 text-white px-4 py-2 rounded-md"
                                onClick={deleteEntry}
                            >
                                Confirm
                            </button>
                            <button 
                                className="bg-gray-300 px-4 py-2 rounded-md"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SavedEntries;