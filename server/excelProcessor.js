const XLSX = require('xlsx');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function processExcelFile(filePath) {
  try {
    // Read the Excel file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
    
    // Convert to a more readable format for OpenAI
    const dataString = rawData.map(row => row.join('\t')).join('\n');
    
    // Use OpenAI to extract OEM and Model
    const extractedData = await extractOEMAndModel(dataString);
    
    // Create structured Excel file
    const outputFileName = `processed_${Date.now()}.xlsx`;
    const outputPath = path.join(__dirname, 'output', outputFileName);
    
    await createStructuredExcel(extractedData, outputPath);
    
    return {
      outputFileName,
      data: extractedData
    };
  } catch (error) {
    console.error('Error in processExcelFile:', error);
    throw error;
  }
}

async function extractOEMAndModel(dataString) {
  const prompt = `You are an expert at extracting structured data from unstructured spreadsheets. 
  
Analyze the following spreadsheet data and extract all OEM (Original Equipment Manufacturer) and Model information. 
The data may be in various formats - some rows may have OEM and Model together, some may be in different columns, 
some may be in product descriptions, etc.

Return ONLY a valid JSON array of objects, where each object has exactly two fields:
- "OEM": The manufacturer/OEM name (string)
- "Model": The model number/name (string)

If you cannot determine the OEM or Model for a row, use "Unknown" as the value.
Do not include any explanatory text, only the JSON array.

Spreadsheet data:
${dataString.substring(0, 15000)}`; // Limit to avoid token limits

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Using GPT-4o (latest available)
      messages: [
        {
          role: "system",
          content: "You are a data extraction specialist. Always return valid JSON arrays only, no additional text."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 4000
    });

    const content = response.choices[0].message.content.trim();
    
    // Clean the response to extract JSON
    let jsonString = content;
    if (content.includes('```json')) {
      jsonString = content.split('```json')[1].split('```')[0].trim();
    } else if (content.includes('```')) {
      jsonString = content.split('```')[1].split('```')[0].trim();
    }
    
    const extracted = JSON.parse(jsonString);
    
    // Validate and clean the data
    return extracted
      .filter(item => item && typeof item === 'object')
      .map(item => ({
        OEM: item.OEM || item.oem || item.Oem || 'Unknown',
        Model: item.Model || item.model || item.Model || 'Unknown'
      }));
  } catch (error) {
    console.error('Error extracting data with OpenAI:', error);
    throw new Error('Failed to extract OEM and Model data: ' + error.message);
  }
}

async function createStructuredExcel(data, outputPath) {
  // Create a new workbook using ExcelJS for better styling support
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('OEM and Models');
  
  // Define columns
  worksheet.columns = [
    { header: 'OEM', key: 'oem', width: 30 },
    { header: 'Model', key: 'model', width: 40 }
  ];
  
  // Style the header row
  worksheet.getRow(1).font = {
    bold: true,
    color: { argb: 'FFFFFFFF' },
    size: 12
  };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF366092' }
  };
  worksheet.getRow(1).alignment = {
    vertical: 'middle',
    horizontal: 'center'
  };
  worksheet.getRow(1).height = 25;
  
  // Add border to header cells
  ['A1', 'B1'].forEach(cellAddress => {
    const cell = worksheet.getCell(cellAddress);
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF000000' } },
      left: { style: 'thin', color: { argb: 'FF000000' } },
      bottom: { style: 'thin', color: { argb: 'FF000000' } },
      right: { style: 'thin', color: { argb: 'FF000000' } }
    };
  });
  
  // Add data rows with styling
  data.forEach((item, index) => {
    const row = worksheet.addRow({
      oem: item.OEM,
      model: item.Model
    });
    
    // Set row height
    row.height = 20;
    
    // Add borders to all cells
    ['A', 'B'].forEach(col => {
      const cell = worksheet.getCell(`${col}${row.number}`);
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        right: { style: 'thin', color: { argb: 'FFCCCCCC' } }
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'left'
      };
      
      // Alternate row colors
      if (index % 2 === 1) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF2F2F2' }
        };
      }
    });
  });
  
  // Freeze the header row
  worksheet.views = [
    { state: 'frozen', ySplit: 1 }
  ];
  
  // Save the workbook
  await workbook.xlsx.writeFile(outputPath);
}

module.exports = { processExcelFile };

