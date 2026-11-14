// Loads Razorpay's payment window script (only once)
const loadScript = () =>
  new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = resolve;
    script.onerror = () => reject(new Error("Could not load the payment window. Please check your internet connection."));
    document.body.appendChild(script);
  });

// Opens the payment window. Resolves with the payment details after a successful payment,
// and rejects with the message "closed" when the customer closes the window.
export const payWithRazorpay = async ({ payment, orderId, user, phone }) => {
  await loadScript();
  return new Promise((resolve, reject) => {
    new window.Razorpay({
      key: payment.keyId,
      order_id: payment.orderId,
      amount: payment.amount,
      currency: payment.currency,
      name: "HomeHub",
      description: `Order #${orderId}`,
      prefill: { name: user?.name, email: user?.email, contact: phone },
      theme: { color: "#087ee8" },
      handler: resolve,
      modal: { ondismiss: () => reject(new Error("closed")) },
    }).open();
  });
};