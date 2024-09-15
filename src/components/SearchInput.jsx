import React from "react";
import { useSearch } from "../context/SearchContext";
import { useNavigate } from 'react-router-dom';

const SearchInput = () => {
  const { values, setValues } = useSearch();
    let navigate = useNavigate()

  let submitHandler = async (e) => {
    e.preventDefault();
    try {
      let res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/products/search/${values.keyword}`,
        {
          method: "GET",
        }
      );
      let data = await res.json();
        setValues({ ...values, results: data.products });
        navigate('/products/search')
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form className="d-flex" role="search" onSubmit={submitHandler}>
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search product"
          aria-label="Search"
          value={values.keyword}
          onChange={(e) => setValues({ ...values, keyword: e.target.value })}
        />
        <button className="btn btn-success btn-outline-black" type="submit">
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchInput;
