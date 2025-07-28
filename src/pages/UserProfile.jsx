import React, { useContext, useState } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";
import { UserContext } from "../context/userContextObject";
import loginUrl from "../api/cognito";
import { apiUrl } from "../api/apiurl";

const UserProfile = () => {
  const { userInfo, isLoadingUser } = useContext(UserContext);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    address: "",
    contact_num: "",
  });

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalSuccess, setModalSuccess] = useState(false);

  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-orange-400 text-xl font-semibold">
          Loading your profile...
        </div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <NavBar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <div className="text-red-500 font-semibold text-xl mb-4">
            Please sign in to view your profile.
          </div>
          <button
            onClick={() => (window.location.href = loginUrl)}
            className="bg-orange-400 text-white px-4 py-2 rounded hover:bg-white hover:text-orange-400 border border-orange-400"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    setFormData({
      name: userInfo.name || "",
      gender: userInfo.gender || "",
      address: userInfo.address || "",
      contact_num: userInfo.contact_num || "",
    });
    setEditMode(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        userInfo: {
          name: formData.name,
          emailId: userInfo.emailId,
          contact_num: formData.contact_num,
          gender: formData.gender,
          address: formData.address,
        },
      };
      const response = await axios.patch(`${apiUrl}/profile`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
      });
      console.log("response", response);
      setModalMessage("Profile updated successfully!");
      setModalSuccess(true);
      setShowModal(true);
      setEditMode(false);
    } catch (err) {
      console.error("Update error:", err);
      setModalMessage("Failed to update profile: " + err.message);
      setModalSuccess(false);
      setShowModal(true);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/";
  };

  console.log("user info", userInfo);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <NavBar />
      <div className="w-full max-w-4xl mx-auto mt-10 p-4 md:p-6 bg-white rounded shadow-md border border-orange-400">
        <div className=" grid grid-cols-1 md:grid-cols-2 gap-6 text-l">
          <div>
            <span className="font-bold text-orange-400 text-sm">NAME</span>
            {editMode ? (
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded"
              />
            ) : (
              <div>{userInfo.name || "-"}</div>
            )}
          </div>

          <div>
            <span className="font-bold text-orange-400 text-sm">EMAIL</span>
            <input
              value={userInfo.emailId}
              disabled
              className="w-full mt-1 p-2 border rounded bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <span className="font-bold text-orange-400 text-sm">GENDER</span>
            {editMode ? (
              <input
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded"
              />
            ) : (
              <div>{userInfo.gender || "-"}</div>
            )}
          </div>

          <div>
            <span className="font-bold text-orange-400 text-sm">USER NAME</span>
            <input
              value={userInfo.userId}
              disabled
              className="w-full mt-1 p-2 border rounded bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div className="col-span-2">
            <span className="font-bold text-orange-400 text-sm">ADDRESS</span>
            {editMode ? (
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded"
                rows={2}
              />
            ) : (
              <div>{userInfo.address || "-"}</div>
            )}
          </div>

          <div className="col-span-2">
            <span className="font-bold text-orange-400 text-sm">
              CONTACT NUMBER
            </span>
            {editMode ? (
              <input
                name="contact_num"
                value={formData.contact_num}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded"
              />
            ) : (
              <div>{userInfo.contact_num}</div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center">
          {editMode ? (
            <button
              onClick={handleUpdate}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Update
            </button>
          ) : (
            <button
              onClick={handleEdit}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Edit
            </button>
          )}

          <button
            onClick={handleLogout}
            className="text-red-600 underline hover:text-red-800"
          >
            LOGOUT
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center space-y-4 relative">
            <button
              onClick={() => {
                setShowModal(false);
                if (modalSuccess) window.location.reload();
              }}
              className="absolute top-2 right-2 bg-orange-400 px-3 py-1 rounded-md text-white font-bold hover:bg-orange-500"
              aria-label="Close modal"
            >
              X
            </button>
            {modalSuccess ? (
              <div>
                <h2 className="text-lg font-semibold text-green-600">
                  Success
                </h2>
                <p>{modalMessage}</p>
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-semibold text-red-600">Failed</h2>
                <p>{modalMessage}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
