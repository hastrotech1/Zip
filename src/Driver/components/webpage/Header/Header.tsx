// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import ziplug from "../../../../assets/Ziplugs-05.png";

// const Header: React.FC = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <div className="relative bg-white text-black p-4">
//       <div className="flex justify-between items-center">
//         <img src={ziplug} alt="" className="w-[100px]" />
//         <button onClick={toggleMenu} className="focus:outline-none">
//           <svg
//             className="w-6 h-6"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M4 6h16M4 12h16m-7 6h7"
//             ></path>
//           </svg>
//         </button>
//       </div>
//       {isOpen && (
//         <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg">
//           <Link to="/" className="block px-4 py-2 hover:bg-gray-200">
//             Home
//           </Link>
//           <Link to="/login" className="block px-4 py-2 hover:bg-gray-200">
//             Login
//           </Link>

//           <Link to="/sign-up" className="block px-4 py-2 hover:bg-gray-200">
//             Sign Up
//           </Link>
//           <Link to="/drive" className="block px-4 py-2 hover:bg-gray-200">
//             Drive
//           </Link>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Header;

import React from 'react';
import { Link } from 'react-router-dom';
import { NavLink } from '../Types/Types';

const Header: React.FC = () => {
	const [isOpen, setIsOpen] = React.useState(false);

	const navLinks: NavLink[] = [
		{ to: '/', label: 'Home' },
		{ to: '/drive', label: 'Drive' },
		{ to: '/driver-login', label: 'Login' },
		{ to: '/driver-signup', label: 'Sign Up' },
	];

	return (
		<nav className='absolute w-full z-50'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex justify-between h-16'>
					<div className='flex-shrink-0 flex items-center'>
						<Link
							to='/'
							className='font-orbitron text-2xl font-bold text-blue-900'>
							ZIP LOGISTICS
						</Link>
					</div>

					<div className='hidden md:flex items-center space-x-8'>
						{navLinks.map((link) => (
							<Link
								key={link.label}
								to={link.to}
								className='text-gray-700 hover:text-blue-900 transition-colors px-3 py-2 rounded-md text-sm font-medium'>
								{link.label}
							</Link>
						))}
					</div>

					<div className='md:hidden flex items-center'>
						<button
							onClick={() => setIsOpen(!isOpen)}
							className='inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-900 focus:outline-none'>
							<svg
								className='h-6 w-6'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d={
										isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'
									}
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>

			{isOpen && (
				<div className='md:hidden bg-white'>
					<div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
						{navLinks.map((link) => (
							<Link
								key={link.label}
								to={link.to}
								className='block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-900 hover:bg-gray-50'
								onClick={() => setIsOpen(false)}>
								{link.label}
							</Link>
						))}
					</div>
				</div>
			)}
		</nav>
	);
};

export default Header;
