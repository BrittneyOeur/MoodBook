"use client"

import { useEffect } from "react";
import { useRouter } from "next/router";
import { useOidc } from "react-oidc-context";

const Callback = () => {
  const { isAuthenticated, signinRedirectCallback } = useOidc();
  const router = useRouter();

  useEffect(() => {
    // Handle the redirect callback and check if the user is authenticated
    const handleRedirectCallback = async () => {
      await signinRedirectCallback();
      if (isAuthenticated) {
        router.push("/homepage"); // Redirect to the home page after authentication
      } else {
        router.push("/login"); // Redirect to login page if not authenticated
      }
    };

    handleRedirectCallback();
  }, [isAuthenticated, signinRedirectCallback, router]);

  return <div>Loading...</div>;
};

export default Callback;