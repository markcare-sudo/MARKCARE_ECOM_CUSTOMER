import { createContext, useContext, useState } from "react";
import bookingService from "@/services/booking.service";
import { postErrorHandler } from "@/components/ErrorHandler";
import { successHandler } from "@/components/SuccessHandler";
import { apiStatusConstants } from "@/utils/api";

const ServiceContext = createContext();

export const ServiceProvider = ({ children }) => {
    const [status, setStatus] = useState(apiStatusConstants.INITIAL);

    const bookNow = async (serviceId, bookingData) => {
        try {
            setStatus(apiStatusConstants.IN_PROGRESS);
            // bookingData might include { date, time_slot, address_id }
            const res = await bookingService.createBooking(serviceId, bookingData);
            successHandler(res);
            setStatus(apiStatusConstants.SUCCESS);
            return res.data.data; // Return booking details for redirection to success page
        } catch (err) {
            postErrorHandler(err);
            setStatus(apiStatusConstants.FAILURE);
            throw err;
        }
    };

    return (
        <ServiceContext.Provider value={{
            bookNow,
            bookingLoading: status === apiStatusConstants.IN_PROGRESS
        }}>
            {children}
        </ServiceContext.Provider>
    );
};

export const useService = () => useContext(ServiceContext);