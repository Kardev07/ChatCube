import Head from "next/head";
import { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { db } from "../firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { useRouter } from "next/router";
import Fade from "react-reveal/Fade";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (window.Clerk?.user) {
      db.collection("users")
        .doc(window?.Clerk.user?.primaryEmailAddress?.emailAddress)
        .set(
          {
            email: window.Clerk.user.primaryEmailAddress?.emailAddress,
            name: window.Clerk.user.fullName,
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
            photoURL: window.Clerk.user.profileImageUrl,
            firstName: window.Clerk.user.firstName,
          },
          { merge: true }
        );
    }

    router.prefetch("/chat/[id]");
  });

  return (
    <div className="flex shadow-md flex-col min-h-screen">
      <Head>
        <title>ChatCube</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/Icon.png" />
      </Head>
      <Header />
      <div className="flex w-full">
        <Sidebar />
        <Fade right>
          <div className="md:flex m-4 flex-col md:w-[63vw] hidden h-[80vh] md:m-1 md:ml-16 mt-0 mb-0 rounded-xl  bg-lightblue dark:bg-indigo-700 w-[93vw] items-center justify-center text-center dark:text-gray-100 text-black">
            <div className="w-[280px] ">
              <h2 className="text-2xl font-semibold">
                Click on a chat or create a new chat
              </h2>
            </div>
          </div>
        </Fade>
      </div>
      <Footer />
    </div>
  );
}
