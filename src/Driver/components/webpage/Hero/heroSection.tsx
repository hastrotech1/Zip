import React from 'react';
import { Link } from 'react-router-dom';
import TRUCK from '../../../../assets/TRUCK.jpg';

const HeroSection: React.FC = () => {
	return (
		<div className='bg-white pt-16'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>
				<div className='flex flex-col items-center'>
					<div className='text-center mb-12'>
						<h1 className='text-4xl md:text-5xl font-bold text-blue-900 mb-6'>
							Drive Your Future with Zip Logistics
						</h1>
						<p className='text-lg text-gray-600 mb-8 max-w-2xl mx-auto'>
							Join our network of professional drivers and take control of your
							career. Flexible schedules, competitive pay, and consistent
							opportunities await.
						</p>
						<div className='space-x-4'>
							<Link
								to='/driver-signup'
								className='inline-block px-6 py-3 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors'>
								Start Driving
							</Link>
							<Link
								to='/driver-login'
								className='inline-block px-6 py-3 border border-blue-900 text-blue-900 font-medium rounded-lg hover:bg-blue-50 transition-colors'>
								Driver Login
							</Link>
						</div>
					</div>
					<div className='w-full max-w-4xl'>
						<img
							src={TRUCK}
							alt='Delivery driver'
							className='w-full rounded-lg border-10 border-gray-200'
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HeroSection;
