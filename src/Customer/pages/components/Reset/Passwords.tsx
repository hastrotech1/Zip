import React, { useState } from 'react';
import Cntainerimage from '.././../../../assets/Containerimage.png';

const NewPassword: React.FC = () => {
	const [password, setPassword] = useState<string>('');
	const [confirmPassword, setConfirmPassword] = useState<string>('');
	const [message, setMessage] = useState<string>('');

	const handleResetPassword = async (e: React.FormEvent) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			setMessage('Passwords do not match.');
			return;
		}

		try {
			const response = await fetch('/api/set-new-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ password }),
			});

			if (response.ok) {
				setMessage('Your password has been reset successfully.');
			} else {
				setMessage('Failed to reset password. Please try again.');
			}
		} catch (error) {
			console.error('Error resetting password:', error);
			setMessage('Something went wrong. Please try again later.');
		}
	};

	return (
		<div className='reset-password-container flex h-screen'>
			<div className='hidden md:block image-side w-1/2 bg-blue-900'>
				<img
					src={Cntainerimage}
					alt='Container'
					className='h-full object-cover'
				/>
			</div>

			<div className='form-side w-full md:w-1/2 flex flex-col justify-center items-center p-8'>
				<h2 className='text-xl font-bold mb-6'>New Password</h2>
				<form onSubmit={handleResetPassword} className='w-full max-w-sm'>
					<input
						type='password'
						placeholder='Password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className='input-field p-3 border rounded-md w-full mb-4'
						required
					/>
					<input
						type='password'
						placeholder='Confirm Password'
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
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

export default NewPassword;
