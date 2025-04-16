
import mongoose from 'mongoose';

const purchaseOrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true }
});

const purchaseOrderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  },
  supplierName: { type: String, required: true },
  items: [purchaseOrderItemSchema],
  status: {
    type: String,
    enum: ['Draft', 'Submitted', 'Approved', 'Rejected', 'Shipped', 'Received', 'Cancelled'],
    default: 'Draft'
  },
  submittedBy: { type: String, required: true },
  approvedBy: { type: String },
  expectedDeliveryDate: { type: Date },
  receivedDate: { type: Date },
  notes: { type: String },
  totalAmount: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ['Unpaid', 'Partial', 'Paid'],
    default: 'Unpaid'
  },
  paymentDueDate: { type: Date },
  paymentMethod: { type: String },
  paymentReference: { type: String },
  shippingMethod: { type: String },
  trackingNumber: { type: String }
}, { timestamps: true });

const PurchaseOrder = mongoose.models.PurchaseOrder || mongoose.model('PurchaseOrder', purchaseOrderSchema);

export default PurchaseOrder;
