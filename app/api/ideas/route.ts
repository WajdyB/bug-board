import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { ideaSchema } from "@/lib/validations"

export async function GET() {
  try {
    const ideas = await prisma.idea.findMany({
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
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(ideas)
  } catch (error) {
    console.error("Failed to fetch ideas:", error)
    return NextResponse.json({ error: "Failed to fetch ideas" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, ...ideaData } = body

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const validation = ideaSchema.safeParse(ideaData)
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid data", details: validation.error.errors }, { status: 400 })
    }

    const idea = await prisma.idea.create({
      data: validation.data,
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
      },
    })

    return NextResponse.json(idea, { status: 201 })
  } catch (error) {
    console.error("Failed to create idea:", error)
    return NextResponse.json({ error: "Failed to create idea" }, { status: 500 })
  }
}
