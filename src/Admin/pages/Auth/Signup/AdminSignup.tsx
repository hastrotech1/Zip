// Let's build a very demure signup page

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';
import googleSvg from '../../../../assets/google.svg';

// Define the shape of the form data
interface SignupFormData {
	email: string;
	password: string;
	confirmPassword: string;
}

const AdminSignUp: React.FC = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm<SignupFormData>();

	const [loading, setLoading] = useState(false);
	// Track loading state for form submission
	const [errorMessage, setErrorMessage] = useState('');
	// Display error messages from API
	const [successMessage, setSuccessMessage] = useState('');
	// Display success message on signup

	const password = watch('password');

	// Google Login success handler
	const handleGoogleLoginSuccess = async (tokenResponse: {
		access_token: string;
	}) => {
		try {
			const accessToken = tokenResponse.access_token;
			// console.log("Google Access Token:", accessToken);

			// First, retrieve user information from Google using the access token
			const userInfoResponse = await axios.get(
				`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
						Accept: 'application/json',
					},
				}
			);
			// User info retrieved successfully
			const userInfo = userInfoResponse.data;
			// console.log("User Info:", userInfo);

			// Send the access token to your server for verification/authentication
			const response = await axios.post(
				'https://ziplogistics.pythonanywhere.com/api/google-user-login/customer',
				{
					token: accessToken,
					email: userInfo.email,
				}
			);

			console.log('Google OAuth Success:', response.data);
			setSuccessMessage("Google login successful! You're now logged in.");
			navigate('/admin/dashboard');
		} catch (error) {
			console.error('Google OAuth Error:', error);
			setErrorMessage('Failed to sign in with Google. Please try again.');
		}
	};

	// Google Login error handler
	const handleGoogleLoginError = (error: unknown) => {
		console.error('Google OAuth Error:', error);
		setErrorMessage('Google login failed. Please try again.');
	};

	// Configure Google login to get id_token
	const loginWithGoogle = useGoogleLogin({
		onSuccess: handleGoogleLoginSuccess,
		onError: handleGoogleLoginError,
	});

	// Function to handle form submission and send data to API
	const navigate = useNavigate();
	const onSubmit = async (data: SignupFormData) => {
		setLoading(true);
		setErrorMessage('');
		setSuccessMessage('');
		// /api/create-user/*{placeholder}*

		// add "const response to save the user input"
		try {
			await axios.post(
				'https://ziplogistics.pythonanywhere.com/api/create-user/admin/regular',
				{
					email: data.email,
					password: data.password,
				}
			);
			// On successful sign-up
			setSuccessMessage('Account created successfully!');
			navigate('/admin');
		} catch (error: unknown) {
			// Handle errors from API
			if (axios.isAxiosError(error) && error.response && error.response.data) {
				setErrorMessage(error.response.data.message);
			} else {
				setErrorMessage('An unexpected error occurred. Please try again.');
			}
		} finally {
			setLoading(false);
		}
	};

	// Function to validate password
	const validatePassword = (value: string) => {
		const passwordRegex =
			/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
		return (
			passwordRegex.test(value) ||
			'Password must be at least 8 characters long and include letters, numbers, and special characters.'
		);
	};

	return (
		<section className='p-5 ml-0 mr-0 flex justify-center h-screen gap-32 font-open-sans'>
			<aside className='w-96 md:p-3 md:bg-gray-100 rounded-lg'>
				{/* Heading for the sign-up form */}

				<p className='mb-8 text-xl leading-9 font-semibold'>
					Streamline your logistics management with real-time oversight,
					seamless coordination, and tools built for operational excellence.
				</p>

				{/* Display error or success messages */}

				{errorMessage && (
					<p className='error-message mb-4 text-red-500'>{errorMessage}</p>
				)}
				{successMessage && <p className='success-message'>{successMessage}</p>}

				{/* Form starts here */}

				<form className='signup-form' onSubmit={handleSubmit(onSubmit)}>
					{/* Google sign-up button */}

					<button
						type='button'
						onClick={() => loginWithGoogle()}
						className='mb-4 p-2 w-full border border-b-900 rounded flex justify-center items-center shadow-sm hover:bg-gray-50'>
						<img className='w-5 h-5 mr-2' src={googleSvg} alt='Google logo' />
						Sign up with Google
					</button>

					{/* Separator between Google login and manual registration */}

					<div className='my-4 flex justify-center items-center'>
						<hr className='w-1/5 border-gray-300 justify-center' />
						<span className='px-4 text-gray-500'>or</span>
						<hr className='w-1/5 border-gray-300 justify-center' />
					</div>

					{/* Email input field */}

					<input
						type='email'
						placeholder='Email Address'
						className={`block w-full p-2 border ${
							errors.email ? 'border-red-500' : 'border-gray-300'
						} rounded focus:ring-2 focus:ring-blue-400 mb-4`}
						{...register('email', {
							required: 'Email is required',
							pattern: {
								value: /^\S+@\S+$/i,
								message: 'Invalid email address',
							},
						})}
					/>
					{errors.email && <p className='error-text'>{errors.email.message}</p>}

					{/* Password input field */}

					<input
						type='password'
						placeholder='Password'
						className={`block w-full p-2 border ${
							errors.password ? 'border-red-500' : 'border-gray-300'
						} rounded focus:ring-2 focus:ring-blue-400 mb-4`}
						{...register('password', {
							required: 'Password is required',
							validate: validatePassword,
						})}
					/>
					{errors.password && (
						<p className='error-text'>{errors.password.message}</p>
					)}

					{/* Confirm password input field */}

					<input
						type='password'
						placeholder='Confirm Password'
						className={`block w-full p-2 border ${
							errors.confirmPassword ? 'border-red-500' : 'border-gray-300 mb-4'
						} rounded focus:ring-2 focus:ring-blue-400`}
						{...register('confirmPassword', {
							required: 'Please confirm your password',
							validate: (value) =>
								value === password || 'Passwords do not match',
						})}
					/>
					{errors.confirmPassword && (
						<p className='error-text'>{errors.confirmPassword.message}</p>
					)}

					{/* Submit button */}

					<div className='flex justify-center mt-8'>
						<button
							type='submit'
							className='w-1/2 py-2 bg-black text-white font-semibold rounded-lg'
							disabled={loading}>
							{loading ? 'Signing Up...' : 'Sign Up'}
						</button>
					</div>
				</form>

				{/* Link to log in */}

				<p className='mt-4 text-center text-gray-600'>
					Already have an account?{' '}
					<Link to='/admin' className='text-black font-bold hover:underline'>
						Log In
					</Link>
				</p>
			</aside>
		</section>
	);
};

export default AdminSignUp;
