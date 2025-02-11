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
  pdfjsLib.getDocument(pdfUrl).promise.then((pdf) => {
    const flipbook = document.getElementById("flipbook");
    flipbook.innerHTML = ""; // Clear previous pages

    let pagesRendered = 0;

    for (let i = 1; i <= pdf.numPages; i++) {
      pdf.getPage(i).then((page) => {
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
          pagesRendered++;

          // Initialize Turn.js when all pages are loaded
          if (pagesRendered === pdf.numPages) {
            $("#flipbook").turn({
              width: viewport.width * 2, // Two pages at once
              height: viewport.height,
              autoCenter: true,
            });
          }
        });
      });
    }
  }).catch((error) => {
    console.error('Error loading PDF:', error);
  });
}
