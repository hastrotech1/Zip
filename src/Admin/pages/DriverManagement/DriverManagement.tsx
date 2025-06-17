import React from 'react';
import AdminProfile from '../../components/AdminDashboardHeader/AdminHeader';

import AdminSideNav from '../../components/AdminSideNav/AdminSideNav';
import axios from 'axios';
import DriverDetails from './DriverDetails';
import DriverOverview from './DriverOverview';

interface DriverProfile {
	driver_id: string;
	full_name: string;
	phone_number: string;
	email: string;
	driver_number_of_deliveries: number;
	vehicle_make: string;
	vehicle_model: string;
	licsence_plate: string;
	production_year: string;
	vehicle_insurance_policy_number: string;
	vehicle_inspection_report: string;
}
interface DriverDetailsData {
	active_drivers: number;
	inactive_drivers: number;
	drivers_data: DriverProfile[];
}

const DriverManagement: React.FC = () => {
	const [driverData, setDriverData] = React.useState<DriverDetailsData>({
		active_drivers: 0,
		inactive_drivers: 0,
		drivers_data: [],
	} as DriverDetailsData);
	const token = localStorage.getItem('accessToken');
	const adminId = localStorage.getItem('user_id');

	React.useEffect(() => {
		const fetchData = async () => {
			const response = await axios.get(
				`https://ziplogistics.pythonanywhere.com/api/admin/admin-driver-management/${adminId}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setDriverData(response.data);
		};

		fetchData();
	}, [token, adminId]);
	return (
		<>
			<section className='flex'>
				{/* Admin Side Nav */}
				<AdminSideNav />
				{/* Admin Dashboard Header */}
				<div className='w-full px-5'>
					<AdminProfile content={<h1>Welcome Admin</h1>} profilePic='A' />
					{/* Admin Dashboard Content */}
					<DriverOverview details={driverData} />
					<DriverDetails drivers={driverData.drivers_data} />
				</div>
			</section>
		</>
	);
};

export default DriverManagement;
