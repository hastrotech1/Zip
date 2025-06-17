// Description: Utility functions for storing and retrieving authentication tokens in localStorage.
const storeTokens = (
  accessToken: string,
  refreshToken: string,
  user_id: string | null,
  driver_id: string | null,
  email: string | null,
  name: string | null,
  picture: string | null
) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  if (picture) localStorage.setItem("picture", picture);
  if (email) localStorage.setItem("user_mail", email);
  if (name) localStorage.setItem("first_name", name);
  if (user_id) localStorage.setItem("user_id", user_id);
  if (driver_id) localStorage.setItem("driver_id", driver_id);
};

const getToken = (value: string): string | null => {
  return localStorage.getItem(value);
};

export default {
  storeTokens,
  getToken,
};
