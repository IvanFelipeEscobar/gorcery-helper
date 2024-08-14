import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const authCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    const expirationTime = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // Code expires in 10 minutes

    // Update the user's auth code in the database
    await sql`
      INSERT INTO Users (email, auth_code, auth_code_expires_at)
      VALUES (${email}, ${authCode}, ${expirationTime})
      ON CONFLICT (email) DO UPDATE 
      SET auth_code = ${authCode}, auth_code_expires_at = ${expirationTime}, updated_at = NOW();
    `;

    // Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-password',
      },
    });

    // Send the email
    await transporter.sendMail({
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Your Authentication Code',
      text: `Your authentication code is ${authCode}`,
    });

    return NextResponse.json({ message: "Authentication code sent" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "An unknown error occurred" }, { status: 500 });
  }
}
