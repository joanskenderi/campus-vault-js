import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import * as Yup from 'yup';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

import { login, setRole, setUserId } from '../store/authSlice';
import image from '../assets/login.jpg';
import { useSocket } from '../contexts/socket';

const initialValues = {
  email: '',
  password: '',
};

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const year = new Date().getFullYear();

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useSocket();

  const url = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      handleLogin(token);
    }
  }, []);

  const handleLogin = async (token) => {
    const { id, role } = jwtDecode(token);

    socket.emit('join_room', `user${id}`);
    socket.emit('join_room', `for_${role}`);

    dispatch(setUserId(id));
    dispatch(setRole(role));
    dispatch(login());

    navigate('/home');
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await axios.post(`${url}/login`, values);
      const { token } = response.data;

      localStorage.setItem('token', token);
      handleLogin(token);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrors({ password: 'Email or password is incorrect' });
      } else {
        console.error('Error:', error.message);
      }
    }
    setSubmitting(false);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-light-primary">
      <div className="flex flex-col lg:flex-row w-full max-w-6xl mx-4 md:mx-8 lg:mx-12 h-auto lg:h-[75vh] border bg-light-secondary shadow-default rounded-2xl overflow-hidden border-none">
        <div className="w-full lg:w-1/2 h-64 lg:h-full">
          <img src={image} alt="img" className="w-full h-full object-cover" />
        </div>

        <div className="w-full lg:w-1/2 p-6 flex flex-col justify-center relative">
          <h2 className="mb-9 text-2xl font-bold text-dark-primary text-center">
            Log In to Campus Vault
          </h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-dark-primary">
                    Email
                  </label>
                  <div className="relative">
                    <Field
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      className="w-full rounded-lg border border-light-tertiary bg-transparent py-4 pl-6 pr-10 text-dark-primary outline-none focus:border-dark-quinary focus-visible:shadow-none"
                    />
                    {touched.email && errors.email && (
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-dark-red text-xs italic mt-1"
                      />
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-dark-primary">
                    Password
                  </label>
                  <div className="relative">
                    <Field
                      type={passwordVisible ? 'text' : 'password'}
                      name="password"
                      placeholder="Enter your password"
                      className="w-full rounded-lg border border-light-tertiary bg-transparent py-4 pl-6 pr-10 text-dark-primary outline-none focus:border-dark-quinary focus-visible:shadow-none"
                    />
                    <span
                      className="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer"
                      onClick={togglePasswordVisibility}
                    >
                      {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  {touched.password && errors.password && (
                    <div className="text-dark-red text-xs italic mt-1">
                      {errors.password}
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full cursor-pointer rounded-lg border border-dark-quinary bg-dark-primary p-4 text-light-primary transition hover:bg-dark-primary"
                  >
                    Log In
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <p>
                    Don't have an account? Contact the{' '}
                    <a
                      href="mailto:example@secretary.com"
                      className="text-light-blue hover:underline"
                    >
                      secretary
                    </a>
                    .
                  </p>
                </div>
              </Form>
            )}
          </Formik>
          <div className="absolute bottom-0 left-0 w-full p-6 text-center">
            <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
              © {year}{' '}
              <a
                href="https://github.com/joanskenderi"
                className="text-light-blue hover:text-dark-blue hover:underline"
              >
                Joan Skënderi
              </a>
              . All Rights Reserved.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
