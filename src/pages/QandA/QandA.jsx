// FAQPage.jsx
import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Tab,
  Tabs,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PeopleIcon from "@mui/icons-material/People";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import CircleIcon from "@mui/icons-material/Circle";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import { Circle, Heart, Square } from "lucide-react";
import CommonTips from "./CommonTips";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`faq-tabpanel-${index}`}
      aria-labelledby={`faq-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const FAQPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [expanded, setExpanded] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : null);
  };

  const faceShapeGuide = {
    male: [
      {
        shape: "Khuôn mặt tròn",
        icon: <Circle size={24} className="text-blue-600" />,
        description:
          "Đặc điểm: Chiều dài và chiều rộng gần bằng nhau, đường viền mềm mại",
        recommendations: [
          "Kính vuông hoặc chữ nhật để tạo góc cạnh",
          "Gọng dày, có đường nét rõ ràng",
          "Tránh kính tròn hoặc oval",
          "Wayfarers và Clubmaster phù hợp",
        ],
        avoid: ["Kính tròn", "Gọng mỏng", "Kính quá nhỏ"],
      },
      {
        shape: "Khuôn mặt vuông",
        icon: <Square size={24} className="text-green-600" />,
        description: "Đặc điểm: Góc hàm rõ rệt, trán rộng, đường viền góc cạnh",
        recommendations: [
          "Kính tròn hoặc oval để làm mềm đường nét",
          "Gọng mỏng, không quá dày",
          "Aviator và kính phi công",
          "Kính rimless hoặc semi-rimless",
        ],
        avoid: ["Kính vuông lớn", "Gọng dày", "Đường nét góc cạnh"],
      },
      {
        shape: "Khuôn mặt oval",
        icon: (
          <div className="w-6 h-8 border-2 border-purple-600 rounded-full" />
        ),
        description:
          "Đặc điểm: Cân đối, chiều dài lớn hơn chiều rộng, đường cong nhẹ nhàng",
        recommendations: [
          "Hầu hết các kiểu kính đều phù hợp",
          "Wayfarers, Aviator, Round frames",
          "Có thể thử nghiệm nhiều style khác nhau",
          "Chọn kích thước phù hợp với tỷ lệ khuôn mặt",
        ],
        avoid: ["Kính quá lớn che mất đường nét tự nhiên"],
      },
      {
        shape: "Khuôn mặt trái tim",
        icon: <Heart size={24} className="text-red-600" />,
        description: "Đặc điểm: Trán rộng, cằm nhọn, phần rộng nhất ở vùng má",
        recommendations: [
          "Kính có phần dưới nặng hơn (bottom-heavy)",
          "Aviator với gọng dày phía dưới",
          "Rimless hoặc semi-rimless",
          "Kính oval nhỏ gọn",
        ],
        avoid: ["Cat-eye", "Kính có phần trên quá nặng", "Gọng dày phía trên"],
      },
    ],
    female: [
      {
        shape: "Khuôn mặt tròn",
        icon: <Circle size={24} className="text-pink-600" />,
        description: "Đặc điểm: Đường viền mềm mại, má đầy đặn, cằm tròn",
        recommendations: [
          "Cat-eye để tạo góc cạnh và kéo dài mặt",
          "Kính vuông hoặc geometric",
          "Gọng có màu sắc nổi bật",
          "Oversized frames với đường nét góc cạnh",
        ],
        avoid: ["Kính tròn nhỏ", "Gọng mỏng", "Màu sắc nhạt"],
      },
      {
        shape: "Khuôn mặt vuông",
        icon: <Square size={24} className="text-teal-600" />,
        description: "Đặc điểm: Góc hàm rõ ràng, đường viền thẳng, cằm vuông",
        recommendations: [
          "Kính tròn hoặc oval để làm mềm",
          "Cat-eye với đường cong nhẹ nhàng",
          "Gọng mỏng, thanh thoát",
          "Màu sắc pastel hoặc trong suốt",
        ],
        avoid: ["Kính vuông lớn", "Gọng dày đen", "Geometric frames"],
      },
      {
        shape: "Khuôn mặt oval",
        icon: (
          <div className="w-6 h-8 border-2 border-indigo-600 rounded-full" />
        ),
        description: "Đặc điểm: Khuôn mặt lý tưởng, cân đối và hài hòa",
        recommendations: [
          "Mọi kiểu kính đều phù hợp",
          "Cat-eye cho vẻ quyến rũ",
          "Round frames cho style vintage",
          "Oversized cho vẻ hiện đại",
        ],
        avoid: ["Kính quá nhỏ không cân đối"],
      },
      {
        shape: "Khuôn mặt trái tim",
        icon: <Heart size={24} className="text-rose-600" />,
        description: "Đặc điểm: Trán rộng, cằm nhọn, má cao",
        recommendations: [
          "Kính có phần dưới nặng",
          "Round frames để cân bằng",
          "Rimless hoặc semi-rimless",
          "Màu sắc nhẹ nhàng",
        ],
        avoid: ["Cat-eye quá sắc", "Kính có phần trên quá nặng"],
      },
    ],
  };

  const generalFAQs = [
    {
      question: "Làm thế nào để biết kính có phù hợp với mình không?",
      answer:
        "Bạn có thể sử dụng tính năng thử kính ảo trên website hoặc đến cửa hàng để thử trực tiếp. Kính phù hợp khi: không gây khó chịu khi đeo, không trượt xuống mũi, không để lại vết đỏ, và tạo cảm giác thoải mái khi nhìn.",
    },
    {
      question: "Tôi có thể đổi tròng kính theo độ của mình không?",
      answer:
        "Có, chúng tôi hỗ trợ thay tròng kính theo đơn thuốc của bạn. Vui lòng mang theo đơn thuốc từ bác sĩ nhãn khoa và chúng tôi sẽ tư vấn loại tròng phù hợp nhất.",
    },
    {
      question: "Thời gian bảo hành kính là bao lâu?",
      answer:
        "Tất cả sản phẩm kính mắt được bảo hành 12 tháng, gọng kính và phụ kiện bảo hành 6 tháng. Bảo hành bao gồm lỗi từ nhà sản xuất, không bao gồm hư hỏng do va đập.",
    },
    {
      question: "Có dịch vụ giao hàng tận nơi không?",
      answer:
        "Có, chúng tôi giao hàng toàn quốc. Miễn phí ship cho đơn từ 500k, giao trong 1-3 ngày tại TP.Đà Nẵng và 3-7 ngày tại các tỉnh khác.",
    },
    {
      question: "Tôi có thể thanh toán như thế nào?",
      answer:
        "Chúng tôi hỗ trợ nhiều hình thức: COD, chuyển khoản, ví điện tử (MoMo, ZaloPay), thẻ tín dụng. Có hỗ trợ trả góp 0% cho đơn từ 2 triệu.",
    },
    {
      question: "Kính chống ánh sáng xanh có thực sự hiệu quả?",
      answer:
        "Có, tròng chống ánh sáng xanh giúp giảm mỏi mắt khi sử dụng máy tính, điện thoại lâu. Đặc biệt hữu ích cho người làm việc với màn hình nhiều giờ trong ngày.",
    },
    {
      question: "Làm sao để vệ sinh và bảo quản kính đúng cách?",
      answer:
        "Dùng khăn microfiber chuyên dụng, nước rửa kính hoặc dung dịch vệ sinh nhẹ. Tránh dùng áo, khăn giấy. Bảo quản trong hộp khi không sử dụng, tránh để úp mặt tròng.",
    },
    {
      question: "Tôi có thể đặt kính theo yêu cầu riêng không?",
      answer:
        "Có, chúng tôi nhận đặt kính theo yêu cầu với nhiều lựa chọn về gọng, tròng, màu sắc. Thời gian hoàn thành 7-14 ngày tùy độ phức tạp.",
    },
  ];

  return (
    <Box sx={{ py: 8, backgroundColor: "#f9fafb", minHeight: "100vh", paddingTop: '100px' }}>
      <Container maxWidth="lg">
        <Typography variant="h4" align="center" gutterBottom fontWeight={600}>
          Câu hỏi thường gặp
        </Typography>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}
        >
          <Tab
            label="Quy tắc chọn kính"
            icon={<PeopleIcon />}
            iconPosition="start"
          />
          <Tab
            label="Câu hỏi chung"
            icon={<HelpOutlineIcon />}
            iconPosition="start"
          />
        </Tabs>

        {/* Tab 1: Hướng dẫn chọn kính */}
        <TabPanel value={tabValue} index={0}>
          <Box display="flex"
          flexWrap="wrap"
          justifyContent="center"
          gap={4}>
            {["male", "female"].map((gender) => (
              <Box flexBasis={{ xs: '100%', md: '48%' }} key={gender}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {gender === "male" ? "👨 Nam" : "👩 Nữ"}
                </Typography>
                {faceShapeGuide[gender].map((item, i) => (
                  <Card variant="outlined" sx={{ mb: 2 }} key={i}>
                    <CardContent>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        {item.icon}
                        <Typography
                          variant="subtitle1"
                          sx={{ ml: 1, fontWeight: 600 }}
                        >
                          {item.shape}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                      <Typography sx={{ mt: 1 }} fontWeight={600}>
                        Nên chọn:
                      </Typography>
                      {item.recommendations.map((rec, idx) => (
                        <Typography key={idx} variant="body2">
                          - {rec}
                        </Typography>
                      ))}
                      <Typography sx={{ mt: 1 }} fontWeight={600} color="error">
                        Tránh:
                      </Typography>
                      {item.avoid.map((av, idx) => (
                        <Typography key={idx} variant="body2">
                          - {av}
                        </Typography>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </Box>
            ))}
          </Box>
          {/* General Tips */}
          <CommonTips></CommonTips>
        </TabPanel>

        {/* Tab 2: FAQ */}
        <TabPanel value={tabValue} index={1}>
          {generalFAQs.map((faq, i) => (
            <Accordion
              key={i}
              expanded={expanded === `panel${i}`}
              onChange={handleAccordionChange(`panel${i}`)}
              sx={{ mb: 2 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </TabPanel>

        <Paper sx={{ mt: 6, p: 4, textAlign: "center", bgcolor: "#e3f2fd" }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Vẫn có thắc mắc?
          </Typography>
          <Typography variant="body2" mb={2}>
            Liên hệ với chúng tôi để được hỗ trợ
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Chip label="📞 Hotline: 1900 1234" variant="outlined" />
            <Chip label="📧 support@eyespot.com" variant="outlined" />
            <Chip label="💬 Chat trực tuyến 24/7" variant="outlined" />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default FAQPage;
