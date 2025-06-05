import React from 'react';
import { Radio, RadioGroup, FormControl, FormControlLabel, FormLabel } from '@mui/material';

const ProductTypeSelector = ({ value, onChange }) => {
  return (
    <FormControl component="fieldset" fullWidth margin="normal" sx={{ mb: 2 }}>
      <FormLabel component="legend" style={{ color: "#bc5700"}}>Phân loại <span style={{ color: 'red' }}>*</span></FormLabel>
      <RadioGroup
        value={value}
        onChange={(e) => onChange(e.target.value)}
        row
         
      >
        <FormControlLabel
          value="gongKinh"
          control={<Radio />}
          label="Gọng kính"
          sx={{ marginRight: '40px' }}
        />
        <FormControlLabel
          value="kinhMat"
          control={<Radio />}
          label="Kính mát"
        />
      </RadioGroup>
    </FormControl>
  );
};

export default ProductTypeSelector;
