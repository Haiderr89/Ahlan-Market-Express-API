// controllers/hoots.js

const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const marketPlace = require('../models/marketPlace.js');
const router = express.Router();

// ========== Public Routes ===========

router.get('/', async (req, res) => {
    try {
      const market = await marketPlace.find({})
        .populate('author')
        .sort({ createdAt: 'desc' });
      res.status(200).json(market);
    } catch (error) {
      res.status(500).json(error);
    }
  });

  router.get('/:marketId', async (req, res) => {
    try {
      const market = await marketPlace.findById(req.params.marketId).populate(['author', 'comments.author']);
      res.status(200).json(market);
    } catch (error) {
      res.status(500).json(error);
    }
  });

// ========= Protected Routes =========

router.use(verifyToken);

router.post('/', async (req, res) => {
    try {
      req.body.author = req.user._id;
      const market = await marketPlace.create(req.body);
      market._doc.author = req.user;
      res.status(201).json(market);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  });

  router.put('/:marketId', async (req, res) => {
    try {
      // Find the hoot:
      const market = await marketPlace.findById(req.params.marketId);
  
      // Check permissions:
      if (!market.author.equals(req.user._id)) {
        return res.status(403).send("You're not allowed to do that!");
      }
  
      // Update hoot:
      const updatedMarket = await marketPlace.findByIdAndUpdate(
        req.params.marketId,
        req.body,
        { new: true }
      );
  
      // Append req.user to the author property:
      updatedMarket._doc.author = req.user;
  
      // Issue JSON response:
      res.status(200).json(updatedMarket);
    } catch (error) {
      res.status(500).json(error);
    }
  });

  router.delete('/:marketId', async (req, res) => {
    try {
      const market = await marketPlace.findById(req.params.marketId);
  
      if (!market.author.equals(req.user._id)) {
        return res.status(403).send("You're not allowed to do that!");
      }
  
      const deletedMarket = await marketPlace.findByIdAndDelete(req.params.marketId);
      res.status(200).json(deletedMarket);
    } catch (error) {
      res.status(500).json(error);
    }
  });


  //comments ==================

router.post('/:hootId/comments', async (req, res) => {
    try {
      req.body.author = req.user._id;
      const hoot = await Hoot.findById(req.params.hootId);
      hoot.comments.push(req.body);
      await hoot.save();
  
      // Find the newly created comment:
      const newComment = hoot.comments[hoot.comments.length - 1];
  
      newComment._doc.author = req.user;
  
      // Respond with the newComment:
      res.status(201).json(newComment);
    } catch (error) {
      res.status(500).json(error);
    }
  });

  router.put('/:hootId/comments/:commentId', async (req, res) => {
    try {
      const hoot = await Hoot.findById(req.params.hootId);
      const comment = hoot.comments.id(req.params.commentId);
      comment.text = req.body.text;
      await hoot.save();
      res.status(200).json({ message: 'Ok' });
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.delete('/:hootId/comments/:commentId', async (req, res) => {
    try {
      const hoot = await Hoot.findById(req.params.hootId);
      hoot.comments.remove({ _id: req.params.commentId });
      await hoot.save();
      res.status(200).json({ message: 'Ok' });
    } catch (err) {
      res.status(500).json(err);
    }
  });

  
module.exports = router;