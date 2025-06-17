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

interface DriverDetails {
	active_drivers: number;
	inactive_drivers: number;
	drivers_data: DriverProfile[];
}

const DriverOverview: React.FC<{ details: DriverDetails }> = ({ details }) => {
	return (
		<>
			<section className='mt-2  w-4/6'>
				<div className='flex gap-10 '>
					<aside className='w-full bg-gray-100 p-3 rounded-md'>
						<div className='flex justify-between mb-5'>
							<p>Active Drivers</p>
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

						<p className='mb-5'>Total Number of active drivers</p>

						<h1 className='text-2xl font-bold'>{details.active_drivers}</h1>
					</aside>

					<aside className='w-full bg-gray-100 p-3 rounded-md'>
						<div className='flex justify-between mb-5'>
							<p>In-Active Drivers</p>
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

						<p className='mb-5'>Total Number of in-active drivers</p>

						<h1 className='text-2xl font-bold'>{details.inactive_drivers}</h1>
					</aside>
				</div>
			</section>
		</>
	);
};

export default DriverOverview;
