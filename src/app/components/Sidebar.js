import { useEffect, useState, useContext } from "react";
import { AccountContext } from "./Account";
import Link from "next/link";

function Options({ text }) {
    const buttonStyle = `relative text-indigo-300 text-2xl m-8 font-bold hover:text-indigo-500 transition duration-200 ease-in-out 
    before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-indigo-500 before:transition-all before:duration-300 
    hover:before:w-full`;
    return <button className={buttonStyle}>{text}</button>;
}

function Sidebar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const { getSession, logout } = useContext(AccountContext);

    useEffect(() => {
        const checkSession = async () => {
            try { 
                await getSession();
                setIsLoggedIn(true);
            } catch (err) {
                setIsLoggedIn(false);  // User is not logged in
            } finally {
                setLoading(false); // Session check is done, regardless of outcome
            }
        };
        checkSession();
    })

    return (
        <div className="bg-white p-12 absolute inset-y-0 left-0 flex flex-col items-center justify-center drop-shadow-[0_1.2px_1.2px_rgba(99,94,255,0.542)]">
            <h1 className="font-extrabold text-5xl text-indigo-500 mt-10 pb-20 text-center">
                <Link href="/">Mood Book</Link>
            </h1>
            <div className="flex flex-col justify-center text-center">
                <div>
                    {isLoggedIn && (
                        <div>
                            <Link href="/pages/saved-entries">
                                <Options text="Saved Entries" />
                            </Link>
                            <Link href="/pages/calendar">
                                <Options text="Calendar" />
                            </Link>
                            <Link href="/account/profile">
                                <Options text="Profile" />
                            </Link>
                            <Link href="/pages/addentry">
                                <button className="bg-gradient-to-r from-indigo-500 via-indigo-400 to-violet-300 text-white text-2xl mt-4 font-bold rounded-md pr-10 pl-10 pt-6 pb-6 hover:bg-indigo-500 transition duration-200 ease-in-out">
                                    New Entry
                                </button>
                            </Link>

                            <div className="flex gap-4 mt-6 text-center justify-center">
                                <button
                                    className="mt-20 text-2xl text-indigo-400 font-bold hover:text-indigo-500 transition ease-in-out delay-50"
                                    onClick={logout}
                                >
                                    Sign out
                                </button>
                            </div>
                        </div>
                    )}
                    {!isLoggedIn && (
                        <div>
                            <Link href="/pages/saved-entries">
                                <Options text="Saved Entries" />
                            </Link>
                            <Options text="Calendar" />
                            <Link href="/pages/profile">
                                <Options text="Profile" />
                            </Link>
                            <button className="text-white text-2xl mt-6 font-bold rounded-md pr-10 pl-10 pt-6 pb-6 bg-indigo-400 hover:bg-indigo-500 transition duration-200 ease-in-out">
                                New Entry
                            </button>
                            <div className="flex gap-4 mt-20 text-center justify-center">
                                <span className="text-indigo-300 text-[18px]">Have an account?</span>
                                <Link href="/pages/login">
                                    <button
                                        className="text-[18px] text-indigo-400 font-bold"
                                    >
                                        Login
                                    </button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
