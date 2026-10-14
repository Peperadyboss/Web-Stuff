const BASE_URL = "https://dummyjson.com";

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, options);

  if (!response.ok) {
    throw new Error(`Request failed: HTTP ${response.status}`);
  }

  return response.json();
}

export function getPosts(limit = 10, skip = 0, signal) {
  return request(`/posts?limit=${limit}&skip=${skip}`, { signal });
}

export function searchPosts(query, limit = 10, skip = 0, signal) {
  const params = new URLSearchParams({
    q: query,
    limit: String(limit),
    skip: String(skip),
  });

  return request(`/posts/search?${params}`, { signal });
}

export function getPostComments(id, signal) {
  return request(`/posts/${id}/comments`, { signal });
}

export function createPost(post) {
  return request("/posts/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...post, userId: 1 }),
  });
}

export function deletePost(id) {
  return request(`/posts/${id}`, {
    method: "DELETE",
  });
}