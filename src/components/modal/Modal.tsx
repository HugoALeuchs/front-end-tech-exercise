import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import ProducModal from "./ProductModal";
import { ProductInterface } from "../../interfaces/ProductInterface";
import { OrderInterface } from "../../interfaces/OrderInterface";
import OrderModal from "./OrderModal";

export enum modalType {
  ORDERS = "orders",
  PRODUCT = "product",
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  p: 0,
};

export default function ModalComponent({
  open,
  setOpen,
  type,
  data,
  setProductData,
  refreshData,
}: {
  open: boolean;
  setOpen: any;
  type: modalType;
  data?: ProductInterface | OrderInterface;
  setProductData?: any;
  refreshData: () => void;
}) {
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {type === modalType.ORDERS && (
            <OrderModal
              data={data as OrderInterface}
              setOrderData={setProductData}
              refreshData={refreshData}
            />
          )}
          {type === modalType.PRODUCT && (
            <ProducModal
              data={data as ProductInterface}
              setProductData={setProductData}
              refreshData={refreshData}
            />
          )}
        </Box>
      </Modal>
    </div>
  );
}
