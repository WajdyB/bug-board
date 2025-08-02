"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ChevronUp, MessageCircle, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getOrCreateUserId } from "@/lib/uuid"

interface IdeaCardProps {
  idea: {
    id: string
    title: string
    description: string
    tags: string[]
    createdAt: string
    _count: {
      votes: number
      comments: number
    }
    votes: { userId: string }[]
  }
}

export default function IdeaCard({ idea }: IdeaCardProps) {
  const [voteCount, setVoteCount] = useState(idea._count.votes)
  const [isVoted, setIsVoted] = useState(() => {
    const userId = getOrCreateUserId()
    return idea.votes.some((vote) => vote.userId === userId)
  })
  const [isVoting, setIsVoting] = useState(false)

  const handleVote = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isVoting) return

    setIsVoting(true)
    const userId = getOrCreateUserId()

    try {
      const response = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ideaId: idea.id, userId }),
      })

      if (response.ok) {
        const data = await response.json()
        setVoteCount(data.voteCount)
        setIsVoted(data.voted)
      }
    } catch (error) {
      console.error("Failed to vote:", error)
    } finally {
      setIsVoting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

  return (
    <Link href={`/idea/${idea.id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 card-hover cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{idea.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">{idea.description}</p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleVote}
            disabled={isVoting}
            className={`ml-4 flex flex-col items-center p-2 min-w-[60px] ${
              isVoted
                ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                : "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            }`}
          >
            <ChevronUp className={`w-5 h-5 ${isVoting ? "animate-pulse" : ""}`} />
            <span className="text-xs font-medium">{voteCount}</span>
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {idea.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span>{idea._count.comments}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(idea.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
