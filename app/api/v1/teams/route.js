import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";

export async function GET() {
    try {
        const [TeamDB] = await db.query(
            "SELECT * FROM teams"
        )

        return NextResponse.json({message: 'Successful', TeamDB}, {status: 200})
    } catch {
        return NextResponse.json({message: 'Internal Server Error'}, {status: 500})
    }
}