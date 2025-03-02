const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
      text: {
        type: String,
        required: true
      },
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    { timestamps: true }
  );


  const marketSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      description: {
        type: String,
      },
      image: {
        type: String,
        required: true,
      },
      category: {
        type: String,
        required: true,
        enum: ['New Product', 'Used Product', 'Service'],
      },
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      comments: [commentSchema],
    },
    { timestamps: true }
  );


const Market = mongoose.model('Market', marketSchema);
  module.exports = Market;