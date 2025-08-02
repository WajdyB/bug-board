"use client"

import { useState } from "react"
import { Moon, Sun, Plus, Bug } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDarkMode } from "@/lib/hooks"
import SubmitForm from "./submit-form"

export default function Header() {
  const { isDark, toggleDarkMode } = useDarkMode()
  const [showSubmitForm, setShowSubmitForm] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <Bug className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Bug Board</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Community Ideas & Bug Reports</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button onClick={() => setShowSubmitForm(true)} className="btn-primary flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Submit Idea</span>
              </Button>

              <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="w-10 h-10">
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <SubmitForm isOpen={showSubmitForm} onClose={() => setShowSubmitForm(false)} />
    </>
  )
}
