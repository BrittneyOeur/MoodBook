"use client"

import React, { useState } from "react";
import { moods, typesOfActivities } from "../data/data";
import EntrySummary from "../entrysummary";

function InputOptionDescription({ option, description, handleDescriptionChange }) {
    const inputStyle = `w-4 h-4 text-indigo-500 border-gray-300 rounded focus:ring-indigo-400`;

    return (
        <input
            type="checkbox"
            value={option}
            checked={description.includes(option)}
            onChange={handleDescriptionChange}
            className={inputStyle}
        />
    )
}

function InputOptionActivities({ option, activities, handleActivitiesChange }) {
    const inputStyle = `w-4 h-4 text-indigo-500 border-gray-300 rounded focus:ring-indigo-400`;

    return (
        <input
            type="checkbox"
            value={option}
            checked={activities.includes(option)}
            onChange={handleActivitiesChange}
            className={inputStyle}
        />
    )
}

function MainContent({ entries, mood, description, activities, handleMoodChange, handleDescriptionChange, handleActivitiesChange, month, day, year }) {
    const [step, setStep] = useState(1);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showSummary, setSummary] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault(); // Prevents form submission
    
        if (step === 1 && !mood) {
            alert("Please make an selection.");
            return;
        }
    
        if ((step === 2 && !mood === "Very Unpleasant") || 
            (step === 2 && !mood === "Unpleasant") || 
            (step === 2 && !mood === "Neutral") || 
            (step === 2 && !mood === "Pleasant") || 
            (step === 2 && !mood === "Very Pleasant") && 
            (!description || description.length === 0)) {
            alert("Please make an selection.");
            return;
        }
    
        if (step < 3) {
            setStep(step + 1);
        } else {
            setSummary(true);
        }
    };
    
    return (
        <div className="bg-white">
            <div className="flex flex-col items-center justify-center">
                {!showSummary ? (
                    <div className="text-center">
                    <h1 className="text-5xl font-extrabold text-indigo-500 flex">
                        {(step === 2 || step === 3) && (
                            <span 
                                className="flex cursor-pointer"
                                onClick={() => setStep(step - 1)}
                            >
                                &larr;
                            </span>
                        )}

                        {month} {day}, {year}
                    </h1>
                    <h2 className="text-3xl text-center text-indigo-400 pt-5">
                        {step === 1
                            ? "How are you feeling?"
                            : step === 2
                            ? "What best describe this feeling?"
                            : "What activities have you done?"
                        }
                    </h2>
                    <div className="pt-5 flex gap-5">
                        {step === 1 && (
                            <select
                                className="text-lg block w-full p-2.5 text-indigo-400 bg-white border-2 border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={mood}
                                onChange={handleMoodChange}
                                >
                            <option value="" disabled className="text-gray-500">
                                Select Mood:
                            </option>
                                {moods.map((moodOption, index) => (
                                    <option key={index} value={moodOption.value}>
                                        {moodOption.label}
                                    </option>
                                ))}
                            </select>
                        )} 

                        {step === 2 && mood === "Very Unpleasant" && (
                            <div className="relative w-full max-w-md text-lg">
                                {/* Dropdown Toggle Button */}
                                <button
                                    onClick={() => setDropdownOpen((prev) => !prev)}
                                    className="text-left block w-full p-2.5 text-indigo-400 bg-white border-2 border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {Array.isArray(description) && description.length > 0 ? description.join(", ") : "Select feelings..."}
                                </button>

                                {/* Dropdown Menu */}
                                {dropdownOpen && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-indigo-300 rounded-md shadow-lg max-h-32 overflow-y-auto">
                                        {["Angry", "Overwhelmed", "Hopeless", "Depressed", "Other"].map((option) => (
                                            <label key={option} className="flex items-center space-x-2 p-2 hover:bg-indigo-100">
                                                <InputOptionDescription
                                                    option={option}
                                                    description={description}
                                                    handleDescriptionChange={handleDescriptionChange}
                                                />
                                                <span className="text-indigo-400">{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {step === 2 && mood === "Unpleasant" && (
                            <div className="relative w-full max-w-md text-lg">
                                {/* Dropdown Toggle Button */}
                                <button
                                    onClick={() => setDropdownOpen((prev) => !prev)}
                                    className="text-left block w-full p-2.5 text-indigo-400 bg-white border-2 border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {Array.isArray(description) && description.length > 0 ? description.join(", ") : "Select feelings..."}
                                </button>

                                {/* Dropdown Menu */}
                                {dropdownOpen && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-indigo-300 rounded-md shadow-lg max-h-32 overflow-y-auto">
                                        {["Irritated", "Tired", "Disappointed", "Stressed", "Other"].map((option) => (
                                            <label key={option} className="flex items-center space-x-2 p-2 hover:bg-indigo-100">
                                                <InputOptionDescription
                                                    option={option}
                                                    description={description}
                                                    handleDescriptionChange={handleDescriptionChange}
                                                />
                                                <span className="text-indigo-400">{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {step === 2 && mood === "Neutral" && (
                            <div className="relative w-full max-w-md text-lg">
                                {/* Dropdown Toggle Button */}
                                <button
                                    onClick={() => setDropdownOpen((prev) => !prev)}
                                    className="text-left block w-full p-2.5 text-indigo-400 bg-white border-2 border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {Array.isArray(description) && description.length > 0 ? description.join(", ") : "Select feelings..."}
                                </button>

                                {/* Dropdown Menu */}
                                {dropdownOpen && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-indigo-300 rounded-md shadow-lg max-h-32 overflow-y-auto">
                                        {["Relaxed", "Content", "Indifferent", "Calm", "Other"].map((option) => (
                                            <label key={option} className="flex items-center space-x-2 p-2 hover:bg-indigo-100">
                                                <InputOptionDescription
                                                    option={option}
                                                    description={description}
                                                    handleDescriptionChange={handleDescriptionChange}
                                                />
                                                <span className="text-indigo-400">{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {step === 2 && mood === "Pleasant" && (
                            <div className="relative w-full max-w-md text-lg">
                                {/* Dropdown Toggle Button */}
                                <button
                                    onClick={() => setDropdownOpen((prev) => !prev)}
                                    className="text-left block w-full p-2.5 text-indigo-400 bg-white border-2 border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {Array.isArray(description) && description.length > 0 ? description.join(", ") : "Select feelings..."}
                                </button>

                                {/* Dropdown Menu */}
                                {dropdownOpen && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-indigo-300 rounded-md shadow-lg max-h-32 overflow-y-auto">
                                        {["Happy", "Hopeful", "Peaceful", "Comfortable", "Other"].map((option) => (
                                            <label key={option} className="flex items-center space-x-2 p-2 hover:bg-indigo-100">
                                                <InputOptionDescription
                                                    option={option}
                                                    description={description}
                                                    handleDescriptionChange={handleDescriptionChange}
                                                />
                                                <span className="text-indigo-400">{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {step === 2 && mood === "Very Pleasant" && (
                            <div className="relative w-full max-w-md text-lg">
                                {/* Dropdown Toggle Button */}
                                <button
                                    onClick={() => setDropdownOpen((prev) => !prev)}
                                    className="text-left block w-full p-2.5 text-indigo-400 bg-white border-2 border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {Array.isArray(description) && description.length > 0 ? description.join(", ") : "Select feelings..."}
                                </button>

                                {/* Dropdown Menu */}
                                {dropdownOpen && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-indigo-300 rounded-md shadow-lg max-h-32 overflow-y-auto">
                                        {["Overjoyed", "Confident", "Ecstatic", "Loved", "Other"].map((option) => (
                                            <label key={option} className="flex items-center space-x-2 p-2 hover:bg-indigo-100">
                                                <InputOptionDescription
                                                    option={option}
                                                    description={description}
                                                    handleDescriptionChange={handleDescriptionChange}
                                                />
                                                <span className="text-indigo-400">{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        {step === 3 && (     
                            <div className="relative w-full max-w-md text-lg">  
                                {/* Dropdown Toggle Button */}
                                <button
                                    onClick={() => setDropdownOpen((prev) => !prev)}
                                    className="text-left block w-full p-2.5 text-indigo-400 bg-white border-2 border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {Array.isArray(activities) && activities.length > 0 ? activities.join(", ") : "Select activities..."}
                                </button>

                                {/* Dropdown Menu */}
                                {dropdownOpen && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-indigo-300 rounded-md shadow-lg max-h-32 overflow-y-auto">
                                        {typesOfActivities.map(({ value, label }) => (
                                            <label key={value} className="flex items-center space-x-2 p-2 hover:bg-indigo-100">
                                                <InputOptionActivities
                                                    option={value}
                                                    activities={activities}
                                                    handleActivitiesChange={handleActivitiesChange}
                                                />
                                                <span className="text-indigo-400">{label}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="text-lg px-6 py-2 bg-indigo-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        >
                            {step < 3 ? 'Next' : 'Submit'}
                        </button>
                    </div>
                </div>
                ) : (
                    <EntrySummary 
                        mood={mood} 
                        description={description} 
                        activities={activities} 
                        month={month} 
                        day={day} 
                        year={year} 
                    />
                )}
            </div>
        </div>
    )
};

export default MainContent;