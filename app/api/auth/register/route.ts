import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

export const POST = async (req: NextRequest) => {
    const { name, email, password } = await req.json();

    // Encrypt the password
    const encryptedPassword = await bcrypt.hash(password, 5);

    try {
        // SQL query to insert a new user
        const result = await sql`
            INSERT INTO users (name, email, password)
            VALUES (${name}, ${email}, ${encryptedPassword})
            RETURNING id;
        `;

        // Check if the insertion was successful
        if (result.rows.length > 0) {
            return NextResponse.json({ message: 'User created' }, { status: 201 });
        } else {
            return NextResponse.json({ message: 'User creation failed' }, { status: 500 });
        }
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
};
