import HeroSection from "../Components/HeroSection";
import ServiceBar from "../Components/ServiceBar";
import ProductSection from "../Components/ProductSection";

function Home() {
  return (
    <main>

      {/* Hero Section */}
      <HeroSection />

      {/* Service Bar */}
      <ServiceBar />

      {/* Best Selling Products */}
      <ProductSection />

    </main>
  );
}

export default Home;