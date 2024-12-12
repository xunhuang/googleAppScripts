function sendDailyStudyDose() {
  const recipient = "xhuang@gmail.com;cathsfz@gmail.com";
  const subject = "AI Study Material";
  let body = studyListContent();
  Logger.log(body);

  // HTML body
  var htmlBody = `
    <html>
      <body>
       ${body}
      </body>
    </html>
  `;
  GmailApp.sendEmail(recipient, subject, body, {
    htmlBody: htmlBody
  });
}

const lifeSpreadsheet = new SpreadsheetManager(
  "list"
);
function studyListContent() {
  const studyDoseSize = 1;
  const contentColumnName = "url";
  const statusColumnName = "sent";
  const titleColumnName = "title";

  let unreadRows = lifeSpreadsheet.getUnreadRowsWithColumnValue(
    statusColumnName,
    ""
  );
  if (unreadRows.length > studyDoseSize) {
    unreadRows = unreadRows.slice(0, studyDoseSize);
  }
  let body = "<h1>AI Study for today</h1><br><br>";

  const urlColumnIndex = lifeSpreadsheet.getColumnIndex(contentColumnName);
  const titleColumnIndex = lifeSpreadsheet.getColumnIndex(titleColumnName);

  for (let i = 0; i < unreadRows.length; i++) {
    body += `<a href="${unreadRows[i][urlColumnIndex]}"> ${unreadRows[i][titleColumnIndex]}</a>\n`;

    const rowIndex = lifeSpreadsheet.getRowIndex(
      titleColumnName,
      unreadRows[i][titleColumnIndex]
    );
    const d = new Date();
    let day = d.getDate();
    let month = d.getMonth();
    let year = d.getFullYear();
    lifeSpreadsheet.setColumnValue(rowIndex, statusColumnName, `${month}/${day}/${year}`);
  }
  return body;
}