// File: src/pages/MyListings.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import { deleteListing } from "../api/listing";
import { apiUrl } from "../api/apiurl";

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [messages, setMessages] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const email = localStorage.getItem("emailId");

  useEffect(() => {
    setLoading(true);

    const myListingIds = JSON.parse(localStorage.getItem("myListings") || "[]");
    const cachedListings = JSON.parse(localStorage.getItem("listings") || "[]");

    // Resolve listings
    const resolved = myListingIds
      .map((id) => cachedListings.find((l) => l.listingId === id))
      .filter(Boolean);

    if (resolved.length === myListingIds.length && resolved.length > 0) {
      setListings(resolved);
      setLoading(false);
    } else {
      fetchListingsFromAPI();
    }
  }, []);

  const fetchListingsFromAPI = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}/listings/owner?emailId=${email}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      const fetched = res.data.data;

      if (!fetched || fetched.length === 0) {
        setMessages("No listings found.");
        setError("");
        return;
      }
      const listingIds = fetched.map((l) => l.listingId);

      // Merge with global cache and deduplicate
      const existing = JSON.parse(localStorage.getItem("listings") || "[]");
      const merged = [
        ...fetched,
        ...existing.filter((c) => !listingIds.includes(c.listingId)),
      ];

      localStorage.setItem("listings", JSON.stringify(merged));
      localStorage.setItem("myListings", JSON.stringify(listingIds));
      setListings(fetched);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Please Login to view your listings.");
        return;
      }
      setError("Failed to load listings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown-cell")) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleView = (listingId) => {
    navigate(`/listing/${listingId}`);
  };

  const handleEdit = (listing) => {
    localStorage.setItem("selectedListing", JSON.stringify(listing));
    navigate(`/owner/listing/edit/${listing.listingId}`);
  };

  const handleDeleteListing = async (listingId, ownerId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this listing?"
    );
    if (!confirmDelete) return;

    try {
      const message = await deleteListing(listingId, ownerId);

      alert(
        message +
          "\nPlease refresh the page if the listing does not disappear automatically."
      );
      navigate("/owner/listings");
    } catch (error) {
      alert(error.message || "Failed to delete listing.");
    }
  };

  function handleRefresh() {
    localStorage.removeItem("myListings");
    localStorage.removeItem("listings");
    window.location.reload();
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Navbar />
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md mt-6">
        <div className="flex flex-row justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-orange-400">Listings</h2>
          <button className="text-xl px-0 py-0" onClick={handleRefresh}>
            🔄
          </button>
        </div>
        <div className="flex justify-end mb-4">
          {!error && (
            <button
              onClick={() => navigate("/add-listing")}
              className="mb-4 px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-600 transition"
            >
              + Add Listing
            </button>
          )}
        </div>
        <table className="w-full text-left text-sm">
          <thead className="border-b-2 border-gray-300">
            <tr className="text-gray-600">
              <th className="py-2">BHK</th>
              <th className="py-2">Rent</th>
              <th className="py-2">Area</th>
              <th className="py-2">District</th>
              <th className="py-2">State</th>
              <th className="py-2">Date Available</th>
              <th className="py-2 text-center">Manage</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((listing) => (
              <tr
                key={listing.listingId}
                className="border-t border-gray-200 hover:bg-orange-50"
              >
                <td className="py-3">{listing.bhk}</td>
                <td className="py-3">₹{listing.rpm}</td>
                <td className="py-3">{listing.area}</td>
                <td className="py-3">{listing.district}</td>
                <td className="py-3">{listing.state}</td>
                <td className="py-3">
                  {new Date(listing.dateAvailable).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="py-3 text-center relative">
                  <button
                    className="text-orange-400 font-semibold hover:underline"
                    onClick={(e) => {
                      e.stopPropagation(); // prevents bubbling to document
                      setActiveDropdown((prev) =>
                        prev === listing.listingId ? null : listing.listingId
                      );
                    }}
                  >
                    Manage
                  </button>
                  {activeDropdown === listing.listingId && (
                    <ul className="absolute bg-white shadow-lg border rounded mt-1 right-0 w-28 text-sm z-10">
                      <li className="px-3 py-1 hover:bg-orange-100 cursor-pointer">
                        <button
                          onClick={() => {
                            handleView(listing.listingId);
                            setActiveDropdown(null); // hide after click
                          }}
                        >
                          View
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleEdit(listing)}>
                          Edit
                        </button>
                      </li>

                      <li>
                        <button
                          onClick={() =>
                            handleDeleteListing(
                              listing.listingId,
                              listing.ownerId
                            )
                          }
                        >
                          Delete
                        </button>
                      </li>
                    </ul>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {error && (
          <div className="text-red-500 font-semibold text-center text-xl py-10">
            {error}
          </div>
        )}
        {messages && (
          <div className="text-red-600 text-center py-10">{messages}</div>
        )}
        {loading && <div className="text-center mt-10">Loading...</div>}
      </div>
    </div>
  );
};

export default MyListings;
