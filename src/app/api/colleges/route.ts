import { NextResponse, NextRequest } from "next/server";
import User from "@/models/user";
import { connectMongoDB } from "@/app/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";

// Define interface for the College type
interface College {
  _id?: string; // Make _id optional since MongoDB generates it automatically
  collegeName: string;
  application_status: Record<string, unknown>;
  questions: { question: string; answer: string }[];
}

// Define interface for the User type
interface UserType {
  email: string;
  colleges: College[];
  save: () => Promise<void>;
}

export async function GET() {
  try {
    console.log("Connecting to MongoDB...");
    await connectMongoDB();
    
    console.log("Fetching session...");
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.error("User not authenticated");
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    console.log(`Fetching user with email: ${session.user.email}`);
    const user = await User.findOne({ email: session.user.email }) as UserType;
    if (!user) {
      console.error("User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log(`User found. Returning colleges: ${JSON.stringify(user.colleges)}`);
    return NextResponse.json({ colleges: user.colleges }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/colleges:", error);
    // Handle the unknown error type properly
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log("Connecting to MongoDB...");
    await connectMongoDB();

    console.log("Fetching session...");
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.error("User not authenticated");
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const data = await req.json();
    const { collegeName } = data as { collegeName: string };
    console.log(`Received college name: ${collegeName}`);
    if (!collegeName) {
      console.error("Missing college name");
      return NextResponse.json({ error: "Missing college name" }, { status: 400 });
    }

    console.log(`Fetching user with email: ${session.user.email}`);
    const user = await User.findOne({ email: session.user.email }) as UserType;
    if (!user) {
      console.error("User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("Adding new college...");
    // No need for type assertion here since the object structure matches the College interface
    user.colleges.push({ 
      collegeName, 
      application_status: {}, 
      questions: [] 
    });
    await user.save();

    console.log("College added successfully");
    return NextResponse.json({ message: "College added successfully", colleges: user.colleges }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/colleges:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    console.log("Connecting to MongoDB...");
    await connectMongoDB();

    console.log("Fetching session...");
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.error("User not authenticated");
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const data = await req.json();
    const { collegeId } = data as { collegeId: string };
    console.log(`Received college ID: ${collegeId}`);
    if (!collegeId) {
      console.error("Missing college ID");
      return NextResponse.json({ error: "Missing college ID" }, { status: 400 });
    }

    console.log(`Fetching user with email: ${session.user.email}`);
    const user = await User.findOne({ email: session.user.email }) as UserType;
    if (!user) {
      console.error("User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("Removing college...");
    user.colleges = user.colleges.filter((college: College) => college._id?.toString() !== collegeId);
    await user.save();

    console.log("College deleted successfully");
    return NextResponse.json({ message: "College deleted successfully", colleges: user.colleges }, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE /api/colleges:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}