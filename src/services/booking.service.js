import apiClient from "../utils/api";

const getBookings = async (filters) => {
    return await apiClient.get("/bookings", { params: filters });
};

const getBooking = async (id) => {
    return await apiClient.get(`/bookings/${id}`);
};

const createBooking = async (serviceId, payload) => {
    // payload: { booking_date, time_slot, address_id, notes }
    return await apiClient.post(`/services/${serviceId}/book`, payload);
};

const updateBookingStatus = async (id, status) => {
    // status: 'CANCELLED', etc.
    return await apiClient.patch(`/bookings/${id}/status`, { status });
};

const bookingService = {
    getBookings,
    getBooking,
    createBooking,
    updateBookingStatus
};

export default bookingService;