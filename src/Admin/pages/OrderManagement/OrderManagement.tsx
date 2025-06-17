import React, { useEffect } from 'react';
import AdminProfile from '../../components/AdminDashboardHeader/AdminHeader';
import AdminSideNav from '../../components/AdminSideNav/AdminSideNav';
import axios from 'axios';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import {
	CalendarMonthSharp,
	LocalPhoneSharp,
	EmailSharp,
	LocationCitySharp,
} from '@mui/icons-material';
import { Avatar } from '@mui/material';

interface OrderDetails {
	delivery_city: string | null;
	delivery_country: string | null;
	delivery_deadline: string | null;
	delivery_postal_code: string | null;
	delivery_state: string | null;
	delivery_status: string;
	package_description: string;
	recipient_email_address: string;
	recipient_full_name: string;
	recipient_phone_number: string;
}
interface OrderHistory {
	customer_full_name: string;
	profile_image: string;
	customer_email: string;
	customer_phone_number: string;
	order_date: string;
	order_details: OrderDetails;
	order_id: string;
	order_status: string;
}

const OrderManagement: React.FC = () => {
	const [orders, setOrders] = React.useState<OrderHistory[]>([]);
	const token = localStorage.getItem('accessToken');
	const admin_id = localStorage.getItem('user_id');

	React.useEffect(() => {
		const fetchOrders = async () => {
			try {
				const response = await axios.get(
					`https://ziplogistics.pythonanywhere.com/api/admin/admin-order-management/${admin_id}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				const ordersData = response.data.orders_data;
				setOrders(ordersData);
			} catch (error) {
				console.error('Error fetching orders:', error);
			}
		};

		if (token && admin_id) {
			fetchOrders();
		}
	}, [token, admin_id]);

	return (
		<>
			<section className='flex'>
				{/* Admin Side Nav */}
				<AdminSideNav />
				{/* Admin Dashboard Header */}
				<div className='w-full p-5'>
					<AdminProfile content={<h1>Welcome Admin</h1>} profilePic='A' />
					{/* Admin Dashboard Content */}
					<section className='mt-5'>
						<OrderOveriew />
						<h2 className='font-bold text-xl my-5'>Order Details</h2>
						<OrderDetails orders={orders} />
					</section>
				</div>
			</section>
		</>
	);
};

const OrderOveriew: React.FC = () => {
	return (
		<div className='grid grid-cols-3 gap-5'>
			<aside className='w-full bg-gray-100 p-3 rounded-md'>
				<div className='flex justify-between mb-5 font-bold'>
					<p>Total Active Orders</p>
				</div>

				<p className='mb-5'>Number of active Orders</p>
				<h2 className='font-bold text-2xl'>5</h2>
			</aside>

			<aside className='w-full bg-gray-100 p-3 rounded-md'>
				<div className='flex justify-between mb-5 font-bold'>
					<p>Completd Orders</p>
				</div>

				<p className='mb-5'>Total Number of Completed Orders</p>
				<h2 className='font-bold text-2xl'>5</h2>
			</aside>

			<aside className='w-full bg-gray-100 p-3 rounded-md'>
				<div className='flex justify-between mb-5 font-bold'>
					<p>Pending Orders</p>
				</div>

				<p className='mb-5'>Total Number of Pending Orders</p>
				<h2 className='font-bold text-2xl'>5</h2>
			</aside>
		</div>
	);
};

interface OrderDetailsProps {
	orders: OrderHistory[];
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ orders }) => {
	const [order, setOrder] = React.useState<OrderHistory | null>(null);

	useEffect(() => {
		setOrder(orders[0]);
	}, [orders]);

	const handleClick = (orders: OrderHistory) => {
		console.log(orders);
		setOrder(orders);
	};

	return (
		<section className='flex gap-5'>
			<div className='border h-[320px] overflow-y-auto py-1 w-4/5'>
				{orders.map((order: OrderHistory, index: number) => (
					<div
						key={index}
						className='border-b border-t grid grid-cols-5 items-center text-center'
						onClick={() => handleClick(order)}>
						<div className=' w-1/2'>
							<img
								src='https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg'
								alt='profile image'
								className=' w-10 h-10 rounded-full'
							/>
						</div>
						<div>{order.customer_email}</div>
						<div>{order.order_id}</div>
						<div>{order.order_date}</div>
						<div>
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
						</div>
					</div>
				))}
			</div>

			{/* Order */}
			<div className='border overflow-y-auto h-[320px] p-2 w-1/2'>
				{/* ORDER NUMBER AND STATUS */}
				<div className='flex justify-between'>
					<p className='font-bold'>Order Number: {order?.order_id}</p>
					<div>
						{order?.order_status === 'completed' ? (
							<div className='bg-green-500 text-white text-center font-bold px-7'>
								completed
							</div>
						) : order?.order_status === 'pending' ? (
							<div className='bg-orange-500 text-white text-center font-bold px-7'>
								pending
							</div>
						) : (
							<div className='bg-red-500 text-white text-center font-bold px-7'>
								cancelled
							</div>
						)}
					</div>
				</div>
				{/* NOTE SENDER DETAILS */}

				<section className='my-5'>
					<div className='grid grid-cols-2 justify-between items-center'>
						<aside>
							<div className='flex gap-3 items-center mb-3'>
								<Avatar>{order?.customer_full_name[0]}</Avatar>
								<p>{order?.customer_full_name}</p>
							</div>

							{/* <p>{ order}</p> */}
							<span className='flex items-center gap-3 mb-2'>
								<LocalPhoneSharp />
								<p>{order?.customer_phone_number}</p>
							</span>

							<span className='flex items-center gap-3 mb-2'>
								<EmailSharp />
								<p>{order?.customer_email}</p>
							</span>
						</aside>

						<aside className='border p-2'>
							<span className='flex items-center gap-3 mb-2'>
								<AccessTimeFilledIcon />
								<h3>Delivery Dealine</h3>
							</span>
							<span className='flex items-center gap-3 mb-2'>
								<CalendarMonthSharp />
								<p>{order?.order_details.delivery_deadline}</p>
							</span>
						</aside>
					</div>
				</section>

				{/* NOTE DELIVERY DETAILS */}

				<section>
					<h2 className='font-bold'>Delivery Location</h2>
					<div className='grid grid-cols-2 items-center '>
						<aside className='my-2'>
							<span className='flex items-center gap-3 mb-2'>
								<p>Name: {order?.order_details.recipient_full_name}</p>
							</span>
							<span className='flex items-center gap-3 mb-2'>
								<LocalPhoneSharp />
								{order?.order_details.recipient_phone_number}
							</span>
							<span className='flex items-center gap-3 mb-2'>
								<EmailSharp />
								{order?.order_details.recipient_email_address}
							</span>
						</aside>
						<aside>
							<span className='flex items-center gap-3 mb-2'>
								<LocationCitySharp />
								<div>
									<p>{order?.order_details.delivery_city}</p>
									<p>{order?.order_details.delivery_postal_code}</p>
									<p>{order?.order_details.delivery_state}</p>
									<p>{order?.order_details.delivery_country}</p>
								</div>
							</span>
						</aside>
					</div>
				</section>

				{/* NOTE PACKAGE DESCRIPTION */}
				<section>
					<h2 className='font-bold'>Package Description</h2>
					<p>{order?.order_details.package_description}</p>
				</section>
			</div>
		</section>
	);
};
export default OrderManagement;
