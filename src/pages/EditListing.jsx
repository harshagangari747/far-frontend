// EditListing.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ListingForm from "./ListingForm";
import axios from "axios";
import { apiUrl } from "../api/apiurl";

const EditListing = () => {
  const { listingId } = useParams();
  const [listingData, setListingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [error, setError] = useState(null);

  // Fetch listing data from selectedListing in localStorage
  useEffect(() => {
    const fetchListing = () => {
      try {
        const cachedListing = JSON.parse(
          localStorage.getItem("selectedListing")
        );
        if (cachedListing?.listingId === listingId) {
          setListingData(cachedListing);
        }
      } catch (error) {
        console.error("Error fetching cached listing:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId]);

  // Handle edit form submission
  const handleSubmit = async (formData, imageFile) => {
    const emailId = localStorage.getItem("emailId");
    if (!emailId) {
      alert("User not logged in.");
      return;
    }

    const payload = { emailId, ...formData };

    const form = new FormData();
    form.append(
      "rentalInfo",
      new Blob([JSON.stringify(payload)], { type: "application/json" })
    );

    if (imageFile && imageFile.length > 0) {
      imageFile.forEach((file) => {
        form.append("homeTour", file, file.name);
      });
    }

    try {
      setLoading(true);
      setShowModal(true);
      setModalMessage("Updating listing...");
      const response = await axios.put(`${apiUrl}/listings`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        timeout: 40000,
      });

      if (response.status === 200) {
        ("setting response to 200 and setting modal to true");
        setShowModal(true);
        setModalMessage("Listing updated successfully!");

        "Response data:", response.data;
        "form", typeof form, form;

        const updatedListing = response.data.listing;
        "Updated listing:", response;
        const updatedId = listingId;
        "Updated listing ID:", updatedId;

        // Update global 'listings' cache
        const globalListings =
          JSON.parse(localStorage.getItem("listings")) || [];
        const updatedGlobalListings = globalListings.map((l) =>
          l.listingId === updatedId ? updatedListing : l
        );

        localStorage.setItem("listings", JSON.stringify(updatedGlobalListings));
        "modal status", showModal;
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // alert("Unauthorized access. Please log in again.");
        setError(true);
        setShowModal(true);
        setModalMessage("Unauthorized access. Please log in again.");
        console.error("Unauthorized access:", err);
        return;
      }
      console.error("Error updating listing:", err);
      setError(true);
      setShowModal(true);
      setModalMessage("Failed to update listing. Please try again.");
      // alert("An error occurred while updating the listing.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError(null);
    setTimeout(() => {
      window.location.href = "/owner/listings";
    }, 500);
  };

  return (
    <>
      {showModal && (
        <div>
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
          <div className="fixed inset-0 z-10 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4">
                {error ? "Error" : loading ? "" : "Success"}
              </h2>
              <p>{modalMessage}</p>
              {!loading && (
                <button
                  onClick={handleCloseModal}
                  className="mt-4 px-4 py-2 bg-orange-400 text-white rounded float-end"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      <ListingForm
        mode="edit"
        initialData={listingData}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default EditListing;
