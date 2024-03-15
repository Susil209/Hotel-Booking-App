package com.spring.springboothotel.controller;

import com.spring.springboothotel.model.Room;
import com.spring.springboothotel.response.RoomResponse;
import com.spring.springboothotel.service.IRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.sql.SQLException;

@RestController
@RequestMapping("/room")
@RequiredArgsConstructor
public class RoomController {

    private final IRoomService roomService;

    // endpoint
    // http://localhost:9192/room/add/new-room?photo=photo,roomType=roomType,roomPrice=roomPrice
    @PostMapping("/add/new-room")
    public ResponseEntity<RoomResponse> addNewRoom(@RequestParam("photo") MultipartFile photo,
            @RequestParam("roomType") String roomType, @RequestParam("roomPrice") BigDecimal roomPrice)
            throws SQLException, IOException {

        Room savedRoom = roomService.addNewRoom(photo, roomType, roomPrice);
        RoomResponse response = new RoomResponse(savedRoom.getId(),
                savedRoom.getRoomType(), savedRoom.getRoomPrice());

        return ResponseEntity.ok(response);
    }

}
