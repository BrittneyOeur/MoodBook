"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
    const [isSideBarOpen, setSideBar] = useState(false);

    const toggleSidebar = () => {
        if (!isSideBarOpen) {
            const openSideBarAudio = new Audio("/sounds/open-sidebar.mp3");
            openSideBarAudio.play().catch(err => console.error("Error playing audio:", err));
        }

        else {
            const closeSideBarAudio = new Audio("/sounds/close-sidebar.mp3");
            closeSideBarAudio.play().catch(err => console.error("Error playing audio:", err));
        }

        setSideBar((prevState) => !prevState);
    };

    return (
        <div className="relative">
            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-80 bg-indigo-300 z-50 transform transition-transform duration-300 ease-in-out
                    ${isSideBarOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <Sidebar />
            </div>

            {/* Button to toggle sidebar */}
            <button
                onClick={toggleSidebar}
                className="p-2 bg-indigo-500 text-white rounded-md fixed top-4 left-4 z-50"
            >
                ☰
            </button>

            {/* Page Content with Transition */}
            <div className={`transition-all duration-300 ${isSideBarOpen ? "ml-64" : "ml-0"}`}>
                {children}
            </div>
        </div>
    );
}