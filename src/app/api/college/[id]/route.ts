import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import User from "@/models/user";
import { connectMongoDB } from "@/app/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // Extracts ID from the URL

    if (!id) {
      return NextResponse.json({ error: "Invalid college ID" }, { status: 400 });
    }

    const user = await User.findOne(
      { email: session.user.email, "colleges._id": id },
      { "colleges.$": 1 }
    );

    if (!user || user.colleges.length === 0) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    return NextResponse.json({
      collegeName: user.colleges[0].collegeName,
      questions: user.colleges[0].questions || [],
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json({ error: "An error occurred while fetching questions." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json({ error: "Invalid college ID" }, { status: 400 });
    }

    const { question } = await req.json();
    if (!question) {
      return NextResponse.json({ error: "Invalid question" }, { status: 400 });
    }

    const user = await User.findOneAndUpdate(
      { email: session.user.email, "colleges._id": id },
      { $push: { "colleges.$.questions": { question, answer: "" } } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    const updatedCollege = user.colleges.find(c => c._id.toString() === id);
    return NextResponse.json({ questions: updatedCollege?.questions || [] }, { status: 200 });

  } catch (error) {
    console.error("Error adding question:", error);
    return NextResponse.json({ error: "An error occurred while adding the question." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectMongoDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json({ error: "Invalid college ID" }, { status: 400 });
    }

    const { question, answer } = await req.json();
    if (!question || answer === undefined) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const user = await User.findOneAndUpdate(
      { email: session.user.email, "colleges._id": id, "colleges.questions.question": question },
      { $set: { "colleges.$.questions.$[q].answer": answer } },
      { new: true, arrayFilters: [{ "q.question": question }] }
    );

    if (!user) {
      return NextResponse.json({ error: "College or question not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Answer updated successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error updating answer:", error);
    return NextResponse.json({ error: "An error occurred while updating the answer." }, { status: 500 });
  }
}
