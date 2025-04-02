const Form = require("../models/Form");
const { uploadImageToCloudinary } = require("../middleware/imageUploader");

const extractFiles = (files, keyPrefix) => {
    return Object.keys(files)
        .filter((key) => key.startsWith(keyPrefix))
        .map((key) => files[key]);
};

const createForm = async (req, res) => {
    try {
        console.log("Received request body:", req.body);
        console.log("Received files:", req.files);

        if (!req.body.userId || !req.body.userName) {
            return res.status(400).json({ message: "Missing required user data" });
        }

        const uploadImages = async (filesArray) => {
            return await Promise.all(
                filesArray.map(async (file) => {
                    return await uploadImageToCloudinary(file.tempFilePath);
                })
            );
        };

        // Extracting files dynamically based on keys
        const numberOfStoriesImages = req.files ? await uploadImages(extractFiles(req.files, 'part1q_numberOfStories')) : [];
        const usageOfStoriesImages = req.files ? await uploadImages(extractFiles(req.files, 'part1q_usageOfStories')) : [];
        const additionalWorksImages = req.files ? await uploadImages(extractFiles(req.files, 'part2q_additionalWorks')) : [];
        const deflactionBeams = req.files ? await uploadImages(extractFiles(req.files, 'defect_deflectionBeamsSlabsFloors')) : [];

        // Create the form entry
        const newForm = await Form.create({
            userId: req.body.userId,
            userName: req.body.userName,
            part1q_nameOfBuilding: req.body.part1q_nameOfBuilding,
            part1q_typeOfBuilding: req.body.part1q_typeOfBuilding,
            part1q_numberOfStories: numberOfStoriesImages,
            part1q_usageOfStories: usageOfStoriesImages,
            part1q_TypesOfProff: req.body.part1q_TypesOfProff,
            part1q_yearOfConstruction: req.body.part1q_yearOfConstruction,
            part2q_descriptionOfStructuralSystem: req.body.part2q_descriptionOfStructuralSystem,
            part2q_descriptionOfSoilCondition: req.body.part2q_descriptionOfSoilCondition,
            part2q_indentificationOfCritical: req.body.part2q_indentificationOfCritical,
            part2q_descriptionOfArea: req.body.part2q_descriptionOfArea,
            part2q_stateTheExistingUsage: req.body.part2q_stateTheExistingUsage,
            part2q_stateTheMisuse: req.body.part2q_stateTheMisuse,
            part2q_additionalWorks: additionalWorksImages,
            leaningOfBuilding: req.body.leaningOfBuilding,
            settlement_floor: req.body.settlement_floor,
            settlement_wall: req.body.settlement_wall,
            settlement_foundation: req.body.settlement_foundation,
            defect_cracking: req.body.defect_cracking,
            defect_settlement: req.body.defect_settlement,
            defect_structural: req.body.defect_structural,
            defect_crazing: req.body.defect_crazing,
            defect_honeycombing: req.body.defect_honeycombing,
            defect_wallCracks: req.body.defect_wallCracks,
            defect_rccCracks: req.body.defect_rccCracks,
            defect_thermalCracking: req.body.defect_thermalCracking,
            defect_waterSeepage: req.body.defect_waterSeepage,
            defect_popOuts: req.body.defect_popOuts,
            defect_spalling: req.body.defect_spalling,
            defect_rustStaining: req.body.defect_rustStaining,
            defect_corrosionLongitudinalBars: req.body.defect_corrosionLongitudinalBars,
            defect_corrosionLateralTies: req.body.defect_corrosionLateralTies,
            defect_debondingDueToCorrosion: req.body.defect_debondingDueToCorrosion,
            defect_deflectionBeamsSlabsFloors: deflactionBeams,
            defect_delaminationDebonding: req.body.defect_delaminationDebonding,
            defect_crackingOthers: req.body.defect_crackingOthers,
            overallCondition: req.body.overallCondition,
            recommendation_noActionRequired: req.body.recommendation_noActionRequired,
            status: req.body.status || "Inprocess",
        });

        console.log("New form created:", newForm);
        return res.status(201).json({ message: "Form submitted successfully", form: newForm });
    } catch (error) {
        console.error("Form submission error:", error);
        return res.status(500).json({ message: "Error submitting form", error: error.message });
    }
};

// Get All Forms
const getAllForms = async (req, res) => {
    try {
        let forms;
        if (req.user.role === "Admin") {
            forms = await Form.findAll({
                order: [["createdAt", "DESC"]],
            });
        } else {
            forms = await Form.findAll({
                where: { userId: req.user.id },
                order: [["createdAt", "DESC"]],
            });
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

// Get Form by ID
const getFormById = async (req, res) => {
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
            return res.status(403).json({ message: "Access Denied: You can only view your own forms" });
        }

        return res.status(200).json(form);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching form", error });
    }
}

module.exports = { createForm, getAllForms, deleteFormById, updateFormById, getFormById };