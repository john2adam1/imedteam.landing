# Google Apps Script - Multi-Landing Page Form Handler

## Overview

This solution uses **ONE** Google Spreadsheet with multiple sheets (tabs) to store leads from different landing pages. Each landing page submits to the **SAME** Web App URL, and the script automatically routes data to the correct sheet based on the `page` parameter.

---

## Google Apps Script Code

### Complete `doPost` Implementation

```javascript
/**
 * Multi-Landing Page Form Handler
 * Handles form submissions from multiple landing pages
 * Routes data to different sheets based on 'page' parameter
 * Automatically creates sheets and manages dynamic headers
 */

function doPost(e) {
  try {
    // Get the active spreadsheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Extract form parameters
    const params = e.parameter;
    
    // Validate required fields
    if (!params.name || !params.phone || !params.page) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: 'Missing required fields: name, phone, or page'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Get or create the sheet for this landing page
    const sheetName = params.page;
    let sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) {
      // Create new sheet if it doesn't exist
      sheet = ss.insertSheet(sheetName);
    }
    
    // Generate timestamp
    const timestamp = new Date();
    
    // Prepare data object with timestamp first
    const data = {
      'Timestamp': timestamp,
      'Name': params.name,
      'Phone': params.phone,
      'Page': params.page
    };
    
    // Add all other optional fields
    for (let key in params) {
      if (key !== 'name' && key !== 'phone' && key !== 'page') {
        // Capitalize first letter for header
        const headerName = key.charAt(0).toUpperCase() + key.slice(1);
        data[headerName] = params[key];
      }
    }
    
    // Get or create headers
    const headers = getOrCreateHeaders(sheet, Object.keys(data));
    
    // Prepare row data aligned with headers
    const rowData = headers.map(header => data[header] || '');
    
    // Append the new row
    sheet.appendRow(rowData);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Lead saved successfully',
      sheet: sheetName
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Log error and return error response
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Error saving lead: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Get existing headers or create them if sheet is empty
 * Automatically adds new columns for new fields
 * Always keeps Timestamp as first column
 */
function getOrCreateHeaders(sheet, dataKeys) {
  const lastRow = sheet.getLastRow();
  
  if (lastRow === 0) {
    // Sheet is empty, create headers
    sheet.appendRow(dataKeys);
    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, dataKeys.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('#ffffff');
    return dataKeys;
  }
  
  // Get existing headers
  const headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  const existingHeaders = headerRange.getValues()[0];
  
  // Check if we need to add new columns
  const newHeaders = [...existingHeaders];
  let headersChanged = false;
  
  for (let key of dataKeys) {
    if (!existingHeaders.includes(key)) {
      newHeaders.push(key);
      headersChanged = true;
    }
  }
  
  // Update headers if new fields were added
  if (headersChanged) {
    sheet.getRange(1, 1, 1, newHeaders.length).setValues([newHeaders]);
    // Format new header cells
    const headerRange = sheet.getRange(1, 1, 1, newHeaders.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('#ffffff');
  }
  
  return newHeaders;
}

/**
 * Test function to verify the script works
 * Run this from the Apps Script editor to test
 */
function testDoPost() {
  const testEvent = {
    parameter: {
      name: 'Test User',
      phone: '+998901234567',
      page: 'Terapiya',
      group: 'Morning',
      source: 'Facebook'
    }
  };
  
  const result = doPost(testEvent);
  Logger.log(result.getContent());
}
```

---

## Deployment Steps

### 1. Create Google Spreadsheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it (e.g., "iMed Team Leads")
4. Note the spreadsheet ID from the URL

### 2. Create Apps Script Project
1. In your spreadsheet, go to **Extensions** → **Apps Script**
2. Delete any default code
3. Paste the complete script above
4. Save the project (name it "Multi-Landing Form Handler")

### 3. Deploy as Web App
1. Click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ → Select **Web app**
3. Configure:
   - **Description**: "Multi-landing page form handler"
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
4. Click **Deploy**
5. **Authorize** the script (review permissions)
6. **Copy the Web App URL** (you'll need this for your HTML forms)

### 4. Update Your HTML Forms
Use the Web App URL in all your landing pages.

---

## HTML Form Examples

### Example 1: Terapiya Landing Page (with optional fields)

```html
<form id="leadForm" class="contact-form">
    <input type="hidden" name="page" value="Terapiya">
    
    <div class="form-group">
        <input type="text" name="name" id="name" placeholder="Ismingiz" required>
    </div>
    
    <div class="form-group">
        <input type="tel" name="phone" id="phone" placeholder="+998 (__) ___-__-__" required>
    </div>
    
    <div class="form-group">
        <select name="group">
            <option value="">Guruhni tanlang</option>
            <option value="Morning">Ertalabki</option>
            <option value="Evening">Kechki</option>
        </select>
    </div>
    
    <div class="form-group">
        <select name="source">
            <option value="">Qayerdan eshitdingiz?</option>
            <option value="Facebook">Facebook</option>
            <option value="Instagram">Instagram</option>
            <option value="Friend">Do'stdan</option>
        </select>
    </div>
    
    <button type="submit">Ro'yxatdan o'tish</button>
</form>

<script>
document.getElementById('leadForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Yuborilmoqda...';
    
    try {
        // Prepare form data
        const formData = new FormData(form);
        
        // Send to Google Apps Script
        const response = await fetch('YOUR_WEB_APP_URL_HERE', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Muvaffaqiyatli yuborildi! Tez orada siz bilan bog\'lanamiz.');
            form.reset();
        } else {
            alert('Xatolik yuz berdi: ' + result.message);
        }
    } catch (error) {
        alert('Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
        console.error('Error:', error);
    } finally {
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
});
</script>
```

### Example 2: EKG Landing Page (minimal fields)

```html
<form id="leadForm" class="contact-form">
    <input type="hidden" name="page" value="EKG">
    
    <div class="form-group">
        <input type="text" name="name" placeholder="Ismingiz" required>
    </div>
    
    <div class="form-group">
        <input type="tel" name="phone" placeholder="+998 (__) ___-__-__" required>
    </div>
    
    <button type="submit">Ro'yxatdan o'tish</button>
</form>

<script>
document.getElementById('leadForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Yuborilmoqda...';
    
    try {
        const formData = new FormData(form);
        
        const response = await fetch('YOUR_WEB_APP_URL_HERE', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Muvaffaqiyatli yuborildi! Tez orada siz bilan bog\'lanamiz.');
            form.reset();
        } else {
            alert('Xatolik yuz berdi: ' + result.message);
        }
    } catch (error) {
        alert('Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
        console.error('Error:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
});
</script>
```

### Example 3: Endokrin Landing Page (with message field)

```html
<form id="leadForm" class="contact-form">
    <input type="hidden" name="page" value="Endokrin">
    
    <div class="form-group">
        <input type="text" name="name" placeholder="Ismingiz" required>
    </div>
    
    <div class="form-group">
        <input type="tel" name="phone" placeholder="+998 (__) ___-__-__" required>
    </div>
    
    <div class="form-group">
        <select name="course">
            <option value="">Kursni tanlang</option>
            <option value="Basic">Asosiy kurs</option>
            <option value="Advanced">Ilg'or kurs</option>
        </select>
    </div>
    
    <div class="form-group">
        <textarea name="message" placeholder="Qo'shimcha ma'lumot (ixtiyoriy)" rows="3"></textarea>
    </div>
    
    <button type="submit">Ro'yxatdan o'tish</button>
</form>

<script>
document.getElementById('leadForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Yuborilmoqda...';
    
    try {
        const formData = new FormData(form);
        
        const response = await fetch('YOUR_WEB_APP_URL_HERE', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Muvaffaqiyatli yuborildi! Tez orada siz bilan bog\'lanamiz.');
            form.reset();
        } else {
            alert('Xatolik yuz berdi: ' + result.message);
        }
    } catch (error) {
        alert('Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
        console.error('Error:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
});
</script>
```

---

## Key Features

### ✅ Single Spreadsheet, Multiple Sheets
- All leads stored in ONE spreadsheet file
- Each landing page gets its own sheet (tab)
- Sheet names match the `page` parameter value

### ✅ Dynamic Headers
- Headers are created automatically on first submission
- New optional fields are added as new columns automatically
- **Timestamp** is always the first column
- Headers are formatted (bold, blue background, white text)

### ✅ Automatic Sheet Creation
- If a sheet for a `page` doesn't exist, it's created automatically
- No manual setup required for new landing pages

### ✅ Flexible Field Support
- **Required fields**: `name`, `phone`, `page`
- **Optional fields**: Any additional fields you add to your forms
- Fields can vary between different landing pages

### ✅ Production Ready
- Error handling and validation
- Success/error responses
- Clean, maintainable code
- Logging for debugging

---

## How It Works

1. **Form Submission**: User fills out form on any landing page
2. **Data Sent**: Form data (including `page` parameter) sent to Web App URL
3. **Sheet Selection**: Script reads `page` value and selects/creates corresponding sheet
4. **Header Management**: Script ensures headers exist and adds new columns if needed
5. **Data Append**: New row is appended with timestamp and all form data
6. **Response**: Success/error message returned to the form

---

## Testing

### Test from Apps Script Editor
1. Open your Apps Script project
2. Run the `testDoPost()` function
3. Check your spreadsheet for a new "Terapiya" sheet with test data

### Test from HTML Form
1. Deploy your HTML page
2. Fill out and submit the form
3. Check your spreadsheet for the new lead

---

## Spreadsheet Structure Example

After submissions from different landing pages, your spreadsheet will look like:

**Sheet: Terapiya**
| Timestamp | Name | Phone | Page | Group | Source |
|-----------|------|-------|------|-------|--------|
| 2026-01-31 14:00 | John Doe | +998901234567 | Terapiya | Morning | Facebook |

**Sheet: EKG**
| Timestamp | Name | Phone | Page |
|-----------|------|-------|------|
| 2026-01-31 14:05 | Jane Smith | +998907654321 | EKG |

**Sheet: Endokrin**
| Timestamp | Name | Phone | Page | Course | Message |
|-----------|------|-------|------|--------|---------|
| 2026-01-31 14:10 | Ali Karimov | +998909876543 | Endokrin | Basic | Need more info |

---

## Important Notes

> [!IMPORTANT]
> - Replace `YOUR_WEB_APP_URL_HERE` with your actual Web App URL in all HTML forms
> - The `page` parameter value becomes the sheet name (use consistent naming)
> - Always include the hidden input: `<input type="hidden" name="page" value="YourPageName">`

> [!TIP]
> - Sheet names are case-sensitive ("Terapiya" ≠ "terapiya")
> - Use meaningful sheet names that match your landing page names
> - You can manually format sheets (colors, column widths) - they won't be overwritten

> [!CAUTION]
> - Don't manually delete or rename the header row (row 1)
> - Don't change the "Timestamp" column name
> - Ensure Web App is deployed with "Anyone" access for public forms

---

## Troubleshooting

### Form not submitting?
- Check browser console for errors
- Verify Web App URL is correct
- Ensure Web App is deployed with "Anyone" access

### Data not appearing in spreadsheet?
- Check Apps Script execution logs (View → Logs)
- Verify required fields (name, phone, page) are being sent
- Check if authorization is needed (re-deploy if necessary)

### New columns not appearing?
- Verify field names in HTML match what you expect
- Check if headers are locked or protected
- Review Apps Script logs for errors

---

## Next Steps

1. ✅ Copy the Apps Script code to your Google Spreadsheet
2. ✅ Deploy as Web App and get the URL
3. ✅ Update all your HTML landing pages with the Web App URL
4. ✅ Test each landing page to ensure data is saved correctly
5. ✅ Monitor your spreadsheet for incoming leads

**You're all set!** 🎉