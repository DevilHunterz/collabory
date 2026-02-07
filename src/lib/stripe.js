import { loadStripe } from '@stripe/stripe-js'

export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

export const createCheckoutSession = async (priceId, userId) => {
  // This would call your Supabase Edge Function
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ priceId, userId })
  })
  
  const { sessionId } = await response.json()
  const stripe = await stripePromise
  await stripe.redirectToCheckout({ sessionId })
}
