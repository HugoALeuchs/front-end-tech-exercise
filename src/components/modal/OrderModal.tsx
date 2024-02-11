import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import OrderForm from "../forms/OrdersForm";
import { OrderInterface } from "../../interfaces/OrderInterface";
import { useEffect, useRef, useState } from "react";
import { FormikProps } from "formik";
import CustomerForm from "../forms/CustomerForm";
import { CustomerInterface } from "../../interfaces/CustomerInterface";
import ProductListForm from "../forms/ProductListForm";
import { ProductOptions } from "../../interfaces/ProductInterface";
import Lottie from "react-lottie";
import * as animationNewOrder from "../../../public/images/new-order-animation.json";
import * as animationWrong from "../../../public/images/wrong-animation.json";

const steps = ["Custoner", "General Information", "Order Details"];

function getStepContent(
  step: number,
  order: OrderInterface,
  setOrder: React.Dispatch<React.SetStateAction<OrderInterface>>,
  formRef: React.RefObject<FormikProps<any>>,
  setResponse: React.Dispatch<React.SetStateAction<any>>,
  customer: CustomerInterface,
  setCustomer: React.Dispatch<React.SetStateAction<CustomerInterface>>,
  product: ProductOptions[],
  setProduct: React.Dispatch<React.SetStateAction<ProductOptions[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>,
  orderID?: string,
  linkProducts?: string
) {
  switch (step) {
    case 0:
      return <CustomerForm customer={customer} setCustomer={setCustomer} />;
    case 1:
      return (
        <ProductListForm
          products={product}
          setProducts={setProduct}
          linkProducts={linkProducts}
        />
      );
    case 2:
      return (
        <OrderForm
          order={order}
          setOrder={setOrder}
          ref={formRef}
          setResponse={setResponse}
          orderID={orderID}
          customer={customer}
          products={product}
          setLoading={setLoading}
          setSuccess={setSuccess}
        />
      );
    default:
      throw new Error("Unknown step");
  }
}

export default function OrderModal({
  data,
  setOrderData,
  refreshData,
}: {
  data?: OrderInterface;
  setOrderData?: any;
  refreshData: () => void;
}) {
  const initialOrder: OrderInterface = data?.attributes?.number
    ? data
    : {
        attributes: {
          number: "",
        },
        relationships: {
          customer: {
            data: {
              type: "",
              id: "",
            },
          },
          order_items: {
            data: [],
          },
        },
      };
  const initialCustomer: CustomerInterface = {
    id: data?.relationships?.customer?.data?.id
      ? parseInt(data.relationships.customer.data.id)
      : 0,
    name: "",
  };
  const initialProduct: ProductOptions[] = [
    { id: "0", sku: "", name: "", quantity: 0 },
  ];

  const newOrderOptions = {
    loop: true,
    autoplay: true,
    animationData: animationNewOrder,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const wrongOptions = {
    loop: true,
    autoplay: true,
    animationData: animationWrong,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [product, setProduct] = useState<ProductOptions[]>(initialProduct);
  const [customer, setCustomer] = useState<CustomerInterface>(initialCustomer);
  const [order, setOrder] = useState<OrderInterface>(initialOrder);
  const [activeStep, setActiveStep] = useState(0);
  const [response, setResponse] = useState<any>(null);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handlePlaceOrder();
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const formRef = useRef<FormikProps<any>>(null);

  const handlePlaceOrder = () => {
    if (formRef.current) {
      formRef.current.submitForm();
    }
  };

  useEffect(() => {
    if (response && response.data && response.data.id) {
      setLoading(false);
      setSuccess(true);
      setActiveStep(activeStep + 1);
      refreshData();
    } else {
      setLoading(false);
      setSuccess(false);
    }
  }, [response]);

  useEffect(() => {
    return () => {
      setProduct({} as ProductOptions[]);
      setCustomer({} as CustomerInterface);
      setOrder({} as OrderInterface);
      setResponse(null);
      setActiveStep(0);
    };
  }, []);

  return (
    <>
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Typography component="h1" variant="h4" align="center">
            {data?.id ? "Edit Order" : "Create Order"}
          </Typography>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <>
              {!loading && success && (
                <Typography variant="h5" gutterBottom>
                  {data?.id ? "Order updated!" : "Order created!"}
                </Typography>
              )}
              <Typography variant="subtitle1">
                {!loading && success ? (
                  <>
                    Your order number is {response.data.id}.{" "}
                    <Lottie
                      options={newOrderOptions}
                      height={400}
                      width={400}
                    />
                  </>
                ) : (
                  <>
                    Something went wrong!
                    <Lottie options={wrongOptions} height={400} width={400} />
                  </>
                )}
              </Typography>
            </>
          ) : (
            <>
              {getStepContent(
                activeStep,
                order,
                setOrder,
                formRef,
                setResponse,
                customer,
                setCustomer,
                product,
                setProduct,
                setLoading,
                setSuccess,
                data?.id,
                data?.relationships?.order_items?.links?.related
              )}
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                {activeStep !== 0 && (
                  <Button
                    onClick={handleBack}
                    sx={{ mt: 3, ml: 1 }}
                    disabled={loading}
                  >
                    Back
                  </Button>
                )}
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 3, ml: 1 }}
                  disabled={
                    (activeStep === 0 && customer.id === 0) ||
                    (activeStep === 1 && product.length <= 0) ||
                    loading
                  }
                >
                  {activeStep === steps.length - 1 ? "Place order" : "Next"}
                </Button>
                {loading && (
                  <CircularProgress
                    size={24}
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      marginTop: "-12px",
                      marginLeft: "-12px",
                    }}
                  />
                )}
              </Box>
            </>
          )}
        </Paper>
      </Container>
    </>
  );
}
