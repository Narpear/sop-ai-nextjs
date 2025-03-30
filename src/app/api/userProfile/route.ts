import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/user";
import { connectMongoDB } from "@/app/lib/mongodb";

export async function GET() {
  try {
    await connectMongoDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    // Fetch user with required fields
    const user = await User.findOne({ email: session.user.email }).select("fname lname email details");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Ensure details exist
    const userDetails = user.details || {};

    return NextResponse.json({
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      details: userDetails,
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json({ error: "An error occurred while fetching user profile." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectMongoDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const { field, value } = await req.json();

    if (!field || value === undefined) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: { [`details.${field}`]: value } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User details updated successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error updating user details:", error);
    return NextResponse.json({ error: "An error occurred while updating details." }, { status: 500 });
  }
}
