"use client";

import Link from "next/link";

export default function EntrySummary({ mood, description, activities, date, time, onSave }) {
    return (
        <div className="text-center p-5">
            <div>
                <div>
                    <h1 className="text-4xl font-bold text-indigo-500">Summary</h1>
                    <h2 className="mt-3 text-2xl text-indigo-500"><strong>Mood: </strong> 
                        <span className="text-indigo-400">{mood}</span>
                    </h2>
                    <h2 className="text-2xl text-indigo-500"><strong>Feelings: </strong> 
                        <span className="text-indigo-400">{description?.join(", ")}</span>
                    </h2>
                    <h2 className="text-2xl text-indigo-500"><strong>Activities: </strong> 
                        <span className="text-indigo-400">{activities?.join(", ")}</span>
                    </h2>
                    <h2 className="text-2xl text-indigo-500"><strong>Date: </strong> 
                        <span className="text-indigo-400">{date}</span> 
                    </h2>
                    <h2 className="text-2xl text-indigo-500"><strong>Time: </strong>
                        <span className="text-indigo-400">{time}</span>
                    </h2>
                </div>
                    <button
                        className="bg-indigo-500 hover:bg-indigo-400 w-full mt-10 p-2 text-2xl duration-100 ease-in-out text-white rounded-md"
                        onClick={onSave} // Save entry when clicked
                    >
                        Save
                    </button>
                    <Link href="/pages/addentry">
                        <button className="w-full p-2 text-2xl mt-3 bg-indigo-400 hover:bg-indigo-300 duration-100 ease-in-out text-white rounded-md">
                            Cancel
                        </button>
                    </Link>
            </div>  
        </div>
    );
}
