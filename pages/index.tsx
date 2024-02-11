import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Orders from "../src/components/tables/OrdersTable";
import theme from "../src/theme/theme";
import ProductTable from "../src/components/tables/ProductTable";
import router from "next/router";
import { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";

export async function getServerSideProps() {
  const orderFetch = fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
    headers: {
      "Cache-Control": "public, s-maxage=10, stale-while-revalidate=59",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
    },
  });

  const productFetch = fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
    headers: {
      "Cache-Control": "public, s-maxage=10, stale-while-revalidate=59",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
    },
  });

  const [ordersRes, productsRes] = await Promise.all([
    orderFetch,
    productFetch,
  ]);

  const ordersData = await ordersRes.json();
  const productsData = await productsRes.json();

  if (!ordersData || !productsData) {
    return {
      notFound: true,
    };
  }

  return {
    props: { ordersData, productsData },
  };
}

export default function Dashboard({ ordersData, productsData }: any) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshData = () => {
    router.replace(router.asPath);
    setIsRefreshing(true);
  };
  useEffect(() => {
    setIsRefreshing(false);
  }, []);

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: theme.palette.grey[900],
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
      }}
    >
      <Toolbar />
      <Container maxWidth={"xl"} sx={{ mt: 2, mb: 4, mx: 0 }}>
        {isRefreshing && (
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
        <Grid container spacing={3}>
          {/* Recent Orders */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <Orders data={ordersData} refreshData={refreshData} />
            </Paper>
          </Grid>
          {/* Recent Products */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <ProductTable data={productsData} refreshData={refreshData} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
