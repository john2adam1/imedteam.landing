## 1. Terapiya Page (terapiya.html)

**Form Fields:**
- name (Ism Familiya)
- number (Telefon Raqam)

**Google Apps Script Code:**

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Get form data
    const name = e.parameter.name || '';
    const number = e.parameter.number || '';
    
    // Validate required fields
    if (!name || !number) {
      return ContentService.createTextOutput(JSON.stringify({
        ok: false,
        error: 'Ism va telefon raqam majburiy'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Validate phone number format
    if (!/^\+998\d{9}$/.test(number)) {
      return ContentService.createTextOutput(JSON.stringify({
        ok: false,
        error: 'Telefon raqam noto\'g\'ri formatda'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Add header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Sana', 'Ism Familiya', 'Telefon Raqam', 'Kurs']);
    }
    
    // Add data to sheet
    const timestamp = new Date();
    sheet.appendRow([timestamp, name, number, 'Intensiv Terapiya']);
    
    return ContentService.createTextOutput(JSON.stringify({
      ok: true,
      message: 'Muvaffaqiyatli saqlandi'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      ok: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

---

## 2. EKG Page (ekg.html)

**Placeholder in HTML:** `YOUR_EKG_SCRIPT_URL_HERE`

**Form Fields:**
- name (Ism Familiya)
- group (Guruh: A guruh or B guruh)
- number (Telefon Raqam)
- page (hidden field: "EKG")

**Google Apps Script Code:**

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Get form data
    const name = e.parameter.name || '';
    const group = e.parameter.group || '';
    const number = e.parameter.number || '';
    const page = e.parameter.page || 'EKG';
    
    // Validate required fields
    if (!name || !group || !number) {
      return ContentService.createTextOutput(JSON.stringify({
        ok: false,
        error: 'Barcha maydonlar majburiy'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Validate phone number format
    if (!/^\+998\d{9}$/.test(number)) {
      return ContentService.createTextOutput(JSON.stringify({
        ok: false,
        error: 'Telefon raqam noto\'g\'ri formatda'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Add header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Sana', 'Ism Familiya', 'Guruh', 'Telefon Raqam', 'Kurs']);
    }
    
    // Add data to sheet
    const timestamp = new Date();
    sheet.appendRow([timestamp, name, group, number, page]);
    
    return ContentService.createTextOutput(JSON.stringify({
      ok: true,
      message: 'Muvaffaqiyatli saqlandi'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      ok: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}