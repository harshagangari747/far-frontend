import { useState, useContext } from "react";
import SearchForm from "../components/SearchForm";
import ListingTable from "../components/ListingTable";
import { ListingsContext } from "../context/listingContextObject";
import { useEffect } from "react";
import NavBar from "../components/NavBar";
const Home = () => {
  const [results, setResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const { cachedResults, setCachedResults } = useContext(ListingsContext);

  useEffect(() => {
    setResults(cachedResults);
  }, [cachedResults]);

  const handleResults = (data) => {
    setResults(data);
    setCachedResults(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <NavBar />
      <div className="mt-8 max-w-7xl mx-auto">
        <SearchForm
          setResults={handleResults}
          setErrorMessage={setErrorMessage}
          setCachedResults={setCachedResults}
        />
        <ListingTable results={results} errorMessage={errorMessage} />
      </div>
    </div>
  );
};

export default Home;
