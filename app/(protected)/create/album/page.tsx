import { CreateAlbumForm } from "@/components/create/create-album-form";
import { getAlbumThemes } from "@/lib/supabase/themes";

export default async function CreateAlbumPage() {
  const themes = await getAlbumThemes();

  return <CreateAlbumForm themes={themes} />;
}
