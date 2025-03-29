"use client";

import Link from "next/link";
import {useState} from "react";
import {useRouter} from "next/navigation";
import marbleImage from "./login_page_marble.jpg"; // Import the same marble image

export default function RegisterForm() {

    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!fname || !lname || !email || !password){
            setError("All fields are necessary.");
            return
        }

        try {

            const resUserExists = await fetch('api/userExists', {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email}),
            });

            const {user} = await resUserExists.json();

            if (user) {
                setError("User already exists");
                return;
            }

            const res = await fetch('api/register', {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fname, lname, email, password
                })
            }
            )

            if (res.ok) {
                const form = e.target as HTMLFormElement;
                form.reset();
                router.replace("/dashboard");
            } else {
                console.log("User registration failed.");
            }
        } catch (error) {
            console.log("Error during registration: ", error);
        }
    };

    // console.log("Full Name: ", fname, lname);
    // console.log("Email: ", email);

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

                {/* Right side with registration form */}
                <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">
                    <h2 className="text-[#606060] text-3xl font-semibold mb-6">Register</h2>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                        <input
                            onChange={(e) => setFname(e.target.value)}
                            type="text"
                            placeholder="First Name"
                            className="w-full px-4 py-3 rounded-full border border-[#f5f5f5] focus:outline-none focus:ring-2 focus:ring-[#8d77ff] text-[#606060] placeholder-[#8f79ff]/50"
                            required
                        />
                        <input
                            onChange={(e) => setLname(e.target.value)}
                            type="text"
                            placeholder="Last Name"
                            className="w-full px-4 py-3 rounded-full border border-[#f5f5f5] focus:outline-none focus:ring-2 focus:ring-[#8d77ff] text-[#606060] placeholder-[#8f79ff]/50"
                            required
                        />
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
                            Register
                        </button>
                        
                        { error && (
                            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                                {error}
                            </div>
                        )}

                        <Link href={'/'} className="underline font-medium text-center mt-3">
                            Already have an account? <u>Login!</u> 
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}