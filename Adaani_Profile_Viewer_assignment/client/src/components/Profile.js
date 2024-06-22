import React, { useState } from 'react';
import avatar from '../assets/profile.png';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { profileValidation } from '../helper/validate';
import convertToBase64 from '../helper/convert';
import useFetch from '../hooks/fetch.hook';
import { updateUser } from '../helper/helper';
import { useNavigate } from 'react-router-dom';

import styles from '../styles/Username.module.css';

export default function Profile() {
  const [file, setFile] = useState();
  const [{ isLoading, apiData, serverError }] = useFetch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      firstName: apiData?.firstName || '',
      lastName: apiData?.lastName || '',
      email: apiData?.email || '',
      mobile: apiData?.mobile || '',
      address: apiData?.address || ''
    },
    enableReinitialize: true,
    validate: profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      values = await Object.assign(values, { profile: file || apiData?.profile || '' });
      let updatePromise = updateUser(values);

      toast.promise(updatePromise, {
        loading: 'Updating...',
        success: <b>Update Successfully...!</b>,
        error: <b>Could not Update!</b>
      });
    }
  });

  const onUpload = async e => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

  function userLogout() {
    localStorage.removeItem('token');
    navigate('/');
  }

  if (isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>;
  if (serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>;

  return (
    <div className="container mx-auto">
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      <div className='flex justify-center items-center h-screen'>
        <div className="glass" style={{ width: "30%", paddingTop: '2em' }}>
          <div className="title flex flex-col items-center">
            <h4 className='text-4xl font-bold'>Profile</h4>
            <span className='py-2 text-lg w-2/3 text-center text-gray-500'>
              You can update the details.
            </span>
          </div>
          <form className='py-1' onSubmit={formik.handleSubmit}>
            <div className='profile flex justify-center py-2'>
              <label htmlFor="profile">
                <img src={apiData?.profile || file || avatar} className="profile_img" alt="avatar" />
              </label>
              <input onChange={onUpload} type="file" id='profile' name='profile' />
            </div>
            <div className="textbox flex flex-col items-center gap-4">
              <div className="name flex w-full gap-4">
                <input {...formik.getFieldProps('firstName')} className="textbox" type="text" placeholder='FirstName' />
                <input {...formik.getFieldProps('lastName')} className="textbox" type="text" placeholder='LastName' />
              </div>
              <div className="name flex w-full gap-4">
                <input {...formik.getFieldProps('mobile')} className="textbox" type="text" placeholder='Mobile No.' />
                <input {...formik.getFieldProps('email')} className="textbox" type="text" placeholder='Email*' />
              </div>
              <input {...formik.getFieldProps('address')} className="textbox" type="text" placeholder='Address' />
              <button className="btn" type='submit'>Update</button>
            </div>
            <div className="text-center py-2">
              <span className='text-gray-500'>come back later? <button onClick={userLogout} className='text-red-500' to="/">Logout</button></span>
            </div>
          </form>
        </div>
      </div>
      <style jsx>{`
        .glass {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          backdrop-filter: blur(10px);
          padding: 1em;
        }

        .profile_img {
          border-radius: 50%;
          width: 80px;
          height: 80px;
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
        }
      `}</style>
    </div>
  );
}
