import { NextResponse } from "next/server";
import pool from "@/lib/db"; // Import the MySQL pool from db.ts
import type { Locale } from "@/lib/i18n-config";

export async function GET(request: Request) {
  let connection;
  const { searchParams } = new URL(request.url);
  const lang = (searchParams.get("lang") || "fr") as Locale;

  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(
      "SELECT `name_fr`, `description_fr`, `name_en`, `description_en`, `name_ar`, `description_ar`, `price_monthly`, `price_yearly`, `popular`, `features_fr`, `features_en`, `features_ar` FROM `pricing_plans`"
    );

    const plans = (rows as any[]).map((row) => {
      let features: string[] = [];
      const featuresRaw = row[`features_${lang}`];
      try {
        features = featuresRaw ? JSON.parse(featuresRaw) : [];
      } catch (parseError) {
        console.error(`Failed to parse features_${lang} for plan ${row[`name_${lang}`]}:`, parseError, `Raw data: ${featuresRaw}`);
        features = []; // Fallback to empty array
      }

      return {
        name: row[`name_${lang}`],
        description: row[`description_${lang}`],
        price: {
          monthly: row.price_monthly,
          yearly: row.price_yearly,
        },
        features,
        popular: row.popular === 1 || row.popular === true,
        cta: lang === "fr" ? "Choisir ce plan" : lang === "ar" ? "اختر هذه الخطة" : "Choose this plan",
      };
    });

    return NextResponse.json({
      title: lang === "fr" ? "Nos tarifs" : lang === "ar" ? "أسعارنا" : "Our Pricing",
      subtitle:
        lang === "fr"
          ? "Choisissez le plan qui convient à vos besoins"
          : lang === "ar"
          ? "اختر الخطة التي تناسب احتياجاتك"
          : "Choose the plan that fits your needs",
      pricingToggle: {
        monthly: lang === "fr" ? "Mensuel" : lang === "ar" ? "شهري" : "Monthly",
        yearly: lang === "fr" ? "Annuel" : lang === "ar" ? "سنوي" : "Yearly",
      },
      plans,
      disclaimer:
        lang === "fr"
          ? "Les prix peuvent changer. Contactez-nous pour plus de détails."
          : lang === "ar"
          ? "الأسعار قابلة للتغيير. تواصلوا معنا لمزيد من التفاصيل."
          : "Prices are subject to change. Contact us for more details.",
    });
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json(
      { error: "Failed to fetch pricing plans" },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}