import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles"

const CustomTextField = styled(TextField)({
    "& .MuiOutlinedInput-input": {
      padding: "10px",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#19A171",
      },
      "&:hover fieldset": {
        borderColor: "#13835B",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#13835B",
      },
    },
  });

export default CustomTextField