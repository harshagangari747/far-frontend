import { useState } from "react";
import { fetchListings } from "../api/listing";
import { location } from "../api/location";

const SearchForm = ({ setResults, setCachedResults, setErrorMessage }) => {
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [area, setArea] = useState("");
  const [bhk, setBhk] = useState("");
  const [rpm, setRpm] = useState("");
  const [occupantType, setOccupantType] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleOccupant = (type) => {
    setOccupantType((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSearch = async () => {
    setErrorMessage(""); // clear previous errors
    const filters = { state, district, area, bhk, rpm };
    if (occupantType.length === 1) filters.occupantType = occupantType;

    setLoading(true);
    const { data, error } = await fetchListings(filters);

    if (error) {
      setErrorMessage(error);
    } else {
      setResults(data);
      setCachedResults(data);
    }
    setLoading(false);
  };

  function handleStateChange(e) {
    const selectedState = e.target.value;
    setState(selectedState);
    setDistrict(""); // Set first district as default
    setArea("");
  }

  function handleDistrictChange(e) {
    const selectedDistrict = e.target.value;
    setDistrict(selectedDistrict);
    setArea("");
  }

  const stateOptions = Object.keys(location).map((s) => s);
  const districtOptions = Object.keys(location[state] || {}).map((d) => d);
  const areaOptions = Object.values(location[state]?.[district] || {}).flat();

  return (
    <>
      <div className="bg-white border border-orange-400 p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-black">SEARCH</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-4">
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              State
            </label>
            <select
              value={state}
              onChange={(e) => handleStateChange(e)}
              className="border border-orange-400 w-full p-2 rounded"
            >
              <option value="">Select State</option>
              {stateOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              District
            </label>
            <select
              value={district}
              onChange={(e) => handleDistrictChange(e)}
              className="border border-orange-400 w-full p-2 rounded"
            >
              <option value="">Select District</option>
              {districtOptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Area
            </label>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="border border-orange-400 w-full p-2 rounded"
            >
              <option value="">Select Area</option>
              {areaOptions.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-4">
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              BHK
            </label>
            <input
              type="number"
              value={bhk}
              onChange={(e) => setBhk(e.target.value)}
              className="border border-orange-400 w-full p-2 rounded"
              placeholder="1"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Max Rent (₹):{" "}
              <span className="text-orange-600 font-medium">{rpm || 0}</span>
            </label>
            <input
              type="range"
              min="5000"
              max="50000"
              step="1000"
              value={rpm}
              onChange={(e) => setRpm(e.target.value)}
              className="w-full accent-orange-500"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>₹5K</span>
              <span>₹50K</span>
            </div>
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Occupant Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={occupantType.includes("family")}
                  onChange={() => toggleOccupant("family")}
                />
                Family
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={occupantType.includes("bachelor")}
                  onChange={() => toggleOccupant("bachelor")}
                />
                Bachelor
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleSearch}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded"
          >
            🔍 Search
          </button>
        </div>
      </div>
      {loading && <div className="text-center mt-10">Loading...</div>}
    </>
  );
};

export default SearchForm;
