import { useState } from "react";
import {
  Box,
  Button,
  Container,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
} from "@mui/material";
import Title from "../Title";
import ModalComponent, { modalType } from "../modal/Modal";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { deleteProduct } from "../../service/Client";
import { ProductInterface } from "../../interfaces/ProductInterface";

// Generate Order Data
function createData(id: number, name: string, sku: string) {
  return { id, name, sku };
}

export default function ProductTable({
  data,
  createButton,
  refreshData,
}: {
  data: { data: ProductInterface[] };
  createButton?: boolean;
  refreshData: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [productData, setProductData] = useState<ProductInterface | undefined>(
    {} as ProductInterface
  );
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(false);

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = (id: number) => {
    setLoading(true);
    try {
      deleteProduct(id.toString()).then(() => {
        refreshData();
        setLoading(false);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (id: number) => {
    setProductData(
      data.data.find((product: ProductInterface) => parseInt(product.id) === id)
    );
    setOpen(true);
  };

  const handleSort = (property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedRows = data.data
    .map((product: ProductInterface) =>
      createData(
        parseInt(product.id),
        product.attributes.name,
        product.attributes.sku
      )
    )
    .sort(
      (a: { name: string; sku: string }, b: { name: string; sku: string }) => {
        if (orderBy === "name") {
          return order === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        } else if (orderBy === "sku") {
          return order === "asc"
            ? a.sku.localeCompare(b.sku)
            : b.sku.localeCompare(a.sku);
        }
        return 0;
      }
    );

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, sortedRows.length - page * rowsPerPage);

  return (
    <Container maxWidth="xl" sx={{ mt: createButton ? 10 : 2, mb: 4, mx: 0 }}>
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
        open={open}
        setOpen={setOpen}
        type={modalType.PRODUCT}
        data={productData}
        setProductData={setProductData}
        refreshData={refreshData}
      />
      {createButton ? (
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpen(true)}
          >
            Create Product
          </Button>
        </Box>
      ) : (
        <Title>Recent Products</Title>
      )}
      <Table size="medium">
        <TableHead>
          <TableRow>
            {createButton && <TableCell></TableCell>}
            <TableCell align="center">
              <Button onClick={() => handleSort("name")}>Name</Button>
            </TableCell>
            <TableCell align="center">
              <Button onClick={() => handleSort("sku")}>SKU</Button>
            </TableCell>
            {createButton && <TableCell align="right"></TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? sortedRows.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              )
            : sortedRows
          ).map(
            (row: { id: number; name: string; sku: string }, index: number) => (
              <TableRow key={index}>
                {createButton && (
                  <TableCell>
                    <IconButton onClick={() => handleEdit(row.id)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                )}
                <TableCell align="center">{row.name}</TableCell>
                <TableCell align="center">{row.sku}</TableCell>
                {createButton && (
                  <TableCell align="right">
                    <IconButton onClick={() => handleDelete(row.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            )
          )}

          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={4} />
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
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
