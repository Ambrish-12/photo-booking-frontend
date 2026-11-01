import React, { useEffect, useState } from 'react';
import { fetchServices, createBooking } from './services/api';
import ServiceCard from './components/ServiceCard';
import BookingForm from './components/BookingForm';
import BookingHistory from './components/BookingHistory';
import { Camera, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('book'); // 'book' or 'history'
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [loadingServices, setLoadingServices] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchServices()
      .then((data) => {
        setServices(data);
        if (data && data.length > 0) {
          setSelectedService(data[0]);
        }
      })
      .catch(() => {
        setErrorMessage('Failed to connect to backend server on port 8080.');
      })
      .finally(() => {
        setLoadingServices(false);
      });
  }, []);

  const handleBookingSubmit = async (payload) => {
    setSubmitting(true);
    setErrorMessage('');
    try {
      const response = await createBooking(payload);
      setConfirmedBooking(response);
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setErrorMessage('This time slot is already booked. Please choose a different date or time.');
      } else {
        setErrorMessage('Unable to process booking. Please ensure all fields are complete.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Header with Navigation */}
      <header className="border-b border-neutral-200 bg-white py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Camera className="h-6 w-6 text-neutral-900" />
            <span className="text-lg font-bold tracking-tight">Studio Booking Portal</span>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex gap-1 rounded-lg bg-neutral-100 p-1">
            <button
              onClick={() => setActiveTab('book')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${activeTab === 'book'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
                }`}
            >
              Book a Session
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${activeTab === 'history'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
                }`}
            >
              Booking History
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-5xl px-4 py-8">
        {activeTab === 'history' ? (
          <BookingHistory />
        ) : confirmedBooking ? (
          <div className="mx-auto max-w-lg rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
            <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500" />
            <h2 className="mt-4 text-2xl font-bold">Booking Confirmed!</h2>
            <p className="mt-2 text-sm text-neutral-600">
              Reserved for <span className="font-semibold">{confirmedBooking.shootDate}</span> from{' '}
              <span className="font-semibold">{confirmedBooking.startTime}</span> to{' '}
              <span className="font-semibold">{confirmedBooking.endTime}</span>.
            </p>
            <div className="mt-6 rounded-lg bg-neutral-50 p-4 text-left text-sm text-neutral-700 border border-neutral-100">
              <p><span className="font-medium">Location:</span> {confirmedBooking.shootLocation}</p>
              <p className="mt-1"><span className="font-medium">Status:</span> {confirmedBooking.status}</p>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setConfirmedBooking(null)}
                className="w-1/2 rounded-lg bg-neutral-900 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
              >
                Book Another
              </button>
              <button
                onClick={() => {
                  setConfirmedBooking(null);
                  setActiveTab('history');
                }}
                className="w-1/2 rounded-lg border border-neutral-300 bg-white py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
              >
                View History
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            {/* Left: Package List */}
            <div className="space-y-4 md:col-span-5">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">1. Select Package</h2>
                <p className="text-sm text-neutral-500">Pick session duration and coverage</p>
              </div>

              {loadingServices ? (
                <div className="rounded-xl border border-neutral-200 bg-white p-6 text-center text-sm text-neutral-500">
                  Loading packages...
                </div>
              ) : (
                <div className="space-y-3">
                  {services.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      isSelected={selectedService?.id === service.id}
                      onSelect={setSelectedService}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right: Booking Form */}
            <div className="space-y-4 md:col-span-7">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">2. Reserve Slot</h2>
                <p className="text-sm text-neutral-500">Select date, time, and location</p>
              </div>

              {selectedService ? (
                <BookingForm
                  selectedService={selectedService}
                  onSubmit={handleBookingSubmit}
                  loading={submitting}
                  errorMessage={errorMessage}
                />
              ) : (
                <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500">
                  Select a package on the left to proceed.
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}