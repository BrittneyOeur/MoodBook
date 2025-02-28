import React, { createContext } from "react";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import { UserPool } from "../UserPool"; // Make sure to set up your Cognito User Pool
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
                        console.log("Session:", session);
                        resolve(session);
                    }
                });
            } else {
                console.log("No user found");
                reject("No user found");
            }
        });
    };

    const authenticate = async (Username, Password) => {
        console.log("Authenticating user:", Username, Password, UserPool); // Debugging
    
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
                    console.log("Login success:", result);
                    
                    // Fetch the JWT token from the result
                    const token = result.getIdToken().getJwtToken(); // This is the JWT token you need
                    
                    // Resolve with the token so it can be used later
                    resolve(token);
    
                    // Redirect to homepage (or wherever you want after login)
                    router.push("/homepage"); // Change to your desired route
                },
                onFailure: (err) => {
                    console.error("Login failed:", err);
                    reject(err);
                },
                newPasswordRequired: (result) => {
                    console.log("newPasswordRequired: ", result);
                    resolve(result);
                }
            });
        });
    }    

    const logout = () => {
        const user = UserPool.getCurrentUser();
        if (user) {
            user.signOut();
            router.push("/");
        }
    };

    return (
        <AccountContext.Provider value={{ authenticate, getSession, logout }}>
            {props.children}
        </AccountContext.Provider>
    )
};

export { Account, AccountContext };