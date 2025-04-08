/**
 * Fetches solar data from Enphase Enlighten API for a specific date
 * @param {string} date - The date to fetch data for in YYYY-MM-DD format
 * @return {Object} The JSON response from the API
 */
function fetchSolarDataForDate(date) {
  const response = UrlFetchApp.fetch(
    `https://enlighten.enphaseenergy.com/systems/460252/inverter_data_x/energy.json?start_date=${date}&end_date=${date}`,
    {
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "e-auth-token":
          PropertiesService.getScriptProperties().getProperty("etoken"),
        "x-requested-with": "XMLHttpRequest",
      },
      muteHttpExceptions: true,
    }
  );

  return JSON.parse(response.getContentText());
}

/**
 * Fetches solar data for a specific date and appends it to the active sheet
 * @param {string} date - The date to fetch data for in YYYY-MM-DD format
 */
function processSolarDataForDate(date) {
  const data = fetchSolarDataForDate(date);
  console.log(data);

  // Get the active spreadsheet and sheet
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();

  // Get the header row to match columns
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  // Prepare the new row data
  const newRow = [date]; // First column is the date

  // Track zero production inverters
  let zeroProductionInverters = [];

  // Match production values with header columns
  for (let i = 1; i < headers.length; i++) {
    const inverterId = headers[i].toString();
    const productionValue = data.production[inverterId] || 0;
    newRow.push(productionValue);

    // Check if production is zero
    if (productionValue === 0) {
      zeroProductionInverters.push(inverterId);
    }
  }

  // Append the new row
  sheet.appendRow(newRow);

  // Send email notification if any inverters have zero production
  if (zeroProductionInverters.length > 0) {
    const recipient = "xhuang@gmail.com";
    const subject = `Solar Production Alert: Zero Production Detected on ${date} for ${zeroProductionInverters.length} inverters`;
    const body = `The following ${
      zeroProductionInverters.length
    } inverter(s) reported zero production on ${date}:\n\n${zeroProductionInverters.join(
      ", "
    )}`;

    GmailApp.sendEmail(recipient, subject, body);
  }
}

function myFunction() {
  const today = new Date();
  const dateStr = Utilities.formatDate(
    today,
    "America/Los_Angeles",
    "yyyy-MM-dd"
  );
  console.log(`Processing data for ${dateStr}`);
  processSolarDataForDate(dateStr);
}
