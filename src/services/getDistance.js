import axios from "axios";
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Bán kính Trái Đất (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const getDistance = async (lng1, lat1, lng2, lat2) => {
  try {
    console.log("lng1, lat1, lng2, lat2:", lng1, lat1, lng2, lat2);
    const response = await axios.post(
      "https://api.openrouteservice.org/v2/matrix/driving-car",
      // `https://api.openrouteservice.org/v2/matrix/foot-walking`,
      // `https://api.openrouteservice.org/v2/matrix/cycling-regular`,
      {
        locations: [
          [lng1, lat1],
          [lng2, lat2],
        ],
        metrics: ["distance"],
        sources: [0],
        destinations: [1],
      },
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_OPENROUTESERVICE_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(
      "response - getDistance:",
      JSON.stringify(response.data, null, 2)
    );
    const distanceInMeters = response.data.distances?.[0]?.[0]; // Do dùng sources: [0], destinations: [1]

    if (!distanceInMeters) {
      console.warn("ORS trả về null, dùng khoảng cách đường thẳng thay thế.");
      return calculateHaversineDistance(lat1, lng1, lat2, lng2); // đơn vị: km
    }
    else return distanceInMeters ? distanceInMeters / 1000 : null;
  } catch (error) {
    console.log("Failed to get distance", error.response?.data || error);
  }
};
