import { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";
import { apiUrl } from "../api/apiurl";

const Matches = () => {
  const [listings, setListings] = useState([]);
  const [matchesMap, setMatchesMap] = useState({});
  const [expanded, setExpanded] = useState(null);
  const [loadingListingId, setLoadingListingId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const emailId = localStorage.getItem("emailId");

  useEffect(() => {
    setLoading(true);
    const fetchListings = async () => {
      if (!emailId) {
        setError("Please login to view your matches.");
        setLoading(false);
        return;
      }

      let myListingIds = JSON.parse(localStorage.getItem("myListings") || "[]");
      let cachedListings = JSON.parse(localStorage.getItem("listings") || "[]");

      // If cache is empty, fetch from backend
      if (myListingIds.length === 0 || cachedListings.length === 0) {
        try {
          const response = await axios.get(
            `${apiUrl}/listings/owner?emailId=${emailId}`,
            {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem(
                  "access_token"
                )}`,
              },
            }
          );

          const listings = response.data.data || [];
          console.log("Fetched listings for Matches:", listings);
          if (!listings || listings.length === 0) {
            setError("No listings found.");
            return;
          }
          const listingIds = listings.map((l) => l.listingId);
          localStorage.setItem("listings", JSON.stringify(listings));
          localStorage.setItem("myListings", JSON.stringify(listingIds));

          myListingIds = listingIds;
          cachedListings = listings;
        } catch (err) {
          console.error("Failed to fetch listings for Matches", err);
          setError("Failed to fetch listings. Please try again later.");
          return;
        } finally {
          setLoading(false);
        }
      }

      const resolved = myListingIds
        .map((id) => cachedListings.find((l) => l.listingId === id))
        .filter(Boolean);

      setListings(resolved);
    };

    fetchListings();
    setLoading(false);
  }, []);

  const toggleMatches = async (listingId) => {
    if (expanded === listingId) {
      setExpanded(null);
      return;
    }

    if (matchesMap[listingId]) {
      setExpanded(listingId);
      return;
    }

    try {
      setLoadingListingId(listingId);
      const response = await axios.get(
        `${apiUrl}/interests?choice=match&emailId=${emailId}&listingId=${listingId}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        }
      );
      var matches = response.data.data || [];
      console.log("Matches fetched successfully", matches);
      if (!matches || matches.length === 0) {
        matches = ["No matches found"];
        setExpanded(listingId);
        return;
      }
      const tenantIds = matches.tenant_ids;

      setMatchesMap((prev) => ({ ...prev, [listingId]: tenantIds }));
      setExpanded(listingId);
    } catch (error) {
      console.error("Failed to fetch matches", error);
      alert("Failed to fetch matches. Try again later.");
    } finally {
      setLoadingListingId(null);
    }
  };

  const fetchUserDetails = async (tenantId) => {
    try {
      const response = await axios.get(`${apiUrl}/profile?userId=${tenantId}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
      });
      console.log("User details fetched successfully", response.data.data);
      console.log("match response", response);
      return response.data;
    } catch (err) {
      console.error("Failed to fetch user details", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = async (tenantId) => {
    setModalLoading(true);
    try {
      const user = await fetchUserDetails(tenantId);
      setSelectedUser(user.data[0]);
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching user details", err);
      alert("Failed to load user details.");
    } finally {
      setModalLoading(false);
    }
  };

  function handleRefreshClick() {
    localStorage.removeItem("myListings");
    localStorage.removeItem("listings");
    window.location.reload();
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <NavBar />
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md mt-6">
        <div className="flex flex-row justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-orange-400">Matches</h2>
          <button className="text-xl px-0 py-0" onClick={handleRefreshClick}>
            🔄
          </button>
        </div>
        {error && (
          <div>
            <p className="text-red-500 font-semibold text-center text-xl">
              {error}
            </p>
          </div>
        )}
        {loading && <div className="text-center mt-10">Loading...</div>}

        {listings.map((listing) => (
          <div
            key={listing.listingId}
            className="bg-orange-50 rounded-xl shadow p-4 mb-6 text-sm"
          >
            <div className="flex flex-wrap gap-4  font-medium">
              <div>
                <span>
                  <strong>ListingId: {listing.listingId}</strong>
                </span>
                <br />
                <span>
                  <b>BHK: </b> {listing.bhk}
                </span>
                <br />
                <span>
                  <b>Rent:</b> ₹{listing.rpm}
                </span>
                <br />
                <span>
                  <b>Area: </b>
                  {listing.area}
                </span>
                <br />
                <span>
                  <b>District:</b> {listing.district}
                </span>
                <br />
                <span>
                  <b>State:</b> {listing.state}
                </span>
                <br />
                <span>
                  <b>Available: </b>
                  {new Date(listing.dateAvailable).toDateString()}
                </span>
              </div>
            </div>

            <button
              className="mt-3 text-orange-400 border border-orange-400 focus:border focus:border-l-orange-400"
              onClick={() => toggleMatches(listing.listingId)}
              disabled={loadingListingId === listing.listingId}
            >
              {expanded === listing.listingId ? "Hide Matches" : "View Matches"}
            </button>

            {expanded === listing.listingId && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                {matchesMap[listing.listingId]?.length > 0 ? (
                  <div className="list-disc list-inside space-y-1">
                    {matchesMap[listing.listingId].map((tenantId) => (
                      <div key={tenantId}>
                        <button
                          onClick={() => handleViewUser(tenantId)}
                          className="text-orange-400 bg-white hover:underline hover:bg-orange-400 hover:text-white"
                        >
                          {tenantId}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No matches found</p>
                )}
              </div>
            )}
          </div>
        ))}

        {showModal && selectedUser && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Tenant Details</h2>

              {modalLoading ? (
                <p className="text-gray-500 italic">Loading...</p>
              ) : (
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {selectedUser.name}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {selectedUser.emailId}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {selectedUser.contact_num}
                  </p>
                </div>
              )}

              <button
                onClick={() => setShowModal(false)}
                className="mt-4 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;
