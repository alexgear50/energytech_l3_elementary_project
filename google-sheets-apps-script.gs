// Google Apps Script for EnergyTech Level 3 Portal
// 1) Create a Google Sheet.
// 2) Extensions > Apps Script > paste this code.
// 3) Deploy > New deployment > Web app > Execute as: Me > Who has access: Anyone.
// 4) Copy the Web App URL into APPS_SCRIPT_URL in app.js.
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Responses') || SpreadsheetApp.getActiveSpreadsheet().insertSheet('Responses');
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp','Student Name','Student ID','Group','Unit','Unit Title','Skill','Score','Total','Word Count','Writing Text','Raw JSON']);
  }
  const data = JSON.parse(e.postData.contents || '{}');
  sheet.appendRow([
    new Date(),
    data.student && data.student.name || '',
    data.student && data.student.id || '',
    data.student && data.student.group || '',
    data.unit || '',
    data.unitTitle || '',
    data.skill || '',
    data.score || 0,
    data.total || 0,
    data.wordCount || '',
    data.text || '',
    JSON.stringify(data)
  ]);
  return ContentService.createTextOutput(JSON.stringify({status:'ok'})).setMimeType(ContentService.MimeType.JSON);
}
