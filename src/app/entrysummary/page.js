"use client";

import { useState } from "react";
import Sidebar from '../components/Sidebar';
import Link from "next/link";


export default function EntrySummary({ mood, description, activities, date, time, onSave }) {
    const [isSideBarOpen, setSideBar] = useState(false);

    return (
        <div className="text-center p-5">
                <div>
                    <div>
                        <h1 className="text-4xl font-bold text-indigo-500">Summary</h1>
                        <h2 className="mt-3 text-2xl text-gray-700"><strong>Mood:</strong> {mood}</h2>
                        <h2 className="text-2xl text-gray-700"><strong>Feelings:</strong> {description?.join(", ")}</h2>
                        <h2 className="text-2xl text-gray-700"><strong>Activities:</strong> {activities?.join(", ")}</h2>
                        <h2 className="text-2xl text-gray-700"><strong>Date:</strong> {date}</h2>
                        <h2 className="text-2xl text-gray-700"><strong>Time:</strong> {time}</h2>
                    </div>
                    <button
                        className="bg-gradient-to-r from-indigo-500 via-indigo-400 to-violet-300 w-full mt-10 p-2 text-2xl text-white rounded-md"
                        onClick={onSave} // Save entry when clicked
                    >
                        Save
                    </button>
                    <Link href="/pages/addentry">
                        <p className="text-2xl mt-4">Cancel</p>
                    </Link>
                </div>  
            </div>
    );
}
