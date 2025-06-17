import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
	return (
		<div className='px-4 md:px-14'>
			{/*// ! Would be replaced by header component or might just leave it this way*/}

			<div className='mb-9 gap-2 flex flex-col-reverse md:grid '>
				<div className='flex md:flex-row gap-2 md:gap-5 md:ml-36 font-bold'>
					<Link to='/'>Drive</Link>
					<Link to='/'>Services</Link>
					<Link to='/'>Customer Service</Link>
					<Link to='/'>Track Shipment</Link>
				</div>

				<div>
					<h2 className='text-4xl md:text-7xl text-blue-800 font-black font-orbitron '>
						ZIP LOGISTICS
					</h2>
				</div>
			</div>
		</div>
	);
};

export default Footer;
