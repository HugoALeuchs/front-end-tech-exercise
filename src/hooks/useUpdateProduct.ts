import { useState } from "react";
import { ProductDataInterface } from "../interfaces/ProductInterface";
import { updateProduct } from "../service/Client";

export const useUpdateProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | Error>(null);

  const update = async (
    productData: ProductDataInterface,
    id: string,
    relationships: { customer: { data: { type: string; id: string } } }
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateProduct(productData, id, relationships);
      setLoading(false);
      return response;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  };

  return { update, loading, error };
};
