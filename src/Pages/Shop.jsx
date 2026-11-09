import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api";
import useProducts from "../data/useProducts";
import ShopSidebar from "../Components/ShopSidebar";
import ShopProductCard from "../Components/ShopProductCard";

// Price filters: label shown in the sidebar -> test for a product price
const priceFilters = {
  "Under ₹10,000": (price) => price < 10000,
  "₹10,000 – ₹20,000": (price) => price >= 10000 && price <= 20000,
  "₹20,000 – ₹30,000": (price) => price > 20000 && price <= 30000,
  "₹30,000 – ₹50,000": (price) => price > 30000 && price <= 50000,
  "Above ₹50,000": (price) => price > 50000,
};

const lower = (value) => String(value || "").trim().toLowerCase();

function Shop() {
  const [searchParams] = useSearchParams();
  const { products, loading, error } = useProducts();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState("");
  const [sort, setSort] = useState("Popularity");

  const search = (searchParams.get("search") || "").trim();
  const categoryFromURL = searchParams.get("category") || "";

  // Load the category names for the sidebar
  useEffect(() => {
    api.get("/category")
      .then((res) => setCategories(res.data.map((c) => c.cat_name)))
      .catch(() => setCategories([]));
  }, []);

  // Select the category given in the page address (/shop?category=...)
  useEffect(() => {
    setSelectedCategory(categoryFromURL);
  }, [categoryFromURL]);

  // Brands that exist in the loaded products
  const brands = useMemo(
    () => [...new Set(products.map((p) => p.brand).filter(Boolean))].sort(),
    [products]
  );

  // Search, filter and sort
  const filteredProducts = useMemo(() => {
    const query = lower(search);

    const result = products.filter((p) => {
      const text = lower([p.name, p.category, p.brand, p.description, ...(p.features || [])].join(" "));
      return (
        (!query || text.includes(query)) &&
        (!selectedCategory || lower(p.category) === lower(selectedCategory)) &&
        (selectedBrands.length === 0 || selectedBrands.some((b) => lower(b) === lower(p.brand))) &&
        (!selectedPrice || priceFilters[selectedPrice](Number(p.price) || 0))
      );
    });

    if (sort === "Price: Low to High") result.sort((a, b) => a.price - b.price);
    if (sort === "Price: High to Low") result.sort((a, b) => b.price - a.price);
    if (sort === "Rating") result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [products, search, selectedCategory, selectedBrands, selectedPrice, sort]);

  const pageTitle = search ? `Search results for "${search}"` : selectedCategory || "All Products";

  return (
    <main className="shop-page">

      {/* SIDEBAR */}
      <ShopSidebar
        categories={categories}
        brands={brands}
        priceRanges={Object.keys(priceFilters)}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedBrands={selectedBrands}
        setSelectedBrands={setSelectedBrands}
        selectedPrice={selectedPrice}
        setSelectedPrice={setSelectedPrice}
      />

      {/* PRODUCTS */}
      <section className="shop-content">
        <div className="shop-top">
          <h1>{pageTitle}</h1>

          <div className="sort-box">
            <label>Sort by:</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="Popularity">Popularity</option>
              <option value="Price: Low to High">Price: Low to High</option>
              <option value="Price: High to Low">Price: High to Low</option>
              <option value="Rating">Rating</option>
            </select>
          </div>
        </div>

        {loading && <div className="no-products"><h2>Loading products...</h2></div>}
        {error && <div className="no-products"><h2>{error}</h2></div>}

        {!loading && !error && (
          filteredProducts.length > 0 ? (
            <div className="shop-product-grid">
              {filteredProducts.map((product) => (
                <ShopProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="no-products">
              <h2>No Products Found</h2>
              <p>{search ? `No products matched "${search}". Try another search.` : "Try changing your filters."}</p>
            </div>
          )
        )}
      </section>
    </main>
  );
}

export default Shop;