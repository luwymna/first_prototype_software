/* Reused component: jsPDF builds the PDF inside the browser. Nothing is uploaded. */
function makePdf() {
  const h = load("mp_hist", []); if (!h.length) return;
  const msg = $("#pdfmsg"); if (msg) msg.textContent = "";
  try {
    if (!window.jspdf) throw new Error("jsPDF is not loaded");
    const clean = s => String(s).replace(/[’‘]/g, "'").replace(/<[^>]+>/g, ""), d = new window.jspdf.jsPDF(), l = h[h.length - 1], K = Object.keys(NAME); let y = 20;
    const line = (s, sz = 11) => { d.setFontSize(sz); d.splitTextToSize(clean(s), 180).forEach(r => { if (y > 278) { d.addPage(); y = 20 } d.text(r, 14, y); y += sz * .6 }) };
    line("MindPulse - " + t("pdf.title"), 18); y += 2; line(new Date().toLocaleDateString(i18next.language === "ms" ? "ms-MY" : "en-GB"), 10); y += 4;
    line(t("pdf.latest"), 13); K.forEach(k => line(`${nm(k)}: ${l[k]} (${lv(level(k, l[k]))})`)); y += 4;
    line(t("tr.says"), 13); insights(h).forEach(i => line("- " + i.txt)); y += 4;
    line(t("tr.hist"), 13); h.slice().reverse().forEach(e => line(`${new Date(e.t).toLocaleDateString()}   ${K.map(k => nm(k) + " " + e[k]).join(" | ")}`)); y += 6;
    line(t("pdf.disc"), 9); d.save("mindpulse-report.pdf");
  } catch (e) { if (msg) msg.textContent = t("pdf.fail"); }
}
