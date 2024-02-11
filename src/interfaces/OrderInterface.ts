export interface OrderInterface {
  type?: "orders";
  id?: string;
  attributes: {
    number: string;
    status_text?: string;
    shipping?: number;
    shipping_method_code?: number;
    shipping_method_name?: string;
    tax?: number;
    discount?: number;
    ready_to_ship?: null | string;
    ordered_at?: string;
    external_id?: number;
    packing_note?: null | string;
    tote?: string;
    created_at?: string;
    updated_at?: string;
  };
  relationships: {
    customer: {
      data: {
        type: string;
        id: string;
      };
    };
    shipping_contact_information?: {
      data: {
        type: string;
        id: string;
      };
    };
    billing_contact_information?: {
      data: {
        type: string;
        id: string;
      };
    };
    order_channel?: {
      data: {
        type: string;
        id: string;
      };
    };
    order_items: {
      data: {
        type: string;
        id: string;
        sku: string;
        quantity: number;
      }[];
      links?: {
        related: string;
      };
    };
    shipments?: {
      data: any[];
    };
  };
}
