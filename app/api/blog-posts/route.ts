import { NextResponse } from "next/server";
import pool from "@/lib/db";
import type { Locale } from "@/lib/i18n-config";

export const revalidate = 3600; // Revalidate every hour for ISR

export async function GET(request: Request) {
  let connection;
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") as Locale;
  const id = searchParams.get("id");

  if (!["en", "fr", "ar"].includes(lang)) {
    return NextResponse.json({ error: "Invalid language" }, { status: 400 });
  }

  try {
    connection = await pool.getConnection();
    let query = `
      SELECT id, title_${lang} AS title, excerpt_${lang} AS excerpt, date, author, category, image, slug
      FROM blog_posts
    `;
    let params: any[] = [];

    if (id) {
      query += ` WHERE id = ?`;
      params.push(parseInt(id));
    }

    const [rows] = await connection.query(query, params);

    const posts = (rows as any[]).map((row) => ({
      id: row.id,
      title: row.title,
      excerpt: row.excerpt,
      date: new Date(row.date).toISOString().slice(0, 10), // Format date as YYYY-MM-DD
      author: row.author,
      category: row.category,
      image: row.image,
      slug: row.slug,
    }));

    return NextResponse.json(id ? posts[0] || null : posts);
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}