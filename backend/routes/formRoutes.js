const express = require("express");
const { createForm, getAllForms, deleteFormById, updateFormById } = require("../controllers/formController");
const { auth, isAdmin } = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * /api/form:
 *   post:
 *     summary: Create a new form entry
 *     tags: [Form]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               part1GeneralInformation:
 *                 type: array
 *                 items:
 *                   type: string
 *               part2StructuralSystem:
 *                 type: array
 *                 items:
 *                   type: string
 *               leaningOfBuilding:
 *                 type: boolean
 *               settlement_floor:
 *                 type: boolean
 *               settlement_wall:
 *                 type: boolean
 *               settlement_foundation:
 *                 type: boolean
 *               defect_cracking:
 *                 type: string
 *               defect_settlement:
 *                 type: string
 *               defect_thermalCracking:
 *                 type: string
 *               defect_structural:
 *                 type: string
 *               defect_crazing:
 *                 type: string
 *               defect_honeycombing:
 *                 type: string
 *               defect_wallCracks:
 *                 type: string
 *               defect_rccCracks:
 *                 type: string
 *     responses:
 *       201:
 *         description: Form created successfully
 */
router.post("/createForm", auth, createForm);

/**
 * @swagger
 * /api/form:
 *   get:
 *     summary: Get all submitted forms
 *     tags: [Form]
 *     responses:
 *       200:
 *         description: Returns all form entries
 */
router.get("/getAllForms", auth, getAllForms);

/**
 * @swagger
 * /api/form/deleteForm:
 *   delete:
 *     summary: Delete a form by ID (Query Param)
 *     tags: [Form]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the form to delete
 *     responses:
 *       200:
 *         description: Form deleted successfully
 *       400:
 *         description: Missing ID in query
 *       404:
 *         description: Form not found
 *       500:
 *         description: Error deleting form
 */
router.delete("/deleteFormById/:id", auth, isAdmin, deleteFormById);

/**
 * @swagger
 * /api/form/updateFormById/{id}:
 *   put:
 *     summary: Update a form by ID (Path Param)
 *     tags: [Form]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the form to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               field1:
 *                 type: string
 *               field2:
 *                 type: number
 *     responses:
 *       200:
 *         description: Form updated successfully
 *       400:
 *         description: Missing ID in parameters
 *       404:
 *         description: Form not found or no changes made
 *       500:
 *         description: Error updating form
 */
router.patch("/updateFormById/:id", auth, isAdmin, updateFormById);

module.exports = router;
