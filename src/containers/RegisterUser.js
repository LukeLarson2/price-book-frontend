//--EXTERNAL IMPORTS--
import React from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

//--INTERNAL IMPORTS--
import FormikControl from "../components/FormikControl";

function RegisterUser() {
  //--SET USE NAVIGATE--
  const navigate = useNavigate();

  //--SET INITAL VALUES TO FORM--
  const initialValues = {
    key: uuidv4(),
    name: "",
    email: "",
    accountType: "",
    password: "",
    confirmPassword: "",
  };

  //--ACCOUNT TYPES FOR SELECT LIST--
  const accountTypes = [
    { key: "Select account type", value: "" },
    { key: "Personal", value: "personal" },
    { key: "Commercial", value: "commercial" },
  ];

  //--VALIDATION--
  const validationSchema = Yup.object({
    name: Yup.string()
      .max(10, "Please limit to 10 characters")
      .required("Required"),
    email: Yup.string()
      .email("Invalid Format (example@email.com)")
      .required("Required"),
    accountType: Yup.string().required("Required"),
    password: Yup.string()
      .min(6, "Must contain at least 6 characters")
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), ""], "Passwords must match")
      .required("Required"),
  });

  //--HANDLE SUBMIT FOR REGISTER USER--
  const onSubmit = (values) => {
    const updatedValues = { ...values };

    // Send the data to the backend
    fetch(
      "https://price-book-backend-production.up.railway.app/users/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedValues),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        navigate("/login", { replace: true });
      })
      .catch((error) => {
        console.error("Error sending data to backend:", error);
      });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => {
        return (
          <div className="register-user-form">
            <Form className="add-item-modal-shadow-control">
              <div className="title-position">
                <label className="title">Create User</label>
              </div>
              <FormikControl
                control="input"
                type="text"
                label="Full Name"
                name="name"
              />
              <FormikControl
                control="input"
                type="email"
                label="Email"
                name="email"
              />
              <FormikControl
                control="select"
                type="select"
                label="Account Type"
                name="accountType"
                id="account"
                options={accountTypes}
              />
              <FormikControl
                control="input"
                type="password"
                label="Password"
                name="password"
              />
              <FormikControl
                control="input"
                type="password"
                label="Confirm Password"
                name="confirmPassword"
              />
              <div className="btn-placement">
                <button
                  className="create-user"
                  type="submit"
                  disabled={!formik.isValid}
                >
                  Submit
                </button>
                <button
                  className="cancel"
                  type="button"
                  onClick={() => navigate("/login")}
                >
                  Cancel
                </button>
              </div>
            </Form>
          </div>
        );
      }}
    </Formik>
  );
}

export default RegisterUser;
