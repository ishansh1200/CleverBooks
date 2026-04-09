import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  awbNumber: { type: String, required: true, unique: true, index: true },
  merchantId: { type: String, required: true },
  courierPartner: { type: String, required: true }, // shiprocket, delhivery, etc.
  orderStatus: { type: String, required: true }, // DELIVERED, RTO, IN_TRANSIT, LOST
  codAmount: { type: Number, required: true },
  declaredWeight: { type: Number, required: true },
  orderDate: { type: Date, required: true },
  deliveryDate: { type: Date, default: null },
}, { timestamps: true });

export const Order = mongoose.model('Order', orderSchema);