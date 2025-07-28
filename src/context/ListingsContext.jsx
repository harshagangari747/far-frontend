import { useEffect, useState } from "react";
import { ListingsContext } from "./listingContextObject";

export const ListingsProvider = ({ children }) => {
  const [cachedResults, setCachedResults] = useState(() => {
    const local = localStorage.getItem("listings");
    return local ? JSON.parse(local) : [];
  });

  useEffect(() => {
    localStorage.setItem("listings", [JSON.stringify(cachedResults)]);
  }, [cachedResults]);

  return (
    <ListingsContext.Provider value={{ cachedResults, setCachedResults }}>
      {children}
    </ListingsContext.Provider>
  );
};
