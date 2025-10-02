import { Check } from "lucide-react";
import { STEPS } from "@/modules/onboarding/validations/onboarding-constants";

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-3 flex-1">
              <div
                className={`flex size-10 items-center justify-center rounded-full border-2 transition-all ${
                  currentStep > step.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : currentStep === step.id
                      ? "border-primary bg-background text-primary"
                      : "border-border bg-background text-muted-foreground"
                }`}
              >
                {currentStep > step.id ? (
                  <Check className="size-5" />
                ) : (
                  <span className="text-sm font-semibold">{step.id}</span>
                )}
              </div>
              <div className="text-center">
                <p
                  className={`text-sm font-medium ${
                    currentStep >= step.id
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.title}
                </p>
              </div>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`h-[2px] flex-1 transition-all ${currentStep > step.id ? "bg-primary" : "bg-border"}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
