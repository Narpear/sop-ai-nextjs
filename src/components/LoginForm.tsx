"use client";

import Link from "next/link";
import {useState} from "react";
import {signIn} from "next-auth/react";
import {useRouter} from "next/navigation";
import marbleImage from "./login_page_marble.jpg";

export default function LoginForm() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await signIn("credentials", {
                email, password, redirect: false,
            });

            if (res.error) {
                setError("Invalid Credentials");
                return;
            }
            router.replace("dashboard");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-6"
        style={{
            backgroundImage: `url(${marbleImage.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
        }}
        >
            <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between">
                {/* Left side with logo and text */}
                <div className="mb-8 md:mb-0 text-center md:text-left md:max-w-md">
                    <h1 className="text-[#606060] text-6xl md:text-8xl font-bold mb-6">sop.ai</h1>
                    <p className="text-[#5a5a5a] text-lg md:text-xl max-w-md mx-auto md:mx-0">
                        Craft your perfect Statement of Purpose with AI assistance. Stand out in your graduate school applications with personalized, compelling narratives.
                    </p>
                </div>

                {/* Right side with login form */}
                <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">
                    <h2 className="text-[#606060] text-3xl font-semibold mb-6">Login</h2>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="Email"
                            className="w-full px-4 py-3 rounded-full border border-[#f5f5f5] focus:outline-none focus:ring-2 focus:ring-[#8d77ff] text-[#606060] placeholder-[#8f79ff]/50"
                            required
                        />
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            placeholder="Password"
                            className="w-full px-4 py-3 rounded-full border border-[#f5f5f5] focus:outline-none focus:ring-2 focus:ring-[#8d77ff] text-[#606060] placeholder-[#8f79ff]/50"
                            required
                        />
                        <button className="px-8 py-2 bg-white rounded-full text-[#606060] font-medium shadow-md hover:shadow-lg transition-shadow">
                            Login
                        </button>

                        {error && (
                            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">{error}</div>
                        )}

                        <Link href={'/register'} className="underline font-medium text-center mt-3">
                            Don't have an account? <u>Get started!</u>
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}