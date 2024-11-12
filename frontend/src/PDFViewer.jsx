import React, { useEffect, useRef } from "react";
import pdfjsLib from "pdfjs-dist/build/pdf";
import "pdfjs-dist/build/pdf.worker.entry";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://mozilla.github.io/pdf.js/build/pdf.worker.js";

const PDFViewer = ({ currentPage, onPageChange, isAdmin }) => {
  const canvasRef = useRef(null);
  const pdfRef = useRef(null);

  useEffect(() => {
    // Load the PDF document
    pdfjsLib
      .getDocument("/pdf")
      .promise.then((pdf) => {
        pdfRef.current = pdf;
        renderPage(currentPage);
      })
      .catch((err) => console.error("Error loading PDF:", err));
  }, []);

  useEffect(() => {
    if (pdfRef.current) {
      renderPage(currentPage);
    }
  }, [currentPage]);

  const renderPage = (num) => {
    pdfRef.current.getPage(num).then((page) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const viewport = page.getViewport({ scale: 1.5 });
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: ctx,
        viewport: viewport,
      };

      page.render(renderContext);
    });
  };

  const handleNext = () => {
    if (isAdmin && currentPage < pdfRef.current.numPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (isAdmin && currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  return (
    <div>
      <canvas ref={canvasRef}></canvas>
      {isAdmin && (
        <div>
          <button onClick={handlePrev}>Previous</button>
          <button onClick={handleNext}>Next</button>
        </div>
      )}
    </div>
  );
};

export default PDFViewer;
