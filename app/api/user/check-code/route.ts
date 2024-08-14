import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, authCode } = await request.json();

    // Retrieve the user's data
    const result = await sql`
     SELECT * FROM Users WHERE email = ${email};
   `;

    // Access the rows
    const user = result.rows[0];
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if the code is correct and hasn't expired
    const now = new Date();
    if (
      user.auth_code === authCode &&
      new Date(user.auth_code_expires_at) > now
    ) {
      return NextResponse.json(
        { message: "Authenticated successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Invalid or expired code" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}
