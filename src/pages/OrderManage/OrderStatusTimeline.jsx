import React from 'react';
import { Box, Typography, Stepper, Step, StepLabel, StepConnector } from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import "./OrderManage.scss";

const statusSteps = [
  { 
    label: 'Chờ xác nhận', 
    icon: <AccessTimeIcon />,
    value: 'waiting' 
  },
  { 
    label: 'Đã xác nhận', 
    icon: <CheckIcon />,
    value: 'confirmed' 
  },
  { 
    label: 'Đang giao hàng', 
    icon: <LocalShippingIcon />,
    value: 'shipping' 
  },
  { 
    label: 'Hoàn thành', 
    icon: <TaskAltIcon />,
    value: 'completed' 
  }
];

// Custom styled connector for the stepper
const CustomConnector = styled(StepConnector)(() => ({
  '& .MuiStepConnector-line': {
    borderColor: '#e0e0e0',
    borderTopWidth: 2,
  },
  '&.Mui-active': {
    '& .MuiStepConnector-line': {
      borderColor: '#007c7c',
    },
  },
  '&.Mui-completed': {
    '& .MuiStepConnector-line': {
      borderColor: '#007c7c',
    },
  },
}));

// Custom styled step label
const CustomStepLabel = styled(StepLabel)(() => ({
  '& .MuiStepLabel-label': {
    color: '#9e9e9e',
    fontSize: '0.9rem',
    marginTop: '8px',
    '&.Mui-active': {
      color: '#007c7c',
      fontWeight: 600,
    },
    '&.Mui-completed': {
      color: '#007c7c',
    },
  },
  '& .MuiStepLabel-iconContainer': {
    color: '#bdbdbd',
    '&.Mui-active': {
      color: '#007c7c',
    },
    '&.Mui-completed': {
      color: '#007c7c',
    },
  },
}));

const OrderStatusTimeline = ({ status }) => {
  // If the order is cancelled, show a different view
  if (status === 'cancelled') {
    return (
      <Box className="cancelled-status-container">
        <DoDisturbIcon sx={{ color: '#e53935', fontSize: '2rem' }} />
        <Typography variant="h6" sx={{ color: '#e53935', fontWeight: 600, marginTop: '8px' }}>
          Đã hủy
        </Typography>
      </Box>
    );
  }

  // Find the active step index
  const activeStep = statusSteps.findIndex(step => step.value === status);
  
  return (
    <Box className="order-status-timeline">
      <Stepper activeStep={activeStep} connector={<CustomConnector />}>
        {statusSteps.map((step, index) => (
          <Step key={step.value} completed={index <= activeStep}>
            <CustomStepLabel
              StepIconComponent={() => (
                <Box
                  sx={{
                    color: index <= activeStep ? '#007c7c' : '#bdbdbd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {step.icon}
                </Box>
              )}
            >
              {step.label}
            </CustomStepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default OrderStatusTimeline;