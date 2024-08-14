import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Drop existing tables if they exist (to avoid conflicts)
    await sql`DROP TABLE IF EXISTS Items CASCADE;`;
    await sql`DROP TABLE IF EXISTS Categories CASCADE;`;
    await sql`DROP TABLE IF EXISTS GroceryLists CASCADE;`;
    await sql`DROP TABLE IF EXISTS Users CASCADE;`;

    // Create the Users table first
    await sql`
      CREATE TABLE IF NOT EXISTS Users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        auth_code VARCHAR(255),
        auth_code_expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    // Create the GroceryLists table with a foreign key referencing Users
    await sql`
      CREATE TABLE IF NOT EXISTS GroceryLists (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        title VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
      );
    `;

    // Create the Categories table with a foreign key referencing GroceryLists
    await sql`
      CREATE TABLE IF NOT EXISTS Categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        grocery_list_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (grocery_list_id) REFERENCES GroceryLists(id) ON DELETE CASCADE
      );
    `;

    // Create the Items table with a foreign key referencing Categories
    await sql`
      CREATE TABLE IF NOT EXISTS Items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        quantity INTEGER NOT NULL,
        category_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (category_id) REFERENCES Categories(id) ON DELETE CASCADE
      );
    `;

    return NextResponse.json({ message: "Tables created successfully" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
    }
  }
}
