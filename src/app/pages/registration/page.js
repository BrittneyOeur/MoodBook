"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import Sidebar from "@/app/components/Sidebar";
import Link from "next/link";

const REGION = process.env.NEXT_PUBLIC_REGION;
const USER_POOL_ID = process.env.NEXT_PUBLIC_USER_POOL_ID;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;

const client = new CognitoIdentityProviderClient({ region: REGION });

const Registration = () => {
  const router = useRouter();

  const [isSideBarOpen, setSideBar] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const [error, setError] = useState("");

  // Password validation states
  const isLengthValid = password.length >= 8;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  // Toggle password visibility
  const showPassword = () => {
    setPasswordType((prevType) =>
      prevType === "password" ? "text" : "password"
    );
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (e.target.value !== password) {
      setError("ERROR: Passwords are not the same");
    } else {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setError("");

    try {
      const signUpCommand = new SignUpCommand({
        ClientId: CLIENT_ID,
        Username: email,
        Password: password,
        UserAttributes: [
          {
            Name: "email",
            Value: email,
          },
        ],
      });

      const response = await client.send(signUpCommand);
      console.log("Registration success:", response);

      router.push("/pages/confirmation");
    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration failed. Please try again.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen sm:m-auto">
      <div className="bg-white px-36 py-10 rounded-lg drop-shadow-[0_1.2px_1.2px_rgba(99,94,255,0.542)]">
        <div className="justify-center">
          <h1 className="text-4xl text-indigo-500 font-bold text-center">
            Create an account
          </h1>
          <h2 className="texl-3xl text-indigo-400 font-bold text-center">
            Required fields are marked with an asterisk (*)
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mt-5">
              <div>
                <label htmlFor="email" className="text-indigo-500 font-bold">
                  *Email:
                </label>
                <input
                  className="w-full px-2 py-1 mt-1 border rounded-md outline outline-2 outline-indigo-300 focus:outline-indigo-700"
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mt-2">
                {/* Container to align Password label and Show Password checkbox */}
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-indigo-500 font-bold"
                  >
                    *Password:
                  </label>
                  <div className="flex items-center">
                    <input
                      className="cursor-pointer"
                      type="checkbox"
                      onClick={showPassword}
                    />
                    <span className="text-indigo-400 ml-2">Show Password</span>
                  </div>
                </div>

                {/* Password Input Field */}
                <input
                  className="w-full px-2 py-1 mt-1 border rounded-md outline outline-2 outline-indigo-300 focus:outline-indigo-700"
                  type={passwordType}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mt-2">
                <label
                  htmlFor="confirm-password"
                  className="text-indigo-500 font-bold"
                >
                  *Confirm Password:
                </label>
                <input
                  className="w-full px-2 py-1 mt-1 border rounded-md outline outline-2 outline-indigo-300 focus:outline-indigo-700"
                  type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  required
                />
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
                    Must include at least one special character (!@#$%^&*() and
                    others)
                  </li>
                </ul>
              </div>
            </div>
            {error && <p className="text-red-500 text-center mt-2">{error}</p>}
            <button
              className="bg-gradient-to-r from-indigo-500 via-indigo-400 to-violet-300 text-white font-bold w-full mt-5 p-2 rounded-md"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>
          </form>
          <div className="flex gap-2 justify-center text-center mt-3">
            <p className="text-indigo-400 font-bold">
              Already have an account?
            </p>
            <Link href="/pages/login">
              <p className="text-indigo-500 font-bold">Login</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
