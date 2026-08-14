import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const workbookPath = process.argv[2];
if (!workbookPath) throw new Error("Workbook path is required.");

const input = await FileBlob.load(workbookPath);
const workbook = await SpreadsheetFile.importXlsx(input);
const overview = await workbook.inspect({
  kind: "workbook,sheet,table",
  maxChars: 14000,
  tableMaxRows: 14,
  tableMaxCols: 18,
  tableMaxCellChars: 160,
});
console.log(overview.ndjson);
