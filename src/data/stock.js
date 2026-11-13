// Stock message and colour: out of stock, low stock (5 or less) or in stock
export const stockInfo = (stock) => {
  const left = Number(stock) || 0;
  if (left <= 0) return ["Out of Stock", "#d23939"];
  if (left <= 5) return [`Only ${left} left`, "#e67e00"];
  return ["In Stock", "#159267"];
};