"use client"

import { useState, useEffect } from "react"

export function useDarkMode() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("bug-board-dark-mode")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const shouldBeDark = stored ? stored === "true" : prefersDark

    setIsDark(shouldBeDark)
    document.documentElement.classList.toggle("dark", shouldBeDark)
  }, [])

  const toggleDarkMode = () => {
    const newValue = !isDark
    setIsDark(newValue)
    localStorage.setItem("bug-board-dark-mode", newValue.toString())
    document.documentElement.classList.toggle("dark", newValue)
  }

  return { isDark, toggleDarkMode }
}
