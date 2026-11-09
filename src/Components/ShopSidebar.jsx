function ShopSidebar({
  categories,
  brands,
  priceRanges,
  selectedCategory,
  setSelectedCategory,
  selectedBrands,
  setSelectedBrands,
  selectedPrice,
  setSelectedPrice,
}) {

  // Add or remove a brand filter
  const toggleBrand = (brand) =>
    setSelectedBrands(
      selectedBrands.includes(brand)
        ? selectedBrands.filter((item) => item !== brand)
        : [...selectedBrands, brand]
    );

  return (
    <aside className="shop-sidebar">

      {/* CATEGORIES */}
      <div className="sidebar-section">
        <h2>Categories</h2>

        <div className="category-list">
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              className={selectedCategory === category ? "category-filter active" : "category-filter"}
              onClick={() => setSelectedCategory(selectedCategory === category ? "" : category)}
            >
              <span>›</span>
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* FILTERS */}
      <div className="sidebar-section filters">
        <h2>Filters</h2>

        {/* Price range */}
        <h3>Price Range</h3>
        <div className="checkbox-list">
          {priceRanges.map((price) => (
            <label key={price}>
              <input
                type="checkbox"
                checked={selectedPrice === price}
                onChange={() => setSelectedPrice(selectedPrice === price ? "" : price)}
              />
              <span>{price}</span>
            </label>
          ))}
        </div>

        {/* Brand */}
        <h3>Brand</h3>
        <div className="checkbox-list">
          {brands.map((brand) => (
            <label key={brand}>
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
              />
              <span>{brand}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default ShopSidebar;