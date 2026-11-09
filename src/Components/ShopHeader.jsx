import {
  Search,
  MoreVertical,
  UserCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function ShopHeader() {
  const navigate = useNavigate();

  return (
    <header className="shop-header">
      <div className="shop-header-container">

        <a href="/" className="shop-logo">
          <div className="shop-logo-icon">⌂</div>

          <h2>
            Home<span>Hub</span>
          </h2>
        </a>

        <div className="shop-search">
          <input
            type="text"
            placeholder="Search for products..."
          />

          <Search size={21} />
        </div>

        <div className="shop-header-actions">

          <button
            type="button"
            title="Menu"
          >
            <MoreVertical size={27} />
          </button>

          <button
            type="button"
            className="shop-profile-btn"
            title="Profile"
            onClick={() => navigate("/profile")}
          >
            <UserCircle size={38} />
          </button>

        </div>

      </div>
    </header>
  );
}

export default ShopHeader;