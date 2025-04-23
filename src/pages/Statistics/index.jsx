import { useState } from "react";
import {
  Box,
  Paper,
  FormControl,
  Select,
  MenuItem,
  RadioGroup,
  Radio,
  FormControlLabel,
  Grid,
  Typography,
} from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import "./Statistics.scss";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const years = ["Tất cả", "2024", "2025", "2026"];
const months = Array.from({ length: 12 }, (_, i) => i + 1);

const sampleData = {
  pieChart: {
    shape: {
      "Hình chữ nhật": 30,
      Tròn: 25,
      Oval: 45,
    },
    material: {
      Nhựa: 40,
      "Kim loại": 35,
      Titanium: 25,
    },
    age: {
      "Người lớn": 70,
      "Trẻ em": 30,
    },
    price: {
      "0-500k": 20,
      "500k-1tr": 35,
      "1tr-2tr": 30,
      "Trên 2tr": 15,
    },
  },
  barChart: {
    labels: months,
    datasets: [
      {
        label: "Gọng kính",
        data: months.map(() => Math.floor(Math.random() * 50) + 20),
        backgroundColor: "rgba(119, 126, 0, 0.5)",
      },
      {
        label: "Kính mát",
        data: months.map(() => Math.floor(Math.random() * 50) + 20),
        backgroundColor: "rgba(132, 2, 95, 0.3)",
      },
    ],
  },
  lineChart: {
    labels: months,
    datasets: [
      {
        label: "Doanh thu (nghìn đồng)",
        data: months.map(() => Math.floor(Math.random() * 50000) + 10000),
        borderColor: "#FFB74D",
        tension: 0.4,
      },
    ],
  },
};

function Statistics() {
  const [selectedYear, setSelectedYear] = useState("2025");
  const [pieChartType, setPieChartType] = useState("material");

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handlePieChartTypeChange = (event) => {
    setPieChartType(event.target.value);
  };

  const getPieChartData = () => {
    const data = sampleData.pieChart[pieChartType];
    return {
      labels: Object.keys(data),
      datasets: [
        {
          data: Object.values(data),
          backgroundColor: ["#FF8A65", "#FFD54F", "#81C784", "#64B5F6"],
        },
      ],
    };
  };

  return (
    <Box className="statistics-content">
      <Box className="time-selector">
        <FormControl>
          <Select
            value={selectedYear}
            onChange={handleYearChange}
            className="year-select"
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Paper className="statistics-section">
        <Typography variant="h6" className="section-title">
          Thống kê bán hàng
        </Typography>
        <Grid container spacing={20}>
          <Grid item xs={12} md={5}>
            <Box className="chart-container">
              <RadioGroup
                value={pieChartType}
                onChange={handlePieChartTypeChange}
                className="chart-radio-group"
              >
                <FormControlLabel
                  value="shape"
                  control={<Radio />}
                  label="Hình dáng kính"
                />
                <FormControlLabel
                  value="material"
                  control={<Radio />}
                  label="Chất liệu"
                />
                <FormControlLabel
                  value="age"
                  control={<Radio />}
                  label="Độ tuổi"
                />
                <FormControlLabel
                  value="price"
                  control={<Radio />}
                  label="Mức giá"
                />
              </RadioGroup>
            </Box>
          </Grid>
          <Grid item xs={12} md={7}>
            <Box>
              <Pie
                data={getPieChartData()}
                options={{
                  plugins: {
                    legend: {
                      position: "right", // 💡 Chuyển chú thích sang bên phải
                    },
                  },
                  responsive: true,
                  maintainAspectRatio: false, // Tuỳ chọn: giúp kiểm soát kích thước tốt hơn nếu dùng chiều cao
                }}
              />
            </Box>
          </Grid>
          {/* </Box> */}
        </Grid>
        <Grid>
          {" "}
          <Grid item xs={12} md={6}>
            <Box className="chart-container">
              <Bar
                data={sampleData.barChart}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                    title: {
                      display: true,
                      text: "So sánh số lượng bán",
                    },
                  },
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Paper className="statistics-section">
        <Typography variant="h6" className="section-title">
          Doanh thu
        </Typography>
        <Box className="chart-container">
          <Line
            data={sampleData.lineChart}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
}

export default Statistics;
