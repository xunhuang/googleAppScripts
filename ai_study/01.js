class SpreadsheetManager {
  constructor(sheetName) {
    this.sheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    this.data = this.sheet.getDataRange().getValues();
    this.headers = this.data[0];
  }

  getColumnIndex(columnName) {
    return this.headers.indexOf(columnName);
  }

  getUnreadRowsWithColumnValue(columnName, value) {
    const results = [];
    for (let i = 1; i < this.data.length; i++) {
      if (this.data[i][this.getColumnIndex(columnName)] === value) {
        results.push(this.data[i]);
      }
    }
    return results;
  }

  getRowIndex(columnName, value) {
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i][this.getColumnIndex(columnName)] === value) {
        return i;
      }
    }
    return -1;
  }

  setColumnValue(rowIndex, columnName, value) {
    this.sheet
      .getRange(rowIndex + 1, this.getColumnIndex(columnName) + 1)
      .setValue(value);
  }
}
