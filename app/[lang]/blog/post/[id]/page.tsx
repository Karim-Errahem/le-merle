import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n-config";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import AboutHero from "@/components/blog-hero";
import pool from "@/lib/db"; // Import the database pool

interface BlogPostPageProps {
  params: { lang: Locale; id: string }; // id is string from URL
}

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string | null;
  image: string;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { lang, id } = params;

  // Validate lang
  if (!["en", "fr", "ar"].includes(lang)) {
    console.log("Invalid language:", lang);
    notFound();
  }

  // Validate id
  const idNum = parseInt(id, 10);
  if (isNaN(idNum)) {
    console.log("Invalid ID:", id);
    notFound();
  }

  const dictionary = await getDictionary(lang);

  let connection;
  try {
    // Fetch post directly from the database
    connection = await pool.getConnection();
    const query = `
      SELECT id, title_${lang} AS title, excerpt_${lang} AS excerpt, date, author, category, image, slug
      FROM blog_posts
      WHERE id = ?
    `;
    const params = [idNum];

    console.log("Executing query:", query, "with params:", params);
    const [rows] = await connection.query(query, params);
    console.log("Query result:", rows);

    const post = (rows as any[])[0] as BlogPost | undefined;

    if (!post) {
      notFound();
    }

    // Format date
    post.date = new Date(post.date).toISOString().slice(0, 10);

    return (
      <div className="flex flex-col">
        <AboutHero dictionary={dictionary.blogPage} lang={lang} />
        <div className="container mx-auto px-4 py-8">
          <Link
            href={`/${lang}/blog`}
            className="inline-flex items-center text-gold-600 dark:text-gold-400 hover:text-gold-700 dark:hover:text-gold-300 mb-8"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
         
          </Link>

          <div className="relative h-80 w-full rounded-xl overflow-hidden mb-8">
            <Image
              src={post.image || `/placeholder.svg?height=320&width=640&text=${encodeURIComponent(post.title)}`}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="text-xl font-semibold text-gray-400 dark:text-amber-300">
            <span>{post.date}</span>
            <span className="mx-2">•</span>
            <span>{post.author}</span>
          </div>

          <h1 className="text-3xl font-bold mb-6">{post.title}</h1>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>{post.excerpt}</p>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Database query error:", error);
    notFound();
  } finally {
    if (connection) {
      connection.release();
    }
  }
}