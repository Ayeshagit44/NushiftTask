const express = require('express');
const router = express.Router();
const Product = require('../models/products'); // matches models/Product.js

// quick test route to confirm router is mounted
router.get('/test', (req, res) => res.json({ ok: true, msg: 'products route works' }));

// GET /products/   -> returns all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.json(products);
  } catch (err) {
    console.error('GET /products error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /products/add  -> add a sample product
router.post('/add', async (req, res) => {
  try {
    const p = new Product(req.body);
    await p.save();
    res.json({ status: 'Product added', product: p });
  } catch (err) {
    console.error('POST /products/add error', err);
    res.status(500).json({ status: 'Failed' });
  }
});

module.exports = router;





// router.delete("/products/:id",(req,res)=>{
//   var pid=req.params.id;
  
//     Products.findOne({_id:pid})
//     .then((docs)=>{
//       if(docs){
//         Products.deleteOne({_id:pid})
//         .then((res)=>res.send(res))
//          .catch((err)=>res.send(err))
//       }
//     })
//     .catch(()=>res.send({status:"not found went"}))
// })

// router.delete("/products/:id",(req,res)=>{
//   var pid=req.params.id;
//   Products.findOneAndDelete(pid)
//   .then(()=>res.send({status:"product deleted successfully"}))
//   .catch(()=>res.send({status:"something went wrong"}))
// })


// router.patch("/products/:id",(req,res)=>{
//     var pid=req.params.id;
//     console.log(req.body)
//     Products.findOneAndUpdate({_id:pid},{pid,...req.body})
//     .then(()=>res.send({staus:"product updated successfully"}))
//     .catch((err)=>{console.log(err);res.send({status:"something went wrong"})})
// })

// router.put("/products/:id",(req,res)=>{
//   var pid=req.params.id;
//   Products.findOneAndReplace({_id:pid},req.body)
//   .then(()=>res.send({staus:"product updated successfully"}))
//   .catch((err)=>{console.log(err);res.send({status:"something went wrong"})})
// })

// router.post("/addMany",(req,res)=>{
//     Products.insertMany(req.body)
//      .then(()=>res.send({staus:"products addedd successfully"}))
//     .catch(()=>res.send({status:"something went wrong"}))
// })

// // Search products by name or description
// router.get("/search/:query", async (req, res) => {
//     const query = req.params.query;
//     try {
//         const results = await Products.find({
//             $or: [
//                 { productName: { $regex: query, $options: "i" } },
//                 { productDescription: { $regex: query, $options: "i" } }
//             ]
//         });
//         res.send(results);
//     } catch (err) {
//         res.status(500).send({ status: "error", error: err });
//     }
// });

// router.get('/', async (req, res) => {
//     const products = await Product.find();
//     res.json(products);
// });










