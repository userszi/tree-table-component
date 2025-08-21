"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"

interface CarouselControlsProps {
  currentIndex: number
  totalCount: number
  isAutoPlay: boolean
  onPrevious: () => void
  onNext: () => void
  onToggleAutoPlay: () => void
  onSelect: (index: number) => void
}

export default function CarouselControls({
  currentIndex,
  totalCount,
  isAutoPlay,
  onPrevious,
  onNext,
  onToggleAutoPlay,
  onSelect,
}: CarouselControlsProps) {
  return (
    <div className="flex items-center space-x-2 bg-slate-800/90 backdrop-blur-sm rounded-lg p-2 border border-slate-600">
      <Button variant="ghost" size="sm" onClick={onPrevious} className="text-slate-300 hover:text-white">
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <div className="flex space-x-1">
        {Array.from({ length: totalCount }).map((_, index) => (
          <button
            key={index}
            onClick={() => onSelect(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? "bg-blue-400" : "bg-slate-600 hover:bg-slate-500"
            }`}
          />
        ))}
      </div>

      <Button variant="ghost" size="sm" onClick={onNext} className="text-slate-300 hover:text-white">
        <ChevronRight className="w-4 h-4" />
      </Button>

      <div className="w-px h-4 bg-slate-600" />

      <Button variant="ghost" size="sm" onClick={onToggleAutoPlay} className="text-slate-300 hover:text-white">
        {isAutoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </Button>
    </div>
  )
}
