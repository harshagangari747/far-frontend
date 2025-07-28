// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ListingDetail from "./pages/ListingDetail";
import MyListings from "./pages/MyListings";
import { ListingsProvider } from "./context/ListingsContext";
import AddListing from "./pages/AddListing";
import EditListing from "./pages/EditListing";
import UserProfile from "./pages/UserProfile";
import { UserProvider } from "./context/UserContext";
import MyInterests from "./pages/MyInterests";
import Matches from "./pages/Matches";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";

function App() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");
      const idToken = params.get("id_token");

      if (accessToken && idToken) {
        sessionStorage.setItem("access_token", accessToken);
      }
      decodeJwt(idToken);

      // Clean up the URL
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  disableReactDevTools();

  return (
    <UserProvider>
      <ListingsProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/listing/:listingId" element={<ListingDetail />} />
            <Route path="/owner/listings" element={<MyListings />} />
            <Route path="/add-listing" element={<AddListing />} />
            <Route
              path="owner/listing/edit/:listingId"
              element={<EditListing />}
            />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/interests" element={<MyInterests />} />
            <Route path="/listings/matches" element={<Matches />} />
          </Routes>
        </Router>
      </ListingsProvider>
    </UserProvider>
  );
}

function decodeJwt(token) {
  if (token) {
    try {
      const user_details = jwtDecode(token);
      localStorage.setItem("emailId", user_details.email);
      localStorage.setItem("userId", user_details["cognito:username"]);
    } catch (error) {
      console.error("Failed to decode JWT", error);
    }
  }
}

export default App;
