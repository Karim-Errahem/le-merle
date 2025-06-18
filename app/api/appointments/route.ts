// app/api/appointments/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  let connection;
  try {
    connection = await pool.getConnection();
    const [services] = await connection.query("SELECT id, title_fr, title_en, title_ar FROM services");
    return NextResponse.json({ services });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

export async function POST(request: Request) {
  let connection;
  try {
    connection = await pool.getConnection();
    const { name, email, phone, date, time, service, message } = await request.json();

    // Validate date and time
    const selectedDate = new Date(`${date}T${time}`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return NextResponse.json({ error: "Impossible de sélectionner une date passée" }, { status: 400 });
    }

    const day = selectedDate.getDay();
    const hours = selectedDate.getHours();
    const minutes = selectedDate.getMinutes();

    const isValidTime =
      (day >= 1 && day <= 5 && hours >= 8 && hours < 17) ||
      (day === 6 && hours >= 8 && hours < 12);

    if (!isValidTime) {
      return NextResponse.json(
        { error: "Veuillez sélectionner une date et une heure valides (lundi-vendredi 8h-17h, samedi 8h-12h)." },
        { status: 400 }
      );
    }

    // Check slot availability
    const [rows] = await connection.query(
      "SELECT COUNT(*) as count FROM rendivous WHERE date = ? AND time = ?",
      [date, time]
    );
    if ((rows as any)[0].count > 0) {
      return NextResponse.json({ error: "Cet horaire est déjà réservé. Veuillez choisir un autre." }, { status: 400 });
    }

    // Insert appointment
    await connection.query(
      "INSERT INTO rendivous (name, email, phone, date, time, service) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, phone, date, time, service]
    );

    return NextResponse.json({ message: "Votre rendez-vous a été réservé avec succès !" });
  } catch (error) {
    console.error("Error booking appointment:", error);
    return NextResponse.json({ error: "Failed to book appointment" }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}