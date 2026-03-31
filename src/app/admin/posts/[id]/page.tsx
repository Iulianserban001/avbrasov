import PostEditorPage from "../new/page";

export default function EditPostPage({ params }: { params: { id: string } }) {
  return <PostEditorPage params={params} />;
}
