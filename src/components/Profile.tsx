"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import React from "react";
import { signOut } from "next-auth/react";
import marbleImage from "./profile_marble.jpg";

const Button = React.forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={`inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${className}`}
    {...props}
  />
));
Button.displayName = "Button";

const Input = React.forwardRef(({ className, type = "text", ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
));
Input.displayName = "Input";

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [updatedValue, setUpdatedValue] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const res = await fetch("/api/userProfile");
      if (res.ok) {
        const data = await res.json();
        setUserData(data);
      } else {
        console.error("Failed to fetch user data");
        setError("Failed to fetch user data.");
      }
    };
    fetchUserData();
  }, []);

  const handleEdit = (field) => {
    setEditingField(field);
    setUpdatedValue(userData.details[field]);
  };

  const handleSave = async (field) => {
    const res = await fetch("/api/userProfile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ field, value: updatedValue }),
    });
    if (res.ok) {
      setUserData((prev) => ({
        ...prev,
        details: { ...prev.details, [field]: updatedValue },
      }));
      setEditingField(null);
    } else {
      setError("Failed to update user details.");
    }
  };

  const questions = {
    location: "Where are you from?",
    education: "What's your educational background?",
    achievements: "Any cool academic achievements you're proud of?",
    subjects: "What subjects or fields excite you the most? Why?",
    futureGoals: "What do you see yourself doing in the future?",
    impact: "If you could make an impact in your field or community, what would it be?",
    projects: "Have you worked on any interesting projects or research?",
    workExperience: "Any internships, jobs, or volunteer work?",
    hobbies: "What do you do for fun outside of studies?",
    leadership: "Have you taken on any leadership roles?",
    competitions: "Any competitions or events you've participated in?",
    challenges: "Have you faced any big challenges?",
    values: "What values or beliefs are important to you?",
    uniqueTraits: "What's something unique about you?",
    family: "Can you tell me a little about your family?",
    familyInfluence: "Has your family influenced your choices?",
    inspiration: "Is there a family member who inspires you?",
    traditions: "Do you have any special family traditions?",
    colleges: "Which colleges are you interested in?",
    goodFit: "Why do you think you'd be a great fit for them?",
    additional: "Anything else you'd like to share?",
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center p-6" 
      style={{ backgroundImage: `url(${marbleImage.src})` }}
    >
      {/* Changed header to a strip */}
      <header className="relative z-10 w-full bg-white bg-opacity-50 py-2 px-4 sm:px-6 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <div className="text-2xl font-bold text-gray-800">sop.ai</div>
          <Link href="/dashboard">
            <Button className="bg-[#8d77ff] text-white hover:bg-[#7a66e6] w-full sm:w-auto px-6 py-2">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>
      {/* Removed the outer card */}
      <div className="container mx-auto p-6">
        {userData ? (
          <>
            <h1 className="text-3xl font-bold text-gray-800">{`${userData.fname} ${userData.lname}`}</h1>
            <div className="flex justify-between items-center">
              <p className="text-lg text-gray-600">{userData.email}</p>
              <button onClick={() => signOut()} className="bg-gray-300 text-gray-800 font-bold px-4 py-1 rounded-md">Log Out</button>
            </div>
            <div className="mt-6 space-y-4">
              {Object.entries(questions).map(([key, question]) => (
                <div key={key} className="bg-white p-4 rounded-lg shadow-md">
                  <p className="text-md font-semibold text-gray-700">{question}</p>
                  {editingField === key ? (
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={updatedValue}
                        onChange={(e) => setUpdatedValue(e.target.value)}
                      />
                      <Button
                        className="bg-green-500 text-white px-3 py-1 rounded-md"
                        onClick={() => handleSave(key)}
                      >
                        Save
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <p className="text-gray-600">{userData.details[key] || "Not provided"}</p>
                      <Button
                        className="text-blue-500"
                        onClick={() => handleEdit(key)}
                      >
                        Edit
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}
