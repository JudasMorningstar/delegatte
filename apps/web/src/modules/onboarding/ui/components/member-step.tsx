"use client";

import React from "react";
import { Users, Plus, X } from "lucide-react";
import { Card } from "@delegatte/ui/components/card";
import { Button } from "@delegatte/ui/components/button";
import { Input } from "@delegatte/ui/components/input";
import { useOnboarding } from "@/lib/contexts/onboarding-context";
import { TourTooltip } from "./tour-tooltip";
import { TourStep } from "@delegatte/ui/components/guided-tour";

export function MembersStep() {
  const { skipMembers, previousStep, nextStep } = useOnboarding();
  const [emails, setEmails] = React.useState<string[]>([]);
  const [inputValue, setInputValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleAddEmail = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (!emails.includes(inputValue.trim())) {
        setEmails([...emails, inputValue.trim()]);
        setInputValue("");
      }
    }
  };

  const handleRemoveEmail = (email: string) => {
    setEmails(emails.filter((e) => e !== email));
  };

  const handleInvite = async () => {
    setIsLoading(true);
    await new Promise((resolve) => {
      setTimeout(() => {
        setIsLoading(false);
        nextStep();
        resolve(null);
      }, 1000);
    });
  };

  return (
    <TourStep
      id="members-invitation"
      title="Build Your Team"
      content="Add team members by entering their email addresses. You can always invite more people later!"
      order={3}
      position="bottom"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            Invite your team members
          </h2>
          <p className="text-muted-foreground">
            Bring your team on board to collaborate. You can always invite more
            people later.
          </p>
        </div>

        <Card className="p-8 space-y-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
            <Users className="h-8 w-8 text-primary" />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Team Member Emails
              </label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="colleague@example.com"
                  value={inputValue}
                  onChange={(e: any) => setInputValue(e.target.value)}
                  onKeyDown={handleAddEmail}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    if (
                      inputValue.trim() &&
                      !emails.includes(inputValue.trim())
                    ) {
                      setEmails([...emails, inputValue.trim()]);
                      setInputValue("");
                    }
                  }}
                  disabled={isLoading || !inputValue.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Press Enter or click the + button to add emails. You can add
                multiple.
              </p>
            </div>

            {emails.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  Invited ({emails.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {emails.map((email) => (
                    <div
                      key={email}
                      className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-full text-sm"
                    >
                      <span className="text-secondary-foreground">{email}</span>
                      <button
                        onClick={() => handleRemoveEmail(email)}
                        className="text-secondary-foreground hover:text-foreground transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-4 flex-wrap">
            <Button
              variant="outline"
              onClick={skipMembers}
              disabled={isLoading}
            >
              Skip for now
            </Button>
            <Button
              onClick={previousStep}
              variant="outline"
              disabled={isLoading}
            >
              Back
            </Button>
            <Button
              onClick={handleInvite}
              disabled={isLoading || emails.length === 0}
            >
              {isLoading ? "Inviting..." : "Send Invites"}
            </Button>
          </div>
        </Card>
      </div>
    </TourStep>
  );
}
