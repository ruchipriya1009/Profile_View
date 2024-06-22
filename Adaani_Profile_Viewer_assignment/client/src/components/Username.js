import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png';
import { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { usernameValidate } from '../helper/validate'
import { useAuthStore } from '../store/store'

export default function Username() {

  const navigate = useNavigate();
  const setUsername = useAuthStore(state => state.setUsername);

  const formik = useFormik({
    initialValues : {
      username : ''
    },
    validate : usernameValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit : async values => {
      setUsername(values.username);
      navigate('/password')
    }
  })

  const styles = {
    container: {
      maxWidth: '350px',
      margin: '0 auto',
      padding: '20px',
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    profileImg: {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
    },
    textbox: {
      width: '80%',
      padding: '10px',
      fontSize: '14px',
      border: '1px solid #ccc',
      borderRadius: '5px',
    },
    button: {
      padding: '10px 20px',
      fontSize: '14px',
      backgroundColor: '#ff5a5f',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    buttonHover: {
      backgroundColor: '#e14e56',
    },
  };

  return (
    <div className="container mx-auto">

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='flex justify-center items-center h-screen'>
        <div style={styles.container}>

          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>Hello Users</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              Explore More by connecting with us.
            </span>
          </div>

          <form className='py-1' onSubmit={formik.handleSubmit}>
              <div className='profile flex justify-center py-4'>
                  <img src={avatar} style={styles.profileImg} alt="avatar" />
              </div>

              <div className="textbox flex flex-col items-center gap-6">
                  <input {...formik.getFieldProps('username')} style={styles.textbox} type="text" placeholder='Username' />
                  <button style={styles.button} type='submit'>Let's Go</button>
              </div>

              <div className="text-center py-4">
                <span className='text-gray-500'>Not a Member <Link className='text-red-500' to="/register">Register Now</Link></span>
              </div>

          </form>

        </div>
      </div>
    </div>
  )
}
