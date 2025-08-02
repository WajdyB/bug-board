import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { ideaId, userId } = await request.json()

    if (!ideaId || !userId) {
      return NextResponse.json({ error: "Idea ID and User ID are required" }, { status: 400 })
    }

    // Check if idea exists
    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
    })

    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 })
    }

    // Check if user has already voted
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_ideaId: {
          userId,
          ideaId,
        },
      },
    })

    let voted = false
    if (existingVote) {
      // Remove vote
      await prisma.vote.delete({
        where: { id: existingVote.id },
      })
    } else {
      // Add vote
      await prisma.vote.create({
        data: {
          userId,
          ideaId,
        },
      })
      voted = true
    }

    // Get updated vote count
    const voteCount = await prisma.vote.count({
      where: { ideaId },
    })

    return NextResponse.json({ voted, voteCount })
  } catch (error) {
    console.error("Failed to process vote:", error)
    return NextResponse.json({ error: "Failed to process vote" }, { status: 500 })
  }
}
