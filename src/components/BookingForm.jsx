import React, { useState } from 'react';
import { Calendar, Clock, User, Mail, Phone, MapPin, FileText } from 'lucide-react';

export default function BookingForm({ selectedService, onSubmit, loading, errorMessage }) {
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        shootDate: '',
        startTime: '10:00',
        shootLocation: '',
        notes: '',
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Appending :00 converts "10:00" to "10:00:00" for Java LocalTime parsing
        const payload = {
            ...formData,
            serviceId: selectedService.id,
            startTime: `${formData.startTime}:00`,
        };
        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="border-b border-neutral-100 pb-4">
                <h2 className="text-xl font-semibold text-neutral-900">Appointment Details</h2>
                <p className="text-sm text-neutral-500">
                    Package: <span className="font-medium text-neutral-800">{selectedService.title}</span> ({selectedService.durationMinutes} mins)
                </p>
            </div>

            {errorMessage && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm font-medium text-red-700">
                    {errorMessage}
                </div>
            )}

            {/* Date & Time Selectors */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-neutral-600">
                        Shoot Date
                    </label>
                    <div className="relative">
                        <input
                            type="date"
                            name="shootDate"
                            required
                            min={new Date().toISOString().split('T')[0]}
                            value={formData.shootDate}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-neutral-300 py-2.5 pl-10 pr-3 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                        />
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                    </div>
                </div>

                <div>
                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-neutral-600">
                        Start Time
                    </label>
                    <div className="relative">
                        <input
                            type="time"
                            name="startTime"
                            required
                            value={formData.startTime}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-neutral-300 py-2.5 pl-10 pr-3 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                        />
                        <Clock className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                    </div>
                </div>
            </div>

            {/* Customer Contact Details */}
            <div className="space-y-4">
                <div>
                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-neutral-600">
                        Full Name
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            name="customerName"
                            placeholder="Alex Morgan"
                            required
                            value={formData.customerName}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-neutral-300 py-2.5 pl-10 pr-3 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                        />
                        <User className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-neutral-600">
                            Email Address
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                name="customerEmail"
                                placeholder="alex@example.com"
                                required
                                value={formData.customerEmail}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-neutral-300 py-2.5 pl-10 pr-3 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                            />
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-neutral-600">
                            Phone Number
                        </label>
                        <div className="relative">
                            <input
                                type="tel"
                                name="customerPhone"
                                placeholder="+1 555-0199"
                                required
                                value={formData.customerPhone}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-neutral-300 py-2.5 pl-10 pr-3 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                            />
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-neutral-600">
                        Shoot Location
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            name="shootLocation"
                            placeholder="e.g. Studio Room 2, Central Park, or Venue Address"
                            required
                            value={formData.shootLocation}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-neutral-300 py-2.5 pl-10 pr-3 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                        />
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                    </div>
                </div>

                <div>
                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-neutral-600">
                        Special Requests / Notes (Optional)
                    </label>
                    <div className="relative">
                        <textarea
                            name="notes"
                            rows="3"
                            placeholder="Outfit changes, props, backdrop preferences..."
                            value={formData.notes}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-neutral-300 py-2.5 pl-10 pr-3 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                        />
                        <FileText className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-neutral-900 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50"
            >
                {loading ? 'Reserving slot...' : 'Confirm Appointment'}
            </button>
        </form>
    );
}