// import { NextResponse } from "next/server";
// import User from "@/models/user";
// import { connectMongoDB } from "@/app/lib/mongodb";
// import { getSession } from "next-auth/react";

// export async function POST(req: Request) {
//     console.log("API Route: Received a POST request");
    
//     try {
//         // Log the request headers to check for cookies
//         console.log("Request headers:", req.headers);

//         const session = await getSession({ req: req as any });
//         console.log("session details: ", session);
        
//         if (!session) {
//             console.log("API Route: No session found. User might not be authenticated.");
//             return NextResponse.json({ message: "User not authenticated." }, { status: 401 });
//         }

//         const email = session.user?.email;
//         console.log("API Route: Retrieved email from session:", email);

//         const formData = await req.json();
//         console.log("API Route: Parsed request body:", formData);

//         await connectMongoDB();
//         console.log("API Route: Connected to MongoDB");

//         const user = await User.findOne({ email });
//         console.log("API Route: Found user:", user);

//         if (!user) {
//             console.log("API Route: User not found");
//             return NextResponse.json({ message: "User not found." }, { status: 404 });
//         }

//         Object.assign(user, formData);
//         console.log("API Route: Updated user details:", user);

//         await user.save();
//         console.log("API Route: User details saved successfully");

//         return NextResponse.json({ message: "User details updated successfully." }, { status: 200 });
//     } catch (error) {
//         console.error("API Route: Error updating user details:", error);
//         return NextResponse.json({ message: "An error occurred while updating user details." }, { status: 500 });
//     }
// }

import { NextResponse } from "next/server";
import User from "@/models/user";
import { connectMongoDB } from "@/app/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust this path based on your NextAuth setup

export async function POST(req: Request) {
    console.log("API Route: Received a POST request");
    
    try {
        const session = await getServerSession(authOptions);
        console.log("session details: ", session);

        if (!session) {
            console.log("API Route: No session found. User might not be authenticated.");
            return NextResponse.json({ message: "User not authenticated." }, { status: 401 });
        }

        const email = session.user?.email;
        console.log("API Route: Retrieved email from session:", email);

        const formData = await req.json();
        console.log("API Route: Parsed request body:", formData);

        await connectMongoDB();
        console.log("API Route: Connected to MongoDB");

        const user = await User.findOne({ email });
        console.log("API Route: Found user:", user);

        if (!user) {
            console.log("API Route: User not found");
            return NextResponse.json({ message: "User not found." }, { status: 404 });
        }

        // Store user details inside the `details` field
        user.details = formData;
        console.log("API Route: Updated user details:", user);

        await user.save();
        console.log("API Route: User details saved successfully");

        return NextResponse.json({ message: "User details updated successfully." }, { status: 200 });
    } catch (error) {
        console.error("API Route: Error updating user details:", error);
        return NextResponse.json({ message: "An error occurred while updating user details." }, { status: 500 });
    }
}
