export const reportTemplate = `
<div class="doc">
  <header class="report-head">
    <h1>{{title}}</h1>
    {{#if subtitle}}<div class="subtitle">{{subtitle}}</div>{{/if}}
    <div class="meta">{{thaiDate date}}{{#if dateRange}} · {{dateRange}}{{/if}}</div>
  </header>

  {{#each sections}}
  <section class="report-section">
    <h2>{{this.heading}}</h2>
    <p>{{this.body}}</p>
  </section>
  {{/each}}

  {{#if summary}}
  <section class="report-section">
    <h2>สรุป</h2>
    <table class="summary">
      <thead><tr><th>รายการ</th><th class="c-num">ค่า</th></tr></thead>
      <tbody>
        {{#each summary}}
        <tr><td>{{this.label}}</td><td class="c-num">{{this.value}}</td></tr>
        {{/each}}
      </tbody>
    </table>
  </section>
  {{/if}}
</div>`;
