import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const idea = await prisma.idea.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            votes: true,
            comments: true,
          },
        },
        votes: {
          select: {
            userId: true,
          },
        },
        comments: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })

    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 })
    }

    return NextResponse.json(idea)
  } catch (error) {
    console.error("Failed to fetch idea:", error)
    return NextResponse.json({ error: "Failed to fetch idea" }, { status: 500 })
  }
}
