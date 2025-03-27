import User from "@/models/user";
import { connectMongoDB } from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try{
        await connectMongoDB();
        const {email} = await req.json();
        const user = await User.findOne({email}).select("_id");
        console.log("user: ", user);
        return NextResponse.json({user});
    } catch (error) {
        console.log(error);
    }
}