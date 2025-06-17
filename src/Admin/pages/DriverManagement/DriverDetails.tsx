import React, { useEffect } from 'react';

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

interface DriverDetailsProps {
	drivers: DriverProfile[];
}

const DriverDetails: React.FC<DriverDetailsProps> = ({ drivers }) => {
	const [selectedDriver, setSelectedDriver] =
		React.useState<DriverProfile | null>(
			drivers.length > 0 ? drivers[0] : null
		);

	useEffect(() => {
		if (drivers.length > 0) {
			setSelectedDriver(drivers[0]);
		}
	}, [drivers]);

	const handleDriverSelection = (driver: DriverProfile) => {
		setSelectedDriver(driver);
	};

	return (
		<section className='flex mt-5 gap-14'>
			{/* Driver Profile List */}
			<div className='w-2/4 h-[390px]'>
				<HeaderWithSearch />
				<DriverList drivers={drivers} onSelectDriver={handleDriverSelection} />
			</div>

			{/* Driver Details Display */}
			<div className='w-full h-[390px] overflow-y-auto'>
				{selectedDriver ? (
					<DriverProfileDisplay details={selectedDriver} />
				) : (
					<p>No Driver Found</p>
				)}
			</div>
		</section>
	);
};

const HeaderWithSearch: React.FC = () => (
	<>
		{/* Header */}
		<aside className='flex justify-between'>
			<h1 className='text-xl'>Driver's Profile</h1>
			<select
				name='location'
				id='location'
				className='rounded-md text-sm bg-black text-white font-bold'>
				<option value='Lagos'>Lagos</option>
			</select>
		</aside>

		{/* Search Input */}
		<aside className='flex gap-5 my-3'>
			<input
				type='text'
				placeholder='Search Driver'
				className='px-2 w-full border-b-2 border-gray-300'
			/>
		</aside>
	</>
);

interface DriverListProps {
	drivers: DriverProfile[];
	onSelectDriver: (driver: DriverProfile) => void;
}

const DriverList: React.FC<DriverListProps> = ({ drivers, onSelectDriver }) => (
	<div className='rounded-md pt-2 overflow-y-auto h-[310px] border'>
		{drivers.map((driver, index: number) => (
			<div
				key={index}
				className='mt-1 border-b cursor-pointer'
				onClick={() => onSelectDriver(driver)}>
				<div className='flex gap-5 items-center'>
					<div className='w-1/5'>
						<img
							src='https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg'
							alt='profile'
							className='w-10 h-10 rounded-full'
						/>
					</div>
					<div className='grid grid-cols-2 w-full items-center'>
						<h1>{driver.full_name || 'Anonnymous'}</h1>
						<p className='text-sm'>Phone No: {driver.phone_number || 'nil'}</p>
					</div>
				</div>
			</div>
		))}
	</div>
);

interface DriverProfileDisplayProps {
	details: DriverProfile;
}

const DriverProfileDisplay: React.FC<DriverProfileDisplayProps> = ({
	details,
}) => (
	<section className='w-full'>
		{/* Profile Image */}
		<div className='mb-5'>
			<img
				src='https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg'
				alt='profile'
				className='w-14 h-14 rounded-full'
			/>
		</div>

		{/* Personal Details */}
		<div className='grid gap-2'>
			<h1 className='font-bold text-xl'>Personal Information</h1>
			<p>Name: {details.full_name}</p>
			<p>Phone Number: {details.phone_number}</p>
			<p>Email: {details.email}</p>
		</div>

		{/* vehivle Details */}
		<div className='grid gap-2'>
			<h1 className='font-bold text-xl mt-5'>Vehicle Information</h1>
			<p>Make: {details.vehicle_make}</p>
			<p>Model: {details.vehicle_model}</p>
			<p>License Plate: {details.licsence_plate}</p>
			<p>Production Year: {details.production_year}</p>
			<p>Insurance Policy Number: {details.vehicle_insurance_policy_number}</p>
			<p>
				Inspection Report:{' '}
				<img
					src={details.vehicle_inspection_report}
					alt='vehicle inspection report attachment'
				/>
			</p>
		</div>

		{/* vehivle Details */}
	</section>
);

export default DriverDetails;
