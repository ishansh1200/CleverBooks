import 'dotenv/config';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { Order } from '../models/Order';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cleverbooks';
const COURIERS = ['delhivery', 'shiprocket', 'bluedart', 'dtdc'];
const STATUSES = ['DELIVERED', 'DELIVERED', 'DELIVERED', 'RTO', 'IN_TRANSIT']; // Weighted towards Delivered

// Helper to generate random numbers
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

const generateSeedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to DB. Clearing old orders...');
    await Order.deleteMany({}); // Start fresh

    const orders = [];
    const settlementCsvRows = [];
    
    // CSV Header matching our schema
    settlementCsvRows.push('awbNumber,settledCodAmount,chargedWeight,forwardCharge,rtoCharge,codHandlingFee,settlementDate');

    console.log('Generating 50 mock orders and settlement batch...');

    for (let i = 1; i <= 50; i++) {
      const awbNumber = `AWB1000${i.toString().padStart(3, '0')}`;
      const courierPartner = COURIERS[Math.floor(Math.random() * COURIERS.length)];
      const orderStatus = STATUSES[Math.floor(Math.random() * STATUSES.length)];
      
      const isPrepaid = Math.random() > 0.7; // 30% prepaid
      const codAmount = isPrepaid ? 0 : randomInt(500, 3000);
      const declaredWeight = randomInt(5, 20) / 10; // 0.5kg to 2.0kg

      // Create Order
      orders.push({
        awbNumber,
        merchantId: 'MERCHANT_001',
        courierPartner,
        orderStatus,
        codAmount,
        declaredWeight,
        orderDate: new Date('2025-10-01'),
        deliveryDate: orderStatus === 'DELIVERED' ? new Date('2025-10-05') : null,
      });

      // Generate Settlement Row
      let settledCodAmount = codAmount;
      let chargedWeight = declaredWeight;
      let rtoCharge = orderStatus === 'RTO' ? randomInt(100, 250) : 0;
      let forwardCharge = randomInt(50, 150);
      let codHandlingFee = isPrepaid ? 0 : Math.round(codAmount * 0.02);

      // --- INJECT INTENTIONAL DISCREPANCIES FOR DEMO ---
      if (i === 3) {
        // Discrepancy 1: COD Short-remittance
        settledCodAmount = codAmount - 500; 
        console.log(`[Injected] COD Short Remittance on ${awbNumber}`);
      } else if (i === 7) {
        // Discrepancy 2: Weight Dispute (Courier charged for 5kg instead of actual)
        chargedWeight = declaredWeight + 4.5; 
        console.log(`[Injected] Weight Dispute on ${awbNumber}`);
      } else if (i === 12 && orderStatus === 'DELIVERED') {
        // Discrepancy 3: Phantom RTO (Charged RTO on a delivered order)
        rtoCharge = 150; 
        console.log(`[Injected] Phantom RTO on ${awbNumber}`);
      }

      // Add to CSV
      const settlementDate = '2025-10-14T10:00:00.000Z';
      settlementCsvRows.push(`${awbNumber},${settledCodAmount},${chargedWeight},${forwardCharge},${rtoCharge},${codHandlingFee},${settlementDate}`);
    }

    // Save to DB
    await Order.insertMany(orders);
    console.log('✅ Successfully inserted 50 mock orders into MongoDB.');

    // Write CSV File
    const csvContent = settlementCsvRows.join('\n');
    const filePath = path.join(__dirname, '../../test-batch.csv');
    fs.writeFileSync(filePath, csvContent);
    console.log(`✅ Successfully generated settlement batch at: ${filePath}`);

    process.exit(0);
  } catch (error) {
    console.error('Failed to seed data:', error);
    process.exit(1);
  }
};

generateSeedData();