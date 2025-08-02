import { v4 as uuidv4 } from "uuid"

export function getOrCreateUserId(): string {
  if (typeof window === "undefined") return ""

  const existingId = localStorage.getItem("bug-board-user-id")
  if (existingId) return existingId

  const newId = uuidv4()
  localStorage.setItem("bug-board-user-id", newId)
  return newId
}

export function getUserId(): string {
  if (typeof window === "undefined") return ""
  return localStorage.getItem("bug-board-user-id") || ""
}
