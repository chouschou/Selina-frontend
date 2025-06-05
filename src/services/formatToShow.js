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
