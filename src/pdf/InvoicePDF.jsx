import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image
} from "@react-pdf/renderer";

import logo from "../assets/logo.png";
import stamp from "../assets/stamp.png";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica"
  },

  watermark: {
    position: "absolute",
    top: "40%",
    left: "25%",
    width: 300,
    opacity: 0.05
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    borderBottom: "1px solid #000",
    paddingBottom: 10
  },

  companyBlock: {
    flexDirection: "row"
  },

  logo: {
    width: 60,
    height: 60,
    marginRight: 10
  },

  companyName: {
    fontSize: 12,
    fontWeight: "bold"
  },

  metaBlock: {
    fontSize: 9,
    textAlign: "right"
  },

  billTo: {
    border: "1px solid #ccc",
    padding: 10,
    marginBottom: 15
  },

  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 5
  },

  table: {
    width: "100%",
    marginTop: 10
  },

  tableRow: {
    flexDirection: "row"
  },

  tableHeader: {
    backgroundColor: "#f2f2f2",
    fontWeight: "bold"
  },

  descriptionCell: {
    width: "40%",
    border: "1px solid #ccc",
    padding: 5
  },

  qtyCell: {
    width: "15%",
    border: "1px solid #ccc",
    padding: 5,
    textAlign: "center"
  },

  priceCell: {
    width: "20%",
    border: "1px solid #ccc",
    padding: 5,
    textAlign: "right"
  },

  totalCell: {
    width: "25%",
    border: "1px solid #ccc",
    padding: 5,
    textAlign: "right"
  },

  summary: {
    marginTop: 20,
    width: 200,
    alignSelf: "flex-end"
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5
  },

  bold: {
    fontWeight: "bold"
  },

  terms: {
    marginTop: 30,
    borderTop: "1px solid #000",
    paddingTop: 10
  },

  stamp: {
    position: "absolute",
    bottom: 80,
    right: 60,
    width: 120,
    opacity: 0.9
  }
});

export default function InvoicePDF({ invoice, calculations }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* WATERMARK */}
        <Image src={logo} style={styles.watermark} />

        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.companyBlock}>
            <Image src={logo} style={styles.logo} />
            <View>
              <Text style={styles.companyName}>
                BITMAX TECHNOLOGY PVT LTD
              </Text>
              <Text>
                BHUTANI ALPHATHUM, Sector 90, Noida
              </Text>
              <Text>
                8595986967 | accounts@bitmaxgroup.com
              </Text>
            </View>
          </View>

          <View style={styles.metaBlock}>
            <Text>Invoice No: {invoice.invoiceNo}</Text>
            <Text>Date: {invoice.invoiceDate}</Text>
            <Text>GST No: 09AANCB4231E1ZT</Text>
            <Text style={styles.bold}>
              Balance Due: ₹ {calculations.balanceDue.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* BILL TO */}
        <View style={styles.billTo}>
          <Text style={styles.sectionTitle}>BILL TO</Text>
          <Text>{invoice.billTo.address}</Text>
          <Text>{invoice.billTo.phone}</Text>
          <Text>{invoice.billTo.email}</Text>
        </View>

        {/* TABLE */}
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.descriptionCell}>Description</Text>
            <Text style={styles.qtyCell}>Qty</Text>
            <Text style={styles.priceCell}>Price</Text>
            <Text style={styles.totalCell}>Total</Text>
          </View>

          {invoice.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.descriptionCell}>
                {item.description}
              </Text>
              <Text style={styles.qtyCell}>
                {item.quantity}
              </Text>
              <Text style={styles.priceCell}>
                ₹ {Number(item.price).toFixed(2)}
              </Text>
              <Text style={styles.totalCell}>
                ₹ {(item.quantity * item.price).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* SUMMARY */}
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text>Total</Text>
            <Text>₹ {calculations.itemsTotal.toFixed(2)}</Text>
          </View>

          {invoice.gstEnabled && (
            <View style={styles.summaryRow}>
              <Text>GST (18%)</Text>
              <Text>₹ {calculations.gstAmount.toFixed(2)}</Text>
            </View>
          )}

          <View style={[styles.summaryRow, styles.bold]}>
            <Text>Balance Due</Text>
            <Text>₹ {calculations.balanceDue.toFixed(2)}</Text>
          </View>
        </View>

        {/* STAMP */}
        <Image src={stamp} style={styles.stamp} />

        {/* TERMS */}
        <View style={styles.terms}>
          <Text style={styles.sectionTitle}>
            TERMS & CONDITIONS
          </Text>
          <Text>{invoice.terms}</Text>
        </View>

      </Page>
    </Document>
  );
}