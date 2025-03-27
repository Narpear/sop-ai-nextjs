"use client";

import Link from "next/link";
import {useState} from "react";
import {useRouter} from "next/navigation";

export default function RegisterForm() {

    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const router = useRouter();

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
                const form = e.target;
                form.reset();
                router.replace("dashboard");
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
    <div className="grid  place-items-center h-screen">
        <div className = "shadow-lg p-5 rounded-lg border-4 border-green-400">
            <h1 className="text-xl font-bold my-4">Enter the details</h1>
            <form  onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input onChange={(e) => setFname(e.target.value)} type="text" placeholder="First Name"></input> 
                <input onChange={(e) => setLname(e.target.value)} type="text" placeholder="Last Name"></input>
                <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email"></input>
                <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password"></input>
                <button className="bg-green-600 text-white font-bold cursor-pointer px-6 py-2">Register</button>
                
                { error && (
                    <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                        {error}
                    </div>
                )}

                <Link href={'/'} className="text-sm mt-3 text-right">
                    Already have an account? <u>Login!</u> 
                </Link>
            </form>
        </div>
    </div>
    );
}