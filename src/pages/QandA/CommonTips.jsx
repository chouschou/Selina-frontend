// CommonTips.jsx
import React from 'react';
import { Box, Grid, Typography, Paper } from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

const CommonTips = () => {
  return (
    <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', mt: 6 }}>
      <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', mb: 3 }}>
        <LightbulbIcon color="warning" sx={{ verticalAlign: 'middle', mr: 1 }} />
        Mẹo chọn kính chung
      </Typography>
      <Box display="flex"
          flexWrap="wrap"
          justifyContent="center"
          gap={4}>
        <Box flexBasis={{ xs: '100%', md: '30%' }}>
          <Box textAlign="center">
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              Kích thước
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Kính không nên rộng hơn khuôn mặt, chiều cao phù hợp với tỷ lệ gương mặt
            </Typography>
          </Box>
        </Box>
        <Box flexBasis={{ xs: '100%', md: '30%' }}>
          <Box textAlign="center">
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              Màu sắc
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Chọn màu phù hợp với tông da, tóc và phong cách cá nhân
            </Typography>
          </Box>
        </Box>
        <Box flexBasis={{ xs: '100%', md: '30%' }}>
          <Box textAlign="center">
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              Chất liệu
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Kim loại cho vẻ lịch lãm, nhựa cho phong cách trẻ trung
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default CommonTips;
