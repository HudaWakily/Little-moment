"use client";

import { WizardPhotoUploader } from "@/components/photo-uploader/wizard-photo-uploader";
import type { WizardPhoto } from "@/components/photo-uploader/wizard-photo-uploader";

type PhotosStepProps = {
  photos: WizardPhoto[];
  onChange: (photos: WizardPhoto[]) => void;
  disabled?: boolean;
};

export function PhotosStep({ photos, onChange, disabled }: PhotosStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold sm:text-2xl">
          Fotos do seu pequeno 📸
        </h2>
        <p className="mt-2 text-muted-foreground">
          Envie de 1 a 3 fotos — o rostinho será o protagonista da história
        </p>
      </div>

      <WizardPhotoUploader photos={photos} onChange={onChange} disabled={disabled} />
    </div>
  );
}
