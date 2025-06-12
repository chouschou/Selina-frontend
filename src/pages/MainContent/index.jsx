import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import "./MainContent.scss";
import ProductManagement from "../ProductManagement";
import VoucherManage from "../VoucherManage";
import ShipFeeManage from "../ShipFeeManage";
import Statistics from "../Statistics";
import ChangeStorePassword from "../../components/ChangeStorePassword";

function ProductsTable() {
  return <ProductManagement />;
}

function VouchersContent() {
  return <VoucherManage />;
}

function ShippingContent() {
  return (
    <>
      {/* <Box className="content-section">
        <h2>Phí vận chuyển</h2>
        <p>Cài đặt phí vận chuyển cho đơn hàng.</p>
      </Box> */}
      <ShipFeeManage />
    </>
  );
}

function StatisticsContent() {
  return (
    // <Box className="content-section">
    //   <h2>Thống kê</h2>
    //   <p>Xem số liệu thống kê về doanh thu và lượt bán.</p>
    // </Box>
    <Statistics />
  );
}
function AccountStoreContent() {
  return (
    // <Box className="content-section">
    //   <h2>Quản lý tài khoản cửa hàng</h2>
    //   <p>Thay dổi mật khẩu tài khoản cửa hàng.</p>
    // </Box>
    <ChangeStorePassword></ChangeStorePassword>
  );
}

function MainContent({ activeMenuItem }) {
  return (
    <Box className="main-content">
      {activeMenuItem === "products" && <ProductsTable />}
      {activeMenuItem === "vouchers" && <VouchersContent />}
      {activeMenuItem === "shipping" && <ShippingContent />}
      {activeMenuItem === "statistics" && <StatisticsContent />}
      {activeMenuItem === "account-store" && <AccountStoreContent />}
    </Box>
  );
}

export default MainContent;
