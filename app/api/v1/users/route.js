import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";

export async function GET() {
    try {
        const [userDB] = await db.query(`
      SELECT 
        u.id,
        u.username,
        u.name AS user_name,
        u.team_id,
        u.roleName,
        t.name AS team_name
      FROM users u
      LEFT JOIN teams t ON u.team_id = t.id
    `);

        return NextResponse.json(
            { message: "Successful", userDB },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
