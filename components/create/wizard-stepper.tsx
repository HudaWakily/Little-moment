"use client";

import { Camera, Check, Palette, User, Wand2 } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export const WIZARD_STEPS = [
  { id: 1, label: "Fotos", shortLabel: "Fotos", icon: Camera },
  { id: 2, label: "Tema", shortLabel: "Tema", icon: Palette },
  { id: 3, label: "Criança", shortLabel: "Info", icon: User },
  { id: 4, label: "Gerar", shortLabel: "Gerar", icon: Wand2 },
] as const;

type WizardStepperProps = {
  currentStep: number;
  className?: string;
};

export function WizardStepper({ currentStep, className }: WizardStepperProps) {
  const progress = ((currentStep - 1) / (WIZARD_STEPS.length - 1)) * 100;

  return (
    <div className={cn("space-y-5", className)}>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-muted-foreground">
            Passo {currentStep} de {WIZARD_STEPS.length}
          </span>
          <span className="font-semibold text-primary">
            {WIZARD_STEPS[currentStep - 1]?.label}
          </span>
        </div>
        <Progress value={progress} className="h-2.5" />
      </div>

      <div className="flex justify-between sm:hidden">
        {WIZARD_STEPS.map((step) => {
          const done = step.id < currentStep;
          const active = step.id === currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-full text-xs font-bold transition-all",
                  done && "bg-carnival-green text-white shadow-md",
                  active &&
                    "bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/20",
                  !done && !active && "bg-muted text-muted-foreground",
                )}
              >
                {done ? <Check className="size-4" /> : step.id}
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {step.shortLabel}
              </span>
            </div>
          );
        })}
      </div>

      <ol className="hidden sm:flex sm:items-start sm:justify-between">
        {WIZARD_STEPS.map((step, index) => {
          const Icon = step.icon;
          const done = step.id < currentStep;
          const active = step.id === currentStep;

          return (
            <li
              key={step.id}
              className={cn(
                "relative flex flex-1 flex-col items-center gap-2 text-center",
                index < WIZARD_STEPS.length - 1 &&
                  "after:absolute after:top-6 after:left-[calc(50%+1.5rem)] after:h-0.5 after:w-[calc(100%-3rem)] after:bg-border last:after:hidden",
                done && "after:bg-carnival-green/40",
              )}
            >
              <div
                className={cn(
                  "relative z-10 flex size-12 items-center justify-center rounded-2xl transition-all duration-300",
                  done && "bg-carnival-green/20 text-carnival-green",
                  active &&
                    "scale-110 bg-primary/15 text-primary shadow-lg shadow-primary/15",
                  !done && !active && "bg-muted text-muted-foreground",
                )}
              >
                {done ? <Check className="size-5" /> : <Icon className="size-5" />}
              </div>
              <span
                className={cn(
                  "text-sm font-medium",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
