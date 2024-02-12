import { useState } from "react";
import { deleteProduct } from "../service/Client";

export const useDeleteProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | Error>(null);

  const deleteProductItem = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteProduct(id);
      setLoading(false);
      return response;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  };

  return { deleteProductItem, loading, error };
};
