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
      "SELECT `title_fr`, `description_fr`, `title_en`, `description_en`, `title_ar`, `description_ar`, `image`, `date_creation`, `features_fr`, `features_en`, `features_ar` FROM `services`"
    );

    // Map the database rows to the expected structure for the Services component
    const services = (rows as any[]).map((row) => ({
      title: row[`title_${lang}`],
      description: row[`description_${lang}`],
      image: row.image, // Ensure image is a valid URL or base64 data
      dateCreation: new Date(row.date_creation).toISOString().slice(0, 10), // Format date as YYYY-MM-DD
      features: row[`features_${lang}`] ? JSON.parse(row[`features_${lang}`]) : [], // Parse features if available
    }));

    return NextResponse.json({
      title:
        lang === "fr" ? "Nos services" : lang === "ar" ? "خدماتنا" : "Our Services",
      subtitle:
        lang === "fr"
          ? "Découvrez nos services de haute qualité"
          : lang === "ar"
          ? "اكتشف خدماتنا عالية الجودة"
          : "Discover our high-quality services",
      services,
    });
  } catch (error) {
    console.error(`Database query error for lang=${lang}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}