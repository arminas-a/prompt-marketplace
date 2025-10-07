'use client'

import { useState } from 'react'

export default function RatingStars({ rating, size = 'medium', onRate = null, readonly = false }) {
  const [hoverRating, setHoverRating] = useState(0)
  
  const sizes = {
    small: 'fs-6',
    medium: 'fs-5',
    large: 'fs-3'
  }

  const displayRating = hoverRating || rating || 0

  return (
    <div className="d-inline-flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`${sizes[size]} ${!readonly && onRate ? 'cursor-pointer' : ''}`}
          style={{ 
            color: star <= displayRating ? '#ffc107' : '#e0e0e0',
            cursor: !readonly && onRate ? 'pointer' : 'default',
            transition: 'color 0.2s'
          }}
          onMouseEnter={() => !readonly && onRate && setHoverRating(star)}
          onMouseLeave={() => !readonly && onRate && setHoverRating(0)}
          onClick={() => !readonly && onRate && onRate(star)}
        >
          {star <= displayRating ? '★' : '☆'}
        </span>
      ))}
    </div>
  )
}
