import { useState } from "react";
import { OrderInterface } from "../interfaces/OrderInterface";
import { createOrder } from "../service/Client";

export const usePlaceOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | Error>(null);

  const placeOrder = async (order: OrderInterface) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createOrder(order);
      setLoading(false);
      return response;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  };

  return { placeOrder, loading, error };
};
