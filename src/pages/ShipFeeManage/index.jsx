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
  Button,
} from "@mui/material";
import { LocalShipping } from "@mui/icons-material";
import "./ShipFeeManage.scss";
import { getAllShipFees } from "../../services/shipfee/getAllShipFees";
import { getProvinces } from "../../services/getProvinces";
import { createShipFee } from "../../services/shipfee/createShipFee";
import { updateShipFee } from "../../services/shipfee/updateShipFee";
import { toast } from "react-toastify";

function ShipFeeManage() {
  const [defaultState, setDefaultState] = useState(null);

  const [selectedCity, setSelectedCity] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [initialDistance, setInitialDistance] = useState("");
  const [additionalFee, setAdditionalFee] = useState("");
  const [perKm, setPerKm] = useState("");
  const [provincesList, setProvincesList] = useState([]);
  const [initialState, setInitialState] = useState(null);

  const handleCityChange = (event) => {
    const value = event.target.value;
    setSelectedCity(value);
    loadFeeForCity(value);
  };

  const resetForm = () => {
    if (defaultState) {
      setSelectedCity(defaultState.StoreLocation);
      setBasePrice(String(defaultState.BasicFee));
      setInitialDistance(String(defaultState.BasicDistance));
      setAdditionalFee(String(defaultState.Surcharge));

      const kmMatch = defaultState.SurchargeUnit?.match(/(\d+)\s*km/);
      setPerKm(kmMatch ? kmMatch[1] : "1");

      setInitialState(defaultState);
    } else {
      setSelectedCity("");
      setBasePrice("");
      setInitialDistance("");
      setAdditionalFee("");
      setPerKm("");
      setInitialState(null);
    }
  };

  const loadFeeForCity = async (cityName) => {
    try {
      const allFees = await getAllShipFees();
      const matched = allFees.find(
        (fee) => fee.StoreLocation.toLowerCase() === cityName.toLowerCase()
      );
      if (matched) {
        setBasePrice(String(matched.BasicFee));
        setInitialDistance(String(matched.BasicDistance));
        setAdditionalFee(String(matched.Surcharge));

        const kmMatch = matched.SurchargeUnit?.match(/(\d+)\s*km/);
        setPerKm(kmMatch ? kmMatch[1] : "");

        setInitialState(matched);
      } else {
        setBasePrice("");
        setInitialDistance("");
        setAdditionalFee("");
        setPerKm("");
        setInitialState(null);
      }
    } catch (err) {
      console.error("Lỗi khi load cấu hình phí:", err);
    }
  };

  const handleSave = async () => {
    if (
      !selectedCity ||
      !basePrice ||
      !initialDistance ||
      !additionalFee ||
      !perKm
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    const payload = {
      StoreLocation: selectedCity,
      BasicFee: Number(basePrice),
      BasicDistance: Number(initialDistance),
      Surcharge: Number(additionalFee),
      SurchargeUnit: `${perKm} km`,
    };

    try {
      if (initialState) {
        await updateShipFee(initialState.ID, payload);
        toast.success("Cập nhật phí vận chuyển thành công!");
      } else {
        await createShipFee(payload);
        toast.success("Tạo phí vận chuyển thành công!");
      }
      const newState = {
        StoreLocation: selectedCity,
        BasicFee: Number(basePrice),
        BasicDistance: Number(initialDistance),
        Surcharge: Number(additionalFee),
        SurchargeUnit: `${perKm || "1"} km`,
      };

      setInitialState(newState);
      setDefaultState(newState);

      // Cập nhật lại form luôn
      setSelectedCity(selectedCity);
      setBasePrice(basePrice);
      setInitialDistance(initialDistance);
      setAdditionalFee(additionalFee);
      setPerKm(perKm || "1");
    } catch (err) {
      toast.error("Lỗi khi lưu cấu hình: " + err);
    }
  };

  useEffect(() => {
    async function fetchApi() {
      const provices = await getProvinces(1);
      if (provices) {
        const cleanedProvinces = provices
          .map((province) => {
            const cleanedName = province.name.replace(
              /^(Thành phố|Tỉnh)\s+/i,
              ""
            );
            return {
              ...province,
              name:
                cleanedName === "Hồ Chí Minh"
                  ? `TP ${cleanedName}`
                  : cleanedName,
            };
          })
          .sort((a, b) => a.name.localeCompare(b.name));
        setProvincesList(cleanedProvinces);
      }

      try {
        const allFees = await getAllShipFees();
        if (allFees.length > 0) {
          const first = allFees[0];
          setSelectedCity(first.StoreLocation);
          setBasePrice(String(first.BasicFee));
          setInitialDistance(String(first.BasicDistance));
          setAdditionalFee(String(first.Surcharge));

          const kmMatch = first.SurchargeUnit?.match(/(\d+)\s*km/);
          setPerKm(kmMatch ? kmMatch[1] : "");

          setInitialState(first);
          setDefaultState(first); // <== Lưu cấu hình ban đầu
        }
      } catch (error) {
        console.error("Lỗi khi tải cấu hình phí đầu tiên:", error);
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
          <FormControl fullWidth variant="outlined" className="form-field">
            <InputLabel required component="legend">
              Vị trí của cửa hàng
            </InputLabel>
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
            required
            label="Phí cơ bản"
            value={Number(basePrice)}
            onChange={(e) => {
              const value = e.target.value;
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
                value={Number(initialDistance)}
                onChange={(e) => {
                  const value = e.target.value;
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
                value={Number(additionalFee)}
                onChange={(e) => {
                  const value = e.target.value;
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
              Phí vận chuyển = {Number(basePrice) || "phí cơ bản"} + (kc -{" "}
              {Number(initialDistance) || "a"}) × {Number(additionalFee) || "b"}/{Number(perKm) || "c"}
            </Typography>
            <Typography className="formula-note">
              Trong đó:
              <br />
              kc là khoảng cách từ cửa hàng bạn đến nơi nhận hàng (đơn vị: km)
              <br />
              a: số km đầu tiên.
              <br />
              b: phí phụ thu.
              <br />
              c: mỗi đơn vị km áp dụng phụ thu.
            </Typography>
          </Box>

          <Box className="form-actions">
            <Button
              className="btn-cancel"
              variant="outlined"
              onClick={resetForm}
            >
              Hủy
            </Button>
            <Button
              className="btn-save"
              variant="contained"
              onClick={handleSave}
            >
              Lưu
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default ShipFeeManage;
