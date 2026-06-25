import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "dist");
const port = Number(process.env.PORT || 4173);
const types = { ".html": "text/html", ".css": "text/css", ".js": "application/javascript", ".jpeg": "image/jpeg", ".jpg": "image/jpeg", ".png": "image/png", ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document" };

http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  let file = path.join(root, decodeURIComponent(url.pathname));
  if (url.pathname.endsWith("/")) file = path.join(file, "index.html");
  if (!file.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
    res.end(data);
  });
}).listen(port, () => console.log(`Tianyu Electric site: http://localhost:${port}`));
