import { apiUrl } from "./apiurl";
export const fetchListings = async (filters) => {
  const { state, district, area, bhk, rpm, occupantType } = filters;

  const queryParams = new URLSearchParams();
  if (state) queryParams.append("state", state);
  if (district) queryParams.append("district", district);
  if (area) queryParams.append("area", area);
  if (bhk) queryParams.append("bhk", bhk);
  if (rpm) queryParams.append("rpm", rpm);
  if (occupantType?.length === 1)
    queryParams.append("occupantType", occupantType[0]);

  console.log("hitting api");
  const url = `${apiUrl}/search?${queryParams.toString()}`;

  try {
    const response = await fetch(url);

    console.log("Response status:", response);
    const statusCode = response.status;
    const text = await response.text();
    let parsed;

    try {
      parsed = JSON.parse(text);
      console.log("parsed", parsed);
    } catch {
      return { data: [], error: "Invalid response from server." };
    }

    if (statusCode === 200 && parsed.result) {
      return { data: parsed.result, error: null };
    } else {
      return { data: [], error: parsed.message || "No listings found." };
    }
  } catch (error) {
    return { data: [], error: error.message || "Failed to fetch listings." };
  }
};

//Delete Listing
// src/api/listing.js
import axios from "axios";

/**
 * Delete a listing using listingId and ownerId
 * @param {string} listingId - The ID of the listing
 * @param {string} ownerId - The owner ID of the listing
 * @returns {Promise<string>} - A success message
 * @throws {Error} - On failure
 */
export const deleteListing = async (listingId, ownerId) => {
  try {
    const response = await axios.delete(`${apiUrl}/listings`, {
      params: { listingId, ownerId },
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
      },
    });

    if (response.status === 200) {
      return response.data.message;
    } else {
      throw new Error("Unexpected status code");
    }
  } catch (err) {
    const msg =
      err.response?.data?.message || "Failed to delete listing. Try again.";
    throw new Error(msg);
  }
};
