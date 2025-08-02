import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { commentSchema } from "@/lib/validations"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ideaId, userId, content } = body

    if (!ideaId || !userId) {
      return NextResponse.json({ error: "Idea ID and User ID are required" }, { status: 400 })
    }

    const validation = commentSchema.safeParse({ content })
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid comment", details: validation.error.errors }, { status: 400 })
    }

    // Check if idea exists
    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
    })

    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 })
    }

    const comment = await prisma.comment.create({
      data: {
        ideaId,
        userId,
        content: validation.data.content,
      },
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error("Failed to create comment:", error)
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 })
  }
}
