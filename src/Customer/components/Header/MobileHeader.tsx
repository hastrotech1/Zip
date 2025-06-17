import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Link as Scroll } from 'react-scroll';
import MenuIcon from '@mui/icons-material/Menu';
import ziplug from '../../../assets/Ziplugs-04.png';

const MobileHeader: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div className='relative text-white p-4'>
			<div className='flex justify-between items-center'>
				<img src={ziplug} alt='' className='w-[100px]' />

				<MenuIcon
					onClick={toggleMenu}
					className='cursor-pointer text-white text-3xl'
				/>
			</div>
			{isOpen && (
				<div className='absolute -right-1 w-60 bg-white text-black rounded-lg shadow-lg grid gap-3 p-5 mt-4'>
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
						to='services'
						duration={1000}
						smooth={true}
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
						duration={1000}
						smooth={true}
						className='block px-2 py-1 hover:bg-gray-200 rounded-lg hover:text-black'>
						About us
					</Scroll>

					<Link
						to='/login'
						className='block px-2 py-1 hover:bg-gray-200 rounded-lg hover:text-black'>
						Login
					</Link>

					<Link
						to='/sign-up'
						className='block px-2 py-1 bg-gray-200 rounded-lg text-black'>
						Sign Up
					</Link>
				</div>
			)}
		</div>
	);
};

export default MobileHeader;
