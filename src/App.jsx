import { useState, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import MarkdownViewer from "./components/MarkdownViewer";
import "./App.css";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <div className="app-layout">
      <Navbar sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}
      <Sidebar open={sidebarOpen} onNavigate={closeSidebar} />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/docs/*" element={<MarkdownViewer />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
