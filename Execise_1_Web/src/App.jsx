
import ProductCard from "./components/ProductCard.jsx";

const products = [
  { id: 1, name: "Keyboard", price: 25, inStock: true },
  { id: 2, name: "Mouse", price: 12, inStock: false },
  { id: 3, name: "Monitor", price: 180, inStock: true },
];

export default function App() {
  return (
    <main
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
        color: "#333",
      }}
    >
      <h1 style={{ marginBottom: "24px" }}>Products</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "20px",
          alignItems: "start",
        }}
      >
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </main>
  );
}



