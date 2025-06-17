// import React from "react";
// import TrackChangesIcon from "@mui/icons-material/TrackChanges";
// import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
// import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";

// const Features: React.FC = () => {
//   const features = [
//     {
//       title: "Drive with Purpose",
//       description:
//         "Delivering goods on time plays a significant role in global commerce.",
//       icon: <TrackChangesIcon />,
//     },
//     {
//       title: "Competitive Pay",
//       description:
//         "Earn top-tier pay rates that increase with your performance.",
//       icon: <WorkspacePremiumIcon />,
//     },
//     {
//       title: "Consistent Work Opportunities",
//       description:
//         "Get consistent delivery schedules and maximize your work hours.",
//       icon: <BarChartOutlinedIcon />,
//     },
//   ];

//   return (
//     <section className="py-12 bg-white">
//       <div className="container mx-auto px-4">
//         <h2 className="text-3xl font-bold text-[#0a1172] text-center mb-8">
//           Why Drive for Zip Logistics?
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {features.map((feature, index) => (
//             <div
//               key={index}
//               className="border p-6 rounded-lg shadow-md hover:shadow-lg flex flex-col items-center transition-transform duration-300 hover:scale-105 bg-white   hover:bg-[#0a1172] hover:text-white"
//             >
//               {/* Icon */}
//               <div className="mb-4 border rounded-e-2xl-[#0a1172] text-5xl transition duration-300">
//                 {feature.icon}
//               </div>
//               {/* Title */}
//               <h3 className="text-xl font-bold mb-4 text-center">
//                 {feature.title}
//               </h3>
//               {/* Description */}
//               <p className="text-center">{feature.description}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Features;

import React from 'react';
import { Feature } from '../Types/Types';

const Features: React.FC = () => {
  const features: Feature[] = [
    {
      title: "Flexible Schedules",
      description: "Choose when you want to drive and maintain work-life balance",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
          <path d="M13 7h-2v5.414l3.293 3.293 1.414-1.414L13 11.586z"/>
        </svg>
      )
    },
    {
      title: "Competitive Pay",
      description: "Earn more with performance-based incentives and bonuses",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
          <path d="M13 7h-2v5h-3v2h5z"/>
        </svg>
      )
    },
    {
      title: "Regular Work",
      description: "Access consistent delivery opportunities in your area",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zm0 16H4V5h16v14z"/>
          <path d="m10 17 6-6-1.414-1.414L10 14.172l-2.293-2.293L6.293 13.293z"/>
        </svg>
      )
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">
          Why Drive With Us?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-xl shadow-lg hover:bg-blue-900 hover:text-white transition-all duration-300 group"
            >
              <div className="text-blue-900 group-hover:text-white mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {feature.title}
              </h3>
              <p className="group-hover:text-gray-200">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;