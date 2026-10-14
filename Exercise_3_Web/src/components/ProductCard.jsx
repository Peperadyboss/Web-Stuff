export default function ProductCard({
  name,
  price,
  inStock = true,
  image = "https://placehold.co/400x220?text=No+image",
  onAdd,
}) {
  return (
    <article className="product-card">
      {price < 20 && (
        <span className="low-price">Low price!</span>
      )}

      <img
        className="product-image"
        src={image}
        alt={name}
      />

      <h3 className="product-name">{name}</h3>

      <p className="product-price">
        {price} USD
      </p>

      <div className="product-actions">
        <span className={inStock ? "stock in-stock" : "stock sold-out"}>
          {inStock ? "In stock" : "Sold out"}
        </span>

        <button
          className="add-button"
          onClick={onAdd}
          disabled={!inStock}
        >
          Add to cart
        </button>
      </div>
    </article>
  );
}