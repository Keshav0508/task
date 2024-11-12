import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import PDFViewer from "./PDFViewer";

const socket = io.connect("http://localhost:3000"); // Make sure to match server URL if different

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Ask user if they are the admin
    const isAdminResponse =
      window.prompt("Are you the admin? Type 'yes' if you are.") === "yes";
    setIsAdmin(isAdminResponse);

    if (isAdminResponse) {
      socket.emit("set-admin");
    }

    // Listen for page update from server
    socket.on("page-update", (page) => {
      setCurrentPage(page);
    });

    return () => {
      socket.off("page-update");
    };
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (isAdmin) {
      socket.emit("page-change", page);
    }
  };

  return (
    <div>
      <h1>PDF Co-Viewer</h1>
      <PDFViewer
        currentPage={currentPage}
        onPageChange={handlePageChange}
        isAdmin={isAdmin}
      />
    </div>
  );
};

export default App;
