import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from '@stripe/react-stripe-js';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

// ✅ Load your Stripe public key
const stripePromise = loadStripe(
  'pk_test_51SJZDIDzH2w5ViTKenAXjzVL2a0JeJ75MV6LT9SMoTngbPR9JHXkZt40k4DTOuorlR5KoZulgcdt8pL40CvajfYz00uVPI97sN'
);

//
// ✅ Checkout Form component
//
const CheckoutForm = ({ order, currentUser }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  // Use your custom hook
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {}, // we’ll add token/orderId when submitting
    onSuccess: () => {
      Router.push('/orders'); // ✅ redirect after success
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    // ✅ Create Stripe token (just like react-stripe-checkout)
    const { token, error } = await stripe.createToken(
      elements.getElement(CardElement)
    );

    if (error) {
      console.error('Stripe error:', error);
      setLoading(false);
      return;
    }

    console.log('✅ Token created:', token.id);

    // ✅ Send token + orderId to backend via your useRequest hook
    await doRequest({
      token: token.id,
      orderId: order.id,
    });

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">
      <CardElement className="p-3 border rounded-md" />

      <button
        type="submit"
        disabled={!stripe || loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        {loading ? 'Processing...' : `Pay $${order.ticket.price}`}
      </button>

      {errors}
    </form>
  );
};

//
// ✅ Main OrderShow component
//
const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => clearInterval(timerId);
  }, [order]);

  if (timeLeft < 0) {
    return <div>❌ Order Expired</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Order Payment</h1>
      <p>
        Time left to pay: <strong>{timeLeft}s</strong>
      </p>

      <Elements stripe={stripePromise}>
        <CheckoutForm order={order} currentUser={currentUser} />
      </Elements>
    </div>
  );
};

//
// ✅ Fetch the order server-side
//
OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default OrderShow;
