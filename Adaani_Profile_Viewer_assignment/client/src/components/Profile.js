import React, { useState } from "react";
import avatar from "../assets/profile.png";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { profileValidation } from "../helper/validate";
import convertToBase64 from "../helper/convert";
import useFetch from "../hooks/fetch.hook";
import { updateUser } from "../helper/helper";
import { useNavigate } from "react-router-dom";

import styles from "../styles/Username.module.css";

export default function Profile() {
  const [file, setFile] = useState();
  const [{ isLoading, apiData, serverError }] = useFetch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      firstName: apiData?.firstName || "",
      lastName: apiData?.lastName || "",
      email: apiData?.email || "",
      mobile: apiData?.mobile || "",
      address: apiData?.address || "",
    },
    enableReinitialize: true,
    validate: profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = await Object.assign(values, {
        profile: file || apiData?.profile || "",
      });
      let updatePromise = updateUser(values);

      toast.promise(updatePromise, {
        loading: "Updating...",
        success: <b>Update Successfully...!</b>,
        error: <b>Could not Update!</b>,
      });
    },
  });

  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

  function userLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  if (isLoading) return <h1 className="text-2xl font-bold">isLoading</h1>;
  if (serverError)
    return <h1 className="text-xl text-red-500">{serverError.message}</h1>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <nav className="bg-purple-600 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold">MyApp</h1>
          <ul className="flex space-x-4">
            <li>
              <a href="/" className="text-white">
                Home
              </a>
            </li>
            <li>
              <button onClick={userLogout} className="text-white">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>
      <div className="flex justify-center items-center py-10">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <div className="title flex flex-col items-center">
            <h4 className="text-4xl font-bold">Profile</h4>
            <span className="py-2 text-lg text-center text-gray-500">
              You can update the details.
            </span>
          </div>
          <form className="py-4" onSubmit={formik.handleSubmit}>
            <div className="profile flex flex-col justify-center items-center py-2">
              <label htmlFor="profile">
                <img
                  src={apiData?.profile || file || avatar}
                  className="profile_img"
                  alt="avatar"
                />
              </label>
              <span className="upload_text">Upload your profile</span>
              <input
                onChange={onUpload}
                type="file"
                id="profile"
                name="profile"
                className="hidden"
              />
            </div>
            <div className="textbox flex flex-col items-center gap-4">
              <div className="name flex w-full gap-4">
                <input
                  {...formik.getFieldProps("firstName")}
                  className="textbox"
                  type="text"
                  placeholder="FirstName"
                />
                <input
                  {...formik.getFieldProps("lastName")}
                  className="textbox"
                  type="text"
                  placeholder="LastName"
                />
              </div>
              <div className="name flex w-full gap-4">
                <input
                  {...formik.getFieldProps("mobile")}
                  className="textbox"
                  type="text"
                  placeholder="Mobile No."
                />
                <input
                  {...formik.getFieldProps("email")}
                  className="textbox"
                  type="text"
                  placeholder="Email*"
                />
              </div>
              <div className="name flex w-full gap-4">
                <input
                  {...formik.getFieldProps("Past Experience")}
                  className="textbox"
                  type="text"
                  placeholder="Past Experience."
                />
                <input
                  {...formik.getFieldProps("qualification")}
                  className="textbox"
                  type="text"
                  placeholder="Qualification"
                />
              </div>
              <input
                {...formik.getFieldProps("address")}
                className="textbox"
                type="text"
                placeholder="Address"
              />
              <button className="btn" type="submit">
                Update
              </button>
            </div>
            <div className="text-center py-2">
              <span className="text-gray-500">
                Come back later?{" "}
                <button onClick={userLogout} className="text-red-500" to="/">
                  Logout
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
      <style jsx>{`
        .profile_img {
          border-radius: 50%;
          width: 80px;
          height: 80px;
        }

        .upload_text {
          margin-top: 10px;
          font-size: 10px;
          font-weight: bold;
          font-style: italic;
          color: #666;
          text-align: center;
        }

        .textbox {
          width: 100%;
          padding: 0.5em;
          border: 1px solid #ccc;
          border-radius: 5px;
        }

        .btn {
          background: #6200ea;
          color: white;
          padding: 0.5em 1em;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          width: 100%;
        }
      `}</style>
    </div>
  );
}
