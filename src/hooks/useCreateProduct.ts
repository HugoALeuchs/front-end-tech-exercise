import { useState } from "react";
import { ProductDataInterface } from "../interfaces/ProductInterface";
import { createProduct } from "../service/Client";

export const useCreateProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | Error>(null);

  const create = async (
    productData: ProductDataInterface,
    relationships: { customer: { data: { type: string; id: string } } }
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createProduct(productData, relationships);
      setLoading(false);
      return response;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  };

  return { create, loading, error };
};
