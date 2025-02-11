let currentPage = 1; // Start from the first page
let totalPages = 0;
let pdfDoc = null;

document
  .getElementById("pdfUpload")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file || file.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);

    fetch("/upload", { method: "POST", body: formData })
      .then((response) => response.json())
      .then((data) => {
        if (data.filePath) {
          renderPDF(data.filePath);
        }
      })
      .catch((error) => console.error("Error uploading PDF:", error));
  });

// Set workerSrc for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

function renderPDF(pdfUrl) {
  pdfjsLib
    .getDocument(pdfUrl)
    .promise.then((pdf) => {
      pdfDoc = pdf;
      totalPages = pdf.numPages;
      displayPages();
    })
    .catch((error) => {
      console.error("Error loading PDF:", error);
    });
}

function displayPages() {
  const flipbook = document.getElementById("flipbook");
  flipbook.innerHTML = ""; // Clear previous pages

  let pageNumbers = [];

  // If it's the first page, render it alone
  if (currentPage === 1) {
    pageNumbers.push(currentPage);
    currentPage++; // Move to next page
  }

  // For subsequent pages, display two pages side-by-side
  while (currentPage < totalPages) {
    pageNumbers.push(currentPage);
    pageNumbers.push(currentPage + 1);
    currentPage += 2; // Move ahead by two pages
  }

  // If the total number of pages is odd, render the last page alone
  if (currentPage === totalPages) {
    pageNumbers.push(currentPage);
  }

  // Render the pages (either single or paired)
  pageNumbers.forEach((pageNumber, index) => {
    pdfDoc.getPage(pageNumber).then((page) => {
      const scale = 1.5;
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement("canvas");
      canvas.classList.add("page");
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const context = canvas.getContext("2d");
      const renderContext = { canvasContext: context, viewport };

      page.render(renderContext).promise.then(() => {
        flipbook.appendChild(canvas);
      });
    });
  });

  // Re-initialize Turn.js after pages are loaded
  $("#flipbook").turn({
    width: 800, // Adjust width
    height: 600, // Adjust height
    autoCenter: true,
  });
}

// Navigation Buttons
document.getElementById("nextBtn").addEventListener("click", function () {
  if (currentPage < totalPages) {
    displayPages();
  }
});

document.getElementById("prevBtn").addEventListener("click", function () {
  if (currentPage > 1) {
    currentPage -= 2;
    if (currentPage < 1) currentPage = 1;
    displayPages();
  }
});
