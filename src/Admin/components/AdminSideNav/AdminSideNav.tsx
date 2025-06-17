import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';
import ziplugs from '../../../assets/Ziplugs-04.png';
import { useNavigate } from 'react-router-dom';

const AdminSideNav: React.FC = () => {
	const navigate = useNavigate();

	// Log out handler
	const handleLogout = (event: React.MouseEvent<HTMLAnchorElement>) => {
		event.preventDefault();
		localStorage.removeItem('accessToken');
		localStorage.removeItem('user_id');
		// Redirect user to login page or another page if necessary
		navigate('/admin');
	};

	return (
		<div className='flex h-screen'>
			{/* Sidebar */}
			<aside className='bg-black w-72 text-white p-4  pb-4 font-bold text-2xl overflow-hidden'>
				<div className='top-15'>
					<img src={ziplugs} alt='Ziplugs logo' />
				</div>
				<div className='mt-16 grid place-content-center text-xl'>
					{/* Sidebar Navigation */}
					<NavLink />
				</div>

				{/* Log Out Button */}
				<div className='absolute bottom-5 pl-4 hover:bg-white hover:text-[#0a1172] hover:rounded'>
					<Link
						to='/auth/admin/login'
						onClick={handleLogout}
						className='flex items-center space-x-2'>
						<LogoutIcon />
						<span>Log Out</span>
					</Link>
				</div>
			</aside>
		</div>
	);
};

const NavLink = () => {
	const [activeLink, setActiveLink] = useState<string | null>(null);

	const handleLinkClick = (
		link: string,
		event: React.MouseEvent<HTMLElement>
	) => {
		event.preventDefault(); // Prevent the default anchor click behavior
		setActiveLink(link);
	};

	return (
		<nav className='space-y-4 text-base'>
			<div onClick={(event) => handleLinkClick('link1', event)}>
				<Link
					to='/admin/dashboard'
					className={`flex items-center space-x-2 hover:bg-white hover:text-[#0a1172] hover:rounded p-1 ${
						activeLink === 'link1' ? 'bg-white text-[#0a1172] rounded' : ''
					}`}>
					<HomeIcon />
					<span>Home</span>
				</Link>
			</div>

			<div onClick={(event) => handleLinkClick('link2', event)}>
				<Link
					to='/admin/driver-management'
					className={`flex items-center space-x-2 hover:bg-white hover:text-[#0a1172] hover:rounded p-1 ${
						activeLink === 'link2' ? 'bg-white text-[#0a1172] rounded' : ''
					}`}>
					<LocalShippingIcon />
					<span>Driver Management</span>
				</Link>
			</div>

			<div onClick={(event) => handleLinkClick('link3', event)}>
				<Link
					to='/admin/customer-management'
					className={`flex items-center space-x-2 hover:bg-white hover:text-[#0a1172] hover:rounded p-1 ${
						activeLink === 'link3' ? 'bg-white text-[#0a1172] rounded' : ''
					}`}>
					<AddLocationIcon />
					<span>Customer Management</span>
				</Link>
			</div>

			<div onClick={(event) => handleLinkClick('link4', event)}>
				<Link
					to='/admin/order-management'
					className={`flex items-center space-x-2 hover:bg-white hover:text-[#0a1172] hover:rounded p-1 ${
						activeLink === 'link4' ? 'bg-white text-[#0a1172] rounded' : ''
					}`}>
					<HelpIcon />
					<span>Order Management</span>
				</Link>
			</div>
		</nav>
	);
};

export default AdminSideNav;
