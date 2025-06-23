import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  TextField,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Facebook,
  Instagram,
  Twitter,
  YouTube,
  Phone,
  Email,
  LocationOn,
  AccessTime,
  Send,
  Visibility,
  LocalShipping,
  Security,
  Support,
} from "@mui/icons-material";
import "./Footer.scss";

const Footer = () => {
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Newsletter subscription");
  };

  return (
    <Box component="footer" className="footer">
      {/* Main Footer Content */}
      <Container maxWidth="lg" className="footer-content">
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box className="brand-section">
              <Typography variant="h4" className="brand-name">
                Selina
              </Typography>
              <Typography variant="body1" className="brand-slogan">
                Trải nghiệm kính thời trang theo cách của bạn!
              </Typography>
              <Typography variant="body2" className="brand-description">
                Chúng tôi mang đến những sản phẩm kính chất lượng cao với thiết
                kế thời trang, giúp bạn thể hiện phong cách riêng và bảo vệ đôi
                mắt một cách tốt nhất.
              </Typography>

              {/* Social Media */}
              <Box className="social-media">
                <Typography variant="subtitle2" className="social-title">
                  Kết nối với chúng tôi
                </Typography>
                <Box className="social-icons">
                  <IconButton
                    className="social-icon facebook"
                    aria-label="Facebook"
                  >
                    <Facebook />
                  </IconButton>
                  <IconButton
                    className="social-icon instagram"
                    aria-label="Instagram"
                  >
                    <Instagram />
                  </IconButton>
                  <IconButton
                    className="social-icon twitter"
                    aria-label="Twitter"
                  >
                    <Twitter />
                  </IconButton>
                  <IconButton
                    className="social-icon youtube"
                    aria-label="YouTube"
                  >
                    <YouTube />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Box className="footer-section">
              <Typography variant="h6" className="section-title">
                Sản phẩm
              </Typography>
              <List className="footer-links">
                <ListItem className="footer-link-item">
                  <Link href="/gong-kinh" className="footer-link">
                    Gọng kính
                  </Link>
                </ListItem>
                <ListItem className="footer-link-item">
                  <Link href="/kinh-mat" className="footer-link">
                    Kính mát
                  </Link>
                </ListItem>
                <ListItem className="footer-link-item">
                  <Link href="/kinh-tre-em" className="footer-link">
                    Kính trẻ em
                  </Link>
                </ListItem>
                <ListItem className="footer-link-item">
                  <Link href="/phu-kien" className="footer-link">
                    Phụ kiện
                  </Link>
                </ListItem>
                <ListItem className="footer-link-item">
                  <Link href="/sale" className="footer-link sale-link">
                    Khuyến mãi
                  </Link>
                </ListItem>
              </List>
            </Box>
          </Grid>

          {/* Customer Service */}
          <Grid item xs={12} sm={6} md={2}>
            <Box className="footer-section">
              <Typography variant="h6" className="section-title">
                Hỗ trợ
              </Typography>
              <List className="footer-links">
                <ListItem className="footer-link-item">
                  <Link href="/huong-dan-mua-hang" className="footer-link">
                    Hướng dẫn mua hàng
                  </Link>
                </ListItem>
                <ListItem className="footer-link-item">
                  <Link href="/chinh-sach-doi-tra" className="footer-link">
                    Chính sách đổi trả
                  </Link>
                </ListItem>
                <ListItem className="footer-link-item">
                  <Link href="/bao-hanh" className="footer-link">
                    Bảo hành
                  </Link>
                </ListItem>
                <ListItem className="footer-link-item">
                  <Link href="/van-chuyen" className="footer-link">
                    Vận chuyển
                  </Link>
                </ListItem>
                <ListItem className="footer-link-item">
                  <Link href="/faq" className="footer-link">
                    FAQ
                  </Link>
                </ListItem>
              </List>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={9}>
            <Box className="footer-section">
              <Typography variant="h6" className="section-title">
                Liên hệ
              </Typography>

              <List className="contact-info">
                <ListItem className="contact-item">
                  <ListItemIcon className="contact-icon">
                    <LocationOn />
                  </ListItemIcon>
                  <ListItemText
                    primary="Địa chỉ"
                    secondary="123 Đường Nguyễn Văn Cừ, Quận 1, TP.HCM"
                  />
                </ListItem>

                <ListItem className="contact-item">
                  <ListItemIcon className="contact-icon">
                    <Phone />
                  </ListItemIcon>
                  <ListItemText
                    primary="Hotline"
                    secondary="1900 1234 (Miễn phí)"
                  />
                </ListItem>

                <ListItem className="contact-item">
                  <ListItemIcon className="contact-icon">
                    <Email />
                  </ListItemIcon>
                  <ListItemText primary="Email" secondary="support@selina.vn" />
                </ListItem>

                <ListItem className="contact-item">
                  <ListItemIcon className="contact-icon">
                    <AccessTime />
                  </ListItemIcon>
                  <ListItemText
                    primary="Giờ làm việc"
                    secondary="8:00 - 22:00 (Thứ 2 - CN)"
                  />
                </ListItem>
              </List>

              {/* Newsletter */}
              {/* <Box className="newsletter">
                <Typography variant="subtitle2" className="newsletter-title">
                  Đăng ký nhận tin
                </Typography>
                <Typography variant="body2" className="newsletter-description">
                  Nhận thông tin về sản phẩm mới và ưu đãi đặc biệt
                </Typography>
                <Box component="form" onSubmit={handleNewsletterSubmit} className="newsletter-form">
                  <TextField
                    size="small"
                    placeholder="Nhập email của bạn"
                    variant="outlined"
                    className="newsletter-input"
                    fullWidth
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    className="newsletter-button"
                    endIcon={<Send />}
                  >
                    Đăng ký
                  </Button>
                </Box>
              </Box> */}

              {/* Features Section className="features-section" */}
              <Box> 
                <Container maxWidth="lg">
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box className="feature-item">
                        <Box className="feature-icon">
                          <Visibility />
                        </Box>
                        <Typography
                          variant="subtitle2"
                          className="feature-title"
                        >
                          Thử kính ảo
                        </Typography>
                        <Typography
                          variant="body2"
                          className="feature-description"
                        >
                          Công nghệ AR hiện đại
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <Box className="feature-item">
                        <Box className="feature-icon">
                          <LocalShipping />
                        </Box>
                        <Typography
                          variant="subtitle2"
                          className="feature-title"
                        >
                          Miễn phí vận chuyển
                        </Typography>
                        <Typography
                          variant="body2"
                          className="feature-description"
                        >
                          Đơn hàng từ 500k
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <Box className="feature-item">
                        <Box className="feature-icon">
                          <Security />
                        </Box>
                        <Typography
                          variant="subtitle2"
                          className="feature-title"
                        >
                          Bảo hành 12 tháng
                        </Typography>
                        <Typography
                          variant="body2"
                          className="feature-description"
                        >
                          Cam kết chất lượng
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <Box className="feature-item">
                        <Box className="feature-icon">
                          <Support />
                        </Box>
                        <Typography
                          variant="subtitle2"
                          className="feature-title"
                        >
                          Hỗ trợ 24/7
                        </Typography>
                        <Typography
                          variant="body2"
                          className="feature-description"
                        >
                          Tư vấn chuyên nghiệp
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Container>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Divider className="footer-divider" />

      {/* Bottom Footer */}
      <Box className="bottom-footer">
        <Container maxWidth="lg">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="body2" className="copyright">
                © 2024 Selina. Tất cả quyền được bảo lưu.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box className="footer-bottom-links">
                <Link href="/privacy-policy" className="bottom-link">
                  Chính sách bảo mật
                </Link>
                <Link href="/terms-of-service" className="bottom-link">
                  Điều khoản sử dụng
                </Link>
                <Link href="/sitemap" className="bottom-link">
                  Sơ đồ trang web
                </Link>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;
