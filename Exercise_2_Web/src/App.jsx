import { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard.jsx";
import { fakeFetchProducts } from "./data/products.js";
import "./App.css";

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState([]);

  // Load products
  useEffect(() => {
    fakeFetchProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  // Update browser tab title with cart quantity
  useEffect(() => {
    const count = cart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    document.title = `Cart (${count})`;
  }, [cart]);

  // Add an item or increase its quantity
  function addToCart(product) {
    setCart((currentCart) => {
      const existing = currentCart.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentCart, { ...product, quantity: 1 }];
    });
  }

  // Remove an item from the cart
  function removeFromCart(id) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== id)
    );
  }

  // Category options
  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  // Search and category filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  // Cart calculations
  const itemCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (loading) {
    return (
      <main className="page">
        <h2>Loading...</h2>
      </main>
    );
  }

  return (
    <main className="page">
      <h1>Products</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by product name..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <section className="product-grid">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            onAdd={() => addToCart(product)}
          />
        ))}
      </section>

      {filteredProducts.length === 0 && (
        <p className="empty-message">No products found.</p>
      )}

      <section className="cart-section">
        <h2>Shopping Cart ({itemCount} items)</h2>

        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <div className="cart-list">
              {cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="cart-item-info">
                    <strong>{item.name}</strong>
                    <span>
                      ${item.price.toFixed(2)} × {item.quantity}
                      {" = "}
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  <button
                    className="remove-button"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <h3 className="cart-total">
              Total: ${total.toFixed(2)}
            </h3>
          </>
        )}
      </section>
    </main>
  );
}



