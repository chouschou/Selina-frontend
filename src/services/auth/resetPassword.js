import * as httpRequest from "../../utils/httpRequest";

export const resetPassword = async (token, password) => {
  try {
    const response = await httpRequest.post("/auth/reset-password", {
      token: token,
      password: password,
    });
    console.log("resetPassword response:", response);
    return response;
  } catch (error) {
    console.log("resetPassword error response:", error.response.data.message);
    throw error.response.data.message;
  }
};
