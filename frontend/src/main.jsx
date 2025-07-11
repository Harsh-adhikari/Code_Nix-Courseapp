import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
const stripePromise = loadStripe("pk_test_51RUTiXHCKneC8So3VU46TR9D3qVBDFchA2wDz62DQwjnzlhFoFDUqIieNZndcoJDEGtswApzCjkO0LOPCUu7gIzd007WkR4ONZ");

createRoot(document.getElementById('root')).render(
  <Elements stripe={stripePromise}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Elements>
)
