import { CreateWizard } from "@/components/create/create-wizard";
import { mergeMomentThemesWithDb } from "@/lib/themes/resolve-themes";
import { getStoryThemes } from "@/lib/supabase/themes";

export async function CreateWizardPage() {
  const dbThemes = await getStoryThemes();
  const themes = mergeMomentThemesWithDb(dbThemes);

  return <CreateWizard themes={themes} />;
}
