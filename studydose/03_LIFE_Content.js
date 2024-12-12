const lifeSpreadsheet = new SpreadsheetManager(
  "LIFE'S LITTLE INSTRUCTION BOOK"
);
function lifeContent() {
  const studyDoseSize = 10;
  const contentColumnName = "Tricks";
  const statusColumnName = "sent";

  let unreadRows = lifeSpreadsheet.getUnreadRowsWithColumnValue(
    statusColumnName,
    "no"
  );
  if (unreadRows.length > studyDoseSize) {
    unreadRows = unreadRows.slice(0, studyDoseSize);
  }
  let body = "Life's little instructions for today:\n\n";

  const tricksColumnIndex = lifeSpreadsheet.getColumnIndex(contentColumnName);

  for (let i = 0; i < unreadRows.length; i++) {
    body += `${unreadRows[i][tricksColumnIndex]}\n`;

    const rowIndex = lifeSpreadsheet.getRowIndex(
      contentColumnName,
      unreadRows[i][tricksColumnIndex]
    );
    lifeSpreadsheet.setColumnValue(rowIndex, statusColumnName, "yes");
  }
  return body;
}
