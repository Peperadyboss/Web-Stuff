import { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard.jsx";
import { getProducts, getProduct } from "./services/productApi";
import "./App.css";

const PRODUCTS_PER_PAGE = 12;

export default function App() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE);

  // Fetch products whenever the page or retry counter changes
  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      setLoading(true);
      setError("");

      try {
        const skip = (page - 1) * PRODUCTS_PER_PAGE;

        const data = await getProducts(
          PRODUCTS_PER_PAGE,
          skip,
          controller.signal
        );

        setProducts(data.products);
        setTotal(data.total);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Something went wrong.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => controller.abort();
  }, [page, retry]);

  // Fetch details when a product is selected
  async function openProduct(product) {
    setSelectedProduct(null);
    setDetailLoading(true);
    setDetailError("");

    try {
      const data = await getProduct(product.id);
      setSelectedProduct(data);
    } catch (err) {
      setDetailError(
        err.message || "Could not load product details."
      );
    } finally {
      setDetailLoading(false);
    }
  }

  function backToProducts() {
    setSelectedProduct(null);
    setDetailError("");
  }

  // Product detail screen
  if (selectedProduct || detailLoading || detailError) {
    return (
      <main className="page">
        <button className="back-button" onClick={backToProducts}>
          ← Back to products
        </button>

        {detailLoading && (
          <p className="message">Loading product details...</p>
        )}

        {detailError && (
          <div className="error-box">
            <p>Error: {detailError}</p>
            <button
              className="retry-button"
              onClick={() => {
                const product = products.find(
                  (item) => item.id === selectedProduct?.id
                );
                if (product) openProduct(product);
              }}
            >
              Try again
            </button>
          </div>
        )}

        {selectedProduct && (
          <section className="detail-card">
            <img
              className="detail-image"
              src={selectedProduct.thumbnail}
              alt={selectedProduct.title}
            />

            <div className="detail-content">
              <p className="detail-category">
                {selectedProduct.category}
              </p>

              <h1>{selectedProduct.title}</h1>
              <p className="detail-description">
                {selectedProduct.description}
              </p>

              <p className="detail-price">
                ${selectedProduct.price.toFixed(2)}
              </p>

              <p>
                <strong>Rating:</strong> ⭐ {selectedProduct.rating}
              </p>

              <p>
                <strong>Stock:</strong> {selectedProduct.stock} available
              </p>

              {selectedProduct.brand && (
                <p>
                  <strong>Brand:</strong> {selectedProduct.brand}
                </p>
              )}
            </div>
          </section>
        )}
      </main>
    );
  }

  // Product list screen
  return (
    <main className="page">
      <header className="page-header">
        <div>
          <h1>Products</h1>
          <p className="subtitle">
            Browse products from the DummyJSON API
          </p>
        </div>

        <span className="product-count">
          {total} products available
        </span>
      </header>

      {loading && <p className="message">Loading...</p>}

      {error && (
        <div className="error-box">
          <p>Error: {error}</p>
          <button
            className="retry-button"
            onClick={() => setRetry((value) => value + 1)}
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <section className="product-grid">
            {products.map((product) => (
              <article className="product-card" key={product.id}>
                <img
                  className="product-image"
                  src={product.thumbnail}
                  alt={product.title}
                  loading="lazy"
                />

                <div className="product-content">
                  <h2>{product.title}</h2>
                  <p className="product-price">
                    ${product.price.toFixed(2)}
                  </p>
                  <p className="product-rating">
                    ⭐ {product.rating}
                  </p>

                  <button
                    className="details-button"
                    onClick={() => openProduct(product)}
                  >
                    View details
                  </button>
                </div>
              </article>
            ))}
          </section>

          <nav className="pagination" aria-label="Product pages">
            <button
              className="page-button"
              onClick={() => setPage((current) => current - 1)}
              disabled={page === 1 || loading}
            >
              ← Previous
            </button>

            <span className="page-number">
              Page {page} of {totalPages}
            </span>

            <button
              className="page-button"
              onClick={() => setPage((current) => current + 1)}
              disabled={page >= totalPages || loading}
            >
              Next →
            </button>
          </nav>
        </>
      )}
    </main>
  );
}