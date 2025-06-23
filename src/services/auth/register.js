import * as httpRequest from "../../utils/httpRequest";

export const register = async (email, password) => {
  try {
    const response = await httpRequest.post("/auth/register", {
      Username: email,
      Password: password,
      Role_ID: 1,
    });
    console.log("register response:", response);
    return response;
  } catch (error) {
    console.log("register error response:", error.response.data.message);
    throw error.response.data.message;
  }
};
