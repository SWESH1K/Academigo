import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import ChatPage from "./pages/chat";
import GDriveChatPage from "./pages/gdrive-chat";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<ChatPage />} path="/chat" />
      <Route element={<GDriveChatPage />} path="/gdrive-chat" />
    </Routes>
  );
}

export default App;
