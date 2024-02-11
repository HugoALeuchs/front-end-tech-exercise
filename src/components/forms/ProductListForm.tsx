import { ChangeEvent, useEffect, useState } from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import { getOrderProducts, getProducts } from "../../service/Client";
import { Box, TextField } from "@mui/material";
import {
  ProductInterface,
  ProductOptions,
} from "../../interfaces/ProductInterface";

interface ProductListFormProps {
  products: ProductOptions[];
  setProducts: React.Dispatch<React.SetStateAction<ProductOptions[]>>;
  linkProducts?: string;
}

const ProductListForm = ({
  products,
  setProducts,
  linkProducts,
}: ProductListFormProps) => {
  const [productOptions, setProductOptions] = useState<ProductOptions[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  useEffect(() => {
    if (linkProducts) {
      getOrderProducts(linkProducts).then((response) => {
        const products = response.data.map((product: ProductInterface) => ({
          id: product.id,
          name: product.attributes.name,
          sku: product.attributes.sku,
          quantity: product.attributes.quantity,
        }));
        setProductOptions(products);
      });
    } else {
      getProducts().then((response) => {
        const products = response.data.map((product: ProductInterface) => ({
          id: product.id,
          name: product.attributes.name,
          sku: product.attributes.sku,
          quantity: 0,
        }));
        setProductOptions(products);
      });
    }
  }, []);

  const handleChange = (event: SelectChangeEvent<typeof selectedProducts>) => {
    const {
      target: { value },
    } = event;
    setSelectedProducts(Array.isArray(value) ? value : [value]);
  };

  const handleQuantityChange = (
    event: ChangeEvent<HTMLInputElement>,
    productName: string
  ) => {
    const { value } = event.target;
    setProducts((prevOptions) => {
      const updatedOptions = prevOptions.map((option) => {
        if (option.name === productName) {
          return {
            ...option,
            quantity: parseInt(value, 10),
          };
        }
        return option;
      });
      return updatedOptions;
    });
  };

  const selectedProductOptions = productOptions.filter((option) =>
    selectedProducts.includes(option.name)
  );

  useEffect(() => {
    setProducts(selectedProductOptions);
  }, [selectedProducts]);

  return (
    <Box sx={{ minWidth: 302 }}>
      <FormControl fullWidth>
        <InputLabel>Products</InputLabel>
        <Select
          multiple
          value={selectedProducts}
          onChange={handleChange}
          input={<OutlinedInput label="Products" />}
          renderValue={(selected) => selected.join(", ")}
        >
          {productOptions.map(({ id, name }) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={selectedProducts.includes(name)} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ maxHeight: "100px", mt: 2, overflowY: "scroll" }}>
        {products.map((productOption) => (
          <TextField
            sx={{ my: 1, pr: 1 }}
            fullWidth
            key={productOption.name}
            label={"Quantity " + productOption.name}
            type="number"
            value={productOption.quantity}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              handleQuantityChange(event, productOption.name)
            }
          />
        ))}
      </Box>
    </Box>
  );
};

export default ProductListForm;
