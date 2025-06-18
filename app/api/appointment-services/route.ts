import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  let connection;
  try {
    connection = await pool.getConnection();
    const query = `
      SELECT id, title_fr, title_en, title_ar
      FROM services
    `;
    const [rows] = await connection.query<any[]>(query);
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointment services" },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}