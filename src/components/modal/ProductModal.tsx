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
import ProductForm from "../forms/ProductForm";
import { use, useEffect, useRef, useState } from "react";
import CustomerForm from "../forms/CustomerForm";
import {
  ProductInterface,
  ProductDataInterface,
} from "../../interfaces/ProductInterface";
import { CustomerInterface } from "../../interfaces/CustomerInterface";
import { FormikProps } from "formik";
import Lottie from "react-lottie";
import * as animationNewProduct from "../../../public/images/new-product-animation.json";
import * as animationWrong from "../../../public/images/wrong-animation.json";

const steps = ["Customer", "Product Details"];

function getStepContent(
  step: number,
  customer: CustomerInterface,
  setCustomer: React.Dispatch<React.SetStateAction<CustomerInterface>>,
  productDetails: ProductDataInterface,
  formRef: React.RefObject<FormikProps<any>>,
  setResponse: React.Dispatch<React.SetStateAction<any>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>,
  productID?: string
) {
  switch (step) {
    case 0:
      return <CustomerForm customer={customer} setCustomer={setCustomer} />;
    case 1:
      return (
        <ProductForm
          productDetails={productDetails}
          customer={customer}
          ref={formRef}
          setResponse={setResponse}
          productID={productID}
          setLoading={setLoading}
          setSuccess={setSuccess}
        />
      );
    default:
      throw new Error("Unknown step");
  }
}

export default function ProducModal({
  data,
  setProductData,
  refreshData,
}: {
  data?: ProductInterface;
  setProductData?: any;
  refreshData: () => void;
}) {
  const newProductOptions = {
    loop: true,
    autoplay: true,
    animationData: animationNewProduct,
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

  const initialCustomer: CustomerInterface = {
    id: data?.relationships?.customer?.data?.id
      ? parseInt(data.relationships.customer.data.id)
      : 0,
    name: "",
  };

  const initialProductDetails: ProductDataInterface = {
    sku: data?.attributes?.sku || "",
    name: data?.attributes?.name || "",
    price: data?.attributes?.price || 0,
    notes: data?.attributes?.notes || "",
    width: data?.attributes?.width || 0,
    height: data?.attributes?.height || 0,
    length: data?.attributes?.length || 0,
    weight: data?.attributes?.weight || 0,
    barcode: data?.attributes?.barcode || "",
    value: data?.attributes?.value || 0,
    customs_price: data?.attributes?.customs_price || 0,
    customs_description: data?.attributes?.customs_description || "",
    hs_code: data?.attributes?.hs_code || "",
    country_of_origin: data?.attributes?.country_of_origin || "",
  };

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [customer, setCustomer] = useState<CustomerInterface>(initialCustomer);
  const [productDetails, setProductDetails] = useState<ProductDataInterface>(
    initialProductDetails
  );
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
      setProductData({} as ProductInterface);
      setCustomer({ id: 0, name: "" });
      setProductDetails({
        sku: "",
        name: "",
        price: 0,
        notes: "",
        width: 0,
        height: 0,
        length: 0,
        weight: 0,
        barcode: "",
        value: 0,
        customs_price: 0,
        customs_description: "",
        hs_code: "",
        country_of_origin: "",
      });
      setActiveStep(0);
      setResponse(null);
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
            {data?.id ? "Edit Product" : "Create Product"}
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
                  {data?.id ? "Product updated!" : "Product created!"}
                </Typography>
              )}
              <Typography variant="subtitle1">
                {!loading && success ? (
                  <>
                    Your product number is {response.data.id}.{" "}
                    <Lottie
                      options={newProductOptions}
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
                customer,
                setCustomer,
                productDetails,
                formRef,
                setResponse,
                setLoading,
                setSuccess,
                data?.id
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
                  disabled={customer.id === 0 || loading}
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
