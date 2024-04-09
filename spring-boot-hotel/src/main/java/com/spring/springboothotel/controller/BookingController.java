package com.spring.springboothotel.controller;

import com.spring.springboothotel.exception.InvalidBookingRequestException;
import com.spring.springboothotel.exception.ResourceNotFoundException;
import com.spring.springboothotel.model.BookedRoom;
import com.spring.springboothotel.model.Room;
import com.spring.springboothotel.response.BookingResponse;
import com.spring.springboothotel.response.RoomResponse;
import com.spring.springboothotel.service.IBookingService;
import com.spring.springboothotel.service.IRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

//@CrossOrigin(origins = "http://localhost:5173", maxAge = 3600)
@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final IBookingService bookingService;
    private final IRoomService roomService;

    @GetMapping("/all-bookings")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<BookingResponse>> getAllBookings(){
        List<BookedRoom> bookings = bookingService.getAllBookings();
        List<BookingResponse> bookingResponses
                = new ArrayList<>();

        for(BookedRoom booking: bookings){
            BookingResponse bookingResponse = getBookingResponse(booking);
            bookingResponses.add(bookingResponse);
        }

        return ResponseEntity.ok(bookingResponses);
    }

    @GetMapping("/confirmation/{confirmationCode}")
    public ResponseEntity<?> getBookingByConfirmationCode(
            @PathVariable String confirmationCode){
        try{
            BookedRoom booking =
                    bookingService.findByBookingConfirmationCode(confirmationCode);
            BookingResponse bookingResponse = getBookingResponse(booking);

            return ResponseEntity.ok(bookingResponse);
        }catch (ResourceNotFoundException ex){
            // return 404 Not Found.
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body(ex.getMessage());
        }
    }


    // get bookings by email
    @GetMapping("/user/{email}/bookings")
    public ResponseEntity<List<BookingResponse>> getBookingsByUserEmail(@PathVariable String email) {
        // get list of booked rooms
        List<BookedRoom> rooms = bookingService.getBookingsByEmail(email);

        //create a list for all booking responses
        List<BookingResponse> bookingResponses = new ArrayList<>();

        for (BookedRoom room : rooms){
            BookingResponse bookingResponse = getBookingResponse(room);
            bookingResponses.add(bookingResponse);
        }

        return ResponseEntity.ok(bookingResponses);
    }


    // http://localhost:9192/bookings/room/booking/1
    @PostMapping("/room/booking/{roomId}")
    public ResponseEntity<?> saveBooking(@PathVariable Long roomId,
                                         @RequestBody BookedRoom bookingRequest){

        try{
            // after saving get the confirmation code
            String confirmationCode = bookingService.saveBooking(roomId, bookingRequest);

            return ResponseEntity.ok(
                    "Room booked successfully, Your booking confirmation code is :"+confirmationCode);
        }catch (InvalidBookingRequestException e){
            // return 400 Bad Request
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/booking/{bookingId}/delete")
    public void cancelBooking(@PathVariable Long bookingId){
        bookingService.cancelBooking(bookingId);
    }

    private BookingResponse getBookingResponse(BookedRoom booking) {
        Room theRoom = roomService.getRoomById(booking.getRoom().getId())
                .orElse(null); // Replace get() with orElse(null)

        if (theRoom == null) {
            // Handle the case when no room is found
            throw new ResourceNotFoundException("Cannot find room with id " + booking.getRoom().getId());
        }

        RoomResponse room = new RoomResponse(theRoom.getId(), theRoom.getRoomType(), theRoom.getRoomPrice());

        return new BookingResponse(booking.getBookingId(), booking.getCheckInDate(),
                booking.getCheckOutDate(), booking.getGuestFullName(), booking.getGuestEmail(), booking.getNumOfAdults(), booking.getNumOfChildren(), booking.getTotalNumOfGuests(), booking.getBookingConfirmationCode(), room);
    }

}
