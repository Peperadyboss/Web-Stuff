
export default function PostCard({ post, onDelete, onClick }) {
  return (
    <article className="post-card">
      <div
        className="post-card-content"
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onClick?.();
          }
        }}
      >
        <h2 className="post-title">{post.title}</h2>

        <p className="post-preview">{post.body}</p>

        {post.tags?.length > 0 && (
          <div className="post-tags">
            {post.tags.map((tag) => (
              <span className="tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="post-card-footer">
          <span className="post-likes">
            ❤️ {post.reactions?.likes ?? post.likes ?? 0} likes
          </span>
        </div>
      </div>

      <button
        type="button"
        className="delete-button"
        onClick={(event) => {
          event.stopPropagation();
          onDelete(post.id);
        }}
      >
        Delete
      </button>
    </article>
  );
}
