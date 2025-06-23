import React from 'react';
import { Box, Container, Grid, Card, CardContent, Typography } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import GlassesIcon from '@mui/icons-material/Visibility'; // dùng tạm vì không có icon kính
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';

const features = [
  {
    icon: <CameraAltIcon sx={{ fontSize: 36, color: '#ffbbcc' }} />,
    title: 'Thử kính ảo',
    description:
      'Dễ dàng thử mọi mẫu kính trên khuôn mặt của bạn với công nghệ AR tiên tiến, giúp bạn thấy mẫu kính phù hợp mà không cần đến cửa hàng.',
    bgColor: '#ff5b5b',
  },
  {
    icon: <GlassesIcon sx={{ fontSize: 36, color: '#b4ffed' }} />,
    title: 'Gợi ý thông minh',
    description:
      'Hệ thống AI phân tích đặc điểm khuôn mặt và gợi ý những mẫu kính phù hợp nhất với bạn, từ kiểu dáng đến màu sắc.',
    bgColor: '#4baebb',
  },
  {
    icon: <CardGiftcardIcon sx={{ fontSize: 36, color: '#FFF3E0' }} />,
    title: 'Dịch vụ tận tâm',
    description:
      'Đội ngũ tư vấn chuyên nghiệp, chính sách bảo hành dài hạn và hỗ trợ tùy chỉnh kính theo nhu cầu cá nhân.',
    bgColor: '#e07941',
  },
];
const FeaturesSection = () => {
  return (
    <Box sx={{ py: 8, bgColor: '#f9fafb' }}>
      <Container>
        <Typography variant="h4" align="center" fontWeight="bold" mb={6}>
          Trải nghiệm mua sắm kính thông minh
        </Typography>

        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent="center"
          gap={4}
        >
          {features.map((feature, idx) => (
            <Box key={idx} flexBasis={{ xs: '100%', md: '30%' }}>
              <Card
                elevation={3}
                sx={{
                  height: '100%',
                  bgColor: 'white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  borderRadius: 2,
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        backgroundColor: feature.bgColor,
                        p: 2,
                        borderRadius: '50%',
                        display: 'inline-flex',
                      }}
                    >
                      {feature.icon}
                    </Box>
                  </Box>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};
export default FeaturesSection;
