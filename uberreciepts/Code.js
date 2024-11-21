const DaysToLookBack = 7;

const UserRules = [
  {
    query: `in:all from:"uber receipts"`,
  },
];

function main() {
  createCalendarEventFromEmail();
}

function createCalendarEventFromEmail() {
  const lookbackPeriod = getDateDaysAgo(DaysToLookBack);

  Logger.log("Reading Messages Since " + lookbackPeriod);
  var queries = UserRules;

  queries.forEach((queryObject) => {
    const results = [];
    var query = queryObject.query;
    query = query + ` after:${lookbackPeriod} `;

    Logger.log("Searching for: " + query);
    const threads = GmailApp.search(query);
    threads.forEach((thread) => {
      const messages = thread.getMessages();
      messages.forEach((msg) => {
        const date2 = msg.getDate().toString();
        const cleanDateString = date2.split(" (")[0]; // format into  "Wed Nov 13 2024 18:18:25 GMT-0500"
        const text = msg.getPlainBody();

        const { from, to } = extractAddresses(text);
        const { amount, name } = extractNameAndAmount(text);
        Logger.log(`Dollar Amount: $${amount}`);
        Logger.log(`Person's Name: ${name}`);

        results.push({
          date: cleanDateString,
          amount: amount,
          name: name,
          from: from,
          to: to,
        });
      });
    });
    saveResultsToSpreadsheet(results);
    Logger.log(JSON.stringify(results, null, 2));
  });
}

function saveResultsToSpreadsheet(results) {
  // Get or create the spreadsheet
  const SPREADSHEET_ID = "1MTG1Rck0GffeL5jdrPAdJ4uJi_xwH5ncoT--cuiluv8";
  let spreadsheet;
  try {
    spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  } catch (e) {
    spreadsheet = SpreadsheetApp.create("Email Data");
  }
  const sheet = spreadsheet.getActiveSheet();

  // If sheet is empty, add headers
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Date", "Amount", "Name", "From", "To"]);
  }

  // Convert results to 2D array for sheet
  const rows = results.map((result) => [
    result.date,
    result.amount,
    result.name,
    result.from,
    result.to,
  ]);

  // Append all rows at once if there are results
  if (rows.length > 0) {
    // Get existing dates from sheet
    const existingData = sheet.getDataRange().getValues();
    const existingDates = existingData.slice(1).map((row) => row[0]); // Skip header row

    // Filter out rows with dates that already exist
    const newRows = rows.filter((row) => !existingDates.includes(row[0]));

    if (newRows.length > 0) {
      sheet
        .getRange(sheet.getLastRow() + 1, 1, newRows.length, newRows[0].length)
        .setValues(newRows);
    }
  }
}

function getDateDaysAgo(days) {
  const dateDaysAgo = new Date();
  dateDaysAgo.setDate(dateDaysAgo.getDate() - days);
  return dateDaysAgo.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function extractNameAndAmount(text) {
  // Regular expressions to extract the dollar amount and name
  const amountRegex = /Total\s+\$(\d+\.\d{2})/;
  const nameRegex = /Thanks for riding,\s+([A-Za-z]+)/;

  // Extract the dollar amount
  const amountMatch = text.match(amountRegex);
  const amount = amountMatch ? amountMatch[1] : null;

  // Extract the person's name
  const nameMatch = text.match(nameRegex);
  const name = nameMatch ? nameMatch[1] : null;

  return { amount, name };
}

function extractAddresses(receiptText) {
  const regex =
    /(?:\d{1,2}:\d{2}\s(?:AM|PM)\n)(.+)\n(?:\d{1,2}:\d{2}\s(?:AM|PM)\n)(.+)/;
  const match = receiptText.match(regex);

  if (match && match.length > 2) {
    return {
      from: match[1].trim(),
      to: match[2].trim(),
    };
  }
  return { from: null, to: null };
}
