const express = require('express');
const router = express.Router();
const Order = require('../models/orders');
const User = require('../models/user');
const Medicine = require('../models/products');

// ---------------------------
// Place an order
// POST /orders/place
// body: { userId, medicines: [{ medicineId, quantity }] }
// routes/orders.js  (only the POST /place handler)
router.post('/place', async (req, res) => {
  try {
    const { userId } = req.body;
    let incoming = req.body.medicines ?? req.body.products ?? req.body.items ?? [];

    if (!userId || !Array.isArray(incoming) || incoming.length === 0) {
      return res.status(400).json({ message: 'userId and medicines/products required' });
    }

    // Normalize each item -> { medicine: <id>, quantity: <n> }
    const normalized = incoming.map(item => {
      // support different caller shapes:
      // item may be { productId } or { medicine } or { product } etc.
      const medicineId = item.medicine ?? item.productId ?? item.product ?? item.medicineId;
      const quantity = Number(item.quantity || item.qty || 1);
      return { medicineId, quantity };
    });

    // validate normalized ids exist
    const missing = normalized.find(i => !i.medicineId);
    if (missing) {
      return res.status(400).json({ message: 'Each item must include productId / medicine / product' });
    }

    // Fetch medicine docs to get price
    const medIds = normalized.map(i => i.medicineId);
    const medDocs = await Medicine.find({ _id: { $in: medIds } });

    // Build order.medicines array matching your Order schema: { medicine: ObjectId, quantity, priceAtPurchase }
    let totalAmount = 0;
    const orderMedicines = normalized.map(i => {
      const med = medDocs.find(m => m._id.toString() === i.medicineId.toString());
      const price = med ? (med.price ?? 0) : 0;
      totalAmount += price * i.quantity;
      return {
        medicine: i.medicineId,
        quantity: i.quantity,
        priceAtPurchase: price
      };
    });

    // Create and save order
    const newOrder = new Order({
      user: userId,
      medicines: orderMedicines,
      totalAmount
    });

    await newOrder.save();

    // return populated order (optional)
    const populated = await Order.findById(newOrder._id).populate('medicines.medicine', 'name price image category');
    return res.json({ success: true, order: populated });
  } catch (err) {
    console.error('Place order error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
