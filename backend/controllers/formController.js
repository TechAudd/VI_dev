const Form = require("../models/Form");

// Create Form
const createForm = async (req, res) => {
    try {
        const newForm = await Form.create({ ...req.body, userId: req.body.userId });
        return res.status(201).json({ message: "Form submitted successfully", form: newForm });
    } catch (error) {
        return res.status(500).json({ message: "Error submitting form", error });
    }
};

// Get All Forms
const getAllForms = async (req, res) => {
    try {
        let forms;
        if (req.user.role === "Admin") {
            forms = await Form.findAll();
        } else {
            forms = await Form.findAll({ where: { userId: req.user.id } });
        }
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
            return res.status(400).json({ message: "Form ID is required in parameters" });
        }

        const form = await Form.findByPk(id);
        if (!form) {
            return res.status(404).json({ message: "Form not found" });
        }

        if (req.user.role !== "Admin" && form.userId !== req.user.id) {
            return res.status(403).json({ message: "Access Denied: You can only delete your own forms" });
        }

        await form.destroy();
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
            return res.status(400).json({ message: "Form ID is required in parameters" });
        }

        const form = await Form.findByPk(id);
        if (!form) {
            return res.status(404).json({ message: "Form not found" });
        }

        if (req.user.role !== "Admin" && form.userId !== req.user.id) {
            return res.status(403).json({ message: "Access Denied: You can only update your own forms" });
        }

        await form.update(updateData);
        return res.status(200).json({ message: "Form updated successfully", form });
    } catch (error) {
        return res.status(500).json({ message: "Error updating form", error });
    }
};


module.exports = { createForm, getAllForms, deleteFormById, updateFormById };
