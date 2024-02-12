import { Typography, Grid, TextField, Box } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ProductDataInterface } from "../../interfaces/ProductInterface";
import { useImperativeHandle, forwardRef, Ref } from "react";
import { CustomerInterface } from "../../interfaces/CustomerInterface";
import { useCreateProduct } from "../../hooks/useCreateProduct";
import { useUpdateProduct } from "../../hooks/useUpdateProduct";

interface ProductFormProps {
  productDetails: ProductDataInterface;
  customer: CustomerInterface;
  setResponse: React.Dispatch<React.SetStateAction<any>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  productID?: string;
}

const ProductFormValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  sku: Yup.string().required("SKU is required"),
  price: Yup.number().moreThan(-1, "Price must be positive"),
  width: Yup.number().moreThan(-1, "Width must be positive"),
  height: Yup.number().moreThan(-1, "Height must be positive"),
  length: Yup.number().moreThan(-1, "Length must be positive"),
  weight: Yup.number().moreThan(-1, "Weight must be positive"),
  value: Yup.number().moreThan(-1, "Value must be positive"),
  customs_price: Yup.number().moreThan(-1, "Customs Price must be positive"),
});

const ProductForm = forwardRef(
  (
    {
      productDetails,
      customer,
      setResponse,
      productID,
      setLoading,
      setSuccess,
    }: ProductFormProps,
    ref: Ref<any>
  ) => {
    const { create } = useCreateProduct();
    const { update } = useUpdateProduct();
    const formik = useFormik({
      initialValues: productDetails,
      validationSchema: ProductFormValidationSchema,
      onSubmit: async (values) => {
        let relationships = {
          customer: { data: { type: "customers", id: customer.id.toString() } },
        };
        if (productID) {
          setLoading(true);
          setSuccess(false);
          await update(values, productID, relationships).then((response) => {
            setResponse(response);
          });
        } else {
          setLoading(true);
          setSuccess(false);
          await create(values, relationships).then((response) => {
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

    return (
      <>
        <Typography variant="h6" gutterBottom>
          Product Details
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ overflow: "auto", maxHeight: { xs: "40vh", lg: "100%" } }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="name"
                  name="name"
                  label="Name"
                  fullWidth
                  variant="standard"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="sku"
                  name="sku"
                  label="SKU"
                  fullWidth
                  variant="standard"
                  value={formik.values.sku}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.sku && Boolean(formik.errors.sku)}
                  helperText={formik.touched.sku && formik.errors.sku}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="price"
                  name="price"
                  label="Price"
                  type="number"
                  fullWidth
                  variant="standard"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.price && Boolean(formik.errors.price)}
                  helperText={formik.touched.price && formik.errors.price}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="notes"
                  name="notes"
                  label="Notes"
                  fullWidth
                  variant="standard"
                  value={formik.values.notes}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.notes && Boolean(formik.errors.notes)}
                  helperText={formik.touched.notes && formik.errors.notes}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  id="width"
                  name="width"
                  label="Width"
                  type="number"
                  fullWidth
                  variant="standard"
                  value={formik.values.width}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.width && Boolean(formik.errors.width)}
                  helperText={formik.touched.width && formik.errors.width}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  id="height"
                  name="height"
                  label="Height"
                  type="number"
                  fullWidth
                  variant="standard"
                  value={formik.values.height}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.height && Boolean(formik.errors.height)}
                  helperText={formik.touched.height && formik.errors.height}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  id="length"
                  name="length"
                  label="Length"
                  type="number"
                  fullWidth
                  variant="standard"
                  value={formik.values.length}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.length && Boolean(formik.errors.length)}
                  helperText={formik.touched.length && formik.errors.length}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="weight"
                  name="weight"
                  label="Weight"
                  type="number"
                  fullWidth
                  variant="standard"
                  value={formik.values.weight}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.weight && Boolean(formik.errors.weight)}
                  helperText={formik.touched.weight && formik.errors.weight}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="barcode"
                  name="barcode"
                  label="Barcode"
                  fullWidth
                  variant="standard"
                  value={formik.values.barcode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.barcode && Boolean(formik.errors.barcode)
                  }
                  helperText={formik.touched.barcode && formik.errors.barcode}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="value"
                  name="value"
                  label="Value"
                  type="number"
                  fullWidth
                  variant="standard"
                  value={formik.values.value}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.value && Boolean(formik.errors.value)}
                  helperText={formik.touched.value && formik.errors.value}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="customs_price"
                  name="customs_price"
                  label="Customs Price"
                  type="number"
                  fullWidth
                  variant="standard"
                  value={formik.values.customs_price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.customs_price &&
                    Boolean(formik.errors.customs_price)
                  }
                  helperText={
                    formik.touched.customs_price && formik.errors.customs_price
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="customs_description"
                  name="customs_description"
                  label="Customs Description"
                  fullWidth
                  variant="standard"
                  value={formik.values.customs_description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.customs_description &&
                    Boolean(formik.errors.customs_description)
                  }
                  helperText={
                    formik.touched.customs_description &&
                    formik.errors.customs_description
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="hs_code"
                  name="hs_code"
                  label="HS Code"
                  fullWidth
                  variant="standard"
                  value={formik.values.hs_code}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.hs_code && Boolean(formik.errors.hs_code)
                  }
                  helperText={formik.touched.hs_code && formik.errors.hs_code}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="country_of_origin"
                  name="country_of_origin"
                  label="Country of Origin"
                  fullWidth
                  variant="standard"
                  value={formik.values.country_of_origin}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.country_of_origin &&
                    Boolean(formik.errors.country_of_origin)
                  }
                  helperText={
                    formik.touched.country_of_origin &&
                    formik.errors.country_of_origin
                  }
                />
              </Grid>
            </Grid>
          </Box>
        </form>
      </>
    );
  }
);

export default ProductForm;
