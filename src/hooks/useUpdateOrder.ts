import { useState } from "react";
import { OrderInterface } from "../interfaces/OrderInterface";
import { updateOrder } from "../service/Client";

export const useUpdateOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | Error>(null);

  const update = async (orderData: OrderInterface, id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateOrder(orderData, id);
      setLoading(false);
      return response;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  };

  return { update, loading, error };
};
