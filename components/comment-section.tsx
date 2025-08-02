"use client"

import type React from "react"

import { useState } from "react"
import { MessageCircle, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { commentSchema } from "@/lib/validations"
import { getOrCreateUserId } from "@/lib/uuid"

interface Comment {
  id: string
  content: string
  createdAt: string
  userId: string
}

interface CommentSectionProps {
  ideaId: string
  comments: Comment[]
  onCommentAdded: (comment: Comment) => void
}

export default function CommentSection({ ideaId, comments, onCommentAdded }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const validation = commentSchema.safeParse({ content: newComment })
    if (!validation.success) {
      setError(validation.error.errors[0].message)
      return
    }

    setIsSubmitting(true)
    try {
      const userId = getOrCreateUserId()
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ideaId, content: newComment, userId }),
      })

      if (!response.ok) throw new Error("Failed to post comment")

      const comment = await response.json()
      onCommentAdded(comment)
      setNewComment("")
    } catch (error) {
      setError("Failed to post comment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  const getUserDisplayName = (userId: string) => {
    return `User ${userId.slice(-4)}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <MessageCircle className="w-5 h-5 text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Comments ({comments.length})</h3>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts..."
          rows={3}
          maxLength={500}
          className={error ? "border-red-500" : ""}
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">{newComment.length}/500 characters</p>
          <Button
            type="submit"
            disabled={!newComment.trim() || isSubmitting}
            className="btn-primary flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Posting...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Post Comment</span>
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {getUserDisplayName(comment.userId)}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(comment.createdAt)}</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
