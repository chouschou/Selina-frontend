const colorNameList = [
  { name: "gray", hex: "#808080" },
  { name: "black", hex: "#000000" },
  { name: "brown", hex: "#A52A2A" },
  { name: "yellow", hex: "#FFFF00" },
  { name: "pink", hex: "#FFC0CB" },
  { name: "blue", hex: "#0000FF" },
  { name: "green", hex: "#008000" },
  { name: "purple", hex: "#800080" },
  { name: "red", hex: "#FF0000" },
  { name: "white", hex: "#FFFFFF" },
  { name: "orange", hex: "#FFA500" },
  { name: "silver", hex: "#C0C0C0" },
];


function hexToColorName(hex) {
  const match = colorNameList.find(color => color.hex.toLowerCase() === hex.toLowerCase());
  return match ? match.name.toLowerCase() : hex;
}
export default hexToColorName;