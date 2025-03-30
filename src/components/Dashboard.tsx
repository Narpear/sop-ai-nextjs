"use client";

import { useEffect, useState } from "react";
import marbleImage from "./dashboard_marble.jpg";
import Image from "next/image";
import Link from "next/link";
import React from "react";

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

export default function Dashboard() {
  const [colleges, setColleges] = useState([]);
  const [newCollegeName, setNewCollegeName] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, collegeId: null, confirmText: "" });

  useEffect(() => {
    const fetchColleges = async () => {
      const res = await fetch("/api/colleges");
      const data = await res.json();
      if (res.ok) setColleges(data.colleges);
    };
    fetchColleges();
  }, []);

  const addCollege = async () => {
    if (!newCollegeName.trim()) return;
    const res = await fetch("/api/colleges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collegeName: newCollegeName.trim() }),
    });
    if (res.ok) {
      const updatedColleges = await res.json();
      setColleges(updatedColleges.colleges);
      setNewCollegeName("");
    }
  };

  const initiateDelete = (collegeId) => {
    setDeleteConfirmation({
      show: true,
      collegeId,
      confirmText: ""
    });
  };

  const handleConfirmTextChange = (e) => {
    setDeleteConfirmation({
      ...deleteConfirmation,
      confirmText: e.target.value
    });
  };

  const cancelDelete = () => {
    setDeleteConfirmation({ show: false, collegeId: null, confirmText: "" });
  };

  const confirmDelete = async () => {
    const { collegeId } = deleteConfirmation;
    const res = await fetch("/api/colleges", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collegeId }),
    });
    if (res.ok) {
      const updatedColleges = await res.json();
      setColleges(updatedColleges.colleges);
      setDeleteConfirmation({ show: false, collegeId: null, confirmText: "" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      <div className="fixed inset-0 z-0">
        <Image src={marbleImage} alt="Marble background" fill className="object-cover" priority />
      </div>

      <header className="relative z-10 w-full bg-white bg-opacity-70 py-4 px-4 sm:px-6 shadow-sm">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-2xl font-bold text-gray-800">sop.ai</div>
          <Link href="/profile">
            <Button className="bg-[#8d77ff] text-white hover:bg-[#7a66e6] w-full sm:w-auto px-6 py-3">
              Your Profile
            </Button>
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex-1 container mx-auto mt-6 sm:mt-8 px-4 pb-12">
        {deleteConfirmation.show && (
          <div 
            className={`fixed left-1/2 z-50 shadow-md transition-transform duration-500 ease-in-out transform ${deleteConfirmation.show ? 'translate-y-0' : '-translate-y-full'}`} 
            style={{ 
              backgroundColor: '#f8d7da', 
              color: '#721c24', 
              padding: '15px 20px', 
              borderRadius: '8px', 
              width: '300px', 
              top: '50%',
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' 
            }} 
          >
            <h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>Confirm Deletion</h3>
            <p style={{ marginBottom: '5px' }}>
              This action cannot be undone, and all of the data associated with your SOP for this college will be lost.
            </p>
            <p style={{ marginBottom: '10px', fontSize: '0.9rem' }}>Type "I want to delete this college" to confirm:</p>
            <Input
              value={deleteConfirmation.confirmText}
              onChange={handleConfirmTextChange}
              className="mb-4"
              placeholder="I want to delete this college"
              style={{ width: '100%', marginBottom: '10px' }}
            />
            <div className="flex justify-end gap-2">
              <Button 
                onClick={cancelDelete} 
                className="bg-gray-200 text-gray-800 hover:bg-gray-300 px-3 py-1"
                style={{ borderRadius: '4px' }}
              >
                Cancel
              </Button>
              <Button 
                onClick={confirmDelete} 
                className="bg-red-500 text-white hover:bg-red-600 px-3 py-1"
                disabled={deleteConfirmation.confirmText !== "I want to delete this college"}
                style={{ borderRadius: '4px' }}
              >
                Delete
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
          {colleges.map((college) => (
            <div key={college._id} className="bg-white bg-opacity-80 backdrop-blur-md rounded-3xl p-6 flex flex-col justify-between h-60 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
              <h2 className="text-gray-700 text-xl font-semibold text-center">{college.collegeName}</h2>
              <div className="mt-auto pt-4 flex justify-between items-center">
                <Link href={`/college/${college._id}`} className="px-4 py-2 bg-[#8d77ff] text-white rounded-full shadow-sm hover:bg-[#7a66e6] transition-colors text-sm">
                  View Details
                </Link>
                <button onClick={() => initiateDelete(college._id)} className="text-red-500 hover:text-red-700 text-sm">
                  ✖ Delete
                </button>
              </div>
            </div>
          ))}

          <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-3xl p-6 flex flex-col items-center justify-center h-60 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
            <h3 className="text-lg font-medium text-gray-600 mb-4">Add New College</h3>
            <div className="w-full px-2">
              <div className="w-full max-w-full overflow-hidden">
                <Input
                  placeholder="Enter college name"
                  value={newCollegeName}
                  onChange={(e) => setNewCollegeName(e.target.value)}
                  className="mb-4 w-full box-border"
                />
              </div>
              <Button 
                onClick={addCollege} 
                className="px-4 py-2 bg-[#8d77ff] text-white rounded-full shadow-sm hover:bg-[#7a66e6] transition-colors text-sm w-full"
                disabled={!newCollegeName.trim()}
              >
                + Add College
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}