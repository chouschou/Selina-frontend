// Tạo tên sản phẩm
export function generateProductName(category, index, id) {
  // const letter = String.fromCharCode(65 + index); // 65 là mã ASCII của 'A'
  const paddedID = id.toString().padStart(5, "0");
  // return `${category}  ${letter}${paddedID}`;
  return `${category}  GKS${paddedID}`;
}

export function generateProductCategoryName(category, material, shape) {
  const materialPart = material ? ` ${material.toLowerCase()}` : "";
  const shapePart = shape ? ` ${translateShapeToVietnamese(shape).toLowerCase()}` : "";
  return `${category}${materialPart}${shapePart}`;  
}

// Định dạng tiền VND
export function formatCurrencyVND(value) {
  return parseInt(value).toLocaleString("vi-VN") + " đ";
}

export const shapeDictionary = {
  square: "Hình vuông",
  rectangular: "Hình chữ nhật",
  oval: "Hình bầu dục",
  round: "Hình tròn",
  butterfly: "Hình bướm",
  "cat eye": "Hình mắt mèo",
  "cat-eye": "Hình mắt mèo", // để xử lý slug
  hexagonal: "Hình lục giác",
  octagonal: "Hình bát giác",
  wayfarer: "Wayfarer",
  aviator: "Aviator",
  other: "Khác",
};

// Chuyển hình dáng sang tiếng Việt
export function translateShapeToVietnamese(shape) {
  const dictionary = {
    square: "Hình vuông",
    rectangular: "Hình chữ nhật",
    oval: "Hình bầu dục",
    round: "Hình tròn",
    butterfly: "Hình bướm",
    "cat eye": "Hình mắt mèo",
    "cat-eye": "Hình mắt mèo", // đề phòng format slug
    hexagonal: "Hình lục giác",
    octagonal: "Hình bát giác",
    wayfarer: "Wayfarer",
    aviator: "Aviator",
    other: "Khác",
  };

  return dictionary[shape.toLowerCase()] || shape;
}

// Format currency
export function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
}

//format orderid
export function formatOrderID(orderId, orderDate){
  // Tách phần ngày từ chuỗi "10:00, 11/05/2025"
  const datePart = orderDate.split(', ')[1]; // "11/05/2025"
  if (!datePart) return `ORD00000000${orderId}`; // fallback

  const [day, month, year] = datePart.split('/');

  return `ORD${day}${month}${year}${orderId}`;
}


export const COLOR_MAP = [
  { name: "Xám", hex: "#808080" },
  { name: "Đen", hex: "#000000" },
  { name: "Nâu", hex: "#A52A2A" },
  { name: "Vàng", hex: "#FFFF00" },
  { name: "Hồng", hex: "#FFC0CB" },
  { name: "Xanh dương", hex: "#0000FF" },
  { name: "Xanh lá", hex: "#008000" },
  { name: "Tím", hex: "#800080" },
  { name: "Đỏ", hex: "#FF0000" },
  { name: "Trắng", hex: "#FFFFFF" },
  { name: "Cam", hex: "#FFA500" },
  { name: "Bạc", hex: "#C0C0C0" },
  { name: "Khác", hex: "Khác" },
];

export const getColorNameFromHex = (hex) => {
  if (!hex) return "";
  const normalizedHex = hex.trim().toUpperCase();
  const color = COLOR_MAP.find((c) => c.hex.toUpperCase() === normalizedHex);
  return color?.name || hex; // Trả về mã hex nếu không tìm thấy tên
};


export function formatDateVN(dateString){
  const date = new Date(dateString);

  const day = date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return `${day}`;
}

// Order status data for formatting
export const statusData = {
  waiting: {
    label: "Chưa xác nhận",
    color: "warning",
  },
  confirmed: {
    label: "Đã xác nhận",
    color: "info",
  },
  shipping: {
    label: "Đang giao hàng",
    color: "primary",
  },
  completed: {
    label: "Hoàn thành",
    color: "success",
  },
  canceled: {
    label: "Đã hủy",
    color: "error",
  },
  returned: {
    label: "Đã trả hàng",
    color: "error",
  },
  refunded: {
    label: "Đã hoàn tiền",
    color: "info",
  },
  unrefunded: {
    label: "Chưa hoàn tiền",
    color: "warn",
  },
  paid: {
    label: "Đã thanh toán",
    color: "success",
  },
};
