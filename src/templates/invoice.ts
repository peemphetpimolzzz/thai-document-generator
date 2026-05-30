export const invoiceTemplate = `
<div class="doc">
  <header class="doc-head">
    <div class="seller">
      <div class="seller-name">{{seller.name}}</div>
      {{#if seller.address}}<div>{{seller.address}}</div>{{/if}}
      {{#if seller.taxId}}<div>เลขประจำตัวผู้เสียภาษี: {{seller.taxId}}</div>{{/if}}
      {{#if seller.branch}}<div>สาขา: {{seller.branch}}</div>{{/if}}
    </div>
    <div class="doc-meta">
      <h1>{{documentTitle}}</h1>
      <table>
        <tr><td>เลขที่</td><td>{{number}}</td></tr>
        <tr><td>วันที่</td><td>{{thaiDate issueDate}}</td></tr>
        {{#if dueDate}}<tr><td>ครบกำหนด</td><td>{{thaiDate dueDate}}</td></tr>{{/if}}
      </table>
    </div>
  </header>

  <section class="bill-to">
    <div class="label">ลูกค้า</div>
    <div class="buyer-name">{{buyer.name}}</div>
    {{#if buyer.address}}<div>{{buyer.address}}</div>{{/if}}
    {{#if buyer.taxId}}<div>เลขประจำตัวผู้เสียภาษี: {{buyer.taxId}}</div>{{/if}}
  </section>

  <table class="items">
    <thead>
      <tr>
        <th class="c-no">ลำดับ</th>
        <th>รายการ</th>
        <th class="c-num">จำนวน</th>
        <th class="c-num">หน่วยละ</th>
        <th class="c-num">จำนวนเงิน</th>
      </tr>
    </thead>
    <tbody>
      {{#each items}}
      <tr>
        <td class="c-no">{{this.index}}</td>
        <td>{{this.description}}</td>
        <td class="c-num">{{this.quantity}}</td>
        <td class="c-num">{{baht this.unitPrice}}</td>
        <td class="c-num">{{baht this.amount}}</td>
      </tr>
      {{/each}}
    </tbody>
  </table>

  <section class="totals">
    <table>
      <tr><td>รวมเป็นเงิน</td><td class="c-num">{{baht subtotal}}</td></tr>
      {{#if discount}}<tr><td>ส่วนลด</td><td class="c-num">{{baht discount}}</td></tr>{{/if}}
      <tr><td>ภาษีมูลค่าเพิ่ม {{vatRate}}%</td><td class="c-num">{{baht vat}}</td></tr>
      <tr class="grand"><td>จำนวนเงินรวมทั้งสิ้น</td><td class="c-num">{{baht total}}</td></tr>
    </table>
    <div class="baht-text">({{bahtText total}})</div>
  </section>

  {{#if note}}<section class="note">หมายเหตุ: {{note}}</section>{{/if}}

  <footer class="sign">
    <div class="sign-box">ผู้รับเงิน / ผู้มีอำนาจลงนาม</div>
  </footer>
</div>`;
