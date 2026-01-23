const Item = require("../models/Item");
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



exports.createItem = async (req, res) => {
  try {
    const restaurant_id = req.restaurant?._id;

    if (!restaurant_id) {
      return res.status(400).json({
        success: false,
        message: "You do not have access to this route.",
      });
    }

    const { itemName, description, isVeg, category_id, price } = req.body;


    if (!itemName || !category_id || !price || !Array.isArray(price) || price.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Item name, category, and price array are required.",
      });
    }


    const newItem = new Item({
      restaurant_id,
      itemName,
      description,
      isVeg,
      category_id,
      price,
    });

    const savedItem = await newItem.save();

    const populatedItem = await Item.findById(savedItem._id)
      .populate({ path: "category_id", select: "_id name" })
      .populate({ path: "price.size_id", select: "_id name" })
      .lean();

    return res.status(201).json({
      success: true,
      message: "Item created successfully",
      data: populatedItem,
    });
  } catch (error) {
    console.log("Error in createItem API:", error);
    return res.status(500).json({
      success: false,
      message: "Error in create item API",
      error: error.message,
    });
  }
};


exports.getItems = async (req, res) => {
  try {
    const restaurant_id = req.restaurant?._id;

    if (!restaurant_id) {
      return res.status(400).json({
        success: false,
        message: "You do not have access to this route.",
      });
    }


    const items = await Item.find({ restaurant_id })
      .populate({
        path: "category_id",
        select: "_id name",
      })
      .populate({
        path: "price.size_id",
        select: "_id name",
      })
      .lean();

    return res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.log("Error in getItems API:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching items.",
      error: error.message,
    });
  }
};



exports.getCategories = async (req, res) => {
  try {
    const restaurant_id = req.restaurant?._id;

    if (!restaurant_id) {
      return res.status(400).json({
        success: false,
        message: "You do not have access to this route.",
      });
    }

    const categories = await Category.find({ restaurant_id })
      .select("_id name") // only return necessary fields
      .lean();

    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    console.log("Error in getCategories API:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching categories",
      error: error.message,
    });
  }
};



exports.getSizes = async (req, res) => {
  try {
    const restaurant_id = req.restaurant?._id;

    if (!restaurant_id) {
      return res.status(400).json({
        success: false,
        message: "You do not have access to this route.",
      });
    }

    const sizes = await itemSize.find({ restaurant_id })
      .select("_id name")
      .lean();

    return res.status(200).json({
      success: true,
      count: sizes.length,
      data: sizes,
    });
  } catch (error) {
    console.log("Error in getSizes API:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching item sizes",
      error: error.message,
    });
  }
};
