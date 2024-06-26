import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../assets/profile.png";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { registerValidation } from "../helper/validate";
import convertToBase64 from "../helper/convert";
import { registerUser } from "../helper/helper";

export default function Register() {
  const navigate = useNavigate();
  const [file, setFile] = useState();

  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
    validate: (values) => {
      const errors = registerValidation(values);
      if (values.password !== values.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
      return errors;
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = await Object.assign(values, { profile: file || "" });
      let registerPromise = registerUser(values);
      toast.promise(registerPromise, {
        loading: "Creating...",
        success: <b>Register Successfully...!</b>,
        error: <b>Could not Register.</b>,
      });

      registerPromise.then(function () {
        navigate("/");
      });
    },
  });

  /** formik doesn't support file upload so we need to create this handler */
  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

  const styles = {
    container: {
      width: "90%",
      maxWidth: "400px",
      padding: "2em",
      background: "rgba(255, 255, 255, 0.8)",
      borderRadius: "16px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      margin: "0 auto",
    },
    profileImg: {
      width: "80px",
      height: "80px",
      borderRadius: "50%",
      objectFit: "cover",
    },

    title: {
      textAlign: "center",
    },
    heading: {
      fontSize: "2.5em",
      fontWeight: "bold",
    },
    subtitle: {
      padding: "1em 0",
      fontSize: "1.25em",
      color: "gray",
    },
    textbox: {
      width: "100%",
      padding: "5px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      margin: "0.5em 0",
    },
    button: {
      width: "100%",
      padding: "0.5em",
      backgroundColor: "#f56565",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      marginTop: "1em",
    },
    link: {
      color: "red",
    },
  };

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div className="flex justify-center items-center min-h-screen">
        <div style={styles.container}>
          <div className="title" style={styles.title}>
            <h4 style={styles.heading}>Register Here</h4>
            <span style={styles.subtitle}>Happy to join you!</span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex flex-col justify-center items-center py-2">
              <label htmlFor="profi">
                <img
                  src={file || avatar}
                  style={styles.profileImg}
                  alt="avatar"
                />
              </label>

              <input
                onChange={onUpload}
                type="file"
                id="profile"
                name="profile"
                style={{ display: "none" }}
              />
            </div>

            <div className="textbox flex flex-col items-center gap-4">
              <input
                {...formik.getFieldProps("email")}
                style={styles.textbox}
                type="text"
                placeholder="Email*"
              />
              <input
                {...formik.getFieldProps("username")}
                style={styles.textbox}
                type="text"
                placeholder="Username*"
              />
              <input
                {...formik.getFieldProps("password")}
                style={styles.textbox}
                type="password"
                placeholder="Password*"
              />
              <input
                {...formik.getFieldProps("confirmPassword")}
                style={styles.textbox}
                type="password"
                placeholder="Confirm Password*"
              />
              <button style={styles.button} type="submit">
                Register
              </button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                Already Register?{" "}
                <Link style={styles.link} to="/">
                  Login Now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
