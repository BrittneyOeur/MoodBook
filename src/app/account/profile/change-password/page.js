"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { CognitoUserPool } from "amazon-cognito-identity-js";

import Layout from "@/app/components/Layout";
import { AccountContext } from "@/app/components/Account";

function ChangePassword() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Get the session from context
  const { getSession } = useContext(AccountContext);

  // Password validation states
  const isLengthValid = newPassword.length >= 8;
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

  // Cognito User Pool
  const poolData = {
    UserPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
    ClientId: process.env.NEXT_PUBLIC_CLIENT_ID,
  };

  const userPool = new CognitoUserPool(poolData);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword) {
      setMessage("Please enter both current and new passwords.");
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

        user.changePassword(currentPassword, newPassword, (err, result) => {
          if (err) {
            // If the current password is incorrect
            if (err.code === "IncorrectPasswordException") {
              setError("The current password you entered is incorrect.");
              console.error(err);
            } else {
              setError("Error changing password.");
              console.error(err);
            }
          } else {
            setMessage(
              "Password changed successfully! You will be logged out shortly."
            );
            setCurrentPassword("");
            setNewPassword("");

            // Delay logout to show the success message
            setTimeout(() => {
              user.signOut();

              router.push("/pages/login");
            }, 3000); // Wait for 3 seconds before logging out
          }
        });
      });
    } catch (err) {
      setError("Failed to change password.");
      console.error(err);
    }
  };

  const handleCancel = () => {
    router.push("/account/profile");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen sm:m-auto">
      <Layout>
        <div className="bg-white w-full px-36 py-24 rounded-lg drop-shadow-[0_1.2px_1.2px_rgba(99,94,255,0.542)]">
          <div className="justify-center text-center max-w-md sm:max-w-lg md:max-w-xl mx-auto">
            <h1 className="text-3xl font-bold text-indigo-500">
              Change Password
            </h1>
            {message && <p className="mt-2 text-green-500">{message}</p>}
            {error && <p className="mt-2 text-red-500">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mt-6">
                {/* Current Password Input */}
                <div className="flex items-center justify-between gap-6 w-full max-w-2xl">
                  <label className="whitespace-nowrap min-w-[100px] mt-2 text-left font-bold text-indigo-400">
                    Current Password:
                  </label>
                  <input
                    className="w-full px-2 py-1 mt-4 border rounded-md outline outline-2 text-indigo-400 outline-indigo-300 focus:outline-indigo-700"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                {/* New Password Input */}
                <div className="flex items-center justify-between gap-6 w-full max-w-2xl">
                  <label className="whitespace-nowrap min-w-[100px] mt-2 text-left font-bold text-indigo-400">
                    New Password:
                  </label>
                  <input
                    className="w-full px-2 py-1 mt-4 border rounded-md outline outline-2 text-indigo-400 outline-indigo-300 focus:outline-indigo-700"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>{" "}
                {/* This was missing! */}
                {/* Password Requirements */}
                <div className="text-left">
                  <ul className="text-gray-500 mt-4">
                    <li
                      className={
                        isLengthValid ? "text-green-500" : "text-gray-500"
                      }
                    >
                      Must be at least 8 characters long
                    </li>
                    <li
                      className={
                        hasLowercase ? "text-green-500" : "text-gray-500"
                      }
                    >
                      Must include at least one lowercase letter (a-z)
                    </li>
                    <li
                      className={
                        hasUppercase ? "text-green-500" : "text-gray-500"
                      }
                    >
                      Must include at least one uppercase letter (A-Z)
                    </li>
                    <li
                      className={hasNumber ? "text-green-500" : "text-gray-500"}
                    >
                      Must include at least one number (0-9)
                    </li>
                    <li
                      className={
                        hasSpecialChar ? "text-green-500" : "text-gray-500"
                      }
                    >
                      Must include at least one special character (!@#$%^&*()
                      and others)
                    </li>
                  </ul>
                </div>
                {/* Buttons */}
                <button
                  type="submit"
                  className="w-full mt-7 px-4 py-2 rounded-md bg-indigo-400 text-white font-bold hover:bg-indigo-300 transition duration-200"
                >
                  Change Password
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full mt-3 px-4 py-2 rounded-md bg-indigo-300 text-white font-bold hover:bg-indigo-200 transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    </div>
  );
}

export default ChangePassword;
