import { useRouter } from "next/router";
import OrdersTable from "../src/components/tables/OrdersTable";
import { useEffect, useState } from "react";

export async function getServerSideProps() {
  const res = await fetch(
    "https://staging1.internal1.packiyo.com/api/v1/orders",
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
    }
  );
  const data = await res.json();

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: { data },
  };
}

export default function Orders({ data }: any) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = () => {
    router.replace(router.asPath);
    setIsRefreshing(true);
  };
  useEffect(() => {
    setIsRefreshing(false);
  }, [data]);
  return (
    <OrdersTable data={data} createButton={true} refreshData={refreshData} />
  );
}
