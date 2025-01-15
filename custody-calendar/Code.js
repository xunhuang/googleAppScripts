function enumerateColumns() {
  // Get the calendar by name
  const calendar = CalendarApp.getCalendarsByName("Huang-Chan Custody")[0];

  // Open the active spreadsheet
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Get all the data in the sheet
  const data = sheet.getDataRange().getValues();

  // Get the date range from first to last row
  const startDate = new Date(data[1][1]); // First date from row 1
  const endDate = new Date(data[data.length - 1][1]); // Last date
  endDate.setDate(endDate.getDate() + 1); // Add one day to end date

  // Get all events for the entire date range at once
  const allEvents = calendar.getEvents(startDate, endDate);
  const allDayEvents = allEvents.filter((e) => e.isAllDayEvent());

  // Iterate through all rows, starting from the second row (assuming the first row is a header)
  for (let i = 1; i < data.length; i++) {
    const row = data[i]; // Current row data
    // const columnsBCD = `B: ${row[1]}, C: ${row[2]}, D: ${row[3]}, E: ${row[4]}`;
    // console.log(columnsBCD);

    // Check if columns B, C, D (indices 1, 2, 3) have the same value
    const whohascustody =
      row[4].toString().trim().toLowerCase() ===
        row[2].toString().trim().toLowerCase() &&
      row[2].toString().trim().toLowerCase() ===
        row[3].toString().trim().toLowerCase()
        ? row[4]
        : "mixed";

    const date = new Date(row[1]); // Convert date string to Date object
    const event = allDayEvents.find(
      (e) => e.getStartTime().toDateString() === date.toDateString()
    );

    if (!event) {
      console.log(
        "No event found for " + date + " creating event for " + whohascustody
      );
      calendar.createAllDayEvent(
        whohascustody,
        date // Date from the spreadsheet
      );
    } else if (event.getTitle() !== whohascustody) {
      console.log(
        "Event found for " +
          date +
          " but title is " +
          event.getTitle() +
          " changing title to " +
          whohascustody
      );
      event.setTitle(whohascustody);
    } else {
      console.log(
        " --------- Event found for " + date + " and title is " + whohascustody
      );
    }
  }
}
