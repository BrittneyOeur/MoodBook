import React, { useState, useContext, useEffect } from "react";
import { AccountContext } from "./Account";

const Status = () => {
    const [status, setStatus] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // New loading state
    const { getSession, logout } = useContext(AccountContext);

    useEffect(() => {
        getSession()
            .then(session => {
                // console.log("Session: ", session);
                setStatus(true);
                setIsLoading(false);
            })
            .catch(error => {
                // console.error("Error fetching session:", error);
                setStatus(false);
                setIsLoading(false);
            });
    }, []);

    return (
        <div>
            {isLoading ? "Loading..." : status ? "You are logged in" : "Please login"}
        </div>
    )
};

export default Status;
