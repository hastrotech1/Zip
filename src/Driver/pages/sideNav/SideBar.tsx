import React from 'react';
import { Link } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/ui/Icons';
import { LogOut } from 'lucide-react';
import logo from '@/assets/Ziplugs-04.png';
import auth from '../../../../helper/authenticate';

const SideBar: React.FC = () => {
	const { driverLogout } = auth;

	const navLinks = [
		{
			to: '/driver-dashboard',
			label: 'Home',
			icon: Icons.home,
		},
		{
			to: '/deliveries',
			label: 'Deliveries',
			icon: Icons.truck,
		},
		{
			to: '/delivery-history',
			label: 'Delivery History',
			icon: Icons.history,
		},
		// {
		//   to: "/earning-overview",
		//   label: "Earning Overview",
		//   icon: Icons.payment,
		// },
		{
			to: '/driver-help',
			label: 'Help',
			icon: Icons.help,
		},
		{
			to: '/driver-settings',
			label: 'Settings',
			icon: Icons.settings,
		},
	];

	return (
		<aside className='fixed left-0 top-0 h-screen w-64 bg-[#1320d8] text-primary-foreground p-4 flex flex-col'>
			<div className='mb-8'>
				<img src={logo} alt='Ziplugs Logo' className='h-12 w-auto mx-auto' />
			</div>

			<nav className='flex-grow space-y-2'>
				{navLinks.map((link) => (
					<Link
						key={link.to}
						to={link.to}
						className={cn(
							buttonVariants({ variant: 'ghost' }),
							'w-full justify-start hover:bg-accent hover:text-[#1320d8]'
						)}>
						<link.icon className='mr-2 h-5 w-5' />
						{link.label}
					</Link>
				))}
			</nav>

			<div className='mt-auto'>
				<button
					onClick={() => driverLogout()}
					className={cn(
						buttonVariants({ variant: 'destructive' }),
						'w-full justify-start bg-transparent hover:bg-white hover:text-[#1320d8]'
					)}>
					<LogOut className='mr-2 h-5 w-5 bg-transparent' />
					Log Out
				</button>
			</div>
		</aside>
	);
};

export default SideBar;
