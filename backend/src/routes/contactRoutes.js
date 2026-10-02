const express = require("express");
const contactController = require("../controllers/contactController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Require a valid JWT for all contact endpoints
router.use(authMiddleware);

// Export routes
router.get("/export/csv", contactController.exportContactsCsv);
router.get("/export/json", contactController.exportContactsJson);

// Contact CRUD routes
router.get("/", contactController.getContacts);
router.get("/:id", contactController.getContactById);
router.post("/", contactController.createContact);
router.put("/:id", contactController.updateContact);
router.delete("/:id", contactController.deleteContact);

module.exports = router;