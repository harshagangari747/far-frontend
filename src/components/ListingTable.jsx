import { useNavigate } from "react-router-dom";

const ListingTable = ({ results, errorMessage }) => {
  const navigate = useNavigate();
  if (errorMessage) {
    return (
      <div className="mt-6 p-4 bg-red-100 text-red-700 rounded border border-red-400">
        ⚠️ {errorMessage}
      </div>
    );
  }

  if (results.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="font-bold text-lg mb-2">Results</h3>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-sm">
              <th className="p-2">BHK</th>
              <th className="p-2">Rent</th>
              <th className="p-2">State</th>
              <th className="p-2">District</th>
              <th className="p-2">Area</th>
              <th className="p-2">Occupant</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {results.map((listing, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-2 text-center">{listing.bhk}</td>
                <td className="p-2 text-green-600 font-medium">
                  ₹{listing.rpm}
                </td>
                <td className="p-2">{listing.state}</td>
                <td className="p-2">{listing.district}</td>
                <td className="p-2">{listing.area}</td>
                <td className="p-2 capitalize">
                  {listing.occupantType || "Any"}
                </td>
                <td className="p-2">
                  <button
                    className="bg-blue-500 text-white px-4 py-1 rounded"
                    onClick={() => navigate(`/listing/${listing.listingId}`)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {results.map((listing, index) => (
          <div key={index} className="border p-4 rounded-md shadow-sm bg-white">
            <div className="text-sm">
              <p>
                <span className="font-semibold">BHK:</span> {listing.bhk}
              </p>
              <p>
                <span className="font-semibold">Rent:</span> ₹{listing.rpm}
              </p>
              <p>
                <span className="font-semibold">State:</span> {listing.state}
              </p>
              <p>
                <span className="font-semibold">District:</span>{" "}
                {listing.district}
              </p>
              <p>
                <span className="font-semibold">Area:</span> {listing.area}
              </p>
              <p>
                <span className="font-semibold">Occupant:</span>{" "}
                {listing.occupantType || "Any"}
              </p>
            </div>
            <button
              className="mt-3 w-full bg-orange-400 text-white py-2 rounded"
              onClick={() => navigate(`/listing/${listing.listingId}`)}
            >
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListingTable;
