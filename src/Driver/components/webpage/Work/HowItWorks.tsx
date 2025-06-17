import React from 'react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      title: "Sign Up and Get Verified",
      description: "Complete your application and verification process to join our driver network",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm0 14H4V6h16v12z"/>
          <path d="m15.707 10.707-1.414-1.414L12 11.586 9.707 9.293l-1.414 1.414L12 14.414z"/>
        </svg>
      )
    },
    {
      title: "Start Driving",
      description: "Accept delivery requests in your area and start earning",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 6h-3V5c0-1.103-.897-2-2-2H8c-1.103 0-2 .897-2 2v1H3c-1.103 0-2 .897-2 2v11c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V8c0-1.103-.897-2-2-2z"/>
        </svg>
      )
    },
    {
      title: "Earn as You Go",
      description: "Get paid weekly with opportunities to earn more through bonuses",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
          <path d="M11 11h2v6h-2zm0-4h2v2h-2z"/>
        </svg>
      )
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="hidden md:block">
            <img
              src="/api/placeholder/600/400"
              alt="How it works"
              className="rounded-lg shadow-xl"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-blue-900 mb-12">
              How It Works
            </h2>
            <div className="space-y-8">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="p-6 bg-white rounded-xl shadow-lg hover:bg-blue-900 hover:text-white transition-all duration-300 group"
                >
                  <div className="text-blue-900 group-hover:text-white mb-4">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {step.title}
                  </h3>
                  <p className="group-hover:text-gray-200">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
