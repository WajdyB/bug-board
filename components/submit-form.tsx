"use client"

import type React from "react"

import { useState } from "react"
import { X, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ideaSchema, type IdeaInput } from "@/lib/validations"
import { getOrCreateUserId } from "@/lib/uuid"

interface SubmitFormProps {
  isOpen: boolean
  onClose: () => void
}

const SUGGESTED_TAGS = [
  "Bug",
  "Feature",
  "Enhancement",
  "UI/UX",
  "Performance",
  "Security",
  "Documentation",
  "Mobile",
  "API",
  "Integration",
]

export default function SubmitForm({ isOpen, onClose }: SubmitFormProps) {
  const [formData, setFormData] = useState<IdeaInput>({
    title: "",
    description: "",
    tags: [],
  })
  const [newTag, setNewTag] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const validation = ideaSchema.safeParse(formData)
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {}
      validation.error.errors.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0] as string] = error.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    setIsSubmitting(true)
    try {
      const userId = getOrCreateUserId()
      const response = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userId }),
      })

      if (!response.ok) throw new Error("Failed to submit idea")

      setFormData({ title: "", description: "", tags: [] })
      onClose()
      window.location.reload() // Simple refresh to show new idea
    } catch (error) {
      setErrors({ submit: "Failed to submit idea. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Submit New Idea</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Brief, descriptive title..."
              maxLength={100}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            <p className="mt-1 text-xs text-gray-500">{formData.title.length}/100 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description *</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Provide detailed information about your idea or bug report..."
              rows={4}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags * (max 5)</label>

            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1 cursor-pointer hover:bg-red-100 dark:hover:bg-red-900"
                  onClick={() => removeTag(tag)}
                >
                  {tag}
                  <X className="w-3 h-3" />
                </Badge>
              ))}
            </div>

            <div className="flex gap-2 mb-3">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add custom tag..."
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addTag(newTag)
                  }
                }}
                disabled={formData.tags.length >= 5}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addTag(newTag)}
                disabled={!newTag || formData.tags.length >= 5}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {SUGGESTED_TAGS.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900"
                  onClick={() => addTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {errors.tags && <p className="mt-1 text-sm text-red-600">{errors.tags}</p>}
          </div>

          {errors.submit && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Idea"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
