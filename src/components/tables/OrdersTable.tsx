import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  TablePagination,
  Tooltip,
} from "@mui/material";
import Title from "../Title";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import ModalComponent, { modalType } from "../modal/Modal";
import { deleteOrder } from "../../service/Client";
import { OrderInterface } from "../../interfaces/OrderInterface";

// Generate Order Data
function createData(
  id: number,
  number: string,
  customer: string,
  status: string,
  date: string
) {
  return { id, number, customer, status, date };
}

export default function OrdersTable({
  data,
  createButton,
  refreshData,
}: {
  data: any;
  createButton?: boolean;
  refreshData: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderData, setOrderData] = useState({} as OrderInterface);
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(false);

  const handleSort = (property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrderBy(property);
    setOrder(isAsc ? "desc" : "asc");
  };

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (id: number) => {
    setOrderData(data.data.find((order: any) => order.id === id));
    setOpen(true);
  };

  const sortedRows = data.data.sort((a: any, b: any) => {
    const aValue = a.attributes[orderBy];
    const bValue = b.attributes[orderBy];
    if (aValue < bValue) {
      return order === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return order === "asc" ? 1 : -1;
    }
    return 0;
  });

  const paginatedRows = sortedRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const rows = paginatedRows.map((order: any) =>
    createData(
      order.id,
      order.attributes.number,
      order.relationships.customer.data.id,
      order.attributes.status_text,
      order.attributes.ordered_at
    )
  );

  return (
    <Container maxWidth={"xl"} sx={{ mt: createButton ? 10 : 2, mb: 4, mx: 0 }}>
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
      <ModalComponent
        data={orderData}
        open={open}
        setOpen={setOpen}
        type={modalType.ORDERS}
        refreshData={refreshData}
      />
      {createButton ? (
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpen(true)}
          >
            Create Order
          </Button>
        </Box>
      ) : (
        <Title>Recent Orders</Title>
      )}
      <Table size="medium">
        <TableHead>
          <TableRow>
            {createButton && <TableCell align="left"></TableCell>}
            <TableCell align={"center"}>
              <Button onClick={() => handleSort("number")}>Number</Button>
            </TableCell>
            <TableCell align="center">
              <Button onClick={() => handleSort("customer")}>Customer</Button>
            </TableCell>
            <TableCell align="center">
              <Button onClick={() => handleSort("status_text")}>Status</Button>
            </TableCell>
            <TableCell align="center">
              <Button onClick={() => handleSort("ordered_at")}>Date</Button>
            </TableCell>
            {createButton && <TableCell align={"right"}></TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(
            (
              row: {
                id: number;
                number: string;
                customer: string;
                status: string;
                date: string;
              },
              index: number
            ) => (
              <TableRow key={index}>
                {createButton ? (
                  <TableCell>
                    <Tooltip title="Edit" placement="right">
                      <IconButton
                        onClick={() => {
                          handleEdit(row.id);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                ) : null}
                <TableCell align="center">{row.number}</TableCell>
                <TableCell align="center">{row.customer}</TableCell>
                <TableCell align="center">{row.status}</TableCell>
                <TableCell align="center">
                  {new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(row.date))}
                </TableCell>
                {createButton ? (
                  <TableCell align={"right"}>
                    <Tooltip title="Cancel" placement="left">
                      <IconButton
                        onClick={() => {
                          setLoading(true);
                          deleteOrder(row.id.toString()).then(() => {
                            refreshData();
                            setLoading(false);
                          });
                        }}
                      >
                        <CancelIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                ) : null}
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={sortedRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Container>
  );
}
