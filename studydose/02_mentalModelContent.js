const mentalModelSpreadsheet = new SpreadsheetManager("Sheet1");
const studyDoseSize = 3;

function shuffle(array) {
  // Create a copy to avoid modifying original array
  const shuffled = [...array];
  // Fisher-Yates algorithm
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function mentalModelContent() {
  let unreadRows = mentalModelSpreadsheet.getUnreadRowsWithColumnValue(
    "sent",
    "no"
  );
  if (unreadRows.length > studyDoseSize) {
    // Randomly select studyDoseSize rows
    unreadRows = shuffle(unreadRows);
    unreadRows = unreadRows.slice(0, studyDoseSize);
  }
  let body = "Here are your mental models for today:\n\n";

  const modelURLColumnIndex = mentalModelSpreadsheet.getColumnIndex("url");

  for (let i = 0; i < unreadRows.length; i++) {
    body += `${i + 1}. ${unreadRows[i][modelURLColumnIndex]}\n`;

    const rowIndex = mentalModelSpreadsheet.getRowIndex(
      "url",
      unreadRows[i][modelURLColumnIndex]
    );
    mentalModelSpreadsheet.setColumnValue(rowIndex, "sent", "yes");
  }
  body += "\nVisit https://modelthinkers.com for more.";
  return body;
}
