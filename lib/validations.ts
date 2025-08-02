import { z } from "zod"

export const ideaSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
  description: z.string().min(1, "Description is required"),
  tags: z.array(z.string()).min(1, "At least one tag is required").max(5, "Maximum 5 tags allowed"),
})

export const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(500, "Comment must be 500 characters or less"),
})

export type IdeaInput = z.infer<typeof ideaSchema>
export type CommentInput = z.infer<typeof commentSchema>
