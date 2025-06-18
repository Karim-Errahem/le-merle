import { NextResponse } from "next/server";
import pool from "@/lib/db";
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
      "SELECT `id`, `name`, `role_fr`, `bio_fr`, `name_ar`, `role_ar`, `bio_ar`, `role_en`, `bio_en`, `image` FROM `team_members`"
    );

    // Map the database rows to the expected structure for the AboutTeam component
    const members = (rows as any[]).map((row) => ({
      name: row[`name${lang === "ar" ? "_ar" : lang === "fr" ? "_fr" : "_en"}`] || row.name,
      role: row[`role_${lang}`],
      bio: row[`bio_${lang}`],
      image: row.image,
    }));

    return NextResponse.json({
      teamTitle: lang === "fr" ? "Notre équipe" : lang === "ar" ? "فريقنا" : "Our Team",
      teamSubtitle:
        lang === "fr"
          ? "Rencontrez les experts derrière notre succès"
          : lang === "ar"
          ? "تعرف على الخبراء وراء نجاحنا"
          : "Meet the experts behind our success",
      members,
    });
  } catch (error) {
    console.error(`Database query error for lang=${lang}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}