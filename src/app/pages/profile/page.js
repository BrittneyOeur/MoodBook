"use client";

import { useEffect, useState } from "react";
import { CognitoUserPool, CognitoUser } from "amazon-cognito-identity-js";
import Layout from "@/app/components/Layout";

const Profile = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);

  // Make sure to set up your Cognito User Pool
  const poolData = {
    UserPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID, // Replace with your Cognito User Pool ID
    ClientId: process.env.NEXT_PUBLIC_CLIENT_ID, // Replace with your Cognito Client ID
  };

  const userPool = new CognitoUserPool(poolData);

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

  return (
    <div className="text-center p-5">
      <div className="flex flex-col items-center justify-center min-h-screen sm:m-auto">
        <Layout>
          <div className="bg-white w-full px-36 py-24 rounded-lg drop-shadow-[0_1.2px_1.2px_rgba(99,94,255,0.542)]">
            <div>
              <h1 className="text-4xl font-bold">Profile</h1>
              <div>
                {error ? (
                  <p>{error}</p>
                ) : (
                  <>
                    <p>Email: {email || 'Loading...'}</p>
                    <p>Total Entries: </p>
                    <p>Account Date Created: </p>
                    <div className="flex gap-6">
                      <button className="bg-indigo-400 p-2">Change Email Address</button>
                      <button className="bg-indigo-400 p-2">Change Password</button>
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
