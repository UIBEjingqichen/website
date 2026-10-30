/* site-polish-v40: light, idempotent table enhancements (badges, chips, grouping). */
(function () {
  "use strict";
  function slug(t) { return t.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
  function headerIndex(table, re) {
    var row = table.tHead && table.tHead.rows[0];
    if (!row) return -1;
    for (var i = 0; i < row.cells.length; i++) if (re.test(row.cells[i].textContent)) return i;
    return -1;
  }
  function wrap(cell, cls, kind) {
    if (!cell || cell.querySelector("." + cls) || cell.children.length) return;
    var txt = cell.textContent.trim();
    if (!txt) return;
    var s = document.createElement("span");
    s.className = cls;
    if (kind) s.setAttribute("data-kind", kind);
    s.textContent = txt;
    cell.textContent = "";
    cell.appendChild(s);
  }
  function enhance() {
    document.querySelectorAll("table.pd-table").forEach(function (table) {
      var body = table.tBodies[0];
      if (!body) return;
      var vIdx = headerIndex(table, /verification|status|report type/i);
      var uIdx = table.classList.contains("pd-table--kv") ? headerIndex(table, /^\s*unit\s*$/i) : -1;
      var isModel = headerIndex(table, /^\s*model\s*$/i) === 0;
      var prev = null;
      Array.prototype.forEach.call(body.rows, function (row) {
        if (vIdx > -1) wrap(row.cells[vIdx], "tbl-badge", slug(row.cells[vIdx] ? row.cells[vIdx].textContent : ""));
        if (uIdx > -1) {
          var c = row.cells[uIdx];
          if (c && c.textContent.trim() !== "—") wrap(c, "tbl-unit");
        }
        if (isModel && row.cells[0]) {
          var key = row.cells[0].textContent.trim();
          wrap(row.cells[0], "tbl-model");
          if (prev !== null && key !== prev) row.classList.add("tbl-group-start");
          if (key === prev) row.classList.add("tbl-repeat");
          prev = key;
        }
      });
    });
    document.querySelectorAll("table.tr-ref-table tbody th, table.ap60-table--intl tbody th").forEach(function (th) {
      wrap(th, "tbl-country");
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", enhance);
  else enhance();
})();
