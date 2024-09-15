import { createContext, useContext, useEffect, useState } from "react";

export const SearchContext = createContext();

const SearchContextProvider = ({ children }) => {
  const [values, setValues] = useState({ keyword: "", results: [] });
  const [moreInfo, setMoreInfo] = useState("");

  let getMoreInfo = async (item) => {
    setMoreInfo(item);
  };
  const [similarProducts, setSimilarProducts] = useState([]);

  let getSimilarProducts = async () => {
    let res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/products/search/similar/${
        moreInfo?._id
      }/${moreInfo?.category?._id}`,
      {
        method: "GET",
      }
    );
    let data = await res.json();
    setSimilarProducts(data.products);
  };
  useEffect(() => {
    if (moreInfo.length < 1) return;
    getSimilarProducts();
  }, [moreInfo]);

  const [cart, setCart] = useState([]);
  useEffect(() => {
    let storageCart = localStorage.getItem('cart')
    if(storageCart) setCart(JSON.parse(storageCart))
  }, [])
  

  return (
    <SearchContext.Provider
      value={{
        values,
        setValues,
        getMoreInfo,
        moreInfo,
        similarProducts,
        cart,
        setCart,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

const useSearch = () => useContext(SearchContext);

export { useSearch, SearchContextProvider };
