import React from "react";
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CheckIcon from "@mui/icons-material/Check";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import "./OrderManage.scss";
import { formatDateTimeVN } from "../../services/formatDatetimeVN";

const statusSteps = [
  {
    label: "Chưa xác nhận",
    icon: <AccessTimeIcon />,
    value: "waiting",
  },
  {
    label: "Đã xác nhận",
    icon: <CheckIcon />,
    value: "confirmed",
  },
  {
    label: "Đang giao hàng",
    icon: <LocalShippingIcon />,
    value: "shipping",
  },
  {
    label: "Hoàn thành",
    icon: <TaskAltIcon />,
    value: "completed",
  },
];

// Custom styled connector for the stepper
const CustomConnector = styled(StepConnector)(() => ({
  "& .MuiStepConnector-line": {
    borderColor: "#e0e0e0",
    borderTopWidth: 2,
  },
  "&.Mui-active": {
    "& .MuiStepConnector-line": {
      borderColor: "#007c7c",
    },
  },
  "&.Mui-completed": {
    "& .MuiStepConnector-line": {
      borderColor: "#007c7c",
    },
  },
}));

// Custom styled step label
const CustomStepLabel = styled(StepLabel)(() => ({
  "& .MuiStepLabel-label": {
    color: "#9e9e9e",
    fontSize: "0.9rem",
    marginTop: "8px",
    "&.Mui-active": {
      color: "#007c7c",
      fontWeight: 600,
    },
    "&.Mui-completed": {
      color: "#007c7c",
    },
  },
  "& .MuiStepLabel-iconContainer": {
    color: "#bdbdbd",
    "&.Mui-active": {
      color: "#007c7c",
    },
    "&.Mui-completed": {
      color: "#007c7c",
    },
  },
}));

const OrderStatusTimeline = ({ status, orderStatus }) => {
  // Tìm bước hiện tại
  const activeStep = statusSteps.findIndex((step) => step.value === status);

  // Tạo ánh xạ status => time
  const statusTimeMap = {};
  orderStatus?.forEach((s) => {
    statusTimeMap[s.Status] = formatDateTimeVN(s.CreateAt);
  });
  // Nếu đơn hàng bị hủy
  if (status === "canceled") {
    return (
      <Box className="cancelled-status-container">
        <DoDisturbIcon sx={{ color: "#e53935", fontSize: "2rem" }} />
        <Typography
          variant="h6"
          sx={{ color: "#e53935", fontWeight: 600, marginTop: "8px" }}
        >
          Đã hủy
        </Typography>
        {statusTimeMap["canceled"] && (
          <Typography
            variant="caption"
            sx={{ color: "#757575", mt: 0.5, display: "block" }}
          >
            {statusTimeMap["canceled"]}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box className="order-status-timeline">
      <Stepper activeStep={activeStep} connector={<CustomConnector />}>
        {statusSteps.map((step, index) => (
          <Step key={step.value} completed={index <= activeStep}>
            <CustomStepLabel
              StepIconComponent={() => (
                <Box
                  sx={{
                    color: index <= activeStep ? "#007c7c" : "#bdbdbd",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {step.icon}
                </Box>
              )}
            >
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ marginTop: 0 }}
              >
                {step.label}
              </Typography>
              {statusTimeMap[step.value] && (
                <Typography
                  variant="caption"
                  sx={{ color: "#757575", mt: 0.5, display: "block" }}
                >
                  {statusTimeMap[step.value]}
                </Typography>
              )}
            </CustomStepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default OrderStatusTimeline;
