import resetBg from '../../../../assets/ResetImage.png';
import resetBgOvelay from '../../../../assets/overlay.png';
import { ChangeEvent, useState } from 'react';

const ResetCode = () => {
	// State for the form inputs
	const [code, setCode] = useState(['', '', '', '', '', '']); // Store each input in an array
	const [error, setError] = useState(false);
	const [errMessage, setErrMessage] = useState('');

	// Handle change for each input field
	const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
		const newCode = [...code];
		newCode[index] = e.target.value;
		setCode(newCode);
	};

	// Handle form submission
	const handleSubmit = async (e: { preventDefault: () => void }) => {
		e.preventDefault();
		const codeToSubmit = code.join(''); // Combine all input values into one string

		try {
			const response = await fetch('your-api-endpoint', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ code: codeToSubmit }),
			});

			if (!response.ok) {
				throw new Error('Failed to reset password');
			}

			// Handle successful response
			console.log('Password reset successful');
			setError(false);
		} catch (error) {
			// Handle errors
			setError(true);
			if (error instanceof Error) {
				setErrMessage(error.message);
			} else {
				setErrMessage('An unknown error occurred');
			}
			console.error('Error:', error);
		}
	};

	return (
		<section className='h-svh border-4 border-green- '>
			<div className='flex h-svh'>
				<div className='hidden md:block h-svh w-1/2 relative'>
					<img className='h-full' src={resetBg} alt='' />
					<img
						className='h-full absolute z-10 top-0'
						src={resetBgOvelay}
						alt=''
					/>
				</div>
				<div className='w-full md:w-1/2 flex flex-col justify-center items-center p-8'>
					{!error && (
						<h2 className='mb-10'>Type in the code sent to your mail</h2>
					)}
					{error && (
						<>
							<h2 className='mb-10'>{errMessage}</h2>
						</>
					)}
					{/* Form */}
					<form onSubmit={handleSubmit}>
						{code.map((digit, index) => (
							<input
								key={index}
								className=' border border-black p-2 w-14 mr-2 md:mr-5'
								type='text'
								value={digit}
								onChange={(e) => handleChange(e, index)}
								maxLength={1} // Optional: restrict input to one character
							/>
						))}
						<br />
						<button className='py-2 px-10  text-white font-bold mt-8 bg-blue-950  rounded-md'>
							Submit
						</button>
					</form>
				</div>
			</div>
		</section>
	);
};

export default ResetCode;
