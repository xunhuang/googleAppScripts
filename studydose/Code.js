function sendDailyStudyDose() {
  const recipient = "xhuang@gmail.com";
  const subject = "Curated Daily Dose of Study Material";
  let body = mentalModelContent() + "\n\n" + lifeContent();
  Logger.log(body);

  GmailApp.sendEmail(recipient, subject, body);
}
