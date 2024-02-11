import { useRouter } from "next/navigation";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BarChartIcon from "@mui/icons-material/BarChart";

export const ListItems = () => {
  const history = useRouter();

  const navigateToDashboard = () => {
    history.push("/");
  };

  const navigateToOrders = () => {
    history.push("/orders");
  };

  const navigateToProducts = () => {
    history.push("/products");
  };

  return (
    <>
      <ListItemButton onClick={navigateToDashboard}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
      <ListItemButton onClick={navigateToOrders}>
        <ListItemIcon>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="Orders" />
      </ListItemButton>
      <ListItemButton onClick={navigateToProducts}>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Products" />
      </ListItemButton>
    </>
  );
};
