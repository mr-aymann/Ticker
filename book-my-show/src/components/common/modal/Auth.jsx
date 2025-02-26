import React, { useState } from 'react';
import MainModal from './Main';
import GoogleIcon from '../../../assets/googlelogo.svg';
import MailIcon from '../../../assets/email.svg';
import Input from '../Input';
import { login, register } from '../../../api/auth';
import { formValidation } from '../../../utils/formValidation';
import Button from '../Button';
import { setToken } from '../../../utils/token';

const TEST_CREDENTIALS = {
  email: 'test@example.com',
  password: 'testPassword'
};

const Auth = ({ isOpen, onClose, header }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [inputFields, setInputFields] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });

  const [inputFieldError, setInputFieldError] = useState({});

  const inputHandler = (e) => {
    setInputFields((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));

    setInputFieldError((prev) => ({
      ...prev,
      [e.target.name]: ''
    }));
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
    setInputFieldError({});
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    // For registration, ensure passwords match.
    if (authMode === 'register' && inputFields.password !== inputFields.confirmPassword) {
      setInputFieldError((prev) => ({
        ...prev,
        confirmPassword: 'Passwords do not match'
      }));
      setIsLoading(false);
      return;
    }
  
    // Validate only the necessary fields depending on the auth mode.
    let fieldsToValidate;
    if (authMode === 'login') {
      // For login, only validate email and password.
      fieldsToValidate = {
        email: inputFields.email,
        password: inputFields.password,
      };
    } else {
      // For registration, validate all fields.
      fieldsToValidate = inputFields;
    }
  
    const { isValid, errors } = formValidation(fieldsToValidate);
    if (!isValid) {
      setInputFieldError(errors);
      setIsLoading(false);
      return;
    }
  
    try {
      let response;
      if (authMode === 'login') {
        console.log('Attempting login with payload:', fieldsToValidate);
        response = await login(fieldsToValidate);
      } else {
        // Registration: use name, email, and password only.
        const registrationPayload = {
          name: inputFields.name,
          email: inputFields.email,
          password: inputFields.password,
        };
        console.log('Attempting registration with payload:', registrationPayload);
        response = await register(registrationPayload);
      }
  
      // Check for both 200 (login) and 201 (registration success)
      if (response.status === 200 || response.status === 201) {
        console.log('Login/Register successful. Response:', response);
        // If the API provides an accessToken, store it
        if (response.data.accessToken) {
          setToken(response.data.accessToken);
        }
        // Optionally, show a success message
        alert(response.data.message);
        onClose();
        window.location.reload();
      }
    } catch (err) {
      console.error('Error during auth request:', err);
      // Set a general error message from the response if available
      if (err?.response) {
        setInputFieldError({
          general: err.response.data.message || 'An error occurred. Please try again.',
        });
      } else {
        setInputFieldError({ general: 'An error occurred. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  
  
  
  const loginWithTestCredentials = async () => {
    setTestLoading(true);
    try {
      const response = await login(TEST_CREDENTIALS);
      if (response.status === 200) {
        setToken(response?.data?.accessToken);
        onClose();
        window.location.reload();
      }
    } catch (err) {
      setInputFieldError({
        general: "Failed to login with test credentials. Please try again."
      });
    } finally {
      setTestLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <MainModal header={header} onClose={onClose} isOpen={isOpen}>
      <div className="w-full">
        <form className="flex justify-start items-start w-full flex-col gap-5" onSubmit={submitHandler}>
          {authMode === 'register' && (
            <Input
              type="text"
              placeholder="Enter Name"
              onChangeHandler={inputHandler}
              name="name"
              value={inputFields?.name}
              error={inputFieldError?.name}
            />
          )}

          <Input
            type="text"
            placeholder="Enter Email"
            onChangeHandler={inputHandler}
            name="email"
            value={inputFields?.email}
            error={inputFieldError?.email}
          />

          <Input
            type="password"
            placeholder="Enter Password"
            onChangeHandler={inputHandler}
            name="password"
            value={inputFields?.password}
            error={inputFieldError?.password}
          />

          {authMode === 'register' && (
            <Input
              type="password"
              placeholder="Confirm Password"
              onChangeHandler={inputHandler}
              name="confirmPassword"
              value={inputFields?.confirmPassword}
              error={inputFieldError?.confirmPassword}
            />
          )}

          {inputFieldError?.general && (
            <div className="w-full text-red-500 text-sm">{inputFieldError.general}</div>
          )}

          <div className="w-full text-center mb-2">
            {authMode === 'login' ? (
              <p className="text-sm">
                Don't have an account?{' '}
                <button 
                  type="button"
                  onClick={toggleAuthMode} 
                  className="text-red-500 hover:underline"
                >
                  Register
                </button>
              </p>
            ) : (
              <p className="text-sm">
                Already have an account?{' '}
                <button 
                  type="button"
                  onClick={toggleAuthMode} 
                  className="text-red-500 hover:underline"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>

          <span className="w-full text-center text-sm text-black">OR</span>

          <button
            type="button" 
            onClick={loginWithTestCredentials}
            disabled={testLoading}
            className="flex justify-center items-center w-full border border-gray-100 py-3 rounded-md px-5 transition cursor-pointer text-sm hover:bg-gray-100 bg-gray-50"
          >
            {testLoading ? 'Logging in...' : 'Login with Test Credentials'}
          </button>

          <div className="flex justify-start items-center w-full border border-gray-100 py-3 rounded-md px-5 gap-20 pr-24 transition cursor-pointer text-sm hover:bg-gray-100">
            <div className="w-[10%]">
              <img src={GoogleIcon} alt="google-icon" />
            </div>
            <p className="w-[90%]">Continue with Google</p>
          </div>

          <div className="flex justify-start items-center w-full border border-gray-100 py-3 rounded-md px-5 gap-20 pr-24 transition cursor-pointer text-sm hover:bg-gray-100">
            <div className="w-[10%]">
              <img src={MailIcon} alt="email-icon" />
            </div>
            <p className="w-[90%]">Continue with Email</p>
          </div>

          <Button 
            type="submit" 
            label={authMode === 'login' ? "Sign In" : "Register"} 
            loading={isLoading} 
            classNames="w-full" 
          />
        </form>
      </div>
    </MainModal>
  );
};

export default Auth;
