import "tailwindcss/tailwind.css";
import "../styles/globals.css";
import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import { useRouter } from "next/router";
import "../styles/nprogress.css";
import nProgress from "nprogress";
import Router from "next/router";
import { useEffect } from "react";
import { db } from "../firebase";
import firebase from "firebase";
import { ToastContainer } from "react-toastify";

const clerkFrontendApi = process.env.NEXT_PUBLIC_CLERK_FRONTEND_API;

Router.events.on("routeChangeWStart", nProgress.start);
Router.events.on("routeChangeComplete", nProgress.done);
Router.events.on("routeChangeError", nProgress.done);

const publicPages = ["/sign-in/[[...index]]", "/sign-up/[[...index]]"];

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();

  useEffect(() => {
    if (window.Clerk?.user) {
      db.collection("users").doc(window.Clerk.user.id).set(
        {
          email: window.Clerk.user.primaryEmailAddress.emailAddress,
          name: window.Clerk.user.fullName,
          lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
          photoURL: window.Clerk.user.profileImageUrl,
          userName: window.Clerk.user.username,
        },
        { merge: true }
      );
    }
  });

  return (
    <ClerkProvider
      frontendApi={clerkFrontendApi}
      navigate={(to) => router.push(to)}
    >
      <ToastContainer />
      {publicPages.includes(router.pathname) ? (
        <Component {...pageProps} />
      ) : (
        <>
          <SignedIn>
            <Component {...pageProps} />
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </>
      )}
    </ClerkProvider>
  );
};

export default MyApp;