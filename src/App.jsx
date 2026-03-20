const SS = SpreadsheetApp.getActiveSpreadsheet();

function doGet(e) {
  const action = e.parameter.action || 'read';
  if (action === 'write') {
    try {
      const sheetName = e.parameter.sheet;
      const data = JSON.parse(decodeURIComponent(e.parameter.data));
      return response(saveRow(sheetName, data));
    } catch(err) {
      return response({ error: err.message });
    }
  }
  try {
    const sheetName = e.parameter.sheet;
    const sheet = SS.getSheetByName(sheetName);
    if (!sheet) return response({ error: '시트 없음: ' + sheetName });
    const [headers, ...rows] = sheet.getDataRange().getValues();
    const data = rows.filter(r => r[0] !== '').map(r =>
      Object.fromEntries(headers.map((h, i) => [h, r[i]]))
    );
    return response({ success: true, data });
  } catch(err) {
    return response({ error: err.message });
  }
}

function saveRow(sheetName, data) {
  const sheet = SS.getSheetByName(sheetName);
  if (!sheet) return { error: '시트 없음: ' + sheetName };
  const [headers, ...rows] = sheet.getDataRange().getValues();
  const newRow = headers.map(h => data[h] !== undefined ? data[h] : '');
  for (let i = 0; i < rows.length; i++) {
    if (String(rows[i][0]) === String(data['연도']) &&
        String(rows[i][1]) === String(data['월'])) {
      sheet.getRange(i + 2, 1, 1, newRow.length).setValues([newRow]);
      return { success: true, action: 'updated' };
    }
  }
  sheet.appendRow(newRow);
  return { success: true, action: 'inserted' };
}

function response(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
