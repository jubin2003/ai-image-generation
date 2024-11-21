"use client";
import { useState } from "react";
import axios from "axios";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PricingPage = () => {
  const [loadingPlan, setLoadingPlan] = useState(null); // Track the plan being processed
  const user = { email: "jubin.21ubc248@mariancollege.org" }; // Replace with actual user email from your app context or state

  const plans = [
    { id: 1, name: "Basic Plan", credits: 10, price: 100 },
    { id: 2, name: "Premium Plan", credits: 50, price: 400 },
    { id: 3, name: "Enterprise Plan", credits: 100, price: 700 },
  ];

  const handlePurchase = async (plan) => {
    setLoadingPlan(plan.id); // Set the current plan as loading
    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        alert("Failed to load Razorpay SDK. Check your connection.");
        setLoadingPlan(null);
        return;
      }

      // Create order on the server
      const { data: order } = await axios.post("/api/order", {
        amount: plan.price * 100, // Amount in smallest currency unit
        currency: "INR",
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Rest Nest",
        description: plan.name,
        order_id: order.id,
        handler: async (response) => {
          try {
            const verification = await axios.post("/api/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verification.data.success) {
              alert("Payment Successful!");
            } else {
              alert("Payment Verification Failed.");
            }
          } catch (error) {
            console.error("Error during payment verification:", error);
            alert("Verification failed. Please contact support.");
          }
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error during purchase:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoadingPlan(null); // Reset the loading state
    }
  };

  const handlePayment = async (plan) => {
    setLoadingPlan(plan.id);

    const razorpayScriptLoaded = await loadRazorpayScript();
    if (!razorpayScriptLoaded) {
      alert("Failed to load Razorpay SDK. Please try again.");
      return;
    }

    try {
      const { data: order } = await axios.post("/api/order", {
        amount: plan.price * 100,
        currency: "INR",
      });

      const razorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        handler: async (response) => {
          const paymentData = {
            ...response,
            user_email: user.email,
            credits_purchased: plan.credits,
          };

          const verification = await axios.post("/api/verify", paymentData);
          if (verification.data.success) {
            alert(
              "Payment successful! Credits have been added to your account."
            );
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
      };

      const razorpayInstance = new window.Razorpay(razorpayOptions);
      razorpayInstance.open();
    } catch (error) {
      console.error("Error during payment:", error);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div>
      <h1>Pricing Plans</h1>
      <ul>
        {plans.map((plan) => (
          <li key={plan.id}>
            <h2>{plan.name}</h2>
            <p>
              {plan.credits} credits for ₹{plan.price}
            </p>
            <button
              onClick={() => handlePayment(plan)}
              disabled={loadingPlan === plan.id}
            >
              {loadingPlan === plan.id ? "Processing..." : "Buy Now"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PricingPage;
