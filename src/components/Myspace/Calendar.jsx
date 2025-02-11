// Components/Calendar.jsx
import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

function Calendar() {
  return (
    <div className="calendar">
      <div className="flex items-center gap-3 mb-6">
        <CalendarIcon className="w-6 h-6" />
        <h2 className="text-xl font-bold">Calendar</h2>
      </div>
      
      <div className="space-y-4">
        <div className="bg-background p-4 rounded-lg">
          <h3 className="font-medium mb-2">Upcoming Events</h3>
          <ul className="space-y-2">
            <li>Team Meeting - 2:00 PM</li>
            <li>Project Review - 4:00 PM</li>
            <li>Client Call - Tomorrow 11:00 AM</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Calendar;