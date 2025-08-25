//handles JWT and error
const VITE_API_URL = import.meta.env.VITE_API_URL;
/**
 *
 * @param {*} url the path to the API after /api/
 * @param {*} options for request method and other options not here
 * @param {*} content_type for the content type, forms with image should be multipart data
 * @returns
 */

export const myFetch = async (
  url,
  options = {},
  user = {},
  content_type = "application/json",
) => {
  const response = await fetch(VITE_API_URL + url, {
    headers: {
      ...(content_type ? { "Content-Type": content_type } : {}),
      ...(user ? { Authorization: `Bearer ${user.token}` } : {}), 
    },
    mode: "cors",
    ...options, 
  });
  const data = await response.json();
  if (response.ok) return data; 
  if (response.status == 401 && data.error == "TokenExpiredError") {
    throw new Error("Token has expired. Please login again.");
  } else {
    throw new Error(data.error || "Failied to fetch data");
  }
};