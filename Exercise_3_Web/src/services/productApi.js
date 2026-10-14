const BASE_URL = "https://dummyjson.com";

export async function getProducts(limit = 12, skip = 0, signal) {
  const response = await fetch(
    `${BASE_URL}/products?limit=${limit}&skip=${skip}`,
    { signal }
  );

  if (!response.ok) {
    throw new Error(`Failed to load products (HTTP ${response.status})`);
  }

  return response.json();
}

export async function getProduct(id, signal) {
  const response = await fetch(`${BASE_URL}/products/${id}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error(`Failed to load product details (HTTP ${response.status})`);
  }

  return response.json();
}