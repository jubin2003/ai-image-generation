"use client";
import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "@clerk/nextjs";

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
  const { user } = useUser(); // Get the authenticated user
  const userEmail = user?.primaryEmailAddress?.emailAddress || "anonymous@domain.com"; // Safely access user email
  const plans = [
    { id: 1, name: "Valuable Plan", credits: 10, price: 100 },
    { id: 2, name: "Premium Plan", credits: 50, price: 400 },
    { id: 3, name: "Enterprise Plan", credits: 100, price: 700 },
  ];

  const handlePayment = async (plan) => {
    setLoadingPlan(plan.id);

    const razorpayScriptLoaded = await loadRazorpayScript();
    if (!razorpayScriptLoaded) {
      toast.error("Payment Verification Failed.", { position: "top-left" });
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
        name: "Rest Nest",
        description: plan.name,
        handler: async (response) => {
          const paymentData = {
            ...response,
            user_email: userEmail,
            credits_purchased: plan.credits,
          };

          const verification = await axios.post("/api/verify", paymentData);
          if (verification.data.success) {
            toast.success("Payment Successfull", { position: "top-right" });
            setTimeout(() => {
              window.location.reload();
              window.location.href = "/dashboard";
            }, 3000);
          } else {
            toast.error(
              "Payment verification failed. Please contact support.",
              { position: "top-left" }
            );
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
    <div className="p-4 sm:p-8 lg:p-16 bg-gray-50 min-h-screen flex flex-col justify-between">
      <ToastContainer />

      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Pricing Plans
      </h1>

      <ul className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <li
            key={plan.id}
            className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105 flex flex-col justify-between"
          >
            <div className="p-1 bg-green-200"></div>
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {plan.name}
              </h2>
              <p className="text-4xl font-bold text-gray-800 mb-6">
                ₹{plan.price}
              </p>
              <ul className="text-sm text-gray-600 mb-6">
                <li className="mb-2 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    fill="none"
                    className="w-4 h-4 mr-2 text-green-500"
                  >
                    <path
                      d="M5 13l4 4L19 7"
                      strokeWidth="2"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    ></path>
                  </svg>
                  {plan.credits} Credits
                </li>
              </ul>
            </div>
            <div className="p-4">
              <button
                onClick={() => handlePayment(plan)}
                disabled={loadingPlan === plan.id}
                className={`w-full bg-green-500 text-white rounded-full px-4 py-2 hover:bg-green-700 focus:outline-none focus:shadow-outline-green active:bg-green-800 ${
                  loadingPlan === plan.id && "opacity-50 cursor-not-allowed"
                }`}
              >
                {loadingPlan === plan.id ? "Processing..." : "Buy Now"}
              </button>
            </div>
          </li>
        ))}
      </ul>

      <footer className="text-center mt-16 py-4 bg-gray-100">
        <p className="text-sm text-gray-600">
          © {new Date().getFullYear()} Rest Nest. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default PricingPage;
