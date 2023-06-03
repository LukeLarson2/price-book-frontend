//-EXTERNAL IMPORTS--
import React, { useState, useEffect } from "react";
import { AiFillEdit, AiOutlinePlus } from "react-icons/ai";
import { FiTrash2 } from "react-icons/fi";
import { TailSpin } from "react-loader-spinner";
import { MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";

//--INTERNAL IMPORTS--
import NavBar from "../components/NavBar";
import AddItem from "../components/AddItem";
import EditItem from "../components/EditItem";
import { fetchUser } from "../utils/fetchUser";

function Home() {
  const [products, setProducts] = useState([]);
  const [sortField, setSortField] = useState("");
  const [update, setUpdate] = useState(null);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showEditItem, setShowEditItem] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  //--STORE USER ID FROM LOCAL STORAGE--
  const userData = fetchUser();
  const userDataValues = Object.values(userData).join();
  //--UPDATE USER DATA --
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://price-book-backend-production.up.railway.app/products?sortBy=${sortField}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const products = await response.json();
          const userProducts = products.filter(
            (product) =>
              userData._id === product.userKey &&
              product.name.toLowerCase().includes(search.toLowerCase())
          );
          if (userProducts.length > 0) {
            setProducts(userProducts);
          }
          setIsLoading(false);
        } else {
          throw new Error("No products found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userDataValues, update, search, sortField, userData._id]);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };
  const handleSortFieldChange = (field) => {
    setSortField(field);
  };

  //--ADD PRODUCT MODAL ONCLICK HANDLE--
  const handleAddItemClick = () => {
    setShowAddItem(true);
  };

  //--EDIT PRODUCT HANDLE ITEM CLICK--
  const handleEditItemClick = (product) => {
    setShowEditItem(true);
    setEditProduct(product);
  };

  //--CLOSE MODAL CONTROL ON CLICK--
  const handleCloseModal = () => {
    setShowAddItem(false);
    setShowEditItem(false);
    setEditProduct(null);
  };

  //--UPDATE PRODUCT STATE CONTROL ON NEW PRODUCT--
  const addProduct = (product) => {
    setProducts([...products, product]);
  };

  //--UPDATE PRODUCT STATE ON PRODUCT EDIT--
  const updateProduct = async (updatedProduct) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://price-book-backend-production.up.railway.app/products",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: updatedProduct.userKey,
            product: updatedProduct,
          }),
        }
      );

      if (response.ok) {
        const productUpdate = await response.json();
        // Find the index of the product to be updated
        const productIndex = products.findIndex(
          (p) => p._id === updatedProduct._id
        );
        // Clone the existing products array
        const updatedProducts = [...products];
        // Replace the existing product with the updated product
        if (productIndex !== -1) {
          updatedProducts[productIndex] = productUpdate;
        }
        // Update the products state
        setProducts(updatedProducts);
        // Update the updateProduct state
        setUpdate(productUpdate);
        setIsLoading(false);
      } else {
        throw new Error("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  //--DELETE PRODUCT --
  const handleRemove = async (key) => {
    try {
      const response = await fetch(
        "https://price-book-backend-production.up.railway.app/products",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            key,
          }),
        }
      );

      if (response.ok) {
        setProducts(products.filter((product) => product.key !== key));
      } else {
        throw new Error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  //--TRACK VIEWPORT SIZE--

  //--UPDATE RENDERED PRODUCTS EFFECT--
  useEffect(() => {
    setProducts(products);
  }, [products]);

  return (
    <div className="home-container">
      <NavBar
        name={userData.name}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onSortChange={(e) => handleSortFieldChange(e.target.value)}
      />
      {isLoading ? (
        <div className="loader-spinner-container">
          <TailSpin
            height="80"
            width="80"
            color="rgb(206, 105, 10)"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      ) : (
        <div className="product-list">
          {products.map((product) => {
            const salesTax = product.salesTax;
            const totalPrice = product.totalPrice;
            const { key, name, productPrice, state, zip } = product;
            return (
              <div key={key} className="product-info">
                <div className="product-header">
                  <h2 className="product-title">{name}</h2>
                  <div className="edit-del-btns">
                    <AiFillEdit
                      className="edit-item"
                      onClick={() => handleEditItemClick(product)}
                    />
                    <FiTrash2
                      className="delete-item"
                      onClick={() => handleRemove(key)}
                    />
                  </div>
                </div>
                <div className="product-details">
                  <p>
                    Product Price: <b>${productPrice}</b>{" "}
                  </p>
                  <p>
                    Sales Tax: <b>{salesTax.toFixed(3)}%</b>{" "}
                  </p>
                  <p>
                    Total Cost: <b>${totalPrice.toFixed(2)}</b>{" "}
                  </p>
                  <p>
                    State: <b>{state}</b>{" "}
                  </p>
                  <p>
                    Zip Code: <b>{zip}</b>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="footer-placement">
        <div className="add-item-placement">
          <button
            type="button"
            className="add-item-btn"
            onClick={handleAddItemClick}
          >
            Add Item <AiOutlinePlus className="add-item-icon" />
          </button>
        </div>
        <div className="logout-btn-placement">
          <MdLogout className="logout" onClick={logout} />
        </div>
      </div>
      {showAddItem && (
        <AddItem
          onClose={handleCloseModal}
          addProduct={addProduct}
          userKey={userData._id}
          // updateProducts={setProducts}
        />
      )}
      {showEditItem && (
        <EditItem
          onClose={handleCloseModal}
          product={editProduct}
          updateProduct={updateProduct}
          userKey={userData._id}
        />
      )}
    </div>
  );
}

export default Home;
