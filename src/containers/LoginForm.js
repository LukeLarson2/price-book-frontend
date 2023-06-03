//--EXTERNAL IMPORTS--
import React from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

//--INTERNAL IMPORTS--
import FormikControl from "../components/FormikControl";

function LoginForm() {
  //--SET USE NAVIGATE--
  const navigate = useNavigate();

  //--SET FORM INITIAL VALUES--
  const initialValues = {
    email: "",
    password: "",
  };

  //--VALIDATION--
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid Format").required("Required"),
    password: Yup.string().required("Required"),
  });

  //--HANDLE SUBMIT OF LOGIN REQUEST--
  const onSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const response = await fetch(
        "https://price-book-backend-production.up.railway.app/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem("userData", JSON.stringify(userData));
        navigate("/home");
      } else {
        const errorMessage = await response.json();
        setFieldError("password", errorMessage.message);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => {
        return (
          <div className="login-form">
            <Form>
              <div className="title-position">
                <label className="title">Login</label>
              </div>
              <FormikControl
                control="input"
                type="email"
                label="Email"
                name="email"
              />
              <FormikControl
                control="input"
                type="password"
                label="Password"
                name="password"
              />
              <div className="login-signup">
                <div className="btn-placement">
                  <button
                    className="login"
                    type="submit"
                    disabled={!formik.isValid || formik.isSubmitting}
                  >
                    Login
                  </button>
                </div>
                <p className="or">or</p>
                <div className="btn-placement">
                  <button
                    className="sign-up"
                    type="button"
                    onClick={() => navigate("/user-registration")}
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </Form>
          </div>
        );
      }}
    </Formik>
  );
}

export default LoginForm;
