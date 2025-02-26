import axiosInstance from "./config"

export const getAllMovies = () => axiosInstance.get('/api/movies');
export const getMovieDetail = (id) => axiosInstance.get(`/api/movies/${id}`);
export const getTheatres = (movieId, city, date) => axiosInstance.get(`/api/movies/${movieId}/theatres?city=${city}&date=${date}`);
export const getSeatsLayout = (theatreId, screenNo, timeSlotId, date) => axiosInstance.get(`/api/theatre/layout?tid=${theatreId}&sno=${screenNo}&slot_id=${timeSlotId}&date=${date}`);
export const seatBooking = (showId, theatreId, seatRow, seatNumber, userId, screenNumber, seatClass, amount) => 
    axiosInstance.post('/api/seat-booking', {
      show_id: showId,
      theatre_id: theatreId,
      seat_row: seatRow,
      seat_number: seatNumber,
      user_id: userId,
      screen_number: screenNumber,
      seat_class: seatClass,
      amount: Number(amount)
    });
export const seatBookingVerify = (orderId, paymentId, signature, reciept) => axiosInstance.post('/api/seat-booking/verify', {
    razorpayOrderId: orderId, 
    razorpayPaymentId: paymentId, 
    razorpaySignature: signature, 
    receiptId: reciept
});