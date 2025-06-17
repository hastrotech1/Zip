// import React from 'react';
// import { Link } from 'react-router-dom';

// const Footer: React.FC = () => {
// 	return (
// 		<div className='px-4 md:px-14'>
// 			{/*// ! Would be replaced by header component or might just leave it this way*/}

// 			<div className='mb-9 gap-2 flex flex-col-reverse md:grid '>
// 				<div className='flex md:flex-row gap-2 md:gap-5 md:ml-36 font-bold'>
// 					<Link to='/'>Drive</Link>
// 					<Link to='/'>Services</Link>
// 					<Link to='/'>Customer Service</Link>
// 					<Link to='/'>Track Shipment</Link>
// 				</div>

// 				<div>
// 					<h2 className='text-4xl md:text-7xl text-blue-800 font-black font-orbitron '>
// 						ZIP LOGISTICS
// 					</h2>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export default Footer;

import React from 'react';
import { Link } from 'react-router-dom';
import { NavLink } from '../Types/Types';

const Footer: React.FC = () => {
  const footerLinks: NavLink[] = [
    { label: 'Drive', to: '/drive' },
    { label: 'Services', to: '/services' },
    { label: 'Customer Service', to: '/support' },
    { label: 'Track Shipment', to: '/track' }
  ];

  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0">
            <Link to="/" className="font-orbitron text-3xl font-bold text-blue-900">
              ZIP LOGISTICS
            </Link>
          </div>
          <div className="flex flex-wrap gap-6">
            {footerLinks.map(link => (
              <Link
                key={link.label}
                to={link.to}
                className="text-gray-600 hover:text-blue-900 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;