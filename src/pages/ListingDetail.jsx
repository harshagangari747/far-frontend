import { useParams, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { ListingsContext } from "../context/listingContextObject";
import NavBar from "../components/NavBar";
import axios from "axios";
import ImageCarousel from "../components/ImageCarousel";
import { apiUrl } from "../api/apiurl";

const ListingDetail = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const { cachedResults } = useContext(ListingsContext);

  const [showModal, setShowModal] = useState(false);
  const [interestMessage, setInterestMessage] = useState("");
  const [responseStatus, setResponseStatus] = useState(null);

  // Try to find listing from context first
  let listing = cachedResults.find((l) => l.listingId === listingId);

  // If not in context, fallback to localStorage 'listings'
  if (!listing) {
    try {
      const listingsCacheStr = localStorage.getItem("listings");
      const listingsCacheJSON = listingsCacheStr
        ? JSON.parse(listingsCacheStr)
        : [];

      listing = listingsCacheJSON.find((l) => l.listingId === listingId);
    } catch (err) {
      console.error("Error parsing listings from localStorage:", err);
    }

    if (!listing) {
      return (
        <div className="min-h-screen bg-gray-50 p-6">
          <NavBar />
          <div className="min-h-screen flex items-center justify-center text-red-600">
            <div>
              <div>
                You are seeing this page because the listing id was not found.
                <br />
                Or it might have been deleted by the owner.
              </div>
              <div className="mt-4">
                <button
                  className="ml-2 bg-orange-400 text-white px-4 py-2 rounded hover:bg-orange-500"
                  onClick={() => navigate("/")}
                >
                  Go back
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  const { rentalInformation, leaseTerms } = listing;

  const handleShowInterest = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/interests`,
        {
          choice: "interest",
          emailId: localStorage.getItem("emailId"),
          listingId: listing.listingId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to post interest");
      }

      const data = response.data;

      setResponseStatus(200);

      setInterestMessage(
        `${data.message}. We let the owner know that you are interested in this listing.`
      );
      setShowModal(true);
      // Optional: show toast or UI confirmation
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setResponseStatus(error.response.status);
        setInterestMessage("Unauthorized access. Please log in again.");
        setShowModal(true);
      }
      setResponseStatus(400);
      console.error("Error posting interest:", error);
      // Optional: show error toast
    }
  };

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center space-y-4">
            <div>
              <button
                onClick={() => setShowModal(false)}
                className="bg-orange-400 float-end px-2 rounded-md py-0"
              >
                X
              </button>
            </div>
            {(responseStatus === 400 || responseStatus === 401) && (
              <div>
                <h2 className="text-lg font-semibold text-red-600">Failed</h2>
                <p>{interestMessage}</p>
              </div>
            )}
            {responseStatus === 200 && (
              <div>
                <h2 className="text-lg font-semibold text-green-600">
                  Success
                </h2>
                <p>{interestMessage}</p>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="min-h-screen bg-gray-50 p-6">
        <NavBar />
        <div className="min-h-screen bg-gray-50 justify-center px-4 py-10 flex">
          <div className="w-full max-w-5xl bg-white rounded-lg shadow-md p-6 space-y-8 flex-justify-center">
            {/* Title Block */}

            <div className="">
              <div>
                <button
                  className="bg-orange-400 text-white float-end"
                  onClick={handleShowInterest}
                >
                  + Interested
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 text-center gap-4">
              <div>
                <div className="text-lg font-bold text-gray-600">
                  Monthly Rent
                </div>
                <div className="text-2xl font-bold text-green-600">
                  ₹{listing.rpm}
                </div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-600">
                  Configuration
                </div>
                <div className="text-2xl font-bold text-green-700">
                  {listing.bhk} BHK
                </div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-600">
                  Occupant Type
                </div>
                <div className="text-2xl font-bold text-purple-600 capitalize">
                  {listing.occupantType ? listing.occupantType : "Any"}
                </div>
              </div>
            </div>

            {/* Rental Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <Info label="Area" value={listing.area} />
              <Info label="District" value={listing.district} />
              <Info label="State" value={listing.state} />
              <Info
                label="Pin Code"
                value={getPinCode(rentalInformation.address)}
              />
              <Info label="Date Available" value={listing.dateAvailable} />
              <Info label="Baths" value={rentalInformation.baths} />
              <Info label="Balconies" value={rentalInformation.balcony} />
              <Info label="Facing" value={rentalInformation.facing} />
              <Info label="Floor" value={rentalInformation.floor} />
              <Info
                label="Elevator"
                value={rentalInformation.hasElevator ? "Yes" : "No"}
              />
              <Info
                label="Borewell"
                value={rentalInformation.hasBorewell ? "Yes" : "No"}
              />
              <Info
                label="Max Occupants"
                value={rentalInformation.maxOccupants}
              />
              <Info
                label="Water Availability"
                value={rentalInformation.waterAvailability}
              />
            </div>

            <div className="mb-2">
              <span className="font-semibold">Contact Owner: </span>
              <label>{listing.ownerId}</label>
            </div>

            {/* Address */}
            <div className="bg-blue-50 p-4 text-sm text-gray-700 border rounded">
              <strong>Full Address:</strong>
              <br />
              {rentalInformation.address}
            </div>

            {/* Video Tour Placeholder */}
            <h2>
              <strong>Home Tour</strong>
            </h2>
            <div className=" flex w-full">
              <ImageCarousel images={listing.homeTour} />
            </div>

            {/* Utilities */}
            <TagList
              title="Utilities"
              items={rentalInformation.utilities}
              color="text-blue-600"
            />

            {/* Amenities */}
            <TagList
              title="Amenities"
              items={rentalInformation.amenities}
              color="text-green-600"
            />

            {/* Highlights */}
            <TagList
              title="Highlights"
              items={listing.highlights}
              color="text-orange-600"
            />

            {/* Lease Terms */}
            <div>
              <h2 className="text-lg font-semibold mb-2">Lease Terms</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <Info
                  label="Advance Amount"
                  value={`₹${leaseTerms.advanceAmount}`}
                />
                <Info
                  label="Lease Tenure"
                  value={`${leaseTerms.leaseTenure} months`}
                />
                <Info
                  label="Maintenance"
                  value={`₹${leaseTerms.maintainance}`}
                />
                <Info label="Water Bill" value={`₹${leaseTerms.waterbill}`} />
                <Info
                  label="Electricity"
                  value={
                    leaseTerms.electricityBillIncluded
                      ? "Included in rent"
                      : "Separate meter"
                  }
                />
                <Info
                  label="Vacancy Notice (days)"
                  value={leaseTerms.vacancyNotification}
                />
              </div>
            </div>

            {/* Back Button */}
            <div className="text-center mt-6">
              <button
                onClick={() => navigate("/")}
                className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
              >
                ← Back to Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Utility components

const Info = ({ label, value }) => (
  <div>
    <span className="text-gray-600 font-medium">{label}:</span>{" "}
    <span>{value}</span>
  </div>
);

const TagList = ({ title, items = [], color = "text-gray-800" }) => {
  if (!items.length) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm list-disc list-inside">
        {items.map((item) => (
          <li key={item} className={`${color}`}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

const getPinCode = (address) => {
  const match = address.match(/\b\d{6}\b/);
  return match ? match[0] : "N/A";
};

export default ListingDetail;
