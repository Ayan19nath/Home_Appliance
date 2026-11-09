import { useEffect, useState } from "react";
import api from "../api";

// Loads all products from the database
export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/item")
      .then((res) => setProducts(res.data))
      .catch(() => setError("Could not load products. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  return { products, loading, error };
}