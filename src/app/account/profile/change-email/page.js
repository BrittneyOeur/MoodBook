"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { CognitoUserPool } from "amazon-cognito-identity-js";
import {
  CognitoIdentityProviderClient,
  ResendConfirmationCodeCommand,
  AdminGetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";

import { AccountContext } from "@/app/components/Account";
import Layout from "@/app/components/Layout";

function ChangeEmail() {
  const [newEmail, setNewEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();
  const { getSession } = useContext(AccountContext);

  // Cognito User Pool
  const poolData = {
    UserPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
    ClientId: process.env.NEXT_PUBLIC_CLIENT_ID,
  };

  const userPool = new CognitoUserPool(poolData);

  const handleEmailChange = async (e) => {
    setNewEmail(e.target.value);
  };

  // Instantiate CognitoIdentityProviderClient
  const client = new CognitoIdentityProviderClient({
    region: process.env.NEXT_PUBLIC_REGION,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY
    }
  });

  const resendVerificationCode = async (email) => {
    try {
      const user = userPool.getCurrentUser();
      if (!user) {
        setError("User not found.");
        return;
      }
  
      // Fetch user attributes
      const userAttributes = await getUserAttributes(user);
  
      // Check if the email is already verified
      const emailVerified = userAttributes.some(
        (attr) => attr.Name === "email_verified" && attr.Value === "true"
      );
  
      if (emailVerified) {
        setMessage("Email is already verified.");
        return;  // If email is verified, don't send another code
      }
  
      // Proceed with resending confirmation code for unverified email
      const resendCommand = new ResendConfirmationCodeCommand({
        ClientId: process.env.NEXT_PUBLIC_CLIENT_ID,
        Username: email,
      });
  
      await client.send(resendCommand);
      console.log("Verification code resent.");
    } catch (err) {
      console.error("Error resending verification code:", err);
      setError("Error resending verification code.");
    }
  };
  
  // Helper function to get user attributes
  const getUserAttributes = async (user) => {
    const userAttributesCommand = new AdminGetUserCommand({
      UserPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
      Username: user.getUsername(),
    });
  
    try {
      const response = await client.send(userAttributesCommand);
      return response.UserAttributes;
    } catch (err) {
      console.error("Error getting user attributes:", err);
      setError("Error getting user attributes.");
    }
  };  

  const signOutUserWithDelay = () => {
    // Delay for 3 seconds before signing out
    setTimeout(() => {
      const user = userPool.getCurrentUser();
      if (user) {
        user.signOut();
        console.log("User signed out after delay.");
      }
    }, 2000); // Adjust delay as needed (3000 ms = 3 seconds)
  };

  const handleSubmit = async () => {
    if (!newEmail) {
      setError("Please enter a valid email address.");
      return;
    }
  
    try {
      const session = getSession();
      const user = userPool.getCurrentUser();
  
      if (!user) {
        setError("User not found.");
        return;
      }
  
      user.getSession((err, session) => {
        if (err) {
          setError("Error fetching session.");
          console.error(err);
          return;
        }
  
        // Check if the email is verified
        const userAttributes = session.getIdToken().payload;
        const emailVerified = userAttributes["email_verified"];
  
        if (emailVerified === "true") {
          setMessage("Email is already verified. No further action needed.");
          return;
        }
  
        // Update email and resend verification code
        user.updateAttributes([{ Name: "email", Value: newEmail }], async (err, result) => {
          if (err) {
            setError("Error updating email.");
            console.error(err);
          } else {
            setMessage("Email updated successfully. Check your inbox for verification.");
  
            // After updating, resend the confirmation code for the new email
            await resendVerificationCode(newEmail);
  
            // Sign out user and prompt them to check their inbox
            signOutUserWithDelay();
  
            setTimeout(() => {
              router.push("/pages/confirmation");
            }, 3000);
          }
        });
      });
    } catch (err) {
      setError("Failed to update email.");
      console.error(err);
    }
  };    

  const handleCancel = () => {
    router.push("/account/profile");
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen sm:m-auto">
        <Layout>
          <div className="bg-white w-full px-36 py-24 rounded-lg drop-shadow-[0_1.2px_1.2px_rgba(99,94,255,0.542)]">
            <div className="justify-center text-center">
              <h1 className="text-3xl font-bold text-indigo-500">
                Change Email Address
              </h1>
              {message && <p className="text-green-500 mt-2">{message}</p>}
              {error && <p className="text-red-500 mt-2">{error}</p>}
              <input
                className="w-full px-2 py-1 mt-4 border rounded-md outline outline-2 text-indigo-400 outline-indigo-300 focus:outline-indigo-700"
                type="email"
                id="change-email"
                onChange={handleEmailChange}
                required
              />
              <button
                onClick={handleSubmit}
                className="w-full mt-7 px-4 py-2 rounded-md bg-indigo-400 text-white font-bold hover:bg-indigo-300 transition duration-200"
              >
                Change Email Address
              </button>
              <button
                onClick={handleCancel}
                className="w-full mt-3 px-4 py-2 rounded-md bg-indigo-300 text-white font-bold hover:bg-indigo-200 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </Layout>
      </div>
    </>
  );
}

export default ChangeEmail;
