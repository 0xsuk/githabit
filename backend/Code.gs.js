const SPREADSHEET_URL =
  "https://docs.google.com/spreadsheets/d/1pABhDzbEZCaQg9INz5HBZgUtRDG66puzC-B2uNx4CSI/edit#gid=0";
const sheet = getSheet();

const habitCell = "A1";
const passwordCell = "A2";
const sidCell = "A3";
const dateCol = "B";
const countCol = "C";

function getSheet() {
  const ss = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
  const sheet = ss.getActiveSheet();
  return sheet;
}
function doGet(e) {
  return doPost(e);
}
function doPost(e) {
  return reqHandler(e);
}

function reqHandler(req) {
  if (!req.postData) {
    return genJsonResponse({ error: "postData is not defined" });
  }
  const data = JSON.parse(req.postData.contents);
  if (!data) {
    return genJsonResponse({ error: "postData.contents is not defined" });
  }
  const action = data.action;
  if (action === "login") {
    return handleLogin(data);
  }

  if (!isAuthenticated(data.sid)) {
    return genJsonResponse({ error: "not authenticated" });
  }
  switch (action) {
    case "fetch":
      return handleFetch();
    case "update":
      return handleUpdate(data);
    default:
      return genJsonResponse({ error: "invalid action: " + action });
  }
}

function isAuthenticated(sid) {
  if (!sid) {
    return false;
  }
  const trueSid = sheet.getRange(sidCell).getValue();
  if (sid === trueSid) {
    return true;
  }
  return false;
}

let cachedResponse;
function handleFetch() {
  const habit = sheet.getRange(habitCell).getDisplayValue();

  const dates = sheet.getRange(dateCol + ":" + dateCol).getDisplayValues(); //get date as string, not in date format
  const data = dates.filter(String).map((dateArr, i) => {
    const count = sheet.getRange(countCol + (i + 1)).getValue();
    return { date: dateArr[0], count }; //assuming countArr exists
  });
  cachedResponse = genJsonResponse({ data, habit });

  return cachedResponse;
}

function handleUpdate(data) {
  const count = data.count;
  if (!Number.isInteger(count) || count < 0) {
    return genJsonResponse({ error: "not valid count" });
  }
  const d = new Date();
  let date;
  {
    let month = d.getMonth() + 1;
    if (month < 10) month = `0${month}`;
    date = d.getFullYear() + "-" + month + "-" + d.getDate();
  }
  const shouldInsertCell =
    sheet.getRange(dateCol + "1").getDisplayValue() !== date;
  if (shouldInsertCell && count === 0) {
    //do nothing
    return cachedResponse;
  }
  if (!shouldInsertCell && count === 0) {
    //delete existing data and unshift
    sheet
      .getRange(dateCol + "1:" + countCol + "1")
      .deleteCells(SpreadsheetApp.Dimension.ROWS);
    return handleFetch();
  }
  if (shouldInsertCell && count !== 0) {
    //insert cell to create space
    sheet
      .getRange(dateCol + "1:" + countCol + "1")
      .insertCells(SpreadsheetApp.Dimension.ROWS);
  }

  sheet.getRange(dateCol + "1").setValue(date);
  sheet.getRange(countCol + "1").setValue(count);
  return handleFetch();
}

function handleLogin(data) {
  function genSid() {
    const length = 50;
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    for (var i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }
  const password = data.password;
  const truePassword = sheet.getRange(passwordCell).getValue();
  if (!password || truePassword !== password) {
    return genJsonResponse({ error: "invalid login" });
  }

  const sid = genSid();
  sheet.getRange(sidCell).setValue(sid);
  return genJsonResponse({ data: sid });
}
function genJsonResponse(obj) {
  const data = JSON.stringify(obj);
  return ContentService.createTextOutput(data).setMimeType(
    ContentService.MimeType.JSON
  );
}
function testHandleUpdate() {
  const data = { count: 1 };
  handleUpdate(data);
}
