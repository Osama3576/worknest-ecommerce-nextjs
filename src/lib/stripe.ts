import Stripe from "stripe";
import { env } from "@/lib/env";

let stripeInstance: Stripe | null = null;

export function getStripe() {
  if (!env.stripeEnabled) {
    return null;
  }

  if (!stripeInstance) {
    stripeInstance = new Stripe(env.stripeSecretKey);
  }

  return stripeInstance;
}
