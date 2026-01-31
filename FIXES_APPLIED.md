# Form Fixes Applied ✅

## Problems Found

Your forms weren't working because of **field name mismatches** between your HTML forms and the Google Apps Script.

### Issue #1: Phone Field Name Mismatch
- **HTML forms used**: `name="number"`
- **Apps Script expected**: `name="phone"`
- **Result**: Phone numbers weren't being saved

### Issue #2: Missing Page Parameter in JavaScript
- Some forms didn't explicitly send the `page` parameter in the JavaScript
- The hidden input existed, but the JavaScript wasn't appending it to the data

### Issue #3: Wrong Page Value in endokrin.html
- **Had**: `value="Intensiv terapiya"`
- **Should be**: `value="Endokrin"`
- **Result**: All Endokrin leads were being saved to the wrong sheet

---

## Fixes Applied

### ✅ terapiya.html
1. Changed `<input name="number">` → `<input name="phone">`
2. Added `data.append('page', 'Terapiya')` to JavaScript
3. Added hidden input: `<input type="hidden" name="page" value="Terapiya">`

### ✅ ekg.html
1. Changed `<input name="number">` → `<input name="phone">`
2. Changed `data.append('number', number)` → `data.append('phone', number)`

### ✅ endokrin.html
1. Changed `<input name="number">` → `<input name="phone">`
2. Fixed page value: `"Intensiv terapiya"` → `"Endokrin"`
3. Added `data.append('page', 'Endokrin')` to JavaScript

### ✅ reproductology.html
1. Changed `<input name="number">` → `<input name="phone">`
2. Added `data.append('page', 'Reproductology')` to JavaScript

---

## How Your Forms Work Now

### Form Submission Flow:
```
User fills form → JavaScript validates → Sends to Google Apps Script
                                              ↓
                                    Reads 'page' parameter
                                              ↓
                                    Creates/selects sheet
                                              ↓
                                    Saves: Timestamp | Name | Phone | Page | (optional fields)
```

### Expected Sheets in Your Spreadsheet:
- **Terapiya** - Leads from terapiya.html
- **EKG** - Leads from ekg.html (with Group field)
- **Endokrin** - Leads from endokrin.html
- **Reproductology** - Leads from reproductology.html

---

## Testing Your Forms

1. **Open each landing page** in your browser
2. **Fill out the form** with test data:
   - Name: Test User
   - Phone: +998901234567
   - (Any optional fields)
3. **Submit the form**
4. **Check your Google Spreadsheet** - you should see:
   - A new sheet created with the page name
   - A new row with your test data
   - Timestamp automatically generated

---

## Important Notes

> **Field Names Must Match**
> 
> Your HTML forms now use these exact field names:
> - `name` → for the person's name
> - `phone` → for the phone number
> - `page` → for the landing page identifier
> - Any other fields (like `group`) are optional

> **Don't Change These Names**
> 
> If you change the field names in HTML, you MUST also update:
> 1. The Google Apps Script
> 2. The JavaScript that sends the data

---

## Your Google Apps Script (Already Deployed)

The script you pasted is **correct** and should work now with the fixed HTML forms.

**Web App URL**: 
```
https://script.google.com/macros/s/AKfycbzOlKzYFfcmBx3y0JL9asE8aOk_hPKVJ_y4llEgBWCk1VIIEmgckWK4vnRjj3H55C4x/exec
```

This URL is already in all your HTML files. ✅

---

## What Happens When a Form is Submitted

1. **User fills form** on any landing page
2. **JavaScript validates**:
   - Name is not empty
   - Phone matches format: `+998XXXXXXXXX`
3. **Data is sent** to Google Apps Script:
   ```javascript
   {
     name: "John Doe",
     phone: "+998901234567",
     page: "Terapiya",
     group: "Morning" // (if applicable)
   }
   ```
4. **Apps Script processes**:
   - Checks if "Terapiya" sheet exists
   - If not, creates it
   - Adds/updates headers
   - Appends new row with timestamp
5. **Response sent back** to user:
   - Success: "Muvaffaqiyatli yuborildi! ✅"
   - Error: "Xatolik: Qayta urinib ko'ring"

---

## All Fixed! 🎉

Your forms should now work perfectly. Test each one and check your Google Spreadsheet to confirm the data is being saved correctly.
