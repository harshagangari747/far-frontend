import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";
import { apiUrl } from "../api/apiurl";

const MyInterests = () => {
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const emailId = localStorage.getItem("emailId");

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const cachedIds = JSON.parse(
          localStorage.getItem("myInterests") || "[]"
        );
        const cachedListings = JSON.parse(
          localStorage.getItem("listings") || "[]"
        );

        // Try to resolve listings from global cache
        const resolvedListings = cachedIds
          .map((id) => cachedListings.find((l) => l.listingId === id))
          .filter(Boolean);

        if (
          resolvedListings.length === cachedIds.length &&
          resolvedListings.length > 0
        ) {
          setInterests(resolvedListings);
          return;
        }

        // If cache incomplete, fetch from API

        if (emailId) {
          setLoading(true);
          const res = await axios.get(
            `${apiUrl}/interests?emailId=${emailId}&choice=interest`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
            }
          );

          if (res.status == 401) {
            setLoading(false);

            setErrorMsg("Please Login to view your interests.");
          }
          const listings = res.data?.data?.listings || [];

          // Merge with global 'listings' cache
          const listingsMap = new Map(
            cachedListings.map((l) => [l.listingId, l])
          );
          listings.forEach((l) => listingsMap.set(l.listingId, l));
          const updatedListings = Array.from(listingsMap.values());
          localStorage.setItem("listings", JSON.stringify(updatedListings));

          // Update interest ID cache
          const interestIds = listings.map((l) => l.listingId);
          localStorage.setItem("myInterests", JSON.stringify(interestIds));

          setInterests(listings);
        } else {
          setErrorMsg("Please Login to view your interests.");
        }
      } catch (err) {
        console.error("Error fetching interests:", err);
        setErrorMsg("Failed to fetch interests. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (emailId) {
      fetchInterests();
    } else {
      setErrorMsg("Please Login to view your interests.");
    }
  }, [emailId]);

  const handleView = (listing) => {
    localStorage.setItem("selectedListing", JSON.stringify(listing));
    window.location.href = `/listing/${listing.listingId}`;
  };

  function handleRefreshClick() {
    localStorage.removeItem("myInterests");
    window.location.reload();
  }

  return (
    <div className="min-h-screen p-6">
      <NavBar />
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md mt-6">
        <div className="flex flex-row justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-orange-400">Interests</h2>
          <button className="text-xl px-0 py-0" onClick={handleRefreshClick}>
            🔄
          </button>
        </div>
        {loading && <div className="text-center mt-10">Loading...</div>}
        {errorMsg && !loading && (
          <div className="text-red-500 font-semibold text-center text-xl py-10">
            {errorMsg}
          </div>
        )}
        {!interests.length && !errorMsg && !loading && (
          <div className="text-red-500 font-semibold text-center text-xl py-10">
            No interests found.
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
          {interests.map((listing) => (
            <div
              key={listing.listingId}
              className="relative border border-orange-300 rounded-lg shadow-md p-4 bg-white"
            >
              {/* View Button */}
              <button
                onClick={() => handleView(listing)}
                className="absolute top-3 right-3 bg-orange-400 text-white px-3 py-1 text-sm rounded hover:bg-orange-500"
              >
                View
              </button>

              <h3 className="text-xl font-semibold text-orange-600 mb-2">
                {listing.area}, {listing.district}
              </h3>
              <p>
                <span className="font-bold">BHK:</span> {listing.bhk}
              </p>
              <p>
                <span className="font-bold">Rent:</span> ₹{listing.rpm}
              </p>
              <p>
                <span className="font-bold">Available From:</span>{" "}
                {listing.dateAvailable}
              </p>
              <p>
                <span className="font-bold">Owner:</span> {listing.ownerId}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {listing.rentalInformation?.address}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyInterests;
