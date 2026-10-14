import { useState } from "react";

export default function PostForm({ onAdd, busy }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim() || !body.trim()) return;

    const success = await onAdd({
      title: title.trim(),
      body: body.trim(),
    });

    if (success) {
      setTitle("");
      setBody("");
    }
  }

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <h2>Create a post</h2>

      <label htmlFor="post-title">Title</label>
      <input
        id="post-title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Enter a post title"
        required
      />

      <label htmlFor="post-body">Body</label>
      <textarea
        id="post-body"
        value={body}
        onChange={(event) => setBody(event.target.value)}
        placeholder="Write your post..."
        rows={4}
        required
      />

      <button className="primary-button" type="submit" disabled={busy}>
        {busy ? "Adding..." : "Add post"}
      </button>
    </form>
  );
}