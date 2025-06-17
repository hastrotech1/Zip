import React from 'react';
import { Link as Scroll } from 'react-scroll';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
	return (
		<div className='flex items-center justify-between text-white pl-40 pr-10 py-3'>
			<div className='flex font-bold text-xl items-center space-x-5'>
				<Link
					to='/drive'
					className='block px-2 py-1 hover:bg-gray-200 rounded-lg hover:text-black'>
					Drive
				</Link>

				<Scroll
					to='track'
					smooth={true}
					duration={1000}
					className='block px-2 py-1 hover:bg-gray-200 rounded-lg hover:text-black'>
					TrackShipment
				</Scroll>

				<Scroll
					smooth={true}
					duration={1000}
					to='services'
					className='block px-2 py-1 hover:bg-gray-200 rounded-lg hover:text-black'>
					Services
				</Scroll>

				<Scroll
					to='contact'
					smooth={true}
					duration={1000}
					className='block px-2 py-1 hover:bg-gray-200 rounded-lg hover:text-black'>
					Contact us
				</Scroll>

				<Scroll
					to='about'
					smooth={true}
					duration={1000}
					className='block px-2 py-1 hover:bg-gray-200 rounded-lg hover:text-black'>
					About us
				</Scroll>
			</div>
			<div className='flex items-center space-x-5 font-bold'>
				<Link
					to='/login'
					className='block px-2 py-1 hover:bg-gray-200 rounded-lg hover:text-black'>
					Login
				</Link>

				<Link
					to='/sign-up'
					className='block px-2 py-1 hover:bg-gray-200 rounded-lg text-white hover:text-black'>
					Sign Up
				</Link>
			</div>
		</div>
	);
};

export default Header;
