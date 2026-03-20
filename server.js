const express = require('express');
const cors = require('cors');
const XLSX = require('xlsx');

const app = express();
app.use(cors());

// โหลด Excel
const workbook = XLSX.readFile('./readersDB.xlsx');
const sheetName = workbook.SheetNames[0];
const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

// API search
app.get('/api/search', (req, res) => {
  const q = (req.query.q || '').toLowerCase();

  const results = data.filter(row => {
    const name = (row['ชื่อผู้ทรงคุณวุฒิ / Name'] || '').toLowerCase();
    const discipline = (row['สาขาวิชา / Discipline'] || '').toLowerCase();
    const sub = (row['อนุสาขาวิชา/ความเชี่ยวชาญ /\nSub discipline :'] || '').toLowerCase();
    const institution = (row['มหาวิทยาลัย/สถาบัน /\nInstitution'] || '').toLowerCase();

    return (
      name.includes(q) ||
      discipline.includes(q) ||
      sub.includes(q) ||
      institution.includes(q)
    );
  });

  res.json(results);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));