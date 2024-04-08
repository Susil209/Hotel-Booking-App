package com.spring.springboothotel.controller;

import com.spring.springboothotel.exception.PhotoNotFoundException;
import com.spring.springboothotel.exception.ResourceNotFoundException;
import com.spring.springboothotel.model.BookedRoom;
import com.spring.springboothotel.model.Room;
import com.spring.springboothotel.response.BookingResponse;
import com.spring.springboothotel.response.RoomResponse;
import com.spring.springboothotel.service.IBookingService;
import com.spring.springboothotel.service.IRoomService;
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Blob;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

//@CrossOrigin(origins = "http://localhost:5173", maxAge = 3600)
@RestController
@RequestMapping("/room")
@RequiredArgsConstructor
public class RoomController {

    private final IRoomService roomService;
    private final IBookingService bookingService;

    // endpoint
    // http://localhost:9192/room/add/new-room?photo=photo,roomType=roomType,roomPrice=roomPrice
    @PostMapping("/add/new-room")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<RoomResponse> addNewRoom(@RequestParam("photo") MultipartFile photo,
            @RequestParam("roomType") String roomType, @RequestParam("roomPrice") BigDecimal roomPrice)
            throws SQLException, IOException {

        Room savedRoom = roomService.addNewRoom(photo, roomType, roomPrice);
        RoomResponse response = new RoomResponse(savedRoom.getId(),
                savedRoom.getRoomType(), savedRoom.getRoomPrice());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/room-types")
    public List<String> getRoomTypes() {
        return roomService.getAllRoomTypes();
    }

    @GetMapping("/all-rooms")
    public ResponseEntity<List<RoomResponse>> getAllRooms() throws SQLException {
        // get list of rooms
        List<Room> rooms = roomService.getAllRooms();

        // create a list of response
        List<RoomResponse> roomResponses = new ArrayList<>();

        // for each room,create a method to get the photo of room by room id
        // and set in responses

        for (Room room: rooms){
            byte[] photoBytes = roomService.getRoomPhotoById(room.getId());

            if(photoBytes != null && photoBytes.length>0){
                String base64Photo = Base64.encodeBase64String(photoBytes);
                RoomResponse roomResponse = getRoomResponse(room);
                roomResponse.setPhoto(base64Photo);
                roomResponses.add(roomResponse);
            }

        }

        return ResponseEntity.ok(roomResponses);
    }

    private RoomResponse getRoomResponse(Room room) {
        // get list of booked rooms by room id
        List<BookedRoom> bookings = getAllBookingsByRoomId(room.getId());

        //get list of booked rooms and map them into booking response objects
        List<BookingResponse> bookingInfo = bookings
                .stream()
                .map(bookedRoom -> new BookingResponse(bookedRoom.getBookingId(),
                        bookedRoom.getCheckInDate(),
                        bookedRoom.getCheckOutDate(),
                        bookedRoom.getBookingConfirmationCode())).toList();

        // get photo
        byte[] photoByte = null;
        Blob photoBlob = room.getPhoto();
        if(photoBlob != null){
            try{
                photoByte = photoBlob.getBytes(1, (int) photoBlob.length());
            } catch (SQLException e) {
                throw new PhotoNotFoundException("Error, cannot find photo.");
            }
        }

        // set room response

        return new RoomResponse(room.getId(), room.getRoomType(), room.getRoomPrice(),
                room.isBooked(), photoByte, bookingInfo);
    }

    private List<BookedRoom> getAllBookingsByRoomId(Long roomId) {
        return bookingService.getAllBookingsByRoomId(roomId);
    }

    @DeleteMapping("/delete-room/{roomId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long roomId){
        roomService.deleteRoom(roomId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/update-room/{roomId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<RoomResponse> updateRoom(@PathVariable Long roomId,
                                                   @RequestParam(required = false) String roomType,
                                                   @RequestParam(required = false) BigDecimal roomPrice,
                                                   @RequestParam(required = false) MultipartFile photo)
                                                    throws IOException, SQLException {

        byte[] photoByte = photo != null && !photo.isEmpty() ?
                photo.getBytes() : roomService.getRoomPhotoById(roomId);

        Blob photoBlob = photoByte!=null && photoByte.length > 0 ? new SerialBlob(photoByte) : null;

        Room theRoom = roomService.updateRoom(roomId, roomType, roomPrice, photoByte);
        theRoom.setPhoto(photoBlob);

        RoomResponse roomResponse = getRoomResponse(theRoom);
        return ResponseEntity.ok(roomResponse);
    }

    @GetMapping("get-room/{roomId}")
    public ResponseEntity<Optional<RoomResponse>> getRoomById(@PathVariable Long roomId){
        Optional<Room> theRoom = roomService.getRoomById(roomId);
        return theRoom.map(room -> {
            RoomResponse roomResponse = getRoomResponse(room);
            return  ResponseEntity.ok(Optional.of(roomResponse));
        }).orElseThrow(() -> new ResourceNotFoundException("Room not found"));
    }

    // endpoint
    // http://localhost:9192/room/available-rooms?checkInDate=2024-02-11&checkOutDate=2024-02-15&roomType=SingleRoom
    @GetMapping("/available-rooms")
    public ResponseEntity<List<RoomResponse>> getAvailableRooms(
            @RequestParam("checkInDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkInDate,
            @RequestParam("checkOutDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOutDate,
            @RequestParam("roomType") String roomType) throws SQLException {

        //get available rooms
        List<Room> availableRooms = roomService.getAvailableRooms(checkInDate,checkOutDate,roomType);

        // list of room responses
        List<RoomResponse> roomResponses = new ArrayList<>();

        // for each room set photo separately
        for(Room room: availableRooms){
            byte[] photoBytes = roomService.getRoomPhotoById(room.getId());
            if(photoBytes != null && photoBytes.length > 0){
                String photoBase64 = Base64.encodeBase64String(photoBytes);

                // set room response
                RoomResponse roomResponse = getRoomResponse(room);
                roomResponse.setPhoto(photoBase64);

                // add in list of room responses
                roomResponses.add(roomResponse);
            }
        }

        if (roomResponses.isEmpty()){
            // return response 204 No Content
            return ResponseEntity.noContent().build();
        }else{
            return ResponseEntity.ok(roomResponses);
        }

    }

}
