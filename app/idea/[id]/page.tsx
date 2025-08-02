"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, ChevronUp, Calendar, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import CommentSection from "@/components/comment-section"
import { getOrCreateUserId } from "@/lib/uuid"

interface IdeaDetail {
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
  comments: {
    id: string
    content: string
    createdAt: string
    userId: string
  }[]
}

export default function IdeaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [idea, setIdea] = useState<IdeaDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isVoted, setIsVoted] = useState(false)
  const [voteCount, setVoteCount] = useState(0)
  const [isVoting, setIsVoting] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchIdea(params.id as string)
    }
  }, [params.id])

  const fetchIdea = async (id: string) => {
    try {
      const response = await fetch(`/api/ideas/${id}`)
      if (!response.ok) {
        if (response.status === 404) {
          setError("Idea not found")
        } else {
          throw new Error("Failed to fetch idea")
        }
        return
      }

      const data = await response.json()
      setIdea(data)
      setVoteCount(data._count.votes)

      const userId = getOrCreateUserId()
      setIsVoted(data.votes.some((vote: any) => vote.userId === userId))
    } catch (error) {
      setError("Failed to load idea")
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async () => {
    if (isVoting || !idea) return

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

  const handleCommentAdded = (newComment: any) => {
    if (idea) {
      setIdea({
        ...idea,
        comments: [newComment, ...idea.comments],
        _count: {
          ...idea._count,
          comments: idea._count.comments + 1,
        },
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600 dark:text-gray-400">Loading idea...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !idea) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-6 flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>

          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{error || "Idea not found"}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The idea you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push("/")}>Return to Home</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6 flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Button>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{idea.title}</h1>

              <div className="flex flex-wrap gap-2 mb-4">
                {idea.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 mb-6">
                <Calendar className="w-4 h-4" />
                <span>Submitted on {formatDate(idea.createdAt)}</span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="lg"
              onClick={handleVote}
              disabled={isVoting}
              className={`ml-6 flex flex-col items-center p-4 min-w-[80px] ${
                isVoted
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                  : "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              <ChevronUp className={`w-6 h-6 ${isVoting ? "animate-pulse" : ""}`} />
              <span className="text-sm font-medium">{voteCount}</span>
              <span className="text-xs">votes</span>
            </Button>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{idea.description}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
          <CommentSection ideaId={idea.id} comments={idea.comments} onCommentAdded={handleCommentAdded} />
        </div>
      </main>
    </div>
  )
}
