
// depth = 1 -> province
// depth = 2 -> district

import axios from "axios"

// depth = 3 -> wards
export const getProvinces = async (depth) => {
  try {
    const response = await axios.get(`https://provinces.open-api.vn/api/?depth=${depth}`)
    return response.data
  } catch (error) {
    console.log('Failed to get all Provinces', error)
  }
}