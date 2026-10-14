
export default function ProductCard({
  name,
  price,
  inStock = true,
  image = "https://placehold.co/300x180?text=No+image",
}) {
  return (
    <div
      style={{
        position: "relative",
        minWidth: 0,
        padding: "16px",
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: "10px",
        boxSizing: "border-box",
      }}
    >
      {price < 20 && (
        <span
          style={{
            display: "inline-block",
            marginBottom: "12px",
            padding: "5px 8px",
            background: "#dc2626",
            color: "#fff",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          Low price!
        </span>
      )}

      <img
        src={image}
        alt={name}
        style={{
          display: "block",
          width: "100%",
          height: "150px",
          objectFit: "contain",
          background: "#f3f3f3",
          marginBottom: "14px",
        }}
      />

      <h3 style={{ margin: "0 0 10px", fontSize: "20px" }}>
        {name}
      </h3>

      <p style={{ margin: "0 0 12px" }}>
        {price.toLocaleString()} USD
      </p>

      <span
        style={{
          display: "inline-block",
          padding: "5px 8px",
          borderRadius: "4px",
          fontSize: "13px",
          color: inStock ? "#166534" : "#991b1b",
          background: inStock ? "#dcfce7" : "#fee2e2",
        }}
      >
        {inStock ? "In stock" : "Sold out"}
      </span>
    </div>
  );
}



