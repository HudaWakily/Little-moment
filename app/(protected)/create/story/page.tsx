import { CreateStoryForm } from "@/components/create/create-story-form";
import { getStoryThemes } from "@/lib/supabase/themes";

export default async function CreateStoryPage() {
  const themes = await getStoryThemes();

  return <CreateStoryForm themes={themes} />;
}
