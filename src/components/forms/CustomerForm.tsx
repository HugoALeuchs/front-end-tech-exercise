import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { CustomerInterface } from "../../interfaces/CustomerInterface";
import { useEffect } from "react";

interface CustomerFormProps {
  setCustomer: React.Dispatch<React.SetStateAction<CustomerInterface>>;
  customer: CustomerInterface;
}

const customerList = [
  { id: 16, name: "FE2" },
  { id: 18, name: "FE3" },
  { id: 20, name: "FE4" },
];

export default function CustomerForm({
  setCustomer,
  customer,
}: CustomerFormProps) {
  const handleChange = (event: SelectChangeEvent) => {
    const customerName = event.target.value;
    const selectedCustomer = customerList.find(
      (customer) => customer.name === customerName
    );
    if (selectedCustomer) {
      setCustomer(selectedCustomer);
    }
  };

  useEffect(() => {
    if (customer.id) {
      setCustomer(
        customerList.find((c) => c.id === customer.id) as CustomerInterface
      );
    }
  }, [customer]);

  return (
    <Box sx={{ minWidth: 302 }}>
      <FormControl fullWidth>
        <InputLabel>Customer</InputLabel>
        <Select value={customer.name} label="Customer" onChange={handleChange}>
          {customerList.map((customer) => (
            <MenuItem key={customer.id} value={customer.name}>
              {customer.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
