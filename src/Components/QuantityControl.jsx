import { useState } from "react";

function QuantityControl() {

  const [quantity, setQuantity] = useState(1);

  const decrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increase = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className="quantity-control">

      <button onClick={decrease}>
        −
      </button>

      <span>
        {quantity}
      </span>

      <button onClick={increase}>
        +
      </button>

    </div>
  );
}

export default QuantityControl;