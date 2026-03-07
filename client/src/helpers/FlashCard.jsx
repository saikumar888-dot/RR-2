import React, { useEffect, useState } from "react"
import '../helpers/Flashcard.css'

export default function FlashCard() {

  const [flash, setFlash] = useState(null)

  useEffect(() => {

    const showFlash = (e) => {
      setFlash(e.detail)

      setTimeout(() => {
        setFlash(null)
      }, 3500)
    }

    window.addEventListener("flash", showFlash)

    return () => window.removeEventListener("flash", showFlash)

  }, [])

  if (!flash) return null

  return (
    <div className={`flash-card ${flash.type}`}>
      <div className="flash-icon">
        {flash.type === "success" ? "✓" : "⚠"}
      </div>

      <div className="flash-message">
        {flash.message}
      </div>
    </div>
  )
}