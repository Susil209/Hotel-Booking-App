import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:9192",
});

/* This function adds a new room room to the database */
export async function addRoom(photo, roomType, roomPrice) {
  const formData = new FormData();
  formData.append("photo", photo);
  formData.append("roomType", roomType);
  formData.append("roomPrice", roomPrice);

  const response = await api.post("/room/add/new-room", formData);
  if (response.status === 200) {
    return true;
  } else {
    return false;
  }
}

/* This function gets all room types from thee database */
export async function getRoomTypes() {
  try {
    const response = await api.get("/room/room-types");
    return response.data;
  } catch (e) {
    throw new Error("Error in fetching room types.");
  }
}

/* This function gets all rooms from the database */
export async function getAllRooms() {
  try {
    const response = await api.get("/room/all-rooms");
    return response.data;
  } catch (e) {
    throw new Error("Error in fetching rooms.");
  }
}

/* This function deletes a room by the Id */
export async function deleteRoom(roomId) {
  try {
    const response = await api.delete(`/room/delete-room/${roomId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error in deleting rooms, ${error.message}`);
  }
}

/* This function update a room by id*/
export async function updateRoom(roomId, roomData) {
  const formData = new FormData();
  formData.append("roomType", roomData.roomType);
  formData.append("roomPrice", roomData.roomPrice);
  formData.append("photo", roomData.photo);

  const response = await api.put(`/room/update-room/${roomId}`, formData);
  return response;
}

/* This funcction gets a room by the id */
export async function getRoomById(roomId) {
  try {
    const response = await api.get(`/room/get-room/${roomId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching room ${error.message}`);
  }
}

/* This function saves a new booking to the database */
export async function bookRoom(roomId, booking) {
  try {
    const response = await api.post(
      `/bookings/room/booking/${roomId}`,
      booking
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    } else {
      throw new Error(`Error booking room : ${error.message}`);
    }
  }
}

/* This function gets alll bokings from the database */
export async function getAllBookings() {
  try {
    const response = await api.get("/bookings/all-bookings");
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching bookings : ${error.message}`);
  }
}

/* This is the function to cancel user booking */
export async function cancelBooking(bookingId) {
  try {
    const response = await api.delete(`/bookings/booking/${bookingId}/delete`);
    return response.data;
  } catch (error) {
    throw new Error(`Error cancelling booking :${error.message}`);
  }
}

/* This function get booking by the cnfirmation code */
export async function getBookingByConfirmationCode(confirmationCode) {
  try {
    const result = await api.get(`/bookings/confirmation/${confirmationCode}`);
    return result.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    } else {
      throw new Error(`Error find booking : ${error.message}`);
    }
  }
}
