import { NextResponse } from "next/server";
import pool from "@/lib/db"; // Import the MySQL pool from db.ts
import type { Locale } from "@/lib/i18n-config";

export async function GET(request: Request) {
  let connection;
  const { searchParams } = new URL(request.url);
  const lang = (searchParams.get("lang") || "en") as Locale;

  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(
      "SELECT `type_fr`, `type_en`, `type_ar`, `name_fr`, `name_en`, `name_ar`, `description_fr`, `description_en`, `description_ar`, `image`, `features_fr`, `features_en`, `features_ar` FROM `equipment`"
    );

    // Group equipment by type to create categories
    const categoriesMap = new Map<string, any[]>();
    (rows as any[]).forEach((row) => {
      const categoryName = row[`type_${lang}`].toLowerCase().trim(); // Normalize category name
      if (!categoriesMap.has(categoryName)) {
        categoriesMap.set(categoryName, []);
      }
      categoriesMap.get(categoryName)!.push({
        name: row[`name_${lang}`],
        description: row[`description_${lang}`],
        image: row.image,
        features: row[`features_${lang}`] ? JSON.parse(row[`features_${lang}`]) : [],
      });
    });

    // Convert map to array of categories
    const categories = Array.from(categoriesMap.entries()).map(([name, items]) => ({
      name,
      items,
    }));

    return NextResponse.json({
      title: lang === "fr" ? "Nos équipements" : lang === "ar" ? "معداتنا" : "Our Equipment",
      subtitle:
        lang === "fr"
          ? "Découvrez notre gamme d'équipements de haute qualité"
          : lang === "ar"
          ? "اكتشف مجموعتنا من المعدات عالية الجودة"
          : "Discover our range of high-quality equipment",
      categories,
    });
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json(
      { error: "Failed to fetch equipment data" },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}