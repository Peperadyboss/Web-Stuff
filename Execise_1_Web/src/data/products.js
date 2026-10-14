import ProductCard from "./components/ProductCard.jsx";

const products = [
  { id: 1, name: "Keyboard", price: 25, inStock: true },
  { id: 2, name: "Mouse", price: 12, inStock: false },
  { id: 3, name: "Monitor", price: 180, inStock: true },
];

export default function App() {
  return (
    <div className="container">
      <h1>Products</h1>

      <div className="product-grid">
        {products.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>
    </div>
  );
}
