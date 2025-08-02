"use client"

import { useState } from "react"
import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface FiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedTags: string[]
  onTagToggle: (tag: string) => void
  sortBy: "newest" | "votes"
  onSortChange: (sort: "newest" | "votes") => void
  availableTags: string[]
}

export default function Filters({
  searchQuery,
  onSearchChange,
  selectedTags,
  onTagToggle,
  sortBy,
  onSortChange,
  availableTags,
}: FiltersProps) {
  const [showAllTags, setShowAllTags] = useState(false)

  const displayTags = showAllTags ? availableTags : availableTags.slice(0, 8)

  return (
    <div className="space-y-4">
      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search ideas and bugs..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
              <Filter className="w-4 h-4" />
              <span>Sort: {sortBy === "newest" ? "Newest" : "Most Upvoted"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onSortChange("newest")}>Newest First</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange("votes")}>Most Upvoted</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Tag Filters */}
      {availableTags.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Tags</h3>
            {selectedTags.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => selectedTags.forEach((tag) => onTagToggle(tag))}
                className="text-xs"
              >
                Clear All
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {displayTags.map((tag) => {
              const isSelected = selectedTags.includes(tag)
              return (
                <Badge
                  key={tag}
                  variant={isSelected ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  }`}
                  onClick={() => onTagToggle(tag)}
                >
                  {tag}
                  {isSelected && <X className="w-3 h-3 ml-1" />}
                </Badge>
              )
            })}

            {availableTags.length > 8 && (
              <Button variant="ghost" size="sm" onClick={() => setShowAllTags(!showAllTags)} className="text-xs">
                {showAllTags ? "Show Less" : `+${availableTags.length - 8} More`}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {(selectedTags.length > 0 || searchQuery) && (
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Active filters:</span>
          {searchQuery && (
            <Badge variant="outline">
              Search: "{searchQuery}"
              <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => onSearchChange("")} />
            </Badge>
          )}
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
              <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => onTagToggle(tag)} />
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
