export interface ProductInterface {
  id: string;
  type: "products";
  attributes: ProductDataInterface;
  relationships: relationships;
}

export interface ProductDataInterface {
  name: string;
  sku: string;
  quantity?: number;
  price: number;
  notes: string;
  width: number;
  height: number;
  length: number;
  weight: number;
  barcode: string;
  value: number;
  customs_price: number;
  customs_description: string;
  hs_code: string;
  country_of_origin: string;
  relationships?: {
    customer: {
      data: {
        type: string;
        id: string;
      };
    };
  };
}

interface relationships {
  customer: {
    data: {
      type: string;
      id: string;
    };
  };
}

export interface ProductOptions {
  id: string;
  type?: "order-items";
  name: string;
  sku: string;
  quantity: number;
}
