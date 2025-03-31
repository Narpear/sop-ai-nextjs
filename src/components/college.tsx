"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import React from "react";
import Link from "next/link";
import marbleImage from "./dashboard_marble.jpg";

// Define the props interface for Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", ...props }, ref) => (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${className}`}
      {...props}
    />
  )
);
Button.displayName = "Button";

// Define the props interface for Input
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  )
);
Input.displayName = "Input";

// Define interface for question
interface Question {
  question: string;
}

export default function College() {
  const { id } = useParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [collegeName, setCollegeName] = useState<string>("");
  const [newQuestion, setNewQuestion] = useState<string>("");
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await fetch(`/api/college/${id}`);
      const data = await res.json();
      if (res.ok) {
        setCollegeName(data.collegeName);
        setQuestions(data.questions || []);
      }
    };
    fetchQuestions();
  }, [id]);

  const addQuestion = async () => {
    if (!newQuestion.trim()) return;
    const res = await fetch(`/api/college/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: newQuestion.trim() }),
    });
    if (res.ok) {
      const updatedData = await res.json();
      setQuestions(updatedData.questions);
      setNewQuestion("");
    }
  };

  const updateAnswer = async (question: string, answer: string) => {
    const res = await fetch(`/api/college/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, answer }),
    });
    if (res.ok) {
      setAnswers((prev) => ({ ...prev, [question]: answer }));
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center p-6" style={{ backgroundImage: `url(${marbleImage.src})` }}>
      {/* Header strip for navigation */}
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

      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{collegeName} Questions</h1>

        <div className="mb-6">
          <Input
            placeholder="Enter a new question"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
          />
          <Button onClick={addQuestion} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md">
            + Add Question
          </Button>
        </div>

        <div className="space-y-4">
          {questions.map((question, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-md font-semibold text-gray-700 mb-2">{question.question}</p>
              <Input
                type="text"
                placeholder="Enter your answer"
                value={answers[question.question] || ""}
                onChange={(e) => updateAnswer(question.question, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}