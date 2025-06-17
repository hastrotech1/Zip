import React from 'react';
import AdminProfile from '../../components/AdminDashboardHeader/AdminHeader';
import { useState, useEffect } from 'react';
import Pagination from '@mui/material/Pagination';
import AdminSideNav from '../../components/AdminSideNav/AdminSideNav';
import { Avatar, Rating } from '@mui/material';
import axios from 'axios';

// Note This is a dummy data for the overview section

const month = [
	{
		month: 'January',
	},
	{
		month: 'February',
	},
	{
		month: 'March',
	},
	{
		month: 'April',
	},
	{
		month: 'May',
	},
	{
		month: 'June',
	},
	{
		month: 'July',
	},
	{
		month: 'August',
	},
	{
		month: 'September',
	},
	{
		month: 'October',
	},
	{
		month: 'November',
	},
	{
		month: 'December',
	},
];

const ITEMS_PER_PAGE = 4;

interface OverviewData {
	// Define the structure of your overview data here
	title: string;
	subtitle: string;
	value: string | undefined;
}

interface Driver {
	full_name: string;
	availability_status: string;
	Vehicle_model: string;
	production_year: string;
	location: string;
	rating: number;
	image: string;
}

interface Overview {
	active_orders: string;
	completed_deliveries: string;
	pending_deliveries: string;
	drivers_data: Driver[];
}

const AdminDashboard: React.FC = () => {
	const [overview, setOverview] = useState<Overview | null>(null);

	const [overviewData, setOverviewData] = useState<OverviewData[]>([]);
	const token = localStorage.getItem('accessToken');
	const user_id = localStorage.getItem('user_id');

	useEffect(() => {
		const fetchData = async () => {
			try {
				const responseData = await axios.get(
					'https://ziplogistics.pythonanywhere.com/api/admin/admin-dashboard-overview/' +
						user_id,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				setOverview(responseData.data);
			} catch (error) {
				console.log(error);
			}
		};
		fetchData();
	}, [token, user_id]);

	useEffect(() => {
		if (overview) {
			setOverviewData([
				{
					title: 'Total Active Deliveries',
					subtitle: 'Numbers of On-going deliveries',
					value: overview.active_orders,
				},
				{
					title: 'Completed Deliveries',
					subtitle: 'Total number of  Completed deliveries',
					value: overview.completed_deliveries,
				},
				{
					title: 'Pending Deliveries',
					subtitle: 'Total number of pending deliveries',
					value: overview.pending_deliveries,
				},
			]);
		}
	}, [overview]);

	return (
		<>
			<section className='flex'>
				{/* Admin Side Nav */}
				<AdminSideNav />
				{/* Admin Dashboard Header */}
				<div className='w-full p-5'>
					<AdminProfile content={<h1>Welcome Admin</h1>} profilePic='A' />
					{/* Admin Dashboard Content */}
					<div className='mt-8 flex space-x-3 w-full'>
						<Overview data={overviewData} />
					</div>

					<section className='mt-5'>
						<h2 className='text-xl'>Driver Availability</h2>
						<aside className='mt-2 flex justify-between items-center'>
							{/* Availability details */}
							<div className='flex space-x-5 border-2 px-2'>
								<div className='flex items-center gap-2'>
									<span className='bg-blue-800 h-3 w-3 block rounded-lg'></span>
									On Delivery
								</div>
								<div className='flex items-center gap-2'>
									<span className='bg-red-600 h-3 w-3 block rounded-lg'></span>{' '}
									Unavailable
								</div>
								<div className='flex items-center gap-2'>
									<span className='bg-green-600 h-3 w-3 block rounded-lg'></span>
									Available
								</div>
							</div>

							{/* Date Ch0ice */}
							<div>
								<select
									name='availability'
									id='availabilty'
									className='bg-black text-white text-xl rounded-md p-0.5'>
									{month.map((item, index: number) => {
										return (
											<option key={index} value={item.month}>
												{item.month}
											</option>
										);
									})}
								</select>
							</div>
						</aside>
					</section>

					<section className='mt-5'>
						<PaginatedDrivers driverData={overview?.drivers_data || []} />
					</section>
				</div>
			</section>
		</>
	);
};

const Overview: React.FC<{ data: OverviewData[] }> = ({ data }) => {
	return data.map((item: OverviewData, index: number) => {
		return (
			<div key={index} className='w-full'>
				<div className='p-5 rounded-md shadow-md bg-gray-50 space-y-4'>
					<div className='flex justify-between items-center'>
						<h1 className='text-base'>{item.title}</h1>
						<select
							name='month'
							id='month'
							className='rounded-md text-sm bg-black text-white font-bold'>
							{month.map((item, index: number) => {
								return (
									<option key={index} value={item.month}>
										{item.month}
									</option>
								);
							})}
						</select>
					</div>
					<p>{item.subtitle}</p>
					<h1 className='text-3xl'>{item.value}</h1>
				</div>
			</div>
		);
	});
};

const PaginatedDrivers: React.FC<{ driverData: Driver[] }> = ({
	driverData,
}) => {
	const [page, setPage] = useState(1);
	const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
		setPage(value);
	};

	const paginatedData = driverData.slice(
		(page - 1) * ITEMS_PER_PAGE,
		page * ITEMS_PER_PAGE
	);

	console.log(paginatedData);

	return (
		<>
			{paginatedData.map((item, index: number) => (
				<div key={index} className='flex items-center gap-5 w-full border mt-2'>
					<div>
						<Avatar src={item.image} />
					</div>
					<div className='grid grid-cols-5  gap-5 items-center text-center justify-between w-full'>
						<div>{item.full_name || 'nil'}</div>
						{item.availability_status === 'available' ? (
							<div className='w-full flex justify-center'>
								<div className='bg-green-600 h-3 w-3  rounded-lg'></div>
							</div>
						) : item.availability_status === 'unavailable' ? (
							<div className='w-full flex justify-center'>
								<div className='bg-red-600 h-3 w-3 block rounded-lg'></div>
							</div>
						) : (
							<div className='w-full flex justify-center'>
								<div className='bg-blue-800 h-3 w-3 block rounded-lg'></div>
							</div>
						)}

						<div>
							{item.Vehicle_model || '2025'}
							{'/'}
							{item.production_year || '2020'}
						</div>
						<div>{item.location || 'Lagos, Nigeria'}</div>
						<div>
							<Rating value={item.rating | 5} readOnly />
						</div>
					</div>
				</div>
			))}
			<Pagination
				count={Math.ceil(driverData.length / ITEMS_PER_PAGE)}
				page={page}
				onChange={handleChange}
				color='primary'
				className='mt-4 float-right absolute bottom-5 right-5'
			/>
		</>
	);
};

export default AdminDashboard;
