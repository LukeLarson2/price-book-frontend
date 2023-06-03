import React from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import FormikControl from "./FormikControl";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdOutlineCancel } from "react-icons/md";
import usStateAbbreviations from "./StateAbbs";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

function AddItem({ onClose, addProduct }) {
  //--CREATE NEW KEY FOR EACH PRODUCT--

  //--SET INITIAL VALUES FOR FORM--
  const initialValues = {
    name: "",
    state: "",
    zip: "",
    productPrice: 0,
    salesTax: 0,
    totalPrice: 0,
    userKey: "",
    key: "",
  };

  //--VALIDATION--
  const validationSchema = Yup.object({
    name: Yup.string().max(10, "Maximum of 10 characters").required("Required"),
    state: Yup.string().required("Required"),
    zip: Yup.string()
      .min(5, "Must be at least 5 digits")
      .max(5, "Must be at least 5 digits")
      .required("Required"),
    productPrice: Yup.number()
      .integer("Please enter a whole number")
      .moreThan(0, "Price must be greater than zero")
      .required("Required"),
  });

  //--HANDLE SUBMIT--
  const onSubmit = (values) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const stateTax = usStateAbbreviations.find(
      (stateInfo) => stateInfo.value === values.state
    );
    const totalPrice =
      values.productPrice * stateTax.salesTax + values.productPrice;
    values.salesTax = stateTax.salesTax;
    values.totalPrice = totalPrice;
    values.userKey = userData._id;
    values.key = uuidv4();
    const axiosPostData = async () => {
      const postData = {
        ...values,
      };
      await axios
        .post(
          "https://price-book-backend-production.up.railway.app/products",
          postData
        )
        .then((res) => {
          addProduct(values);
          onClose();
        })
        .catch((error) => {
          console.error("Error adding product:", error);
          onClose();
        });
    };

    axiosPostData();
    onClose();
  };

  //--HANDLE CLOSE MODAL--
  const onCancel = () => {
    onClose();
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => {
        return (
          <div className="modal-container">
            <div className="modal-content">
              <div className="add-item-form">
                <div className="add-item-form">
                  <Form className="add-item-modal-shadow-control">
                    <div className="new-item-position">
                      <label className="add-item-title">
                        Add a new product
                      </label>
                    </div>
                    <FormikControl
                      control="input"
                      type="text"
                      label="Product"
                      name="name"
                    />
                    <div className="dollar">
                      <p className="dollar-sign">$</p>
                      <FormikControl
                        control="input"
                        type="number"
                        label="Price"
                        name="productPrice"
                      />
                    </div>
                    <FormikControl
                      control="select"
                      type="select"
                      label="State"
                      name="state"
                      options={usStateAbbreviations}
                      id="state"
                    />
                    <FormikControl
                      control="input"
                      type="text"
                      label="Zip Code"
                      name="zip"
                      id="zip"
                    />
                    <div className="upload-cancel">
                      <div className="btn-placement">
                        <button className="upload" type="submit">
                          Upload <AiOutlineCloudUpload />
                        </button>
                        <button
                          type="button"
                          className="cancel"
                          onClick={onCancel}
                        >
                          Cancel <MdOutlineCancel />
                        </button>
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </Formik>
  );
}

export default AddItem;

// Avatax integration
// import React from "react";
// import { Form, Formik } from "formik";
// import * as Yup from "yup";
// import FormikControl from "./FormikControl";
// import { AiOutlineCloudUpload } from "react-icons/ai";
// import { MdOutlineCancel } from "react-icons/md";
// import usStateAbbreviations from "./StateAbbs";
// import { v4 as uuidv4 } from "uuid";
// import { client } from "../utils/avataxConfig";

// function AddItem({ onClose, addProduct }) {
//   const initialValues = {
//     name: "",
//     state: "",
//     zip: "",
//     productPrice: 0,
//     salesTax: 0,
//     totalPrice: 0,
//     dateAdded: new Date().toISOString().split("T")[0],
//   };

//   const validationSchema = Yup.object({
//     name: Yup.string().max(10, "Maximum of 10 characters").required("Required"),
//     state: Yup.string().required("Required"),
//     zip: Yup.string()
//       .min(5, "Must be at least 5 digits")
//       .max(5, "Must be at least 5 digits")
//       .required("Required"),
//     productPrice: Yup.number()
//       .integer("Please enter a whole number")
//       .moreThan(0, "Price must be greater than zero")
//       .required("Required"),
//   });

//   const onSubmit = (values) => {
//     const taxDocument = {
//       type: "SalesInvoice",
//       companyCode: "abc123",
//       date: values.dateAdded,
//       customerCode: "ABC",
//       purchaseOrderNo: new Date().toISOString().split("T")[0] + "-001",
//       addresses: {
//         SingleLocation: {
//           line1: "123 Main Street",
//           city: "Irvine",
//           region: values.state,
//           country: "US",
//           postalCode: values.zip,
//         },
//       },
//       lines: [
//         {
//           number: "1",
//           quantity: 1,
//           amount: values.productPrice,
//           taxCode: "PS081282",
//           itemCode: "Y0001",
//           description: values.name,
//         },
//       ],
//       commit: true,
//       currencyCode: "USD",
//       description: values.name,
//     };

//     client
//       .createTransaction({ model: taxDocument })
//       .then((result) => {
//         const salesTax = result.totalTax || 0;
//         const totalPrice = values.productPrice + salesTax;
//         const product = { ...values, salesTax, totalPrice, key: uuidv4() };
//         addProduct(product);
//         onClose();
//       })
//       .catch((error) => {
//         console.error("Tax calculation error:", error);
//         onClose();
//       });
//   };

//   const onCancel = () => {
//     onClose();
//   };

//   return (
//     <Formik
//       initialValues={initialValues}
//       validationSchema={validationSchema}
//       onSubmit={onSubmit}
//     >
//       {(formik) => {
//         return (
//           <div className="modal-container">
//             <div className="modal-content">
//               <div className="add-item-form">
//                 <div className="add-item-form">
//                   <Form className="add-item-modal-shadow-control">
//                     <div className="new-item-position">
//                       <label className="add-item-title">
//                         Add a new product
//                       </label>
//                     </div>
//                     <FormikControl
//                       control="input"
//                       type="text"
//                       label="Product"
//                       name="name"
//                     />
//                     <div className="dollar">
//                       <p className="dollar-sign">$</p>
//                       <FormikControl
//                         control="input"
//                         type="number"
//                         label="Price"
//                         name="productPrice"
//                       />
//                     </div>
//                     <FormikControl
//                       control="select"
//                       type="select"
//                       label="State"
//                       name="state"
//                       options={usStateAbbreviations}
//                       id="state"
//                     />
//                     <FormikControl
//                       control="input"
//                       type="text"
//                       label="Zip Code"
//                       name="zip"
//                       id="zip"
//                     />
//                     <div className="upload-cancel">
//                       <div className="btn-placement">
//                         <button className="upload" type="submit">
//                           Upload <AiOutlineCloudUpload />
//                         </button>
//                         <button
//                           type="button"
//                           className="cancel"
//                           onClick={onCancel}
//                         >
//                           Cancel <MdOutlineCancel />
//                         </button>
//                       </div>
//                     </div>
//                   </Form>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );
//       }}
//     </Formik>
//   );
// }

// export default AddItem;
