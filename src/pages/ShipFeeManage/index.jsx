import { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  InputAdornment,
  Paper,
} from "@mui/material";
import { LocalShipping } from "@mui/icons-material";
import "./ShipFeeManage.scss";
import { getProvinces } from "../../services/getProvinces";

function ShipFeeManage() {
  const [selectedCity, setSelectedCity] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [initialDistance, setInitialDistance] = useState("");
  const [additionalFee, setAdditionalFee] = useState("");
  const [perKm, setPerKm] = useState("");
  const [provincesList, setProvincesList] = useState([]);

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  useEffect(() => {
    async function fetchApi() {
      const provices = await getProvinces(1);
      console.log("provices------", provices);
      if (provices) {
        const cleanedProvinces = provices
          .map((province) => {
            const cleanedName = province.name.replace(
              /^(Thành phố|Tỉnh)\s+/i,
              ""
            ); // Loại bỏ tiền tố "Thành phố" hoặc "Tỉnh"
            return {
              ...province,
              name:
                cleanedName === "Hồ Chí Minh"
                  ? `TP ${cleanedName}`
                  : cleanedName, // Thêm "TP" nếu là Hồ Chí Minh
            };
          })
          .sort((a, b) => a.name.localeCompare(b.name)); // Sắp xếp theo bảng chữ cái
        setProvincesList(cleanedProvinces);
      }
    }
    fetchApi();
  }, []);

  return (
    <Box className="shipping-content">
      <Paper className="shipping-form">
        <Box className="form-header">
          <LocalShipping className="shipping-icon" />
          <Typography variant="h6">Cấu hình phí vận chuyển</Typography>
        </Box>

        <Box className="form-content">
          <FormControl fullWidth className="form-field">
            <InputLabel>Vị trí của cửa hàng</InputLabel>
            <Select
              value={selectedCity}
              onChange={handleCityChange}
              label="Vị trí của cửa hàng"
            >
              {provincesList.map((province, index) => (
                <MenuItem key={index} value={province.name}>
                  {province.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Phí cơ bản"
            value={basePrice}
            // onChange={(e) => setBasePrice(e.target.value)}
            onChange={(e) => {
              const value = e.target.value;
              // Chỉ cho phép số nguyên dương hoặc chuỗi rỗng (để xóa)
              if (value === "" || (/^\d+$/.test(value) && Number(value) > 0)) {
                setBasePrice(value);
              }
            }}
            className="form-field"
            InputProps={{
              endAdornment: <InputAdornment position="end">đ</InputAdornment>,
            }}
          />

          <Box className="distance-config">
            <Typography className="formula-label">
              Sau
              <TextField
                value={initialDistance}
                // onChange={(e) => setInitialDistance(e.target.value)}
                onChange={(e) => {
                  const value = e.target.value;
                  // Chỉ cho phép số nguyên dương hoặc chuỗi rỗng (để xóa)
                  if (
                    value === "" ||
                    (/^\d+$/.test(value) && Number(value) > 0)
                  ) {
                    setInitialDistance(value);
                  }
                }}
                className="distance-input"
                placeholder="a"
                size="small"
              />
              km đầu tiên, tính thêm phí
              <TextField
                value={additionalFee}
                // onChange={(e) => setAdditionalFee(e.target.value)}
                onChange={(e) => {
                  const value = e.target.value;
                  // Chỉ cho phép số nguyên dương hoặc chuỗi rỗng (để xóa)
                  if (
                    value === "" ||
                    (/^\d+$/.test(value) && Number(value) > 0)
                  ) {
                    setAdditionalFee(value);
                  }
                }}
                className="fee-input"
                size="small"
                placeholder="b"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">đ</InputAdornment>
                  ),
                }}
              />
              /
              <TextField
                value={perKm}
                onChange={(e) => {
                  const value = e.target.value;
                  // Chỉ cho phép số nguyên dương hoặc chuỗi rỗng (để xóa)
                  if (
                    value === "" ||
                    (/^\d+$/.test(value) && Number(value) > 0)
                  ) {
                    setPerKm(value);
                  }
                }}
                className="per-km-input"
                size="small"
                placeholder="c"
                type="number"
              />
              km
            </Typography>
          </Box>

          <Box className="formula-display">
            <Typography className="formula-title">
              Công thức tính phí vận chuyển:
            </Typography>
            <Typography className="formula">
              Phí vận chuyển = {basePrice || "phí cơ bản"} + (kc -{" "}
              {initialDistance || "a"}) × {additionalFee || "b"}/{perKm || "c"}
            </Typography>
            <Typography className="formula-note">
              Trong đó:<br/>kc là khoảng cách từ cửa hàng bạn đến nơi nhận hàng (đơn
              vị: km)<br/>a: số km đầu tiên.<br/> b: phí phụ thu.<br/>c: mỗi đơn vị
              km áp dụng phụ thu.
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default ShipFeeManage;
