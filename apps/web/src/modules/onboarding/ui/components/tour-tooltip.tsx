"use client";

import React from "react";
import { X, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@delegatte/ui/components/button";

interface TourTooltipProps {
  title: string;
  description: string;
  onNext?: () => void;
  onPrevious?: () => void;
  onClose?: () => void;
  showNext?: boolean;
  showPrevious?: boolean;
  nextLabel?: string;
  previousLabel?: string;
  position?: "top" | "bottom" | "left" | "right";
}

export function TourTooltip({
  title,
  description,
  onNext,
  onPrevious,
  onClose,
  showNext = true,
  showPrevious = false,
  nextLabel = "Next",
  previousLabel = "Back",
  position = "bottom",
}: TourTooltipProps) {
  const positionClasses = {
    top: "bottom-full mb-4",
    bottom: "top-full mt-4",
    left: "right-full mr-4",
    right: "left-full ml-4",
  };

  return (
    <div
      className={`absolute z-50 ${positionClasses[position]} rounded-lg border border-border bg-card p-4 shadow-lg animate-in fade-in slide-in-from-bottom-2 max-w-xs`}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground">{title}</h3>
          {onClose && (
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <p className="text-sm text-muted-foreground">{description}</p>

        <div className="flex items-center justify-between gap-2 pt-2">
          {showPrevious && onPrevious && (
            <Button
              variant="outline"
              size="sm"
              onClick={onPrevious}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              {previousLabel}
            </Button>
          )}
          {showNext && onNext && (
            <Button size="sm" onClick={onNext} className="gap-1 ml-auto">
              {nextLabel}
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Arrow pointer */}
      <div
        className={`absolute w-2 h-2 bg-card border border-border transform rotate-45 ${
          position === "bottom"
            ? "-top-1 left-4"
            : position === "top"
              ? "-bottom-1 left-4"
              : position === "right"
                ? "-left-1 top-4"
                : "-right-1 top-4"
        }`}
      />
    </div>
  );
}
