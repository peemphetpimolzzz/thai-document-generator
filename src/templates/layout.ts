const baseStyles = `
  @page { size: A4; margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  body {
    font-family: 'Sarabun', 'Noto Sans Thai', sans-serif;
    /* Thai needs extra leading so stacked vowels/tone marks never collide between lines. */
    line-height: 1.6;
    color: #1f2937;
    font-size: 14px;
    margin: 0;
    /* No letter-spacing — it breaks Thai mark positioning. */
  }
  h1 { font-size: 22px; margin: 0 0 4px; }
  h2 { font-size: 16px; margin: 18px 0 6px; }
  table { width: 100%; border-collapse: collapse; }
  .c-num { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .c-no { text-align: center; width: 48px; }

  .doc-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; }
  .seller-name { font-weight: 700; font-size: 16px; }
  .doc-meta { text-align: right; }
  .doc-meta table td:first-child { color: #6b7280; padding-right: 12px; }

  .bill-to { margin: 18px 0; padding: 12px 14px; background: #f3f4f6; border-radius: 8px; }
  .bill-to .label { color: #6b7280; font-size: 12px; }
  .buyer-name { font-weight: 700; }

  table.items { margin-top: 8px; }
  table.items th { background: #1f2937; color: #fff; padding: 8px 10px; text-align: left; }
  table.items td { padding: 8px 10px; border-bottom: 1px solid #e5e7eb; }

  .totals { margin-top: 16px; display: flex; flex-direction: column; align-items: flex-end; }
  .totals table { width: 280px; }
  .totals td { padding: 4px 8px; }
  .totals tr.grand td { font-weight: 700; border-top: 2px solid #1f2937; font-size: 16px; }
  .baht-text { margin-top: 8px; font-weight: 700; }

  .note { margin-top: 18px; color: #374151; }
  .sign { margin-top: 48px; text-align: right; }
  .sign-box { display: inline-block; border-top: 1px solid #9ca3af; padding-top: 6px; min-width: 220px; text-align: center; color: #6b7280; }

  .report-head { border-bottom: 2px solid #1f2937; padding-bottom: 10px; }
  .report-head .subtitle { color: #6b7280; }
  .report-head .meta { color: #6b7280; font-size: 13px; margin-top: 4px; }
  .report-section p { margin: 4px 0 0; text-align: justify; }
  table.summary th { background: #f3f4f6; padding: 6px 10px; text-align: left; }
  table.summary td { padding: 6px 10px; border-bottom: 1px solid #e5e7eb; }
`;

export function layout(fontDir: string, body: string): string {
  return `<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8" />
<style>
@font-face { font-family: 'Sarabun'; src: url('file://${fontDir}/Sarabun-Regular.ttf') format('truetype'); font-weight: 400; font-display: block; }
@font-face { font-family: 'Sarabun'; src: url('file://${fontDir}/Sarabun-Bold.ttf') format('truetype'); font-weight: 700; font-display: block; }
${baseStyles}
</style>
</head>
<body>${body}</body>
</html>`;
}
