"use client";

import { useEffect, useState, useContext } from "react";
import { CognitoUserPool } from "amazon-cognito-identity-js";
import { AccountContext } from "@/app/components/Account";
import { useRouter } from "next/navigation";
import Layout from "@/app/components/Layout";
import Link from "next/link";

const Profile = () => {
  const [email, setEmail] = useState('');
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState(null);

  // Setting up Cognito User Pool
  const poolData = {
    UserPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID, 
    ClientId: process.env.NEXT_PUBLIC_CLIENT_ID, 
  };

  const router = useRouter();
  const userPool = new CognitoUserPool(poolData);
  const { getSession } = useContext(AccountContext);

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const user = userPool.getCurrentUser(); // Get current user from the pool

        if (user) {
          // Fetch the session
          user.getSession((err, session) => {
            if (err) {
              setError('Error fetching session.');
              console.error(err);
              return;
            }

            // Fetch user attributes after successful session retrieval
            user.getUserAttributes((err, attributes) => {
              if (err) {
                setError('Error fetching user attributes.');
                console.error(err);
                return;
              }

              // Find email attribute and set it
              const emailAttribute = attributes.find(attr => attr.Name === 'email');
              if (emailAttribute) {
                setEmail(emailAttribute.Value);
              } else {
                setError('Email not found');
              }
            });
          });
        } else {
          setError('No user found');
        }
      } catch (err) {
        setError('Failed to fetch user data.');
        console.error('Error fetching user data:', err);
      }
    };

    fetchUserEmail();
  }, []);

  useEffect(() => {
    async function fetchEntries() {
        try {
            const session = await getSession();
            const token = session?.idToken?.jwtToken;

            if (!token) {
                console.error("No user token found.");
                return;
            }

            const response = await fetch("/api/entry", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch entries");
            }

            const data = await response.json();
            setEntries(data.entries || []);
        } catch (error) {
            console.error("Error fetching entries:", error.message);
        }
    }

    fetchEntries();
}, [router.pathname]);

  return (
    <div className="text-center p-5">
      <div className="flex flex-col items-center justify-center min-h-screen sm:m-auto">
        <Layout>
          <div className="bg-white w-full px-36 py-24 rounded-lg drop-shadow-[0_1.2px_1.2px_rgba(99,94,255,0.542)]">
            <div>
              <h1 className="text-indigo-500 text-4xl font-bold">
                Profile
                </h1>
              <div>
                {error ? (
                  <p>{error}</p>
                ) : (
                  <>
                  <div className="justify-center text-center items-center mb-4 text-xl">
                    <div className="flex gap-1 justify-center">
                      <span className="text-indigo-500 font-bold">Email: </span>
                      <span className="text-indigo-400">{email || "Loading..."}</span>
                    </div>
                    <div className="flex gap-1 justify-center">
                      <span className="text-indigo-500 font-bold">Total Entries: </span>
                      <span className="text-indigo-400">{entries.length || "Loading..."}</span>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <Link href="/pages/change-email">
                      <button className="p-3 rounded-md bg-indigo-400 text-white font-bold hover:bg-indigo-300 transition duration-200">
                        Change Email Address
                      </button>
                    </Link>
                    <button className="p-3 rounded-md bg-indigo-400 text-white font-bold hover:bg-indigo-300 transition duration-200">
                      Change Password
                    </button>
                  </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </Layout>
      </div>
    </div>
  );
};

export default Profile;
