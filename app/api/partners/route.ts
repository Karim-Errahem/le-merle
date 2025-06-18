import { NextResponse } from "next/server";
import pool from "@/lib/db";
import type { Locale } from "@/lib/i18n-config";

export const revalidate = 3600; // Revalidate every hour for ISR

export async function GET(request: Request) {
  let connection;
  const { searchParams } = new URL(request.url);
  const lang = (searchParams.get("lang") || "en") as Locale;

  if (!["en", "fr", "ar"].includes(lang)) {
    return NextResponse.json({ error: "Invalid language" }, { status: 400 });
  }

  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT name, logo FROM partners`
    );

    const partners = (rows as any[]).map((row) => ({
      name: row.name,
      logo: row.logo,
    }));

    return NextResponse.json(partners);
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json(
      { error: "Failed to fetch partners" },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}