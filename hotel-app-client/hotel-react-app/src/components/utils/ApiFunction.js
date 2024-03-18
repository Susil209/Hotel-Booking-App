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
