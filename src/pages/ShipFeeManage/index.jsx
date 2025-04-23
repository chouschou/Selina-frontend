import { useState } from 'react'
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  InputAdornment,
  Paper
} from '@mui/material'
import { LocalShipping } from '@mui/icons-material'
import './ShipFeeManage.scss'

const cities = [
  'Hà Nội',
  'Hồ Chí Minh',
  'Đà Nẵng',
  'Hải Phòng',
  'Cần Thơ'
]

function ShipFeeManage() {
  const [selectedCity, setSelectedCity] = useState('')
  const [basePrice, setBasePrice] = useState('')
  const [initialDistance, setInitialDistance] = useState('')
  const [additionalFee, setAdditionalFee] = useState('')
  const [perKm, setPerKm] = useState('')

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value)
  }

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
              {cities.map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Phí cơ bản"
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            className="form-field"
            InputProps={{
              endAdornment: <InputAdornment position="end">đ</InputAdornment>
            }}
          />

          <Box className="distance-config">
            <Typography className="formula-label">
              Sau
              <TextField
                value={initialDistance}
                onChange={(e) => setInitialDistance(e.target.value)}
                className="distance-input"
                size="small"
              />
              km đầu tiên, tính thêm phí
              <TextField
                value={additionalFee}
                onChange={(e) => setAdditionalFee(e.target.value)}
                className="fee-input"
                size="small"
                InputProps={{
                  endAdornment: <InputAdornment position="end">đ</InputAdornment>
                }}
              />
              /
              <TextField
                value={perKm}
                onChange={(e) => setPerKm(e.target.value)}
                className="per-km-input"
                size="small"
              />
              km
            </Typography>
          </Box>

          <Box className="formula-display">
            <Typography className="formula-title">
              Công thức tính phí vận chuyển:
            </Typography>
            <Typography className="formula">
              Phí vận chuyển = {basePrice || 'b'} + (kc - {initialDistance || 'c'}) × {additionalFee || 'd'}/{perKm || 'e'}
            </Typography>
            <Typography className="formula-note">
              Trong đó: kc là khoảng cách từ cửa hàng bạn đến nơi nhận hàng
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

export default ShipFeeManage