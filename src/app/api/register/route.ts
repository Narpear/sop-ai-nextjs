import { NextResponse } from "next/server";
import User from "@/models/user";
import { connectMongoDB } from "@/app/lib/mongodb";
import bcrypt from "bcryptjs";


export async function POST(req: Request) {
    try {
        const{fname, lname, email, password} = await req.json();
        const hashedPassword = await bcrypt.hash(password, 10);
        await connectMongoDB();
        await User.create({fname, lname, email, password: hashedPassword});

        return NextResponse.json({message: "User registered"}, {status: 201});
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: "An error occurred while registering the user.", error: (error as Error).message}, {status: 500});
    }
}