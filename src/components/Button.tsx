import React from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

interface CheckoutButtonProps {
  items: { price: string; quantity: number }[];
  customerEmail: string;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ items, customerEmail }) => {
  const handleCheckout = async () => {
    const stripe = await stripePromise;

    const res = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, customerEmail }),
    });

    const { sessionId } = await res.json();

    await stripe?.redirectToCheckout({ sessionId });
  };

  return <button onClick={handleCheckout}>Checkout</button>;
};

export default CheckoutButton;
