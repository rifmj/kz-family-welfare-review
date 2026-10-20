(function () {
  "use strict";
  var D = window.METODIKA;
  var $ = function (id) { return document.getElementById(id); };
  var minus = function (n) { return String(n).replace("-", "−"); };
  var fmt = function (n) { return minus(Math.abs(n) >= 1000 ? n.toLocaleString("ru-RU").replace(/ /g, " ") : n); };
  var esc = function (s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); };
  var md = function (s) { return esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"); };

  /* ---------- пункт 13: категории ---------- */
  var CATS = [
    { k: "A", name: "благополучный", lo: 1800, hi: Infinity, q: "от 1 800 и выше баллов" },
    { k: "B", name: "удовлетворительный", lo: 730, hi: 1799, q: "от 730 до 1 799 баллов" },
    { k: "C", name: "неудовлетворительный", lo: -30, hi: 729, q: "от минус 30 до 729 баллов" },
    { k: "D", name: "кризисный", lo: -460, hi: -29, q: "от минус 460 до минус 29 баллов" },
    { k: "E", name: "экстренный", lo: -Infinity, hi: -459, q: "до минус 459 баллов" }
  ];
  var inCat = function (c, v) { return v >= c.lo && v <= c.hi; };

  var catsEl = $("cats");
  catsEl.innerHTML = CATS.map(function (c) {
    return '<li data-k="' + c.k + '"><b>' + c.k + "</b>" + c.name + "<br>«" + c.q + "»</li>";
  }).join("");

  var range = $("sum-range"), out = $("sum-out"), verdict = $("verdict"), loupe = $("loupe");
  function renderSum(v) {
    v = Math.max(-700, Math.min(2100, Math.round(v / 10) * 10));
    range.value = v;
    out.textContent = fmt(v);
    var hit = CATS.filter(function (c) { return inCat(c, v); });
    var dbl = hit.length > 1;
    verdict.innerHTML = dbl
      ? '<span class="two">' + hit.map(function (c) { return c.k; }).join(" и ") + "</span><small>Сумма входит в оба диапазона пункта 13.</small>"
      : "Категория " + hit[0].k + "<small>" + hit[0].name + " уровень</small>";
    Array.prototype.forEach.call(catsEl.children, function (li) {
      var c = CATS.filter(function (x) { return x.k === li.dataset.k; })[0];
      li.className = inCat(c, v) ? "lit" + (dbl ? " dbl" : "") : "";
    });
    var ticks = [];
    for (var t = v - 70; t <= v + 70; t += 10) ticks.push(t);
    var html = "";
    CATS.forEach(function (c) {
      html += '<div class="loupe__name' + (inCat(c, v) ? " lit" : "") + '">' + c.k + "</div>";
      ticks.forEach(function (t) {
        var cls = "loupe__cell" + (inCat(c, t) ? " in" : "") + (t === v ? " mark" : "") + (t === v && dbl ? " dbl" : "");
        html += '<div class="' + cls + '" title="' + c.k + ", " + fmt(t) + '"></div>';
      });
    });
    html += "<div></div>" + ticks.map(function (t) {
      return '<div class="loupe__tick' + (t === v ? " mark" : "") + '">' + fmt(t) + "</div>";
    }).join("");
    loupe.innerHTML = html;
  }
  range.addEventListener("input", function () { renderSum(+range.value); });
  document.querySelectorAll(".ruler__jumps button").forEach(function (b) {
    b.addEventListener("click", function () {
      renderSum(b.dataset.sum !== undefined ? +b.dataset.sum : +range.value + +b.dataset.step);
    });
  });
  renderSum(-30);

  /* ---------- пример: площадь 18 м² ---------- */
  var area = $("area"), areaOut = $("area-out"), cmp = $("area-cmp");
  var RU = [
    { q: "…менее 18 квадратных метров на одного члена семьи", pts: "−80", t: function (a) { return a < 18; } },
    { q: "…более 18 квадратных метров на одного члена семьи", pts: "0", t: function (a) { return a > 18; } }
  ];
  var KK = [
    { q: "кем дегенде 18 шаршы метр", tr: "не менее 18", pts: "−80", t: function (a) { return a >= 18; } },
    { q: "18 шаршы метрден астам", tr: "более 18", pts: "0", t: function (a) { return a > 18; } }
  ];
  function col(name, rows, a) {
    var on = rows.filter(function (r) { return r.t(a); });
    var res = on.length === 0 ? '<p class="cmp__res res-none">Подходящей строки нет</p>'
      : on.length === 2 ? '<p class="cmp__res res-two">Подходят обе: ' + on.map(function (r) { return r.pts; }).join(" или ") + "</p>"
      : '<p class="cmp__res">' + on[0].pts + " баллов</p>";
    return '<div class="cmp__col"><div class="cmp__lang">' + name + "</div>" + rows.map(function (r) {
      return '<div class="cmp__row' + (r.t(a) ? " on" : "") + '"><q>' + r.q + "</q>" + (r.tr ? " (" + r.tr + ")" : "") + " — " + r.pts + "</div>";
    }).join("") + res + "</div>";
  }
  function renderArea() {
    var a = +area.value;
    areaOut.textContent = a;
    cmp.innerHTML = col("Русский текст", RU, a) + col("Казахский текст", KK, a);
  }
  area.addEventListener("input", renderArea);
  renderArea();

  /* ---------- пример: число жилищ ---------- */
  var units = 3;
  function upto() { return document.querySelector('input[name="upto"]:checked').value === "incl"; }
  function unitRows(u, inc) {
    var le = function (x, b) { return inc ? x <= b : x < b; };
    return [
      { q: "отсутствие жилища", pts: "−200", on: u === 0 },
      { q: "одна единица жилища", pts: "−80 или 0 по площади", on: u === 1 },
      { q: "от двух до трех единиц жилища", pts: "100", on: u >= 2 && le(u, 3) },
      { q: "от трех до шести единиц жилища", pts: "400", on: u >= 3 && le(u, 6) },
      { q: "от шести до одиннадцати единиц жилища", pts: "1 000", on: u >= 6 && le(u, 11) },
      { q: "более одиннадцати единиц жилища", pts: "2 000", on: u > 11 }
    ];
  }
  function renderUnits() {
    var rows = unitRows(units, upto());
    $("units-out").textContent = units;
    $("units-rows").innerHTML = rows.map(function (r) {
      return '<li class="' + (r.on ? "on" : "") + '"><span>«' + r.q + "»</span><span>" + r.pts + "</span></li>";
    }).join("");
    var on = rows.filter(function (r) { return r.on; });
    var res = $("units-result");
    if (on.length === 0) { res.className = "ex__result res-none"; res.textContent = "Ни одна строка не подходит."; }
    else if (on.length > 1) {
      res.className = "ex__result res-two";
      res.textContent = "Подходят две строки: " + on.map(function (r) { return r.pts; }).join(" или ") + " баллов." +
        (units === 3 ? " Для семьи, у которой остальные критерии дают 590, это 690 (категория C) или 990 (категория B)." : "");
    } else { res.className = "ex__result"; res.textContent = "Подходит одна строка: " + on[0].pts + (/^[−\d]/.test(on[0].pts) && on[0].pts.indexOf("или") < 0 ? " баллов." : "."); }
  }
  $("units-dec").addEventListener("click", function () { units = Math.max(0, units - 1); renderUnits(); });
  $("units-inc").addEventListener("click", function () { units = Math.min(13, units + 1); renderUnits(); });
  document.querySelectorAll('input[name="upto"]').forEach(function (r) { r.addEventListener("change", renderUnits); });
  renderUnits();

  /* ---------- карта 85 позиций ---------- */
  var FAM = [
    { k: "two", name: "Два результата", hint: "Одним и тем же сведениям подходят две строки или две категории." },
    { k: "none", name: "Нет результата", hint: "Для возможного состояния семьи строки нет." },
    { k: "lang", name: "Русский и казахский", hint: "Версии на двух языках расходятся." },
    { k: "undef", name: "Не определено", hint: "Понятие, величина или порядок не определены и не отосланы к другому акту." },
    { k: "edit", name: "Редакция и согласованность", hint: "Формулировки, названия и оформление; на балл обычно не влияют." }
  ];
  var famBy = {}; FAM.forEach(function (f) { famBy[f.k] = f; });
  var active = {}; FAM.forEach(function (f) { active[f.k] = true; });
  var query = "", showLow = true;

  $("chips").innerHTML = FAM.map(function (f) {
    var n = D.items.filter(function (i) { return i.family === f.k; }).length;
    return '<button type="button" class="chip" aria-pressed="true" data-f="' + f.k + '" title="' + f.hint + '"><i style="background:var(--f-' + f.k + ')"></i>' + f.name + " <b>" + n + "</b></button>";
  }).join("") + '<button type="button" class="chip chip--low" aria-pressed="true" data-low="1" title="Редакционные и второстепенные замечания — приложение 2"><i></i>Приложение 2 · редакционные <b>20</b></button>';

  var byKey = {};
  D.items.forEach(function (i) { (byKey[i.key] = byKey[i.key] || []).push(i); });
  var critByKey = {};
  D.points.forEach(function (p) { p.criteria.forEach(function (c) { critByKey[c.key] = c; }); });

  function marks(key) {
    return '<div class="marks">' + (byKey[key] || []).map(function (i) {
      return '<button type="button" class="mk' + (i.part === 2 ? " low" : "") + '" data-n="' + i.id + '" data-f="' + i.family + '" aria-label="' + (i.part === 2 ? "Замечание " : "Позиция ") + i.id + ": " + famBy[i.family].name + '">' + i.id + "</button>";
    }).join("") + "</div>";
  }
  function row(no, name, key) {
    return '<div class="crit' + (byKey[key] ? "" : " empty") + '"><span class="crit__no">' + no + '</span><span class="crit__name">' + name + "</span>" + marks(key) + "</div>";
  }
  var html = '<div class="blk"><div class="blk__title"><span>1–4</span>Назначение, определения, формула</div>' + row("", "Пункты 1–4 и определения пункта 2", "gen") + "</div>";
  D.points.forEach(function (p) {
    html += '<div class="blk"><div class="blk__title"><span>' + p.p + "</span>" + p.title + "</div>";
    p.criteria.forEach(function (c) { html += row(c.key, c.title, c.key); });
    html += "</div>";
  });
  html += '<div class="blk"><div class="blk__title"><span>13</span>Категории A–E</div>' + row("13", "Диапазоны уровней благополучия", "13") + "</div>";
  html += '<div class="blk"><div class="blk__title"><span>—</span>Данные и процедура</div>' + row("", "Неизвестные сведения, дата расчёта, пересчёт, переходное применение", "proc") + "</div>";
  $("sheet").innerHTML = html;

  var panel = $("panel"), body = $("panel-body"), empty = $("panel-empty");
  var visible = function () {
    return D.items.filter(function (i) {
      return active[i.family] && (i.part === 1 || showLow) && (!query || (i.text + " " + i.loc).toLowerCase().indexOf(query) >= 0);
    }).map(function (i) { return i.id; });
  };
  function applyFilter() {
    var vis = visible();
    document.querySelectorAll(".mk").forEach(function (b) { b.classList.toggle("dim", vis.indexOf(b.dataset.n) < 0); });
  }
  function select(n, focus) {
    var i = D.items.filter(function (x) { return x.id === n; })[0];
    if (!i) return;
    document.querySelectorAll(".mk.sel").forEach(function (b) { b.classList.remove("sel"); });
    var btn = document.querySelector('.mk[data-n="' + n + '"]');
    if (btn) btn.classList.add("sel");
    var src = "";
    if (critByKey[i.key]) {
      var c = critByKey[i.key];
      src = '<div class="panel__src"><h4>Строки критерия ' + c.key + " · рус.</h4><p class=\"panel__no\">«" + esc(c.title) + "»</p><ul>" +
        c.rows.map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("") + "</ul></div>";
    } else if (i.key === "13") {
      src = '<div class="panel__src"><h4>Пункт 13 · рус.</h4><ul>' + D.categories.map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("") + "</ul></div>";
    }
    var f = famBy[i.family];
    var vis = visible(), k = vis.indexOf(n);
    body.innerHTML =
      '<button type="button" class="panel__close" id="panel-close" aria-label="Закрыть">×</button>' +
      '<div class="panel__no">' + (i.part === 2 ? "Замечание " + n + " · приложение 2, редакционное" : "Позиция " + n + " из 65 · приложение 1") + "</div>" +
      '<div class="panel__fam"><i style="background:var(--f-' + i.family + ')"></i>' + f.name + "</div>" +
      '<p class="panel__loc">' + esc(i.loc) + "</p>" +
      '<div class="panel__text">' + md(i.text) + "</div>" + src +
      '<div class="panel__nav"><button type="button" id="prev"' + (k <= 0 ? " disabled" : "") + '>← Предыдущая</button>' +
      '<button type="button" id="next"' + (k < 0 || k >= vis.length - 1 ? " disabled" : "") + ">Следующая →</button></div>";
    body.hidden = false; empty.hidden = true;
    panel.classList.add("open");
    $("prev").onclick = function () { if (k > 0) select(vis[k - 1], true); };
    $("next").onclick = function () { if (k >= 0 && k < vis.length - 1) select(vis[k + 1], true); };
    $("panel-close").onclick = function () { panel.classList.remove("open"); if (btn) btn.focus(); };
    if (history.replaceState) history.replaceState(null, "", "#" + (i.part === 2 ? "r" + n.replace("Р-", "") : "n" + n));
    if (focus) panel.focus({ preventScroll: true });
  }

  $("sheet").addEventListener("click", function (e) {
    var b = e.target.closest(".mk");
    if (b) select(b.dataset.n, window.matchMedia("(max-width: 900px)").matches);
  });
  $("chips").addEventListener("click", function (e) {
    var b = e.target.closest(".chip");
    if (!b) return;
    if (b.dataset.low) { showLow = !showLow; b.setAttribute("aria-pressed", String(showLow)); applyFilter(); return; }
    active[b.dataset.f] = !active[b.dataset.f];
    b.setAttribute("aria-pressed", String(active[b.dataset.f]));
    applyFilter();
  });
  $("q").addEventListener("input", function (e) { query = e.target.value.trim().toLowerCase(); applyFilter(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") panel.classList.remove("open"); });

  var m = /^#([nr])(\d+)$/.exec(location.hash);
  if (m) { select(m[1] === "r" ? "Р-" + m[2] : m[2]); document.getElementById("map").scrollIntoView(); }
})();
