import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams, Link } from "react-router-dom"; // Added Link import
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { BACKEND_URL } from "../utils/utils";
function Buy() {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(true); // For initial data fetching
  const [processing, setProcessing] = useState(false); // For payment processing
  const navigate = useNavigate();

  const [course, setCourse] = useState(null); // Initialize as null
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = user?.token;

  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState("");

  useEffect(() => {
    const fetchBuyCourseData = async () => {
      if (!token) {
        setError("Please login to purchase the courses");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.post(
          `${BACKEND_URL}/course/buy/${courseId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        console.log(response.data);
        setCourse(response.data.course);
        setClientSecret(response.data.clientSecret);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error?.response?.status === 400) {
          setError("You have already purchased this course");
        } else {
          setError(error?.response?.data?.errors || "Something went wrong");
        }
      }
    };
    fetchBuyCourseData();
  }, [courseId, token, navigate]);

  const handlePurchase = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.log("Stripe or Element not found")
      return;
    }

    setProcessing(true); // Use processing state instead of loading
    const card = elements.getElement(CardElement);

    if (card == null) {
      console.log("Card Element not found")
      setProcessing(false);
      return;
    }

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      console.log('Stripe PaymentMethod Error: ', error);
      setProcessing(false);
      setCardError(error.message)
    } else {
      console.log('[PaymentMethod Created]', paymentMethod);
    }
    if (!clientSecret) {
      console.log("No client secret found")
      setProcessing(false);
      return
    }

    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: card,
          billing_details: {
            name: user?.user?.firstName,
            email: user?.user?.email,
          },
        },
      },
    );
    if (confirmError) {
      setCardError(confirmError.message)
      setProcessing(false);
    } else if (paymentIntent.status === "succeeded") {
      console.log("Payment succeeded:", paymentIntent);
      setCardError("Your payment id: " + paymentIntent.id);
      const paymentInfo = {
        email: user?.user?.email, // Fixed: changed from user2 to user
        userId: user._id,
        courseId: courseId,
        paymentId: paymentIntent.id,
        amount: paymentIntent.amount,
        status: paymentIntent.status,
      };
      console.log("Payment info: ", paymentInfo);
      await axios.post(`${BACKEND_URL}/order`, paymentInfo, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
      .then(response => {
        console.log(response.data);
      }).catch((error)=> {
        console.error(error);
        toast.error("Error in making payment");
      })
      toast.success("Payment Successful");

      // Small delay to show success message before redirect
      setTimeout(() => {
        navigate("/purchases");
      }, 1500);
    }
    setProcessing(false);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Show error message if there's an error
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-red-500 text-center">
          <p>{error}</p>
          <Link
            to="/login"
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-800 duration-300 inline-block"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // Show nothing if course is not loaded yet
  if (!course) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p>Course not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row my-40 container mx-auto">
      <div className="w-full md:w-1/2">
        <h1 className="text-xl font-semibold underline">Order Details</h1>
        <div className="flex items-center text-center space-x-2 mt-4">
          <h2 className="text-gray-600 text-sm">Total Price</h2>
          <p className="text-red-500 font-bold">${course.price}</p>
        </div>
        <div className="flex items-center text-center space-x-2">
          <h1 className="text-gray-600 text-sm">Course name</h1>
          <p className="text-red-500 font-bold">{course.title}</p>
        </div>
      </div>
      <div className="w-full md:w-1/2 flex justify-center items-center">
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
          <h2 className="text-lg font-semibold mb-4">
            Process your Payment!
          </h2>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm mb-2"
              htmlFor="card-number"
            >
              Credit/Debit Card
            </label>
            <form onSubmit={handlePurchase}>
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                    },
                    invalid: {
                      color: "#9e2146",
                    },
                  },
                }}
              />

              <button
                type="submit"
                disabled={!stripe || processing}
                className="mt-8 w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition duration-200 disabled:opacity-50"
              >
                {processing ? "Processing..." : "Pay"}
              </button>
            </form>
            {cardError && (
              <p className="text-red-500 font-semibold text-xs mt-2">
                {cardError}
              </p>
            )}
          </div>

          <button className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center justify-center">
            <span className="mr-2">🅿️</span> Other Payments Method
          </button>
        </div>
      </div>
    </div>
  );
}

export default Buy;