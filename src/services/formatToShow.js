// Tạo tên sản phẩm
export function generateProductName(category, index, id) {
  const letter = String.fromCharCode(65 + index); // 65 là mã ASCII của 'A'
  const paddedID = id.toString().padStart(5, "0");
  return `${category}  ${letter}${paddedID}`;
}

// Định dạng tiền VND
export function formatCurrencyVND(value) {
  return parseInt(value).toLocaleString("vi-VN") + " đ";
}

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


const COLOR_MAP = [
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
];

export const getColorNameFromHex = (hex) => {
  if (!hex) return "";
  const normalizedHex = hex.trim().toUpperCase();
  const color = COLOR_MAP.find((c) => c.hex.toUpperCase() === normalizedHex);
  return color?.name || hex; // Trả về mã hex nếu không tìm thấy tên
};
