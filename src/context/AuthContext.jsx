import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userInfo, setUserInfo] = useState("");

  let storeToken = (token) => {
    setToken(token);
    return localStorage.setItem("token", token);
  };

  //   let isLoggedIn = !!token; // isLoggedIn true/false if token true/false
  const getUserInfo = () => {
   if (token) {
     fetch(`${import.meta.env.VITE_BASE_URL}/user`, {
       method: "GET",
       headers: { Authorization: `Bearer ${token}` },
     })
       .then((res) => res.json())
       .then((data) => setUserInfo(data.userData))
       .catch((error) => console.log(error));
   }
}
  useEffect(() => {
   getUserInfo();
  }, [token]);
  //============== all category====================================
  const [category, setCategory] = useState([]);

  let getCategory = async () => {
    try {
      let res = await fetch(`${import.meta.env.VITE_BASE_URL}/category/category-list`, {
        method: "GET",
      });
      let data = await res.json();
      setCategory(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategory();
  }, []);
  //==============================================================
  //========== all products ==================
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingHome, setLoadingHome] = useState(false);
  
// console.log(products);
  let getProducts = async () => {
    try {
      setLoadingHome(true);
      let res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/products/product-list-per-page/${page}`,
        {
          method: "GET",
        }
      );
      let data = await res.json();
      setProducts(data?.products);
      setLoadingHome(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);
  //======================================================================
    // get edit data 
  const [editData, setEditData] = useState([]);
    let getEditData = (item) => {
      setEditData(item);
    };
  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        storeToken,
        userInfo,
        getUserInfo,
        category,
        getCategory,
        products,
        setProducts,
        getProducts,
        getEditData,
        editData,
        setEditData,
        page,
        setPage,
        loadingHome,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);
 

export { useAuth, AuthContextProvider };
