import { redirect } from "next/navigation";

export default function AlbumRedirectPage() {
  redirect("/create/album");
}
