import React from 'react';
import { Building2, Users, Clock, Calendar, ClipboardCheck } from 'lucide-react';

function Overview() {
  const services = [
    {
      name: "Onboarding Intern",
      icon: Users,
      description: "Streamlined intern recruitment and orientation process"
    },
    {
      name: "Attendance",
      icon: Clock,
      description: "Track and manage employee attendance records"
    },
    {
      name: "Leave Approval",
      icon: ClipboardCheck, 
      description: "Review and process leave requests"
    },
    {
      name: "Leave Request",
      icon: Calendar,
      description: "Submit and manage leave applications"
    }
  ];
  return (
    <div className="overview">
      <div className="company-info">
      <img 
          src="data:image/jpeg;base64,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"
          alt="RamanaSoft Logo"
          className="company-logo"
        />        <h2 className="text-2xl font-bold mb-4">RamanaSoft</h2>
        <div className="flex flex-col gap-2 items-center">
          <Building2 className="w-6 h-6" />
          <p className="text-secondary">Technology Solutions</p>
          <a 
            href="https://ramanasoft.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Visit Website
          </a>
        </div>
        
      </div>

      
      <div className="mt-8">
        <h3 className="text-center">Our Services</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="p-6 rounded-lg border border-border-dark hover:border-primary transition-colors"
              style={{
                backgroundColor: 'white',
                '@media (prefers-color-scheme: light)': {
                  backgroundColor: 'var(--surface-light)'
                }
              }}
            >
              <div className="flex items-center gap-4">
                <div className='d-flex'>
                <service.icon className="w-8 h-8 text-primary" />
                <h4 className="font-semibold mb-2">{service.name}</h4>
                </div>
                
                <div>
                 
                  <p className="text-secondary">{service.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Overview;