"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { CognitoUserPool, CognitoUser } from "amazon-cognito-identity-js";

function ResetPassword() {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [step, setStep] = useState(1);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    const poolData = {
      UserPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
      ClientId: process.env.NEXT_PUBLIC_CLIENT_ID,
    };

    const userPool = new CognitoUserPool(poolData);

    const handleCancel = () => {
        router.push("/pages/login");
    };

    const handleResetPasswordRequest = () => {
      setError("");
      setMessage("");
  
      const user = new CognitoUser({ Username: email, Pool: userPool });
  
      user.forgotPassword({
        onSuccess: (data) => {
          setMessage(`A reset code has been sent to ${email}.`);
          setStep(2); // Move to the next step
        },
        onFailure: (err) => {
          setError(err.message || "Error sending reset code.");
        },
      });
    };

    const handleConfirmReset = () => {
      setError("");
      setMessage("");
  
      const user = new CognitoUser({ Username: email, Pool: userPool });
  
      user.confirmPassword(code, newPassword, {
        onSuccess: () => {
          setMessage("Your password has been successfully reset.");
          setTimeout(() => {
            router.push("/pages/login");
          }, 2000);
        },
        onFailure: (err) => {
          setError(err.message || "Invalid reset code or error resetting password.");
        },
      });
    };

    return (
      <div className="flex flex-col items-center justify-center min-h-screen sm:m-auto max-w-md sm:max-w-lg md:max-w-xl mx-auto">
          <div className="bg-white px-36 py-24 rounded-lg drop-shadow-[0_1.2px_1.2px_rgba(99,94,255,0.542)]">
                <h1 className="text-4xl text-indigo-500 font-bold text-center">
                  Reset Password
                </h1>
                {message && <p className="text-green-500 mt-2">{message}</p>}
                {error && <p className="text-red-500 mt-2">{error}</p>}
      
                {step === 1 ? (
                  <form onSubmit={(e) => { e.preventDefault(); handleResetPasswordRequest(); }}>
                    <div className="mt-4">
                      <div>
                        <input
                          className="w-full px-2 py-1 mt-1 border rounded-md outline outline-2 outline-indigo-300 focus:outline-indigo-700"
                          type="email"
                          id="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-indigo-400 text-white font-bold w-full mt-7 p-2 rounded-md hover:bg-indigo-300 transition duration-100 ease-in-out"
                      >
                        Send Reset Code
                      </button>
                      <button
                          type="button"
                          onClick={handleCancel}
                          className="bg-indigo-300 text-white font-bold w-full mt-2 p-2 rounded-md hover:bg-indigo-200 transition duration-100 ease-in-out"
                      >
                          Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); handleConfirmReset(); }}>
                    <div className="mt-5">
                      <div>
                        <label className="text-indigo-500 text-center" htmlFor="code">
                          Reset Code:
                        </label>
                        <input
                          className="w-full px-2 py-1 mt-1 border rounded-md outline outline-2 outline-indigo-300 focus:outline-indigo-700"
                          type="text"
                          id="code"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mt-2">
                        <label className="text-indigo-500" htmlFor="newPassword">
                          New Password:
                        </label>
                        <input
                          className="w-full px-2 py-1 mt-1 border rounded-md outline outline-2 outline-indigo-300 focus:outline-indigo-700"
                          type="password"
                          id="newPassword"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-indigo-500 via-indigo-400 to-violet-300 text-white font-bold w-full mt-2 p-2 rounded-md hover:bg-indigo-500 transition duration-100 ease-in-out"
                      >
                        Reset Password
                      </button>
                    </div>
                  </form>
                )}
          </div>
      </div>
    );
};

export default ResetPassword;
