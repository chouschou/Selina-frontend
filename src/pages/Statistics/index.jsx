import { useEffect, useState } from "react";
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
import {
  getStatisticsByShape,
  getStatisticsByMaterial,
  getStatisticsByAge,
  getStatisticsByPrice,
  getStatisticsByType,
} from "../../services/statistics/statisticsQuantity";
import { translateShapeToVietnamese } from "../../services/formatToShow";
import Revenue from "./Revenue";

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

function Statistics() {
  const [selectedYear, setSelectedYear] = useState("2025");
  const [pieChartType, setPieChartType] = useState("shape");
  const [timeType, setTimeType] = useState("year");
  const [selectedMonth, setSelectedMonth] = useState("1");
  const [pieChartData, setPieChartData] = useState({});
  const [barChartData, setBarChartData] = useState(null);

  const [selectedYearForRevenue, setSelectedYearForRevenue] = useState("2025");

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // tháng tính từ 0

  // Bắt đầu từ tháng 1 năm 2024
  const years = [];
  for (let year = 2024; year <= currentYear; year++) {
    years.push(String(year));
  }

  // Nếu năm đang chọn là năm hiện tại → chỉ cho chọn đến tháng hiện tại
  const months =
    selectedYear === String(currentYear)
      ? Array.from({ length: currentMonth }, (_, i) => i + 1)
      : Array.from({ length: 12 }, (_, i) => i + 1);

  const handleTimeTypeChange = (event) => {
    setTimeType(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handlePieChartTypeChange = (event) => {
    setPieChartType(event.target.value);
  };

  const getPieChartData = () => {
    if (!pieChartData || Object.keys(pieChartData).length === 0) return null;

    return {
      labels: Object.keys(pieChartData),
      datasets: [
        {
          data: Object.values(pieChartData),
          backgroundColor: ["#FF8A65", "#FFD54F", "#81C784", "#64B5F6"],
        },
      ],
    };
  };
  const handleStatisticClick = async () => {
    try {
      const time =
        timeType === "all"
          ? null
          : timeType === "year"
          ? selectedYear
          : `${selectedMonth}/${selectedYear}`;

      console.log("timeType - time :", timeType, time);

      // ======= Xử lý dữ liệu cho Bar Chart =======
      const barResponse = await getStatisticsByType(timeType, time);

      if (timeType === "year") {
        const months = Array.from({ length: 12 }, (_, i) => String(i + 1));
        const labels = months.map((m) => `Tháng ${m}`);

        const datasets = Object.entries(barResponse).map(
          ([label, monthData], idx) => ({
            label,
            data: months.map((m) => monthData[m] || 0),
            backgroundColor:
              idx === 0 ? "rgba(255, 0, 38, 0.5)" : "rgba(255, 51, 0, 0.3)",
          })
        );

        setBarChartData({ labels, datasets });
      } else {
        const barLabels = Object.keys(barResponse);
        const barData = Object.values(barResponse);

        // Danh sách màu mẫu (có thể mở rộng nếu cần)
        const colorPalette = [
          "rgba(255, 0, 38, 0.5)",
          "rgba(255, 51, 0, 0.3)",
          "rgba(255, 0, 38, 0.5)", // đỏ
          "rgba(255, 153, 0, 0.5)", // cam
          "rgba(0, 204, 102, 0.5)", // xanh lá
          "rgba(0, 153, 255, 0.5)", // xanh dương
          "rgba(153, 102, 255, 0.5)", // tím
          "rgba(255, 102, 204, 0.5)", // hồng
        ];

        // Cắt mảng màu đúng với độ dài data
        const backgroundColors = colorPalette.slice(0, barData.length);

        const datasets = [
          {
            label: "",
            data: barData,
            backgroundColor: backgroundColors,
          },
        ];

        setBarChartData({ labels: barLabels, datasets });
      }

      // ======= Xử lý dữ liệu cho Pie Chart =======
      let pieData = {};

      switch (pieChartType) {
        case "shape": {
          const shapeResponse = await getStatisticsByShape(timeType, time);
          pieData = Object.fromEntries(
            Object.entries(shapeResponse).map(([key, value]) => [
              translateShapeToVietnamese(key),
              value,
            ])
          );
          break;
        }

        case "material":
          pieData = await getStatisticsByMaterial(timeType, time);
          break;

        case "age":
          pieData = await getStatisticsByAge(timeType, time);
          break;

        case "price":
          pieData = await getStatisticsByPrice(timeType, time);
          break;

        default:
          break;
      }

      console.log("Pie Chart Data:", pieData);

      if (!pieData || Object.keys(pieData).length === 0) {
        setPieChartData({});
        return;
      }

      setPieChartData(pieData);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu biểu đồ:", err);
    }
  };

  useEffect(() => {
    handleStatisticClick();
  }, [pieChartType]);

  return (
    <Box className="statistics-content">
      <Box className="time-selector" display="flex" gap={2} alignItems="center">
        <FormControl>
          <Select value={timeType} onChange={handleTimeTypeChange}>
            <MenuItem value="month">Theo tháng</MenuItem>
            <MenuItem value="year">Theo năm</MenuItem>
            <MenuItem value="all">Tất cả</MenuItem>
          </Select>
        </FormControl>
        {timeType === "month" && (
          <FormControl>
            <Select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {months.map((month) => (
                <MenuItem key={month} value={month}>
                  Tháng {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {(timeType === "month" || timeType === "year") && (
          <FormControl>
            <Select value={selectedYear} onChange={handleYearChange}>
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Button để thực hiện thống kê */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleStatisticClick}
          style={{ height: "40px", color: "white" }}
        >
          Thống kê
        </Button>
      </Box>

      {/* Accordion Thống kê bán hàng */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography
            variant="h6"
            sx={{
              backgroundColor: "#e0f7fa", 
              padding: "4px 8px",
              borderRadius: "4px",
            }}
          >
            Thống kê bán hàng
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Paper className="statistics-section">
            <Grid container spacing={20}>
              <Grid item xs={12} md={5}>
                <Box className="filter-chart-container">
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    gutterBottom
                    style={{ color: "#bc5700", fontWeight: 500, fontSize: 18 }}
                  >
                    Thống kê số lượng bán theo:
                  </Typography>
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
                <Box className="chart-container">
                  {getPieChartData() ? (
                    <Pie
                      data={getPieChartData()}
                      options={{
                        plugins: {
                          legend: {
                            position: "right", //Chuyển chú thích sang bên phải
                            labels: {
                              font: {
                                size: 16, // Tăng kích thước chú thích ở đây
                              },
                              padding: 12,
                            },
                          },
                        },
                        layout: {
                          padding: {
                            right: 40, // Đẩy biểu đồ sang trái, tạo khoảng trống giữa biểu đồ và chú thích
                          },
                        },
                        responsive: true,
                        maintainAspectRatio: false, // Tuỳ chọn: giúp kiểm soát kích thước tốt hơn nếu dùng chiều cao
                      }}
                    />
                  ) : (
                    <Typography>Không có dữ liệu thống kê</Typography>
                  )}
                </Box>
              </Grid>
              {/* </Box> */}
            </Grid>
          </Paper>
          <Paper className="statistics-section">
            <Grid>
              <Grid item xs={12} md={6}>
                <Box className="chart-container-2">
                  {barChartData ? (
                    <Bar
                      data={barChartData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: "top",
                            labels: {
                              font: {
                                size: 16,
                              },
                              padding: 16,
                            },
                          },
                          title: {
                            display: true,
                            text: "So sánh số lượng bán",
                            font: {
                              size: 20,
                            },
                            color: "#bc5700",
                          },
                        },
                      }}
                    />
                  ) : (
                    <Typography>Không có dữ liệu biểu đồ</Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </AccordionDetails>
      </Accordion>
      <Box className="time-selector" sx={{ mt: 2 }}>
        <FormControl>
          <Select
            value={selectedYear}
            onChange={(e) => setSelectedYearForRevenue(e.target.value)}
            className="year-select"
          >
            <MenuItem key="all" value="all">
              Tất cả
            </MenuItem>
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {/* Accordion Doanh thu */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography
            variant="h6"
            sx={{
              backgroundColor: "#e0f7fa", 
              padding: "4px 8px",
              borderRadius: "4px",
            }}
          >
            Doanh thu
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Revenue selectedYear={selectedYearForRevenue}></Revenue>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

export default Statistics;
