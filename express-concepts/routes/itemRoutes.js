const express = require("express");
const { asyncHandler, APIError } = require("../middleware/errorHandler");
const router = express.Router();

const items = [
  { id: 1, name: "item 1" },
  { id: 2, name: "item 2" },
  { id: 3, name: "item 3" },
  { id: 4, name: "item 4" },
  { id: 5, name: "item 5" },
];

router.get(
  "/items",
  asyncHandler(async (req, res) => {
    res.json(items);
  })
);

router.post(
  "/item",
  asyncHandler(async (req, res) => {
    if (!req.body.name) {
      throw new APIError("Item name is required! Please add a new item", 400);
    }

    const newItem = {
      id: items.length + 1,
      name: req.body.name,
    };

    items.push(newItem);
    res.status(201).json(newItem);
  })
);

module.exports = router;
