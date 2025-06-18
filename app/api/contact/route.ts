// app\api\contact\route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(request: Request) {
  let connection;
  try {
    const { name, email, phone, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    connection = await pool.getConnection();
    const query = `
      INSERT INTO contact (name, email, phone, message)
      VALUES (?, ?, ?, ?)
    `;
    const params = [name, email, phone || null, message];

    console.log("Executing query:", query, "with params:", params);
    await connection.query(query, params);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Database error:", error);
    const errorMessage =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "ECONNRESET"
        ? "Database connection lost. Please try again."
        : "Failed to submit contact form";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    if (connection) {
      try {
        connection.release();
      } catch (releaseError) {
        console.error("Error releasing connection:", releaseError);
      }
    }
  }
}