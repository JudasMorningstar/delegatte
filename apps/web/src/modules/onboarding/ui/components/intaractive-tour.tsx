import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@delegatte/ui/components/button";
import {
  X,
  ChevronRight,
  LayoutDashboard,
  ListChecks,
  Upload,
} from "lucide-react";

interface InteractiveTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

const tourSteps = [
  {
    id: 1,
    title: "Your projects live here",
    description:
      "Access all your film projects from the sidebar. Switch between them anytime.",
    icon: LayoutDashboard,
    position: { top: "20%", left: "5%" },
    highlight: { top: "12%", left: "2%", width: "15%", height: "60%" },
  },
  {
    id: 2,
    title: "Organize sourcing, builds, and returns",
    description:
      "Track every task from pre-production through wrap. Assign to your crew and monitor progress.",
    icon: ListChecks,
    position: { top: "50%", left: "35%" },
    highlight: { top: "35%", left: "25%", width: "35%", height: "50%" },
  },
  {
    id: 3,
    title: "Drop in prop images or receipts",
    description:
      "Keep everything organized. Upload photos, receipts, and reference materials in one place.",
    icon: Upload,
    position: { top: "50%", right: "15%" },
    highlight: { top: "60%", right: "10%", width: "35%", height: "25%" },
  },
];

export function InteractiveTour({ onComplete, onSkip }: InteractiveTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = tourSteps[currentStep]!;
  const Icon = step.icon;

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Dark overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onSkip}
      />

      {/* Spotlight highlight */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="absolute rounded-lg ring-4 ring-accent/50 bg-accent/5"
          style={{
            ...step.highlight,
            pointerEvents: "none",
          }}
        />
      </AnimatePresence>

      {/* Tooltip Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="absolute max-w-sm"
          style={step.position}
        >
          <div className="bg-card border border-border rounded-xl shadow-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {currentStep + 1} / {tourSteps.length}
                  </span>
                </div>
              </div>
              <button
                onClick={onSkip}
                className="p-1 rounded-md hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <h3 className="mb-2">{step.title}</h3>
            <p className="text-sm text-muted-foreground mb-6">
              {step!.description}
            </p>

            <div className="flex items-center justify-between gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onSkip}
                className="text-muted-foreground"
              >
                Skip Tour
              </Button>
              <Button onClick={handleNext} size="sm" className="gap-1.5">
                {currentStep < tourSteps.length - 1 ? (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </>
                ) : (
                  "Got it!"
                )}
              </Button>
            </div>

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-1.5 mt-4">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 rounded-full transition-all ${
                    index === currentStep
                      ? "w-6 bg-accent"
                      : index < currentStep
                        ? "w-1 bg-accent/50"
                        : "w-1 bg-border"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
