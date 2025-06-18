import { NextResponse } from "next/server";
import pool from "@/lib/db"; // Import the MySQL pool from db.ts
import type { Locale } from "@/lib/i18n-config";

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
      "SELECT `quote`, `author`, `star` FROM `testimonials`"
    );

    // Map the database rows to the expected structure for the Testimonials component
    const items = (rows as any[]).map((row) => ({
      quote: row.quote,
      author: row.author,
      star: row.star, // Renamed from 'etoile' to match database column and POST endpoint
    }));

    return NextResponse.json({
      title: lang === "fr" ? "Témoignages" : lang === "ar" ? "شهادات" : "Testimonials",
      subtitle:
        lang === "fr"
          ? "Ce que nos clients disent de nous"
          : lang === "ar"
          ? "ماذا يقول عملاؤنا عنا"
          : "What our clients say about us",
      items,
    });
  } catch (error) {
    console.error(`Database query error for lang=${lang}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}