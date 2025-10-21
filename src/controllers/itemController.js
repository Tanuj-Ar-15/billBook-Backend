const Category = require("../models/ItemCategory");
const itemSize = require("../models/size");

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!req.restaurant._id || !req.restaurant) {
      res.status(400).json({
        success: false,
        messaage: "You do not have access to this route."
      });
    }

    if (!name) {
      res.status(400).json({
        success: false,
        message: "Category name is required!"
      });
    }

    const newCategory = await Category.create({
      name,
      restaurant_id: req.restaurant._id
    });

    res.status(201).json({
      success: true,
      message: "New category created",
      category: newCategory
    });
  } catch (error) {
    console.log("Error in create category Api: ", error);

    return res.status(400).json({
      success: false,
      message: "Error in create category api",
      error
    });
  }
};



exports.createSize = async (req, res) => {
  try {
    const { name } = req.body;

    if (!req.restaurant._id || !req.restaurant) {
      res.status(400).json({
        success: false,
        messaage: "You do not have access to this route."
      });
    }

    if (!name) {
      res.status(400).json({
        success: false,
        message: "Item name is required!"
      });
    }

    const newSize = await itemSize.create({
      name,
      restaurant_id: req.restaurant._id
    });

    res.status(201).json({
      success: true,
      message: "New Item Size created",
      itemSize: newSize
    });
  } catch (error) {
    console.log("Error in create item size Api: ", error);

    return res.status(400).json({
      success: false,
      message: "Error in create item size api",
      error
    });
  }
};

