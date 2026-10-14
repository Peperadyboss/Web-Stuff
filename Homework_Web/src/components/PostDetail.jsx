import { useEffect, useState } from "react";
import { getPostComments } from "../services/postApi";

export default function PostDetail({ post, onBack }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadComments() {
      setLoading(true);
      setError("");

      try {
        const data = await getPostComments(post.id, controller.signal);
        setComments(data.comments);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Could not load comments.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadComments();
    return () => controller.abort();
  }, [post.id]);

  return (
    <section className="detail-panel">
      <button className="secondary-button" onClick={onBack}>
        ← Back to posts
      </button>

      <article className="full-post">
        <h1>{post.title}</h1>

        <div className="tags">
          {(post.tags ?? []).map((tag) => (
            <span className="tag" key={tag}>
              #{tag}
            </span>
          ))}
        </div>

        <p className="full-post-body">{post.body}</p>
        <p className="likes">
          ♥ {post.reactions?.likes ?? 0} likes
        </p>
      </article>

      <section className="comments-section">
        <h2>Comments</h2>

        {loading && <p>Loading comments...</p>}
        {error && <p className="error-message">Error: {error}</p>}

        {!loading && !error && comments.length === 0 && (
          <p>No comments found.</p>
        )}

        {comments.map((comment) => (
          <article className="comment" key={comment.id}>
            <strong>
              {comment.user?.fullName ??
                comment.user?.username ??
                "Anonymous"}
            </strong>
            <p>{comment.body}</p>
          </article>
        ))}
      </section>
    </section>
  );
}