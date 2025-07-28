import React from "react";
import ListingForm from "./ListingForm";
import axios from "axios";
import { useState } from "react";
import { apiUrl } from "../api/apiurl";

const AddListing = () => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (formData, imageFile) => {
    const emailId = localStorage.getItem("emailId");
    if (!emailId) {
      alert("User not logged in.");
      return;
    }

    const payload = {
      emailId,
      ...formData,
    };

    const form = new FormData();
    form.append(
      "rentalInfo",
      new Blob([JSON.stringify(payload)], { type: "application/json" })
    );

    if (imageFile && imageFile.length > 0) {
      imageFile.forEach((file) => {
        form.append("homeTour", file);
      });
    }

    try {
      setLoading(true);
      setShowModal(true);
      setModalMessage("Adding listing... Please wait.");
      const response = await axios.post(`${apiUrl}/listings`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
      });
      console.log("Listing added successfully:", response);
      if (response.status === 201) {
        setShowModal(true);
        setModalMessage("Listing added successfully!");

        const newListing = response.data;
        console.log("updated response", response);
        console.log("New listing data:", newListing);
        const newListingId = newListing.listingId;
        console.log("New listing ID:", newListingId);

        // Step 1: Update the global 'listings' cache (full objects)
        const existingGlobalListings =
          JSON.parse(localStorage.getItem("listings")) || [];

        const updatedGlobalListings = [
          newListing,
          ...existingGlobalListings.filter((l) => l.listingId !== newListingId),
        ];
        localStorage.setItem("listings", JSON.stringify(updatedGlobalListings));

        // Step 2: Update 'myListings' cache (IDs only)
        const myListings = JSON.parse(localStorage.getItem("myListings")) || [];
        const updatedMyListings = myListings.includes(newListingId)
          ? myListings
          : [newListingId, ...myListings];
        localStorage.setItem("myListings", JSON.stringify(updatedMyListings));
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError(true);
        setShowModal(true);
        setModalMessage("Unauthorized access. Please log in again.");
        // alert("Unauthorized access. Please log in again.");
        console.error("Unauthorized access:", err);
        return;
      }
      console.error("Error adding listing:", err);
      // alert("Failed to add listing. Please try again.");
      setError(true);
      setShowModal(true);
      setModalMessage("Failed to add listing. Please try again.");
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
        initialData={null}
        onSubmit={handleSubmit}
        submitText="Add Listing"
      />
    </>
  );
};

export default AddListing;
