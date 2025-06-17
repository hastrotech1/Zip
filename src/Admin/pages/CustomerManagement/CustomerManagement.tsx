import React from 'react';
import AdminProfile from '../../components/AdminDashboardHeader/AdminHeader';
import AdminSideNav from '../../components/AdminSideNav/AdminSideNav';
import TextField from '@mui/material/TextField';
import axios from 'axios';
// import SearchIcon from '@mui/icons-material/Search';

interface Customer {
	full_name: string;
	phone_number: string;
	email: string;
	number_of_orders: number;
	order_history: OrderHistory[];
}

interface OrderHistory {
	order_id: string;
	order_fee: number;
	order_status: string;
	order_date: string;
	payment_type: string | null;
}
const CustomerManagement: React.FC = () => {
	// const [search, setSearch] = React.useState('');

	const [customers, setCustomers] = React.useState<Customer[]>([]);
	const [prevData, setPrevData] = React.useState<Customer[]>([]);
	const [customerProfile, setCustomerProfile] = React.useState<Customer | null>(
		null
	);

	const token = localStorage.getItem('accessToken');
	const user_id = localStorage.getItem('user_id');

	React.useEffect(() => {
		const fetchCustomers = async () => {
			try {
				const response = await axios.get(
					`https://ziplogistics.pythonanywhere.com/api/admin/admin-customer-management/${user_id}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				const customersData = response.data.customers_data;
				setCustomers(customersData);
				setPrevData(customersData);
				setCustomerProfile(customersData[0]);
			} catch (error) {
				console.error('Error fetching customers:', error);
			}
		};

		if (token && user_id) {
			fetchCustomers();
		}
	}, [token, user_id]);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const search = e.target.value.toLowerCase();
		if (search === '') {
			setCustomers(prevData);
		} else {
			const filteredCustomers = prevData.filter((customer) =>
				customer.full_name.toLowerCase().includes(search)
			);
			setCustomers(filteredCustomers);
		}
	};

	const handleCustomerProfile = (e: React.MouseEvent<HTMLDivElement>) => {
		const customerName = e.currentTarget.querySelector('h1')?.textContent;
		const customer = prevData.find(
			(customer) => customer.full_name === customerName
		);
		if (customer) {
			setCustomerProfile(customer);
		}
	};

	return (
		<>
			<section className='flex overflow-hidden'>
				{/* Admin Side Nav */}
				<AdminSideNav />
				{/* Admin Dashboard Header */}
				<div className='w-full p-5'>
					<AdminProfile content={<h1>Welcome Admin</h1>} profilePic='A' />
					{/* Admin Dashboard Content */}
					<div className='my-3 text-2xl'>Customer's Profile</div>

					<section className='flex gap-10'>
						<div className='w-2/4 border-x-2 pt-1 border-b-2 rounded-md  overflow-y-auto h-[460px]'>
							{/* Search bottom */}
							<TextField
								id='outlined-basic'
								label='Search Customer'
								variant='outlined'
								className='w-full'
								size='small'
								onChange={handleSearch}
							/>

							{/* All Customer Profile */}

							{customers.map((customer: Customer, index: number) => {
								return (
									<>
										<div
											className='mt-1 border-b'
											key={index}
											onClick={handleCustomerProfile}>
											<div className='flex gap-5 items-center'>
												<div className='w-1/5'>
													<img
														src='https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg'
														alt='profile'
														className='w-14 h-14 rounded-full'
													/>
												</div>
												<div className='grid grid-cols-2  w-full items-center'>
													<h1>{customer.full_name || 'Anon'}</h1>
													<p className='text-sm'>
														Phone No: {customer.phone_number || 'nil'}
													</p>
												</div>
											</div>
										</div>
									</>
								);
							})}
						</div>
						<div className='w-full'>
							{customerProfile && (
								<section className='border-2 rounded-md px-5 py-2'>
									<div className='mb-5'>
										<img
											src='https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg'
											alt='profile image'
											className='w-14 h-14 rounded-full'
										/>
									</div>
									{/* details */}
									<div className='grid gap-2'>
										<h1 className='font-bold text-xl'>Personal Information</h1>
										<p className=''>Name: {customerProfile.full_name}</p>
										<p>Phone Number: {customerProfile.phone_number}</p>
										<p>Email: {customerProfile.email}</p>
									</div>

									{/* Order History */}
									<div className='mt-5'>
										<h1 className='font-bold text-xl'>Order History</h1>
										<div className='h-[230px] overflow-y-auto'>
											{customerProfile.order_history.length === 0 ? (
												<h1 className='text-center text-xl font-medium'>
													No Order Yet
												</h1>
											) : (
												customerProfile.order_history.map((order, index) => {
													return (
														<div
															key={index}
															className='border-b border-t grid grid-cols-5'>
															<p>{order.order_date}</p>
															<p>{order.order_id}</p>
															<p>₦{order.order_fee}</p>
															<p>{order.payment_type || 'nil'}</p>
															<p>
																{order.order_status === 'completed' ? (
																	<div className='bg-green-500 text-white text-center font-bold'>
																		completed
																	</div>
																) : order.order_status === 'pending' ? (
																	<div className='bg-orange-500 text-white text-center font-bold'>
																		pending
																	</div>
																) : (
																	<div className='bg-red-500 text-white text-center font-bold'>
																		cancelled
																	</div>
																)}
															</p>
														</div>
													);
												})
											)}
										</div>
									</div>
								</section>
							)}
						</div>
					</section>
				</div>
			</section>
		</>
	);
};

export default CustomerManagement;
