import { OnboardingProvider } from "@/lib/contexts/onboarding-context";
import { OnboardingContainer } from "@/modules/onboarding/ui/components/onboarding-container";
import { OnboardingPageView } from "@/modules/onboarding/ui/views/onboarding-view";
import React from "react";

export const metadata = {
  title: "Onboarding - Get Started",
  description: "Complete your onboarding and start using our platform",
};

export default function OnboardingPage() {
  return (
    <OnboardingProvider>
      <OnboardingContainer />
    </OnboardingProvider>
  );
}
