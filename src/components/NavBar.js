import React from "react";

import { BiBookBookmark } from "react-icons/bi";
import { AiOutlineSearch } from "react-icons/ai";

function NavBar(props) {
  const { onChange, value } = props;

  const handleTitleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="navbar">
      <div className="app-user">
        <h2
          className="app-title"
          onClick={handleTitleClick}
          style={{ cursor: "pointer" }}
        >
          <BiBookBookmark className="book-icon" />
          Price Book
        </h2>
        <div className="user-logout-container">
          <p className="username welcome">
            <b>Welcome,</b>
          </p>
          <p className="username name">
            <span className="name-logout-container">
              <b>{props.name}</b>
            </span>
          </p>
        </div>
      </div>
      <div className="search-container">
        <div className="search-sort">
          <AiOutlineSearch className="search-icon" />
          <input
            type="search"
            className="search-bar"
            placeholder="Search products..."
            value={value}
            onChange={onChange}
          />
          {/* <BiSortAlt2 className="sort-icon" /> */}
          <select onChange={props.onSortChange} className="sort-select">
            <option value="">Sort by...</option>
            <option value="name">Name</option>
            <option value="productPrice">Product Price</option>
            <option value="totalPrice">Total Price</option>
            <option value="salesTax">Sales Tax</option>
            <option value="state">State</option>
            <option value="zip">Zip code</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
