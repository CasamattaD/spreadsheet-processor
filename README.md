# Spreadsheet Processor

A web application that uses AI to extract OEM (Original Equipment Manufacturer) and Model information from unstructured Excel files and generates a structured, styled Excel file.

## Features

- 📤 Upload Excel files (.xlsx, .xls, .csv)
- 🤖 AI-powered extraction using OpenAI GPT-5.2
- 📊 Structured output with proper headers and styling
- 💾 Download processed files
- 🎨 Modern, responsive UI

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key

## Setup

1. **Install dependencies:**
   ```bash
   npm run install-all
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=5000
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and the React frontend (port 3000).

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Click or drag and drop an Excel file to upload
3. Click "Process File" to analyze the file with AI
4. Wait for processing to complete
5. Download the structured Excel file with extracted OEM and Model data

## Project Structure

```
spreadsheet-processor/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                 # Express backend
│   ├── index.js           # Main server file
│   ├── excelProcessor.js  # Excel processing logic
│   ├── uploads/           # Temporary upload storage
│   └── output/            # Processed file storage
├── package.json
└── README.md
```

## API Endpoints

- `POST /api/upload` - Upload and process an Excel file
- `GET /api/download/:filename` - Download a processed file

## Technologies Used

- **Frontend:** React, CSS3
- **Backend:** Node.js, Express
- **File Processing:** xlsx
- **AI:** OpenAI GPT-5.2
- **File Upload:** Multer

## Notes

- The application processes files up to 10MB in size
- Uploaded files are automatically deleted after processing
- Processed files are stored in `server/output/` directory
- The AI model used is GPT-5.2

## License

ISC

