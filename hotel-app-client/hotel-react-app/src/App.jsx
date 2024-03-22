// import './App.css'
import Home from "./components/home/Home";
import AddRoom from "./components/room/AddRoom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EditRoom from "./components/room/EditRoom";
import ExistingRoom from "./components/room/ExistingRoom";

function App() {
  return (
    <main>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/edit-room/:roomId" element={<EditRoom />} />
          <Route path="/existing-rooms" element={<ExistingRoom />} />
          <Route path="/add-room" element={<AddRoom />} />
        </Routes>
      </Router>
    </main>
  );
}

export default App;
