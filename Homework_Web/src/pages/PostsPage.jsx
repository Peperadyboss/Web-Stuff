import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import PostDetail from "../components/PostDetail";
import PostForm from "../components/PostForm";
import useDebounce from "../hooks/useDebounce";
import {
  getPosts,
  searchPosts,
  createPost,
  deletePost,
} from "../services/postApi";

const POSTS_PER_PAGE = 10;

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  const [selectedPost, setSelectedPost] = useState(null);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [notice, setNotice] = useState("");

  const totalPages = Math.max(1, Math.ceil(total / POSTS_PER_PAGE));

  // Reset to page 1 when the search term changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  // Fetch the current page of posts
  useEffect(() => {
    const controller = new AbortController();

    async function loadPosts() {
      setLoading(true);
      setError("");

      try {
        const skip = (page - 1) * POSTS_PER_PAGE;

        const data = debouncedSearch.trim()
          ? await searchPosts(
              debouncedSearch.trim(),
              POSTS_PER_PAGE,
              skip,
              controller.signal
            )
          : await getPosts(
              POSTS_PER_PAGE,
              skip,
              controller.signal
            );

        setPosts(data.posts);
        setTotal(data.total);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Could not load posts.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadPosts();

    return () => controller.abort();
  }, [page, debouncedSearch, retry]);

  // Create a post
  async function handleAddPost(newPost) {
    setAdding(true);
    setNotice("");
    setError("");

    try {
      const created = await createPost(newPost);

      const localPost = {
        ...created,
        tags: [],
        reactions: { likes: 0, dislikes: 0 },
      };

      // Display the new post locally
      setPosts((current) => [
        localPost,
        ...current.filter((post) => post.id !== localPost.id),
      ]);
      setTotal((current) => current + 1);
      setNotice("Post added to the list.");

      return true;
    } catch (err) {
      setError(err.message || "Could not add the post.");
      return false;
    } finally {
      setAdding(false);
    }
  }

  // Delete a post after confirmation
  async function handleDeletePost(post) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${post.title}"?`
    );

    if (!confirmed) return;

    setDeletingId(post.id);
    setNotice("");
    setError("");

    try {
      await deletePost(post.id);

      setPosts((current) =>
        current.filter((item) => item.id !== post.id)
      );
      setTotal((current) => Math.max(0, current - 1));

      if (selectedPost?.id === post.id) {
        setSelectedPost(null);
      }

      setNotice("Post deleted from the list.");
    } catch (err) {
      setError(err.message || "Could not delete the post.");
    } finally {
      setDeletingId(null);
    }
  }

  if (selectedPost) {
    return (
      <main className="app-page">
        <PostDetail
          post={selectedPost}
          onBack={() => setSelectedPost(null)}
        />
      </main>
    );
  }

  return (
    <main className="app-page">
      <header className="app-header">
        <div>
          <p className="eyebrow">HOMEWORK · REACT + API</p>
          <h1>Mini Blog Manager</h1>
          <p className="subtitle">
            Browse, search, create, and manage blog posts.
          </p>
        </div>

        <div className="total-badge">{total} posts</div>
      </header>

      <PostForm onAdd={handleAddPost} busy={adding} />

      <section className="list-section">
        <div className="list-heading">
          <div>
            <h2>Blog posts</h2>
            <p>Search updates after you stop typing.</p>
          </div>

          <input
            className="search-input"
            type="search"
            placeholder="Search posts..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search posts"
          />
        </div>

        {notice && <p className="success-message">{notice}</p>}

        {error && (
          <div className="error-box">
            <p>{error}</p>
            <button
              className="secondary-button"
              onClick={() => setRetry((value) => value + 1)}
            >
              Try again
            </button>
          </div>
        )}

        {loading && <p className="loading-message">Loading posts...</p>}

        {!loading && !error && posts.length === 0 && (
          <p className="empty-message">No posts found.</p>
        )}

        {!loading && !error && posts.length > 0 && (
          <>
            <div className="post-list">
              {posts.map((post) => (
                <div className="post-wrapper" key={post.id}>
                  <PostCard
                    post={post}
                    onOpen={setSelectedPost}
                    onDelete={handleDeletePost}
                  />

                  {deletingId === post.id && (
                    <p className="small-status">Deleting...</p>
                  )}
                </div>
              ))}
            </div>

            <nav className="pagination" aria-label="Post pages">
              <button
                className="secondary-button"
                disabled={page <= 1 || loading}
                onClick={() => setPage((current) => current - 1)}
              >
                ← Previous
              </button>

              <span>
                Page {page} of {totalPages}
              </span>

              <button
                className="secondary-button"
                disabled={page >= totalPages || loading}
                onClick={() => setPage((current) => current + 1)}
              >
                Next →
              </button>
            </nav>
          </>
        )}
      </section>
    </main>
  );
}