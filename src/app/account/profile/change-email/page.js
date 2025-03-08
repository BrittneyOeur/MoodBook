"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import {
  CognitoUserPool,
} from "amazon-cognito-identity-js";
import { AccountContext } from "@/app/components/Account";

import Layout from "@/app/components/Layout";

function ChangeEmail() {
  const [newEmail, setNewEmail] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const router = useRouter();
  const { getSession } = useContext(AccountContext);

  const poolData = {
    UserPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
    ClientId: process.env.NEXT_PUBLIC_CLIENT_ID,
  };

  const userPool = new CognitoUserPool(poolData);

  const handleCancel = () => {
    router.push("/account/profile");
  };

  const handleEmailChange = (e) => {
    setNewEmail(e.target.value);
  };

  const handleConfirmationCodeChange = (e) => {
    setConfirmationCode(e.target.value);
  };

  const handleSubmit = async () => {
    setError("");
    setMessage("");

    getSession()
      .then((session) => {
        const user = userPool.getCurrentUser();

        if (!user) {
          setError("No authenticated user found.");
          return;
        }

        user.getSession((err, session) => {
          if (err) {
            setError("Error getting user session.");
            return;
          }

          user.updateAttributes(
            [{ Name: "email", Value: newEmail }],
            (err, result) => {
              if (err) {
                setError(err.message || "Failed to update email.");
              } else {
                setMessage(
                  "A confirmation code has been sent to your new email."
                );
                setIsVerifying(true);
              }
            }
          );
        });
      })
      .catch((err) => {
        setError(err.message || "Error fetching user session.");
      });
  };

  const handleConfirmEmail = () => {
    setError("");
    setMessage("");

    // Get the current authenticated user
    const user = userPool.getCurrentUser();

    if (!user) {
      setError("No authenticated user found.");
      return;
    }

    // Get session to ensure user is authenticated
    user.getSession((err, session) => {
      if (err) {
        setError(err.message || "Error fetching user session.");
        return;
      }

      // If session is valid, call verifyAttribute to confirm email
      user.verifyAttribute("email", confirmationCode, {
        onSuccess: (result) => {
          setMessage("Email verified successfully. Signing out...");
          setTimeout(() => {
            user.signOut();
            router.push("/");
          }, 2000);
        },
        onFailure: (err) => {
          setError(err.message || "Invalid confirmation code.");
        },
      });
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen sm:m-auto">
      <Layout>
        <div className="bg-white w-full px-36 py-24 rounded-lg drop-shadow-[0_1.2px_1.2px_rgba(99,94,255,0.542)]">
          <div className="justify-center text-center">
            <h1 className="text-3xl font-bold text-indigo-500">
              Change Email Address
            </h1>
            {message && <p className="text-green-500 mt-2">{message}</p>}
            {error && <p className="text-red-500 mt-2">{error}</p>}

            {!isVerifying ? (
              <>
                <input
                  className="w-full px-2 py-1 mt-4 border rounded-md outline outline-2 text-indigo-400 outline-indigo-300 focus:outline-indigo-700"
                  type="email"
                  placeholder="Enter new email"
                  value={newEmail}
                  onChange={handleEmailChange}
                  required
                />
                <button
                  onClick={handleSubmit}
                  className="w-full mt-7 px-4 py-2 rounded-md bg-indigo-400 text-white font-bold hover:bg-indigo-300 transition duration-200"
                >
                  Change Email Address
                </button>
              </>
            ) : (
              <>
                <input
                  className="w-full px-2 py-1 mt-4 border rounded-md outline outline-2 text-indigo-400 outline-indigo-300 focus:outline-indigo-700"
                  type="text"
                  placeholder="Enter confirmation code"
                  value={confirmationCode}
                  onChange={handleConfirmationCodeChange}
                  required
                />
                <button
                  onClick={handleConfirmEmail}
                  className="w-full mt-7 px-4 py-2 rounded-md bg-indigo-400 text-white font-bold hover:bg-indigo-300 transition duration-200"
                >
                  Confirm Email
                </button>
              </>
            )}
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
  );
}

export default ChangeEmail;
