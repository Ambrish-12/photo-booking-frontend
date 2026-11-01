import React, { useState, useEffect } from 'react';
import { fetchBookings } from '../services/api';
import { Calendar, Clock, MapPin, Search, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function BookingHistory() {
    const [emailQuery, setEmailQuery] = useState('');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [viewMode, setViewMode] = useState('client'); // 'client' or 'admin'

    const loadBookings = async (email = '') => {
        setLoading(true);
        try {
            const data = await fetchBookings(email);
            setBookings(data);
        } catch {
            setBookings([]);
        } finally {
            setLoading(false);
            setHasSearched(true);
        }
    };

    useEffect(() => {
        if (viewMode === 'admin') {
            loadBookings('');
        } else {
            setBookings([]);
            setHasSearched(false);
        }
    }, [viewMode]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (emailQuery.trim()) {
            loadBookings(emailQuery.trim());
        }
    };

    const getStatusBadge = (status) => {
        const s = status?.toLowerCase();
        if (s === 'confirmed') {
            return (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                    <CheckCircle className="h-3 w-3" /> Confirmed
                </span>
            );
        }
        if (s === 'cancelled') {
            return (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700 border border-red-200">
                    <AlertCircle className="h-3 w-3" /> Cancelled
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
                <RefreshCw className="h-3 w-3" /> Pending
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* View Switcher: Client Lookup vs Admin Dashboard */}
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
                <div>
                    <h2 className="text-xl font-bold text-neutral-900">
                        {viewMode === 'client' ? 'Find Your Bookings' : 'Studio Management Dashboard'}
                    </h2>
                    <p className="text-sm text-neutral-500">
                        {viewMode === 'client'
                            ? 'Enter the email you used during checkout to view appointment history'
                            : 'Viewing all studio appointments'}
                    </p>
                </div>

                <button
                    onClick={() => setViewMode(viewMode === 'client' ? 'admin' : 'client')}
                    className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
                >
                    Switch to {viewMode === 'client' ? 'Studio View' : 'Client Lookup'}
                </button>
            </div>

            {/* Email Search Bar for Clients */}
            {viewMode === 'client' && (
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-1">
                        <input
                            type="email"
                            required
                            placeholder="Enter your booking email (e.g., alex@example.com)..."
                            value={emailQuery}
                            onChange={(e) => setEmailQuery(e.target.value)}
                            className="w-full rounded-lg border border-neutral-300 py-2.5 pl-10 pr-3 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                        />
                        <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-50"
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </form>
            )}

            {/* Bookings List Display */}
            {loading ? (
                <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500">
                    Loading appointments...
                </div>
            ) : bookings.length > 0 ? (
                <div className="space-y-3">
                    {bookings.map((b) => (
                        <div
                            key={b.id}
                            className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs transition hover:border-neutral-300"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-2 border-b border-neutral-100 pb-3">
                                <div>
                                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                                        Booking #{b.id}
                                    </span>
                                    <h3 className="text-base font-bold text-neutral-900">
                                        {b.service ? b.service.title : 'Photo Session'}
                                    </h3>
                                    {b.customer && (
                                        <p className="text-xs text-neutral-500">
                                            Client: <span className="font-medium text-neutral-700">{b.customer.name}</span> ({b.customer.email})
                                        </p>
                                    )}
                                </div>
                                <div>{getStatusBadge(b.status)}</div>
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-neutral-600 sm:grid-cols-3">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="h-4 w-4 text-neutral-400" />
                                    <span>{b.shootDate}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock className="h-4 w-4 text-neutral-400" />
                                    <span>{b.startTime} - {b.endTime}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="h-4 w-4 text-neutral-400" />
                                    <span className="truncate">{b.shootLocation}</span>
                                </div>
                            </div>

                            {b.notes && (
                                <div className="mt-3 rounded-md bg-neutral-50 p-2.5 text-xs text-neutral-600">
                                    <span className="font-semibold text-neutral-700">Notes:</span> {b.notes}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : hasSearched ? (
                <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500">
                    No bookings found.
                </div>
            ) : null}
        </div>
    );
}