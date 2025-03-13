const Form = require("../models/Form");

// Create Form
const createForm = async (req, res) => {
    try {
        const newForm = await Form.create(req.body);
        return res.status(201).json({ message: "Form submitted successfully", form: newForm });
    } catch (error) {
        return res.status(500).json({ message: "Error submitting form", error });
    }
};

// Get All Forms
const getAllForms = async (req, res) => {
    try {
        const forms = await Form.findAll();
        return res.status(200).json(forms);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching forms", error });
    }
};

// Delete Form by ID
const deleteFormById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Form ID is required in query parameters" });
        }
        const deletedForm = await Form.destroy({ where: { id } });
        if (deletedForm === 0) {
            return res.status(404).json({ message: "Form not found or already deleted" });
        }
        return res.status(200).json({ message: "Form deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting form", error });
    }
};

// Update Form by ID
const updateFormById = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        if (!id) {
            return res.status(400).json({ message: "Form ID is required in query parameters" });
        }
        const [updatedRows] = await Form.update(updateData, { where: { id } });
        if (updatedRows === 0) {
            return res.status(404).json({ message: "Form not found or no changes made" });
        }
        const updatedForm = await Form.findByPk(id);
        return res.status(200).json({ message: "Form updated successfully", form: updatedForm });
    } catch (error) {
        return res.status(500).json({ message: "Error updating form", error });
    }
};


module.exports = { createForm, getAllForms, deleteFormById, updateFormById };
