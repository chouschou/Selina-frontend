
// depth = 3 -> wards
// export const getLongitudeLatitude = async (province) => {
//   try {
//     const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${province}&format=json`)
//     return response.data
//   } catch (error) {
//     console.log('Failed to get Longitude Latitude', error)
//   }
// }
import * as httpRequest from '../utils/httpRequest'
export const getLongitudeLatitude = async (province) => {
  try {
    const response = await httpRequest.get(`/geocode?q=${province}`);
    console.log('getLongitudeLatitude response', response);
    return response;
  } catch (error) {
    console.log('Failed to get Longitude Latitude', error);
  }
};
