import { PostCreateForm } from "@/features/post/post-create-form";

export default function NewPostPage() {
  return (
    <div>
      <header className="sticky top-0 z-10 border-b bg-white px-4 py-3">
        <h1 className="font-semibold text-center">新しい投稿</h1>
      </header>
      <PostCreateForm />
    </div>
  );
}
