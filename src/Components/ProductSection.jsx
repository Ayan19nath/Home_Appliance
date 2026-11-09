import useProducts from "../data/useProducts";
import ProductCard from "./ProductCard";

function ProductSection() {
  const { products, loading, error } = useProducts();

  return (
    <section className="section products-section">

      <div className="section-heading">
        <h2>Best Selling Products</h2>
        <a href="/shop">View All →</a>
      </div>

      {loading && <p>Loading products...</p>}
      {error && <p>{error}</p>}

      <div className="product-grid">
        {products.slice(0, 8).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

    </section>
  );
}

export default ProductSection;