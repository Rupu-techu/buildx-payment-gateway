import { formatCurrency } from "../utils/pricing.js";
import { formatReceiptDate } from "../utils/receipt.js";

function ReceiptDocument({ receiptData, receiptRef }) {
  if (!receiptData) {
    return null;
  }

  const summary = receiptData.billingSummary;

  return (
    <>
      <style>{`
        @media print {
          body {
            background: #ffffff !important;
          }
        }
      `}</style>

      <article ref={receiptRef} style={receiptStyles.document}>
        <header style={receiptStyles.header}>
          <div style={receiptStyles.brandBlock}>
            <div style={receiptStyles.logoMark}>BX</div>
            <div>
              <p style={receiptStyles.eyebrow}>{receiptData.brand.title}</p>
              <h2 style={receiptStyles.title}>{receiptData.brand.subtitle}</h2>
            </div>
          </div>

          <div style={receiptStyles.headerMeta}>
            <span style={receiptStyles.statusPill}>{receiptData.status}</span>
            <p style={receiptStyles.metaText}>Issued on {formatReceiptDate(receiptData.paidAt)}</p>
          </div>
        </header>

        <section style={receiptStyles.hero}>
          <div>
            <p style={receiptStyles.sectionLabel}>Customer</p>
            <p style={receiptStyles.primaryValue}>{receiptData.customerName}</p>
            <p style={receiptStyles.secondaryValue}>Order {receiptData.orderId}</p>
          </div>

          <div style={receiptStyles.totalCard}>
            <p style={receiptStyles.sectionLabel}>Final Amount</p>
            <p style={receiptStyles.totalValue}>{formatCurrency(summary.finalAmount)}</p>
          </div>
        </section>

        <section style={receiptStyles.metaGrid}>
          <InfoCard label="Transaction ID" value={receiptData.transactionId} />
          <InfoCard label="Payment Method" value={receiptData.paymentMethod} />
          <InfoCard label="Date & Time" value={formatReceiptDate(receiptData.paidAt)} />
          <InfoCard label="Payment Status" value={receiptData.status} />
        </section>

        <section style={receiptStyles.contentGrid}>
          <section style={receiptStyles.panel}>
            <div style={receiptStyles.panelHeader}>
              <p style={receiptStyles.sectionLabel}>Billing Summary</p>
              <p style={receiptStyles.panelHint}>Clean SaaS-style invoice breakdown</p>
            </div>

            <div style={receiptStyles.lineItems}>
              {summary.items.map((item) => (
                <div key={item.id} style={receiptStyles.lineRow}>
                  <div>
                    <p style={receiptStyles.lineTitle}>{item.title}</p>
                    <p style={receiptStyles.lineMeta}>Qty {item.quantity}</p>
                  </div>
                  <strong style={receiptStyles.lineAmount}>
                    {formatCurrency(item.amount)}
                  </strong>
                </div>
              ))}
            </div>
          </section>

          <section style={receiptStyles.summaryPanel}>
            <div style={receiptStyles.summaryRows}>
              <SummaryRow label="Subtotal" value={formatCurrency(summary.subtotal)} />
              <SummaryRow
                label="Platform Fee"
                value={formatCurrency(summary.platformFee)}
              />
              <SummaryRow
                label={`GST / Tax (${Math.round(summary.gstRate * 100)}%)`}
                value={formatCurrency(summary.gst)}
              />
              <SummaryRow
                label={
                  summary.discountCode
                    ? `Discount Applied (${summary.discountCode})`
                    : "Discount Applied"
                }
                value={`-${formatCurrency(summary.discount)}`}
                tone="success"
              />
            </div>

            <div style={receiptStyles.finalRow}>
              <div>
                <p style={receiptStyles.sectionLabel}>Amount Paid</p>
                <p style={receiptStyles.finalAmount}>
                  {formatCurrency(summary.finalAmount)}
                </p>
              </div>
              <span style={receiptStyles.successBadge}>SUCCESS</span>
            </div>
          </section>
        </section>

        <footer style={receiptStyles.footer}>
          <p style={receiptStyles.footerText}>{receiptData.notes}</p>
          <p style={receiptStyles.footerText}>Currency: {receiptData.currency}</p>
        </footer>
      </article>
    </>
  );
}

function InfoCard({ label, value }) {
  return (
    <article style={receiptStyles.infoCard}>
      <p style={receiptStyles.infoLabel}>{label}</p>
      <p style={receiptStyles.infoValue}>{value}</p>
    </article>
  );
}

function SummaryRow({ label, value, tone = "default" }) {
  return (
    <div
      style={{
        ...receiptStyles.summaryRow,
        color: tone === "success" ? "#047857" : "#334155",
      }}
    >
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

const receiptStyles = {
  document: {
    width: "100%",
    maxWidth: "820px",
    margin: "0 auto",
    padding: "32px",
    borderRadius: "30px",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)",
    color: "#0f172a",
    boxShadow: "0 24px 80px rgba(15, 23, 42, 0.18)",
    display: "grid",
    gap: "24px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  brandBlock: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  logoMark: {
    width: "56px",
    height: "56px",
    borderRadius: "18px",
    background: "linear-gradient(135deg, #0f172a 0%, #2563eb 100%)",
    color: "#f8fafc",
    display: "grid",
    placeItems: "center",
    fontSize: "1rem",
    fontWeight: 800,
    letterSpacing: "0.08em",
  },
  eyebrow: {
    margin: 0,
    color: "#475569",
    fontSize: "0.78rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  title: {
    margin: "6px 0 0",
    fontSize: "1.8rem",
    fontWeight: 800,
    letterSpacing: "-0.04em",
  },
  headerMeta: {
    display: "grid",
    justifyItems: "end",
    gap: "10px",
  },
  statusPill: {
    display: "inline-flex",
    padding: "10px 14px",
    borderRadius: "999px",
    backgroundColor: "#dcfce7",
    color: "#166534",
    fontSize: "0.78rem",
    fontWeight: 800,
    letterSpacing: "0.08em",
  },
  metaText: {
    margin: 0,
    color: "#64748b",
    fontSize: "0.9rem",
  },
  hero: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    padding: "22px",
    borderRadius: "24px",
    background: "linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)",
    border: "1px solid #dbeafe",
  },
  sectionLabel: {
    margin: 0,
    color: "#64748b",
    fontSize: "0.76rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  primaryValue: {
    margin: "10px 0 0",
    fontSize: "1.28rem",
    fontWeight: 700,
  },
  secondaryValue: {
    margin: "8px 0 0",
    color: "#475569",
    fontSize: "0.95rem",
  },
  totalCard: {
    padding: "20px",
    borderRadius: "22px",
    backgroundColor: "#0f172a",
    color: "#f8fafc",
  },
  totalValue: {
    margin: "10px 0 0",
    fontSize: "2rem",
    lineHeight: 1,
    fontWeight: 800,
    letterSpacing: "-0.05em",
  },
  metaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "14px",
  },
  infoCard: {
    padding: "18px",
    borderRadius: "20px",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    display: "grid",
    gap: "8px",
  },
  infoLabel: {
    margin: 0,
    color: "#64748b",
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  infoValue: {
    margin: 0,
    color: "#0f172a",
    fontSize: "0.95rem",
    fontWeight: 600,
    wordBreak: "break-word",
  },
  contentGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "18px",
  },
  panel: {
    padding: "22px",
    borderRadius: "24px",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    display: "grid",
    gap: "18px",
  },
  panelHeader: {
    display: "grid",
    gap: "6px",
  },
  panelHint: {
    margin: 0,
    color: "#64748b",
    fontSize: "0.9rem",
  },
  lineItems: {
    display: "grid",
    gap: "14px",
  },
  lineRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "14px",
    alignItems: "center",
    padding: "16px 18px",
    borderRadius: "18px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
  },
  lineTitle: {
    margin: 0,
    fontSize: "0.98rem",
    fontWeight: 600,
  },
  lineMeta: {
    margin: "6px 0 0",
    color: "#64748b",
    fontSize: "0.84rem",
  },
  lineAmount: {
    fontSize: "0.95rem",
  },
  summaryPanel: {
    padding: "22px",
    borderRadius: "24px",
    background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
    border: "1px solid #e2e8f0",
    display: "grid",
    gap: "18px",
    alignContent: "start",
  },
  summaryRows: {
    display: "grid",
    gap: "14px",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "14px",
    alignItems: "center",
    fontSize: "0.94rem",
  },
  finalRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "14px",
    alignItems: "center",
    paddingTop: "18px",
    borderTop: "1px solid #e2e8f0",
    flexWrap: "wrap",
  },
  finalAmount: {
    margin: "10px 0 0",
    fontSize: "1.5rem",
    fontWeight: 800,
    letterSpacing: "-0.04em",
  },
  successBadge: {
    display: "inline-flex",
    padding: "10px 14px",
    borderRadius: "999px",
    backgroundColor: "#dcfce7",
    color: "#166534",
    fontSize: "0.78rem",
    fontWeight: 800,
    letterSpacing: "0.08em",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    paddingTop: "18px",
    borderTop: "1px solid #e2e8f0",
    flexWrap: "wrap",
  },
  footerText: {
    margin: 0,
    color: "#64748b",
    fontSize: "0.84rem",
    lineHeight: 1.6,
  },
};

export default ReceiptDocument;
