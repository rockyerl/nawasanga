import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const itemPerPage = parseInt(searchParams.get("itemPerPage") || "10", 10);

    const allArticles = await db.select().from(articles).orderBy(desc(articles.createdAt));
    const filtered = search
      ? allArticles.filter((a) => a.title.toLowerCase().includes(search.toLowerCase()))
      : allArticles;

    const start = (page - 1) * itemPerPage;
    const items = filtered.slice(start, start + itemPerPage);

    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Data artikel regulasi berhasil diambil",
      data: {
        items,
        count: filtered.length,
        page,
        itemPerPage,
        totalPages: Math.max(1, Math.ceil(filtered.length / itemPerPage)),
      },
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newArt = {
      id: `art_${Date.now()}`,
      title: body.title,
      author: body.author || "Sundawa ESG Team",
      category: body.category || "Regulasi",
      content: body.content || "",
      publishedAt: new Date().toISOString().split("T")[0],
      status: body.status || "published",
      views: 0,
      createdAt: new Date(),
    };

    await db.insert(articles).values(newArt);

    return NextResponse.json({
      code: 201,
      status: "Created",
      message: "Artikel berhasil ditambahkan",
      data: newArt,
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}
