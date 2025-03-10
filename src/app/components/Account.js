import React, { createContext } from "react";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import { UserPool } from "../UserPool";
import { useRouter } from "next/navigation";

const AccountContext = createContext();

const Account = (props) => {
    const router = useRouter();

    const getSession = async () => {
        return await new Promise((resolve, reject) => {
            const user = UserPool.getCurrentUser();
    
            // If user exists:
            if (user) {
                user.getSession((err, session) => {
                    // If there's an error
                    if (err) {
                        console.error("Error fetching session:", err);
                        reject("Error fetching session");
                    } else {
                        resolve(session);
                    }
                });
            } else {
                console.log("No user found");
                reject("No user found.");
            }
        });
    };

    const authenticate = async (Username, Password) => {    
        return await new Promise((resolve, reject) => {
            const authenticationData = {
                Username,
                Password
            };
    
            const authenticationDetails = new AuthenticationDetails(authenticationData);
    
            if (!UserPool) {
                console.error("UserPool is undefined!");
                return reject(new Error("UserPool is undefined"));
            }
    
            const cognitoUser = new CognitoUser({
                Username,
                Pool: UserPool,
            });
    
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: (result) => {                
                    // Fetch the JWT token from the result
                    const token = result.getIdToken().getJwtToken();
                    
                    // Resolve with the token so it can be used later
                    resolve(token);
    
                    // Redirect to homepage (or wherever you want after login)
                    router.push("/homepage");
                },
                onFailure: (err) => {
                    console.error("Login failed:", err);
                    reject(err);
                },
                newPasswordRequired: (result) => {
                    resolve(result);
                }
            });
        });
    }    

    const logout = () => {
        const user = UserPool.getCurrentUser();
        if (user) {
            const confirmLogout = window.confirm("Are you sure you want to log out?");
            if (confirmLogout) {
                user.signOut();
                alert("You have been logged out.");
                router.push("/pages/login");
            }
        }
    };

    return (
        <AccountContext.Provider value={{ authenticate, getSession, logout }}>
            {props.children}
        </AccountContext.Provider>
    )
};

export { Account, AccountContext };