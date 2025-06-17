import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const HeroBanner = () => {
	const [formData, setFormData] = useState({
		name: '',
		number: '',
		email: '',
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// Handle form submission logic here
	};

	return (
		<section className=' text-white p-5 md:py-14 md:px-14'>
			<div className='container mx-auto flex flex-col md:flex-row items-center justify-center gap-10'>
				<div className='md:w-1/2 space-y-6'>
					<h1 className='font-orbitron font-bold text-3xl leading-tight'>
						Zip Through Your Deliveries With Speed and Precision
					</h1>
					<div className='space-y-3'>
						<p className='text-xl'>
							Seamless, reliable, and fast logistics solutions tailored to your
							needs.
						</p>
						<p className='text-xl'>
							Dedicated to providing logistics services that are not just fast,
							but also meticulously reliable.
						</p>
					</div>
					<Button
						variant='secondary'
						size='lg'
						className='w-1/3 font-black text-xl'>
						Zip it
					</Button>
				</div>

				<Card className='hidden md:block md:w-1/2 border-none bg-white bg-opacity-10  text-white'>
					<CardHeader>
						<CardTitle className='text-2xl font-orbitron '>
							Place Order
						</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className='space-y-4'>
							<Input
								className='bg-transparent border-2 border-white text-white placeholder:text-white/70 font-orbitron'
								type='text'
								name='name'
								value={formData.name}
								onChange={handleChange}
								placeholder='Full name'
							/>
							<Input
								className='bg-transparent border-2 border-white text-white placeholder:text-white/70 font-orbitron'
								type='tel'
								name='number'
								value={formData.number}
								onChange={handleChange}
								placeholder='Phone Number'
							/>
							<Input
								className='bg-transparent border-2 border-white text-white placeholder:text-white/70 font-orbitron'
								type='email'
								name='email'
								value={formData.email}
								onChange={handleChange}
								placeholder='Email Address'
							/>
							<Button
								variant='secondary'
								className='w-40 bg-blue-500 hover:bg-blue-700 font-bold text-white text-2xl'>
								Order
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</section>
	);
};

export default HeroBanner;
