import { useFormik } from "formik";
import { Grid, SelectChangeEvent, TextField } from "@mui/material";
import { OrderInterface } from "../../interfaces/OrderInterface";
import {
  Ref,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import * as Yup from "yup";
import { CustomerInterface } from "../../interfaces/CustomerInterface";
import { createOrder, updateOrder } from "../../service/Client";
import { ProductOptions } from "../../interfaces/ProductInterface";

interface OrderFormProps {
  order: OrderInterface;
  setOrder: React.Dispatch<React.SetStateAction<OrderInterface>>;
  setResponse: React.Dispatch<React.SetStateAction<any>>;
  customer: CustomerInterface;
  products: ProductOptions[];
  ref: React.RefObject<any>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  orderID?: string;
}

const OrderFormValidationSchema = Yup.object().shape({
  number: Yup.string().required("Number is required"),
});

const OrderForm = forwardRef(
  (
    {
      order,
      setOrder,
      setResponse,
      orderID,
      customer,
      products,
      setLoading,
      setSuccess,
    }: OrderFormProps,
    ref: Ref<any>
  ) => {
    const formik = useFormik({
      initialValues: order.attributes,
      validationSchema: OrderFormValidationSchema,
      onSubmit: async (values) => {
        let newOrder: OrderInterface = {
          attributes: {
            ...values,
            shipping_method_code: 123,
            shipping_method_name: "teste",
          },
          relationships: {
            ...order.relationships,
            customer: {
              data: {
                type: "customers",
                id: customer.id.toString(),
              },
            },
            order_items: {
              data: products.map((product) => ({
                type: "order-items",
                id: product.id,
                sku: product.sku,
                quantity: product.quantity,
              })),
            },
          },
        };
        if (order.id) {
          await updateOrder(newOrder, order.id).then((response) => {
            setResponse(response);
          });
        } else {
          await createOrder(newOrder).then((response) => {
            setResponse(response);
          });
        }
      },
    });

    useImperativeHandle(ref, () => ({
      submitForm: () => {
        formik.handleSubmit();
      },
    }));

    useEffect(() => {
      console.log(order);
    }, []);

    return (
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              id="number"
              name="number"
              label="Number"
              fullWidth
              variant="outlined"
              value={formik.values.number}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.number && Boolean(formik.errors.number)}
              helperText={formik.touched.number && formik.errors.number}
            />
          </Grid>
        </Grid>
      </form>
    );
  }
);

export default OrderForm;
