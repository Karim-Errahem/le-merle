import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(request: Request) {
  let connection;
  try {
    connection = await pool.getConnection();
    const { quote, author, star } = await request.json();

    if (!quote || !author || !star) {
      return NextResponse.json(
        { error: "Quote, author, and star rating are required" },
        { status: 400 }
      );
    }

    if (star < 1 || star > 5) {
      return NextResponse.json(
        { error: "Star rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO testimonials (quote, author, star)
      VALUES (?, ?, ?)
    `;
    const params = [quote, author, star];

    console.log("Executing query:", query, "with params:", params);
    await connection.query(query, params);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}