"use client"

import { useState, useEffect } from "react"
import { Loader2, Lightbulb } from "lucide-react"
import Header from "@/components/header"
import IdeaCard from "@/components/idea-card"
import Filters from "@/components/filters"

interface Idea {
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

export default function HomePage() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [filteredIdeas, setFilteredIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<"newest" | "votes">("newest")
  const [availableTags, setAvailableTags] = useState<string[]>([])

  useEffect(() => {
    fetchIdeas()
  }, [])

  useEffect(() => {
    filterAndSortIdeas()
  }, [ideas, searchQuery, selectedTags, sortBy])

  const fetchIdeas = async () => {
    try {
      const response = await fetch("/api/ideas")
      if (!response.ok) throw new Error("Failed to fetch ideas")

      const data = await response.json()
      setIdeas(data)

      // Extract unique tags
      const tags = new Set<string>()
      data.forEach((idea: Idea) => {
        idea.tags.forEach((tag) => tags.add(tag))
      })
      setAvailableTags(Array.from(tags).sort())
    } catch (error) {
      console.error("Failed to fetch ideas:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortIdeas = () => {
    let filtered = [...ideas]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (idea) => idea.title.toLowerCase().includes(query) || idea.description.toLowerCase().includes(query),
      )
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((idea) => selectedTags.some((tag) => idea.tags.includes(tag)))
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "votes") {
        return b._count.votes - a._count.votes
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    setFilteredIdeas(filtered)
  }

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600 dark:text-gray-400">Loading ideas...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Community Ideas & Bug Reports</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Share your ideas, report bugs, and help improve our platform together.
          </p>
        </div>

        <div className="mb-8">
          <Filters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
            sortBy={sortBy}
            onSortChange={setSortBy}
            availableTags={availableTags}
          />
        </div>

        {filteredIdeas.length === 0 ? (
          <div className="text-center py-20">
            <Lightbulb className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {ideas.length === 0 ? "No ideas yet" : "No matching ideas found"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {ideas.length === 0
                ? "Be the first to submit an idea or bug report!"
                : "Try adjusting your search or filters to find what you're looking for."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredIdeas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
