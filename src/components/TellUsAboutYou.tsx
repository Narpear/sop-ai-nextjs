"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import marbleImage from "./tell_us_about_you_marble.jpg";

const Button = ({ className = "", ...props }) => (
    <button
        className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 px-8 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 ${className}`}
        {...props}
    />
);

const Textarea = ({ className = "", ...props }) => (
    <textarea
        className={`flex min-h-[60px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${className}`}
        {...props}
    />
);

export default function TellUsAboutYou() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        location: "",
        education: "",
        achievements: "",
        subjects: "",
        futureGoals: "",
        impact: "",
        projects: "",
        workExperience: "",
        hobbies: "",
        leadership: "",
        competitions: "",
        challenges: "",
        values: "",
        uniqueTraits: "",
        family: "",
        familyInfluence: "",
        inspiration: "",
        traditions: "",
        colleges: "",
        goodFit: "",
        additional: ""
    });
    const [error, setError] = useState("");

    const questions = {
        location: "Where are you from?",
        education: "What's your educational background?",
        achievements: "Any cool academic achievements you're proud of?",
        subjects: "What subjects or fields excite you the most? Why?",
        futureGoals: "What do you see yourself doing in the future?",
        impact: "If you could make an impact in your field or community, what would it be?",
        projects: "Have you worked on any interesting projects or research? What was it about?",
        workExperience: "Any internships, jobs, or volunteer work? What did you do, and what did you learn?",
        hobbies: "What do you do for fun outside of studies?",
        leadership: "Have you taken on any leadership roles? What was that experience like?",
        competitions: "Any competitions or events you've participated in that meant something to you?",
        challenges: "Have you faced any big challenges or setbacks? How did you deal with them?",
        values: "What values or beliefs are really important to you?",
        uniqueTraits: "What's something unique or unexpected about you that people might not know?",
        family: "Can you tell me a little about your family?",
        familyInfluence: "Has your family influenced your academic or career choices in any way?",
        inspiration: "Is there a family member who inspires you? What have you learned from them?",
        traditions: "Do you have any special family traditions or experiences that shaped who you are today?",
        colleges: "Which colleges/universities are you most interested in? Why?",
        goodFit: "Why do you think you'd be a great fit for them?",
        additional: "Anything else you'd like to share? (Random fun facts totally welcome!)",
    };

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Component: Sending data to API:", formData);
            const res = await fetch("/api/tell_us_about_you", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
    
            console.log("Component: API response status:", res.status);
            if (res.ok) {
                console.log("Component: User details updated successfully");
                router.replace("/dashboard");
            } else {
                const errorData = await res.json();
                console.error("Component: Error response from API:", errorData);
                setError("Failed to update details.");
            }
        } catch (error) {
            console.error("Component: Error updating details:", error);
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <div 
            className="min-h-screen bg-gradient-sop p-6 md:p-8 relative overflow-auto"
            style={{
                backgroundImage: `url(${marbleImage.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="absolute inset-0 bg-white opacity-10 pointer-events-none"></div>

            <div className="max-w-3xl mx-auto relative bg-white shadow-lg rounded-lg p-6 md:p-10">
                <h2 className="text-4xl font-semibold text-gray-800 text-center mb-6">Tell Us About You</h2>
                <p className="text-md text-gray-600 text-center mb-8">
                    P.S. Be as detailed and accurate as you can with these, because this is the info we use to help you write
                    your SOP - no pressure, though, just answer whatever feels right!
                </p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {Object.entries(formData).map(([key, value]) => (
                        <div key={key}>
                            <label htmlFor={key} className="text-lg font-semibold text-gray-700 mb-2 block">
                                {questions[key]}
                            </label>
                            <Textarea id={key} name={key} value={value} onChange={handleChange} />
                        </div>
                    ))}
                    <div className="text-center pt-4">
                        <Button type="submit">Submit</Button>
                    </div>
                    {error && <p className="text-red-500 text-center text-sm">{error}</p>}
                </form>
            </div>
        </div>
    );
}
