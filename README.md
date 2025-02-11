# Flipbook
## Technology used
- Node.js, express, multer
- Turn.js, PDF.js ( used via CDN instead of installing it via npm).

## Structure
```
Flipbook/
├── public/         # Front-end files
│   ├── index.html  # Main page
│   ├── styles.css  # Styles
│   ├── script.js   # Client-side JavaScript
├── uploads/        # Stores uploaded PDFs
├── app.js          # Express server (backend)
├── package.json
```

### Why Use Express?
- Handles HTTP Requests & Responses (e.g., GET, POST)
- Serves Static Files (like HTML, CSS, JavaScript): Express delivers index.html, styles.css, and script.js from the public/ folder. Without Express, we’d have to manually configure a web server.
- Manages Routes (so different URLs trigger different actions)
- Supports Middleware (like file uploads with Multer)

## Start the Server
Run:
```node app.js```
You should see:
```Server running at http://localhost:3000```
