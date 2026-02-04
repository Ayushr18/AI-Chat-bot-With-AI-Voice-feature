// src/components/BookingWidget.jsx
import React, { useState } from 'react';
import './BookingWidget.css';

function BookingWidget({ onClose, userName }) {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isBooked, setIsBooked] = useState(false);

  // Sample time slots (in real app, fetch from API)
  const timeSlots = [
    { id: 1, day: 'Tomorrow', time: '2:00 PM', date: 'Feb 5, 2026' },
    { id: 2, day: 'Tomorrow', time: '5:00 PM', date: 'Feb 5, 2026' },
    { id: 3, day: 'Thursday', time: '11:00 AM', date: 'Feb 6, 2026' },
    { id: 4, day: 'Thursday', time: '3:00 PM', date: 'Feb 6, 2026' },
    { id: 5, day: 'Friday', time: '10:00 AM', date: 'Feb 7, 2026' },
    { id: 6, day: 'Friday', time: '4:00 PM', date: 'Feb 7, 2026' },
  ];

  const handleBooking = () => {
    if (selectedSlot) {
      // In real app, call API to book
      setIsBooked(true);
      
      // Simulate sending confirmation
      setTimeout(() => {
        onClose();
      }, 3000);
    }
  };

  if (isBooked) {
    return (
      <div className="booking-widget">
        <div className="booking-success">
          <div className="success-icon">✅</div>
          <h3>Consultation Booked!</h3>
          <p className="booking-details">
            {timeSlots.find(s => s.id === selectedSlot)?.day} at{' '}
            {timeSlots.find(s => s.id === selectedSlot)?.time}
          </p>
          <div className="confirmation-list">
            <div className="confirmation-item">
              📧 Confirmation email sent
            </div>
            <div className="confirmation-item">
              📱 WhatsApp reminder scheduled
            </div>
            <div className="confirmation-item">
              📅 Calendar invite sent
            </div>
          </div>
          <p className="next-steps">
            You'll receive a reminder 1 hour before your call!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-widget">
      <div className="booking-header">
        <h3>Book Your Free Consultation</h3>
        <button className="booking-close" onClick={onClose}>✕</button>
      </div>
      
      <p className="booking-description">
        Choose a time that works for you. Our career advisor will create a personalized roadmap for your goals.
      </p>

      <div className="time-slots">
        {timeSlots.map(slot => (
          <button
            key={slot.id}
            className={`time-slot ${selectedSlot === slot.id ? 'selected' : ''}`}
            onClick={() => setSelectedSlot(slot.id)}
          >
            <div className="slot-day">{slot.day}</div>
            <div className="slot-time">{slot.time}</div>
            <div className="slot-date">{slot.date}</div>
          </button>
        ))}
      </div>

      <button
        className="booking-confirm-btn"
        onClick={handleBooking}
        disabled={!selectedSlot}
      >
        {selectedSlot ? 'Confirm Booking' : 'Select a Time Slot'}
      </button>
    </div>
  );
}

export default BookingWidget;