import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import { location } from "../api/location";

const ListingForm = ({
  mode = "add",
  initialData = {},
  onSubmit,
  isSubmitting,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    address1: "",
    address2: "",
    state: "",
    district: "",
    area: "",
    pincode: "",
    rpm: "",
    beds: "",
    baths: "",
    balconies: "",
    floor: "",
    maxOccupants: "",
    waterAvailability: "",
    advanceAmount: "",
    vacancyNotification: "",
    leaseTenure: "",
    waterbill: "",
    maintainance: "",
    dateAvailable: "",
    facing: "",
    occupantType: "",
    hasElevator: false,
    hasBorewell: false,
    electricityBillIncluded: false,
  });

  const [imageFile, setImageFile] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [utilities, setUtilities] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [inputFields, setInputFields] = useState({
    amenity: "",
    utility: "",
    highlight: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (mode === "edit" && initialData) {
      const rental = initialData.rentalInformation || {};
      setFormData((prev) => ({
        ...prev,
        ...rental,
        ...initialData.leaseTerms,
        dateAvailable: initialData.dateAvailable || "",
        rpm: initialData.rpm || "",
        beds: initialData.bhk || "",
        state: initialData.state || "",
        district: initialData.district || "",
        area: initialData.area || "",
      }));
      setAmenities(rental.amenities || []);
      setUtilities(rental.utilities || []);
      setHighlights(initialData.highlights || []);
      setImageFile(rental.imageFile || []);
    }
  }, [initialData, mode]);

  // Cascading dropdown derived options
  const states = Object.keys(location);

  const districts = formData.state ? Object.keys(location[formData.state]) : [];

  const areas =
    formData.state && formData.district
      ? location[formData.state][formData.district]
      : [];

  // Handlers for cascading dropdowns
  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setFormData((prev) => ({
      ...prev,
      state: selectedState,
      district: "",
      area: "",
    }));
  };

  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value;
    setFormData((prev) => ({
      ...prev,
      district: selectedDistrict,
      area: "",
    }));
  };

  const handleAreaChange = (e) => {
    const selectedArea = e.target.value;
    setFormData((prev) => ({
      ...prev,
      area: selectedArea,
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTagAdd = (field) => {
    const value = inputFields[field].trim();
    if (value) {
      const update = {
        amenity: amenities,
        utility: utilities,
        highlight: highlights,
      };
      const setter = {
        amenity: setAmenities,
        utility: setUtilities,
        highlight: setHighlights,
      };
      setter[field]([...update[field], value]);
      setInputFields((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleTagRemove = (field, index) => {
    const update = {
      amenity: amenities,
      utility: utilities,
      highlight: highlights,
    };
    const setter = {
      amenity: setAmenities,
      utility: setUtilities,
      highlight: setHighlights,
    };
    setter[field](update[field].filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailId = localStorage.getItem("emailId");

    const rentalInformation = {
      ...formData,
      utilities,
      amenities,
    };

    const leaseTerms = {
      advanceAmount: formData.advanceAmount,
      vacancyNotification: formData.vacancyNotification,
      leaseTenure: formData.leaseTenure,
      electricityBillIncluded: formData.electricityBillIncluded,
      waterbill: formData.waterbill,
      maintainance: formData.maintainance,
    };

    const payload = {
      emailId,
      rentalInformation,
      leaseTerms,
      highlights,
      dateAvailable: formData.dateAvailable,
      rpm: formData.rpm,
      bhk: formData.beds,
      state: formData.state,
      district: formData.district,
      area: formData.area,
      listingId: mode === "edit" ? initialData.listingId : undefined,
    };

    onSubmit(payload, imageFile);
  };

  const renderInput = (
    label,
    name,
    type = "text",
    min = 0,
    max = 0,
    required = false
  ) => (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        name={name}
        type={type}
        value={formData[name]}
        onChange={handleChange}
        max={max}
        min={min}
        required={required}
        className="w-full border border-gray-300 rounded px-2 py-1"
      />
    </div>
  );

  const renderTagInput = (label, field, values) => (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="flex gap-2">
        <input
          value={inputFields[field]}
          onChange={(e) =>
            setInputFields((prev) => ({ ...prev, [field]: e.target.value }))
          }
          className="flex-1 border border-gray-300 px-2 py-1 rounded"
        />
        <button
          type="button"
          onClick={() => handleTagAdd(field)}
          className="bg-orange-500 text-white px-3 rounded"
        >
          +
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {values.map((item, i) => (
          <div
            key={i}
            className="bg-orange-100 text-sm px-2 py-1 flex items-center gap-1"
          >
            {item}
            <button
              onClick={() => handleTagRemove(field, i)}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const handleCancelClick = () => {
    setFormData({});
    setAmenities([]);
    setHighlights([]);
    setUtilities([]);
    setImageFile([]);
    setInputFields({});
    navigate("/owner/listings");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-5xl mx-auto bg-white shadow rounded p-6 mt-6">
        <h2 className="text-2xl font-bold text-center text-orange-600 mb-4">
          {mode === "edit" ? "Edit Listing" : "Add New Listing"}
        </h2>
        {isLoading && (
          <div className="text-center text-orange-500">Loading the page...</div>
        )}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {renderInput("Address Line 1", "address1", "text", "", "", true)}
          {renderInput("Address Line 2", "address2", "text", "", "", false)}

          {/* State dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <select
              name="state"
              value={formData.state}
              onChange={handleStateChange}
              required
              className="w-full border border-gray-300 rounded px-2 py-1"
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          {
            <div>
              <label className="block text-sm font-medium mb-1">District</label>
              <select
                name="district"
                value={formData.district}
                onChange={handleDistrictChange}
                required
                className="w-full border border-gray-300 rounded px-2 py-1"
              >
                <option value="">Select District</option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>
          }

          {
            <div>
              <label className="block text-sm font-medium mb-1">Area</label>
              <select
                name="area"
                value={formData.area}
                onChange={handleAreaChange}
                required
                className="w-full border border-gray-300 rounded px-2 py-1"
              >
                <option value="">Select Area</option>
                {areas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>
          }

          {renderInput("Pincode", "pincode", "text", "", "", true)}
          {renderInput(
            "Rent per Month (RPM)",
            "rpm",
            "number",
            1000,
            50000,
            true
          )}
          {renderInput("Bedrooms", "beds", "number", 0, 5, true)}
          {renderInput("Bathrooms", "baths", "number", 0, 5, true)}
          {renderInput("Balconies", "balconies", "number", 0, 3, true)}
          {renderInput("Floor", "floor", "number", 0, 100, true)}
          {renderInput("Max Occupants", "maxOccupants", "number", 1, 10, true)}
          {renderInput(
            "Water Availability",
            "waterAvailability",
            "text",
            "",
            "",
            true
          )}
          {renderInput(
            "Advance Amount",
            "advanceAmount",
            "number",
            1000,
            "",
            true
          )}
          {renderInput(
            "Vacancy Notification (days)",
            "vacancyNotification",
            "number",
            15,
            365,
            true
          )}
          {renderInput(
            "Lease Tenure (months)",
            "leaseTenure",
            "number",
            1,
            36,
            true
          )}
          {renderInput("Water Bill", "waterbill", "number", 0, 5000, true)}
          {renderInput("Maintenance", "maintainance", "number", 0, 20000, true)}

          <div>
            <label className="block text-sm font-medium mb-1">
              Date Available
            </label>
            <input
              type="date"
              name="dateAvailable"
              value={formData.dateAvailable}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full border border-gray-300 rounded px-2 py-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Facing</label>
            <select
              name="facing"
              value={formData.facing}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-2 py-1"
            >
              <option value="">Select Facing</option>
              <option value="east">East</option>
              <option value="west">West</option>
              <option value="north">North</option>
              <option value="south">South</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Occupant Type
            </label>
            <select
              name="occupantType"
              value={formData.occupantType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-2 py-1"
            >
              <option value="">Select</option>
              <option value="family">Family</option>
              <option value="bachelor">Bachelor</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="hasElevator"
              checked={formData.hasElevator}
              onChange={handleChange}
            />
            <label>Elevator</label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="hasBorewell"
              checked={formData.hasBorewell}
              onChange={handleChange}
            />
            <label>Borewell</label>
          </div>

          <div className="md:col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              name="electricityBillIncluded"
              checked={formData.electricityBillIncluded}
              onChange={handleChange}
            />
            <label>Electricity Bill Included</label>
          </div>

          {renderTagInput("Amenities", "amenity", amenities)}
          {renderTagInput("Utilities", "utility", utilities)}
          {renderTagInput("Highlights", "highlight", highlights)}

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Upload Images (max 10)
              <br />
              {mode === "edit" && (
                <span className="text-red-500">
                  Note*: You need to reupload the images to reflect the changes
                  in the final listing
                </span>
              )}
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files);
                const newImages = [...imageFile, ...files];

                if (newImages.length > 10) {
                  alert("You can only upload up to 10 images.");
                  return;
                }

                // Remove duplicate file names (optional)
                const uniqueFiles = Array.from(
                  new Map(newImages.map((f) => [f.name, f])).values()
                );

                setImageFile(uniqueFiles);
              }}
              className="w-full border border-gray-300 px-2 py-1 rounded"
            />

            {/* Display selected image names with delete button */}
            <div className="flex flex-wrap gap-2 mt-2">
              {imageFile.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded shadow-sm"
                >
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setImageFile((prev) => prev.filter((_, i) => i !== index))
                    }
                    className="text-red-500 hover:text-red-700 font-bold"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-1">
            <button
              type="reset"
              className="w-full bg-slate-100 text-red-500"
              onClick={handleCancelClick}
            >
              Cancel
            </button>
          </div>

          <div className="md:col-span-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-400 text-white w-full py-2 rounded hover:bg-orange-600"
            >
              {isSubmitting
                ? "Submitting..."
                : mode === "edit"
                ? "Update Listing"
                : "Add Listing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListingForm;
