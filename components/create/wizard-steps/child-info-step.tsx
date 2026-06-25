"use client";

import { AgeSelector } from "@/components/age-selector";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export type ChildInfo = {
  name: string;
  age: number | null;
  gender: string;
  interests: string;
  parentMessage: string;
};

type ChildInfoStepProps = {
  value: ChildInfo;
  onChange: (value: ChildInfo) => void;
  disabled?: boolean;
};

const GENDER_OPTIONS = [
  { value: "menino", label: "Menino", emoji: "👦" },
  { value: "menina", label: "Menina", emoji: "👧" },
  { value: "outro", label: "Prefiro não dizer", emoji: "✨" },
] as const;

export function isChildInfoValid(info: ChildInfo): boolean {
  return Boolean(info.name.trim() && info.age && info.gender);
}

export function ChildInfoStep({ value, onChange, disabled }: ChildInfoStepProps) {
  const patch = (partial: Partial<ChildInfo>) => onChange({ ...value, ...partial });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-xl font-bold sm:text-2xl">
          Conte sobre a criança 💛
        </h2>
        <p className="mt-2 text-muted-foreground">
          Essas informações personalizam a história mágica
        </p>
      </div>

      <div className="space-y-3">
        <Label htmlFor="child-name" className="text-base font-semibold">
          Nome da criança
        </Label>
        <Input
          id="child-name"
          type="text"
          placeholder="Ex: Sofia, Pedro, Maria..."
          value={value.name}
          onChange={(e) => patch({ name: e.target.value })}
          disabled={disabled}
          className="h-14 rounded-xl border-2 px-5 text-lg focus:border-primary"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-base font-semibold">Idade</Label>
        <AgeSelector
          selectedAge={value.age}
          onSelectAge={(age) => patch({ age })}
        />
      </div>

      <div className="space-y-3">
        <Label className="text-base font-semibold">Gênero</Label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {GENDER_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              disabled={disabled}
              onClick={() => patch({ gender: option.value })}
              className={cn(
                "flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all",
                "hover:border-primary/40 hover:bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                value.gender === option.value
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border",
                disabled && "pointer-events-none opacity-60",
              )}
            >
              <span className="text-2xl">{option.emoji}</span>
              <span className="font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="interests" className="text-base font-semibold">
          Interesses <span className="font-normal text-muted-foreground">(opcional)</span>
        </Label>
        <Input
          id="interests"
          type="text"
          placeholder="Ex: dinossauros, futebol, desenhar, princesas..."
          value={value.interests}
          onChange={(e) => patch({ interests: e.target.value })}
          disabled={disabled}
          className="h-12 rounded-xl border-2 px-4 focus:border-primary"
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="parent-message" className="text-base font-semibold">
          Mensagem dos pais <span className="font-normal text-muted-foreground">(opcional)</span>
        </Label>
        <Textarea
          id="parent-message"
          placeholder="Uma dedicatória especial para incluir na história..."
          value={value.parentMessage}
          onChange={(e) => patch({ parentMessage: e.target.value })}
          disabled={disabled}
          rows={4}
          className="resize-none rounded-xl border-2 px-4 py-3 focus:border-primary"
        />
      </div>
    </div>
  );
}
