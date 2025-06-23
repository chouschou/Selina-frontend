import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';

import SecurityIcon from '@mui/icons-material/Security';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LockIcon from '@mui/icons-material/Lock';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const PolicyPage = () => {
  const policies = [
    {
      title: 'Chính sách bảo hành',
      icon: <SecurityIcon color="primary" />,
      content: [
        'Bảo hành 12 tháng cho tất cả sản phẩm kính mắt',
        'Bảo hành 6 tháng cho phụ kiện và gọng kính',
        'Miễn phí thay thế trong 30 ngày đầu nếu có lỗi từ nhà sản xuất',
        'Hỗ trợ sửa chữa miễn phí trong thời gian bảo hành',
        'Bảo hành không áp dụng cho hư hỏng do tác động vật lý'
      ]
    },
    {
      title: 'Chính sách đổi trả',
      icon: <AutorenewIcon color="secondary" />,
      content: [
        'Đổi trả trong vòng 7 ngày kể từ ngày nhận hàng',
        'Sản phẩm phải còn nguyên vẹn, chưa sử dụng',
        'Giữ nguyên bao bì, hóa đơn và phụ kiện đi kèm',
        'Miễn phí đổi size hoặc màu sắc trong 3 ngày đầu',
        'Hoàn tiền 100% nếu sản phẩm có lỗi từ nhà sản xuất'
      ]
    },
    {
      title: 'Chính sách vận chuyển',
      icon: <LocalShippingIcon sx={{ color: 'orange' }} />,
      content: [
        'Miễn phí vận chuyển cho đơn hàng từ 500.000đ',
        'Giao hàng trong 1-3 ngày làm việc tại TP.Đà Nẵng',
        'Giao hàng trong 3-7 ngày làm việc tại các tỉnh thành khác',
        'Hỗ trợ giao hàng nhanh trong ngày (phí 50.000đ)',
        'Đóng gói cẩn thận với hộp bảo vệ chuyên dụng'
      ]
    },
    {
      title: 'Chính sách thanh toán',
      icon: <CreditCardIcon sx={{ color: 'green' }} />,
      content: [
        'Thanh toán khi nhận hàng (COD)',
        'Chuyển khoản ngân hàng',
        'Thanh toán qua ví điện tử (MoMo, ZaloPay)',
        'Thanh toán bằng thẻ tín dụng/ghi nợ',
        'Hỗ trợ trả góp 0% lãi suất cho đơn hàng từ 2.000.000đ'
      ]
    },
    {
      title: 'Chính sách bảo mật',
      icon: <LockIcon sx={{ color: 'purple' }} />,
      content: [
        'Bảo mật tuyệt đối thông tin cá nhân của khách hàng',
        'Không chia sẻ thông tin với bên thứ ba',
        'Mã hóa dữ liệu thanh toán theo tiêu chuẩn quốc tế',
        'Hệ thống bảo mật SSL 256-bit',
        'Tuân thủ nghiêm ngặt luật bảo vệ dữ liệu cá nhân'
      ]
    },
    {
      title: 'Chính sách thành viên',
      icon: <VerifiedUserIcon sx={{ color: 'blue' }} />,
      content: [
        'Tích điểm với mỗi giao dịch mua hàng',
        'Ưu đãi đặc biệt cho thành viên VIP',
        'Sinh nhật được tặng voucher giảm giá 20%',
        'Thông báo sớm về các chương trình khuyến mãi',
        'Hỗ trợ tư vấn 24/7 cho thành viên'
      ]
    }
  ];

  return (
    <Box sx={{ py: 6, backgroundColor: '#f9fafb', minHeight: '100vh', paddingTop: '100px' }}>
      <Container maxWidth="lg">
        <Box textAlign="center" mb={6}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Chính sách của SELINA
          </Typography>
          <Typography variant="body1" color="text.secondary" maxWidth="600px" mx="auto">
            Chúng tôi cam kết mang đến cho khách hàng những chính sách minh bạch, công bằng và 
            dịch vụ tốt nhất. Dưới đây là các chính sách chi tiết của Selina.
          </Typography>
        </Box>

        <Box display={'flex'} flexWrap="wrap"  gap={4} justifyContent="center">
          {policies.map((policy, index) => (
            <Box flexBasis={{ xs: '100%', md: '30%' }}  key={index}>
              <Card
                elevation={3}
                sx={{
                  height: '100%',
                  border: '1px solid #e0e0e0',
                  transition: '0.3s',
                  '&:hover': {
                    boxShadow: 3,
                  },
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Box mr={2}>{policy.icon}</Box>
                    <Typography variant="h6" fontWeight="bold">
                      {policy.title}
                    </Typography>
                  </Box>
                  <List dense>
                    {policy.content.map((text, idx) => (
                      <ListItem key={idx} sx={{ pl: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon fontSize="small" color="success" />
                        </ListItemIcon>
                        <ListItemText primary={text} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>

        <Paper sx={{ mt: 6, p: 3, backgroundColor: '#FFF3E0', border: '1px solid #FFCC80' }} elevation={0}>
          <Box display="flex" alignItems="flex-start">
            <ErrorOutlineIcon sx={{ color: 'orange', mr: 2, mt: 0.5 }} />
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: 'orange' }}>
                Lưu ý quan trọng
              </Typography>
              <Typography variant="body2" sx={{ color: 'orange' }}>
                • Vui lòng đọc kỹ các chính sách trước khi đặt hàng<br />
                • Mọi thắc mắc về chính sách, vui lòng liên hệ hotline: <strong>1900 1234</strong><br />
                • Chính sách có thể thay đổi mà không cần báo trước, phiên bản mới nhất sẽ được cập nhật trên website
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper sx={{ mt: 3, p: 3, backgroundColor: '#E3F2FD', border: '1px solid #90CAF9' }} elevation={0}>
          <Box display="flex" alignItems="flex-start">
            <InfoOutlinedIcon sx={{ color: 'blue', mr: 2, mt: 0.5 }} />
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: 'blue' }}>
                Thông tin liên hệ
              </Typography>
              <Typography variant="body2" sx={{ color: 'blue' }}>
                <strong>Địa chỉ:</strong> 123 Lê Duẩn, TP. Đà Nẵng<br />
                <strong>Hotline:</strong> 1900 1234 (8:00 - 22:00 hàng ngày)<br />
                <strong>Email:</strong> support@selina.com
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default PolicyPage;
