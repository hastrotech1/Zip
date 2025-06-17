import React, { useState } from 'react';
import Containerimage from '../../../../assets/Containerimage.png';

const ResetPassword: React.FC = () => {
	const [email, setEmail] = useState<string>('');
	const [message, setMessage] = useState<string>('');

	const handleResetPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await fetch('/api/reset-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email }),
			});

			if (response.ok) {
				setMessage('A password reset link has been sent to your email.');
			} else {
				setMessage('Failed to send reset link. Please try again.');
			}
		} catch (error) {
			console.error('Error during password reset:', error);
			setMessage('Something went wrong. Please try again later.');
		}
	};

	return (
		<div className='reset-password-container flex h-screen'>
			<div className=' hidden md:block image-side w-1/2 bg-blue-900 bg-blend-overlay'>
				<img
					src={Containerimage}
					alt='Container'
					className='h-full object-cover'
				/>
			</div>

			<div className='form-side w-full md:w-1/2 flex flex-col justify-center items-center p-8'>
				<h2 className='text-xl font-bold mb-6'>Reset Password</h2>
				<form onSubmit={handleResetPassword} className='w-full max-w-sm'>
					<input
						type='email'
						placeholder='Email Address'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className='input-field p-3 border rounded-md w-full mb-4'
						required
					/>
					<button
						type='submit'
						className='reset-btn bg-blue-600 text-white px-4 py-2 rounded-md w-full'>
						Reset
					</button>
				</form>
				{message && <p className='mt-4 text-blue-600'>{message}</p>}
			</div>
		</div>
	);
};

export default ResetPassword;
