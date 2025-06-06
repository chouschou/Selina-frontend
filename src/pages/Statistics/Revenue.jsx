import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "./Statistics.scss";
import { getStatisticsRevenue } from "../../services/statistics/statisticsRevenue";


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Revenue({ selectedYear }) {
  
  const [labels, setLabels] = useState([]);
  const [dataPoints, setDataPoints] = useState([]);

  const fetchRevenueData = async (year) => {
    const statisticsBy = year === "all" ? "all" : "year";
    const time = year === "all" ? "" : year;

    try {
      const data = await getStatisticsRevenue(statisticsBy, time);
      const sortedKeys = Object.keys(data)
        .sort((a, b) => Number(a) - Number(b));

      setLabels(sortedKeys.map((key) => statisticsBy === "year" ? `Tháng ${key}` : key));
      setDataPoints(sortedKeys.map((key) => data[key] / 1000)); // chia 1000 => nghìn đồng
    } catch (error) {
      console.error("Failed to fetch revenue data:", error);
      setLabels([]);
      setDataPoints([]);
    }
  };

  useEffect(() => {
    fetchRevenueData(selectedYear);
  }, [selectedYear]);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Doanh thu (nghìn đồng)",
        data: dataPoints,
        // borderColor: "rgba(8, 161, 164, 0.8)",
        borderColor: "rgba(109, 8, 164, 0.8)",
        backgroundColor: "rgba(109, 8, 164, 0.8)",
        tension: 0.1,
      },
    ],
  };

  return (
    <Box className="statistics-revenue-content">
      
      <Paper className="statistics-section">
        <Box className="chart-container-2">
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
              },
              scales: {
                y: { beginAtZero: true },
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
}

export default Revenue;
