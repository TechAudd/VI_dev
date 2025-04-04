import React, { useEffect, useState, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { AiFillDelete, AiFillEdit, AiFillPrinter } from "react-icons/ai";
import { useReactToPrint } from "react-to-print";

export default function AllForm() {
    const contentRef = useRef(null);
    const reactToPrintFn = useReactToPrint({
        contentRef,
        documentTitle: "Building Condition Assessment",
    });
    const token = localStorage.getItem("accessToken");
    const decoded = jwtDecode(token);
    const [showModal, setShowModal] = useState(false);
    const [forms, setForms] = useState([]);
    const [selectedForm, setSelectedForm] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [editingIndex, setEditingIndex] = useState(null);
    const [step, setStep] = useState(1);
    const [printId, setPrintId] = useState("");
    const [showPrintModal, setShowPrintModal] = useState(false);

    const [formData, setFormData] = useState({
        part1q_nameOfBuilding: "",
        part1q_typeOfBuilding: "",
        part1q_numberOfStories: [],
        part1q_usageOfStories: [],
        part1q_TypesOfProff: "",
        part1q_yearOfConstruction: "",

        part2q_descriptionOfStructuralSystem: "",
        part2q_descriptionOfSoilCondition: "",
        part2q_indentificationOfCritical: "",
        part2q_descriptionOfArea: "",
        part2q_stateTheExistingUsage: "",
        part2q_stateTheMisuse: "",
        part2q_additionalWorks: [],

        leaningOfBuilding: null,
        settlements: { floor: null, wall: null, foundation: null },
        defect_cracking: "",
        defect_settlement: "",
        defect_thermalCracking: "",
        defect_structural: "",
        defect_crazing: "",
        defect_honeycombing: "",
        defect_wallCracks: "",
        defect_rccCracks: "",
        defect_waterSeepage: "",
        defect_popOuts: "",
        defect_spalling: "",
        defect_rustStaining: "",
        defect_corrosionLongitudinalBars: "",
        defect_corrosionLateralTies: "",
        defect_debondingDueToCorrosion: "",
        defect_deflectionBeamsSlabsFloors: [],
        defect_delaminationDebonding: "",
        defect_crackingOthers: "",
        overallCondition: "",
        recommendations: "",
    });

    const part1Questions = [
        "Name and address of the building, year of construction",
        "TYPE OF THE BUILDING - Load bearing/party load bearing and partly RCC/RCC frame",
        "Number of stories in each block of the building",
        `Description of the main usage of the building:\nResidential/education/office/hostel/workshop\n/hospital/any other specify`,
        "TYPE OF FLOOR AND ROOF - RCC/Wooden/steel",
        "Year of construction, Maintenance history of the building if known to be mentioned",
    ];

    const part2Questions = [
        "Description of the structural forms, systems and materials used in different parts of the building, e.g., RCC, Prestressed concrete, steel, etc.",
        "Description of soil condition and foundation system, if known",
        "Identification of critical structures (e.g. slender columns, floating columns, cantilever structures, long-span structures, etc.)",
        "Description of any area not covered in visual inspections. State the reasons for the same.",
        "State, if the existing usage and loading condition is compatible with the intended purpose of the structure",
        "State the misuse, abuse or deviation has given rise to excessive loading",
        "State, if there was any additional/alteration works due to the building structure",
    ];

    const [part1Data, setPart1Data] = useState(Array(part1Questions.length).fill(""));
    const [part2Data, setPart2Data] = useState(Array(part2Questions.length).fill(""));

    // Fetch data from API on component mount
    useEffect(() => {
        fetchForms();
    }, []);

    useEffect(() => {
        if (printId) {
            purchasePrintFetch();
        }
    }, [printId]);

    const purchasePrintFetch = async (id) => {
        try {
            const res = await axios.get(`http://localhost:4100/api/form/getFormById/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFormData(res.data);
            setShowPrintModal(true);
        } catch (error) {
            console.error("Error fetching form:", error);
            toast.error("Failed to fetch form data.");
        }
    };

    const fetchForms = async () => {
        try {
            const response = await axios.get("http://localhost:4100/api/form/getAllForms", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setFormData(response.data);
        } catch (error) {
            console.error("Error fetching forms", error);
            toast.error("No Form Available");
        }
    };

    // Handle Edit Button Click
    const handleEdit = (form) => {
        setSelectedForm(form);
        // Populate form data with the selected form's data
        setFormData({
            ...form,
            settlements: { ...form.settlements }
        });
        setShowModal(true);
        setStep(1);
    };

    const handleYesNoChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNestedYesNoChange = (parentField, field, value) => {
        setFormData(prev => ({
            ...prev,
            [parentField]: {
                ...prev[parentField],
                [field]: value
            }
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(
                `http://localhost:4100/api/form/updateFormById/${selectedForm.id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            // Update the forms list with the updated form
            setForms(prevForms =>
                prevForms.map(form =>
                    form.id === selectedForm.id ? { ...form, ...formData } : form
                )
            );

            toast.success("Form updated successfully!");
            setShowModal(false);
            fetchForms();
        } catch (error) {
            console.error("Error updating form:", error);
            toast.error("Error updating form");
        }
    };

    const handleDelete = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this form?");
        if (!isConfirmed) return;
        try {
            await axios.delete(`http://localhost:4100/api/form/deleteFormById/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            setFormData(prevForms => prevForms.filter(form => form.id !== id));
            toast.success("Form deleted successfully");
        } catch (error) {
            console.error("Error deleting form:", error.message);
            toast.error("Access Denied: Admins Only");
        }
    }

    const handleCrossClick = () => {
        fetchForms();
        setShowPrintModal(false);
    }

    const handlePrint = async (id) => {
        if (id) {
            await purchasePrintFetch(id);
        } else {
            toast.error("Please Retry...");
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === "Inprocess" ? "Complete" : "Inprocess";
            await axios.patch(`http://localhost:4100/api/form/updateFormById/${id}`, { status: newStatus }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            // Update UI immediately
            setForms(prevForms =>
                prevForms.map(form =>
                    form.id === id ? { ...form, status: newStatus } : form
                )
            );
            fetchForms();
            toast.success(`Status updated to ${newStatus}`);
        } catch (error) {
            console.error("Error updating form status:", error.message);
            toast.error("Access Denied: Admins Only");
        }
    };

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleImageChange = (field, files) => {
        const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
        setFormData((prev) => ({
            ...prev,
            [field]: [...prev[field], ...newImages],
        }));
    };

    const removeImage = (field, index) => {
        setFormData((prev) => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index),
        }));
    };

    const handleCloseEditModal = () => {
        setShowModal(false);
        fetchForms();
    }

    const severityLevels = ["Insignificant", "Slight", "Moderate", "Severe", "Very Severe"];
    const colors = ["bg-green-500", "bg-yellow-400", "bg-orange-500", "bg-purple-600", "bg-red-500"];
    const getSeverityColor = (severity) => {
        const index = severityLevels.indexOf(severity);
        return index !== -1 ? colors[index] : "bg-gray-300";
    };

    const updatedDate = new Date(formData.updatedAt);
    const formattedDate = updatedDate.toLocaleDateString("en-GB");
    const formattedTime = updatedDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    return (
        <>
            <div className="border-gray-300 w-full">
                <div className="bg-white">
                    <Toaster position="top-center" />
                    <div className="overflow-y-scroll h-[550px]">
                        <table className="w-full">
                            <thead className="bg-blue-200 text-gray-800 text-xs sm:text-xs md:text-sm">
                                <tr>
                                    <th className="p-3 border border-gray-300">SR NO</th>
                                    <th className="p-3 border border-gray-300">General Information</th>
                                    <th className="p-3 border border-gray-300">Submitted by</th>
                                    <th className="p-3 border border-gray-300">Created Date</th>
                                    <th className="p-3 border border-gray-300">Last Update</th>
                                    <th className="p-3 border border-gray-300">Status</th>
                                    {decoded.role === "Admin" && (
                                        <th className="p-3 border border-gray-300">Approve</th>
                                    )}
                                    <th className="p-3 border border-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.length > 0 ? (
                                    formData.map((form, index) => (
                                        <tr key={form.id} className="text-center border border-gray-300">
                                            <td className="p-3 border border-gray-300">{index + 1}</td>
                                            <td className="p-3 border border-gray-300">
                                                {form.part1q_nameOfBuilding || "N/A"},
                                                {form.part1q_typeOfBuilding || "N/A"}
                                            </td>
                                            <td className="p-3 border border-gray-300">{form.userName || "N/A"}</td>
                                            <td className="p-3 border border-gray-300">
                                                {form.createdAt
                                                    ? new Date(form.createdAt).toLocaleDateString("en-GB")
                                                    : "N/A"}
                                            </td>
                                            <td className="p-3 border border-gray-300">
                                                {form.updatedAt
                                                    ? new Date(form.createdAt).toLocaleDateString("en-GB")
                                                    : "N/A"}
                                            </td>
                                            <td className="p-3 border border-gray-300">{form.status || "N/A"}</td>
                                            {decoded.role === "Admin" && (

                                                <td className="p-3 border border-gray-300">

                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={form.status === "Complete"}
                                                            onChange={() => toggleStatus(form.id, form.status)}
                                                            className="sr-only peer"
                                                        />
                                                        <div
                                                            className={`w-11 h-6 rounded-full ${form.status === "Complete"
                                                                ? "bg-green-500 peer-focus:ring-2 peer-focus:ring-green-300"
                                                                : "bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-300"
                                                                } transition-all`}
                                                        ></div>
                                                        <div
                                                            className={`absolute left-1 top-1 w-4 h-4 bg-white border border-gray-300 rounded-full transition-transform duration-200 transform ${form.status === "Complete" ? "translate-x-5" : ""
                                                                }`}
                                                        ></div>
                                                    </label>
                                                </td>
                                            )}
                                            <td className="p-6 flex justify-center">
                                                <button className="text-blue-500"
                                                    onClick={() => {

                                                        handleEdit(form)
                                                    }}
                                                >
                                                    <AiFillEdit size={20} />
                                                </button>
                                                {decoded.role === "Admin" && (
                                                    <button className="ml-3 cursor-pointer text-red-600"
                                                        onClick={() => handleDelete(form.id)}
                                                    >
                                                        <AiFillDelete size={20} />
                                                    </button>
                                                )}
                                                <button className="ml-3 text-black-500"
                                                    onClick={() => {
                                                        handlePrint(form.id);
                                                    }}
                                                >
                                                    <AiFillPrinter size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="p-3 text-center">No forms available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="mt-5 flex justify-between w-full ">
                    <button
                        className="h-10 w-24 border rounded-md border-gray-300 bg-zinc-300 font-medium"
                    >
                        Previous
                    </button>
                    <button
                        className="h-10 w-24 border rounded-md border-gray-300 bg-blue-700 text-white font-medium"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Edit Modal */}
            {showModal && selectedForm && (
                <div className="fixed inset-0 flex justify-center items-center  bg-gray-50/40 backdrop-blur-sm border shadow-md">
                    <div className="bg-white mt-10 p-6 rounded-md w-full max-h-[95vh] max-w-[75%] flex flex-col">
                        <button
                            className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                            onClick={handleCloseEditModal}
                        >
                            <span className="text-red-500 bg-transparent h-6 w-6 text-2xl block outline-none focus:outline-none">
                                ×
                            </span>
                        </button>
                        <Toaster position="top-center" />
                        <h2 className="text-xl font-bold text-center mb-4">Building Assessment Form</h2>
                        <h2 className="text-xl font-bold text-center mb-4 uppercase">
                            Condition Assessment of Residential Building
                        </h2>
                        <h3 className="text-lg font-semibold text-center mb-4">
                            Visual Inspection Form
                        </h3>
                        {/* Step Indicator */}
                        <div className="flex justify-center gap-4 mb-4">
                            {['Step 1', 'Step 2', 'Step 3'].map((label, idx) => (
                                <div key={idx} className={`px-4 py-2 rounded-full ${step === idx + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                                    {label}
                                </div>
                            ))}
                        </div>
                        <div className="overflow-y-auto flex-1">
                            <form onSubmit={handleSubmit}>
                                {/* STEP 1 */}
                                {step === 1 && (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">PART 1 GENERAL INFORMATION OF THE BUILDING</h3>

                                        {/* Name of Building */}
                                        <div className="mb-3">
                                            <label className="block mb-1">1. Name and address of the building, year of construction</label>
                                            <input
                                                type="text"
                                                className="w-[50%] border rounded p-2"
                                                value={formData.part1q_nameOfBuilding || ""}
                                                onChange={(e) => handleInputChange("part1q_nameOfBuilding", e.target.value)}
                                                required
                                            />
                                        </div>

                                        {/* Type of Building */}
                                        <div className="mb-3">
                                            <label className="block mb-1">2. TYPE OF THE BUILDING</label>
                                            <input
                                                type="text"
                                                className="w-[50%] border rounded p-2"
                                                value={formData.part1q_typeOfBuilding || ""}
                                                onChange={(e) => handleInputChange("part1q_typeOfBuilding", e.target.value)}
                                                required
                                            />
                                        </div>

                                        {/* Number of Stories - Image Upload */}
                                        <div className="mb-3">
                                            <label className="block mb-1">3. Number of stories in each block of the building (Upload Images)</label>
                                            <input
                                                type="file"
                                                className="w-[50%] border rounded p-2"
                                                multiple
                                                onChange={(e) => handleImageChange("part1q_numberOfStories", e.target.files)}
                                            />
                                            <div className="flex flex-wrap mt-2">
                                                {formData.part1q_numberOfStories?.map((img, index) => (
                                                    <div key={index} className="relative w-24 h-24 m-1">
                                                        <img src={img} alt="Uploaded" className="w-full h-full object-cover rounded" />
                                                        <button
                                                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2"
                                                            onClick={() => removeImage("part1q_numberOfStories", index)}
                                                        >
                                                            X
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Usage of Stories - Image Upload */}
                                        <div className="mb-3">
                                            <label className="block mb-1">4. Description of the main usage of the building (Upload Images)</label>
                                            <input
                                                type="file"
                                                className="w-[50%] border rounded p-2"
                                                multiple
                                                onChange={(e) => handleImageChange("part1q_usageOfStories", e.target.files)}
                                            />
                                            <div className="flex flex-wrap mt-2">
                                                {formData.part1q_usageOfStories?.map((img, index) => (
                                                    <div key={index} className="relative w-24 h-24 m-1">
                                                        <img src={img} alt="Uploaded" className="w-full h-full object-cover rounded" />
                                                        <button
                                                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2"
                                                            onClick={() => removeImage("part1q_usageOfStories", index)}
                                                        >
                                                            X
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Types of Roof */}
                                        <div className="mb-3">
                                            <label className="block mb-1">5. TYPE OF FLOOR AND ROOF</label>
                                            <input
                                                type="text"
                                                className="w-[50%] border rounded p-2"
                                                value={JSON.parse(formData.part1q_TypesOfProff || '""')}
                                                onChange={(e) => handleInputChange("part1q_TypesOfProff", e.target.value)}
                                                required
                                            />
                                        </div>

                                        {/* Year of Construction */}
                                        <div className="mb-3">
                                            <label className="block mb-1">6. Year of construction, Maintenance history of the building</label>
                                            <input
                                                type="text"
                                                className="w-[50%] border rounded p-2"
                                                value={formData.part1q_yearOfConstruction || ""}
                                                onChange={(e) => handleInputChange("part1q_yearOfConstruction", e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* STEP 2 */}
                                {step === 2 && (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">PART 2 STRUCTURAL SYSTEM OF THE BUILDING</h3>

                                        {/* Description of Structural System */}
                                        <div className="mb-3">
                                            <label className="block mb-1">1. Description of the structural forms, systems, and materials used</label>
                                            <textarea
                                                className="w-[50%] border rounded p-2"
                                                value={formData.part2q_descriptionOfStructuralSystem || ""}
                                                onChange={(e) => handleInputChange("part2q_descriptionOfStructuralSystem", e.target.value)}
                                                required
                                            />
                                        </div>

                                        {/* Description of Soil Condition */}
                                        <div className="mb-3">
                                            <label className="block mb-1">2. Description of soil condition and foundation system</label>
                                            <textarea
                                                className="w-[50%] border rounded p-2"
                                                value={formData.part2q_descriptionOfSoilCondition || ""}
                                                onChange={(e) => handleInputChange("part2q_descriptionOfSoilCondition", e.target.value)}
                                                required
                                            />
                                        </div>

                                        {/* Identification of Critical Structures */}
                                        <div className="mb-3">
                                            <label className="block mb-1">3. Identification of critical structures (e.g., slender columns, cantilever structures, etc.)</label>
                                            <textarea
                                                className="w-[50%] border rounded p-2"
                                                value={formData.part2q_indentificationOfCritical || ""}
                                                onChange={(e) => handleInputChange("part2q_indentificationOfCritical", e.target.value)}
                                                required
                                            />
                                        </div>

                                        {/* Description of Uninspected Areas */}
                                        <div className="mb-3">
                                            <label className="block mb-1">4. Description of any area not covered in visual inspections</label>
                                            <textarea
                                                className="w-[50%] border rounded p-2"
                                                value={formData.part2q_descriptionOfArea || ""}
                                                onChange={(e) => handleInputChange("part2q_descriptionOfArea", e.target.value)}
                                                required
                                            />
                                        </div>

                                        {/* Compatibility of Usage */}
                                        <div className="mb-3">
                                            <label className="block mb-1">5. Compatibility of existing usage with intended purpose</label>
                                            <textarea
                                                className="w-[50%] border rounded p-2"
                                                value={formData.part2q_stateTheExistingUsage || ""}
                                                onChange={(e) => handleInputChange("part2q_stateTheExistingUsage", e.target.value)}
                                                required
                                            />
                                        </div>

                                        {/* Misuse or Deviations */}
                                        <div className="mb-3">
                                            <label className="block mb-1">6. Misuse, abuse, or deviations causing excessive loading</label>
                                            <textarea
                                                className="w-[50%] border rounded p-2"
                                                value={formData.part2q_stateTheMisuse || ""}
                                                onChange={(e) => handleInputChange("part2q_stateTheMisuse", e.target.value)}
                                                required
                                            />
                                        </div>

                                        {/* Additional/Alteration Work - Image Upload */}
                                        <div className="mb-3">
                                            <label className="block mb-1">7. Any additional/alteration work done on the building (Upload Images)</label>
                                            <input
                                                type="file"
                                                className="w-[50%] border rounded p-2"
                                                multiple
                                                onChange={(e) => handleImageChange("part2q_additionalWorks", e.target.files)}
                                            />
                                            <div className="flex flex-wrap mt-2">
                                                {formData.part2q_additionalWorks?.map((img, index) => (
                                                    <div key={index} className="relative w-24 h-24 m-1">
                                                        <img src={img} alt="Uploaded" className="w-full h-full object-cover rounded" />
                                                        <button
                                                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2"
                                                            onClick={() => removeImage("part2q_additionalWorks", index)}
                                                        >
                                                            X
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 3 */}
                                {step === 3 && (
                                    <div className="space-y-8">
                                        <h3 className="text-lg font-semibold mb-2">
                                            PART 3: Survey of Signs of Distress, Deformation, or Deterioration in Building Structure (Condition Assessment)
                                        </h3>

                                        {/* 1. Leaning of Building */}
                                        <div>
                                            <label className="block font-semibold text-gray-700 mb-2">1. Leaning of Building</label>
                                            <div className="flex gap-6">
                                                <label className="flex items-center gap-2">
                                                    <input type="radio" checked={formData.leaningOfBuilding === true} onChange={() => handleYesNoChange('leaningOfBuilding', true)} />
                                                    Yes
                                                </label>
                                                <label className="flex items-center gap-2">
                                                    <input type="radio" checked={formData.leaningOfBuilding === false} onChange={() => handleYesNoChange('leaningOfBuilding', false)} />
                                                    No
                                                </label>
                                            </div>
                                        </div>

                                        {/* 2. Settlements */}
                                        <div>
                                            <label className="block font-semibold text-gray-700 mb-2">2. Settlements</label>
                                            <div className="space-y-4">
                                                {[
                                                    { key: "floor", label: "(a) Floor" },
                                                    { key: "wall", label: "(b) Settlement of load-bearing wall" },
                                                    { key: "foundation", label: "(c) Settlement of RCC Foundation" },
                                                ].map(({ key, label }) => (
                                                    <div key={key} className="flex flex-wrap items-center gap-4">
                                                        <span className="w-64 font-medium">{label}</span>
                                                        <label className="flex items-center gap-2">
                                                            <input type="radio" checked={formData.settlements[key] === true} onChange={() => handleNestedYesNoChange('settlements', key, true)} />
                                                            Yes
                                                        </label>
                                                        <label className="flex items-center gap-2">
                                                            <input type="radio" checked={formData.settlements[key] === false} onChange={() => handleNestedYesNoChange('settlements', key, false)} />
                                                            No
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* 3. Defects Table */}
                                        <div>
                                            <label className="block font-semibold text-gray-700 mb-2">3. Defects (Extent of defect)</label>
                                            <div className="overflow-auto border border-gray-300 rounded">
                                                <table className="w-full text-sm">
                                                    <thead className="bg-gray-100">
                                                        <tr>
                                                            <th className="border p-2 text-left">Defect Type</th>
                                                            <th className="border p-2 text-left max-w-[10px] min-w-[10px]">Severity</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="max-w-10px min-w-10px">
                                                        {/* Basic Defects */}
                                                        {[
                                                            { key: "defect_cracking", label: "Cracking" },
                                                            { key: "defect_settlement", label: "Settlement" },
                                                            { key: "defect_thermalCracking", label: "Thermal cracking" },
                                                            { key: "defect_structural", label: "Structural" },
                                                            { key: "defect_crazing", label: "Crazing" },
                                                            { key: "defect_honeycombing", label: "Honeycombing" },
                                                            { key: "defect_wallCracks", label: "Cracking in load-bearing walls/ Infill walls" },
                                                            { key: "defect_rccCracks", label: "Cracking in RCC components" },
                                                        ].map((item) => (
                                                            <tr key={item.key}>
                                                                <td className="border p-2">{item.label}</td>
                                                                <td className="border p-2 max-w-[100px] min-w-[100px]">
                                                                    <select
                                                                        value={formData[item.key] || ""}
                                                                        onChange={(e) =>
                                                                            setFormData((prev) => ({ ...prev, [item.key]: e.target.value }))
                                                                        }
                                                                        className="w-full border rounded p-1"
                                                                    >
                                                                        <option value="">Select severity</option>
                                                                        {["Insignificant", "Slight", "Moderate", "Severe", "Very Severe"].map((level) => (
                                                                            <option key={level} value={level}>{level}</option>
                                                                        ))}
                                                                    </select>
                                                                </td>
                                                            </tr>
                                                        ))}

                                                        {/* Water Seepage Section */}
                                                        <tr>
                                                            <td colSpan={2} className="border p-2 font-semibold text-gray-700 bg-gray-50">
                                                                (Attach separate sheets for crack details, if required)
                                                            </td>
                                                        </tr>
                                                        {[
                                                            { key: "defect_waterSeepage", label: "Water seepage" },
                                                            { key: "defect_popOuts", label: "Pop-outs" },
                                                            { key: "defect_spalling", label: "Spalling" },
                                                            { key: "defect_rustStaining", label: "Rust staining" },
                                                        ].map((item) => (
                                                            <tr key={item.key}>
                                                                <td className="border p-2">{item.label}</td>
                                                                <td className="border p-2">
                                                                    <select
                                                                        value={formData[item.key] || ""}
                                                                        onChange={(e) =>
                                                                            setFormData((prev) => ({ ...prev, [item.key]: e.target.value }))
                                                                        }
                                                                        className="w-full border rounded p-1"
                                                                    >
                                                                        <option value="">Select severity</option>
                                                                        {["Insignificant", "Slight", "Moderate", "Severe", "Very Severe"].map((level) => (
                                                                            <option key={level} value={level}>{level}</option>
                                                                        ))}
                                                                    </select>
                                                                </td>
                                                            </tr>
                                                        ))}

                                                        {/* Extent of Corrosion Section */}
                                                        <tr>
                                                            <td colSpan={2} className="border p-2 font-semibold text-gray-700 bg-gray-50">
                                                                (Extent of corrosion)
                                                            </td>
                                                        </tr>
                                                        {[
                                                            { key: "defect_corrosionLongitudinalBars", label: "(a) Corrosion in longitudinal bars" },
                                                            { key: "defect_corrosionLateralTies", label: "(b) Corrosion in lateral ties/rings" },
                                                            { key: "defect_debondingDueToCorrosion", label: "(c) Debonding of surface due to corrosion" },
                                                            { key: "defect_deflectionBeamsSlabsFloors", label: "(d) Deflection in beams/slabs/floors (Attach separate sheets for details preferably with photographs)" },
                                                        ].map((item) => (
                                                            <tr key={item.key}>
                                                                <td className="border p-2">{item.label}</td>
                                                                <td className="border p-2">
                                                                    <select
                                                                        value={formData[item.key] || ""}
                                                                        name={item.key}
                                                                        onChange={(e) =>
                                                                            setFormData((prev) => ({ ...prev, [item.key]: e.target.value }))
                                                                        }
                                                                        className="w-full border rounded p-1"
                                                                    >
                                                                        <option value="">Select severity</option>
                                                                        {["Insignificant", "Slight", "Moderate", "Severe", "Very Severe"].map((level) => (
                                                                            <option key={level} value={level}>{level}</option>
                                                                        ))}
                                                                    </select>
                                                                </td>
                                                            </tr>
                                                        ))}

                                                        {/* State of Existing Repairs Section */}
                                                        <tr>
                                                            <td colSpan={2} className="border p-2 font-semibold text-gray-700 bg-gray-50">
                                                                State of the existing repairs (if any carried out in structure)
                                                            </td>
                                                        </tr>
                                                        {[
                                                            { key: "defect_delaminationDebonding", label: "(a) Delamination/debonding" },
                                                            { key: "defect_crackingOthers", label: "(b) Cracking Others (specify)" },
                                                        ].map((item) => (
                                                            <tr key={item.key}>
                                                                <td className="border p-2">{item.label}</td>
                                                                <td className="border p-2">
                                                                    <select
                                                                        value={formData[item.key] || ""}
                                                                        onChange={(e) =>
                                                                            setFormData((prev) => ({ ...prev, [item.key]: e.target.value }))
                                                                        }
                                                                        className="w-full border rounded p-1"
                                                                    >
                                                                        <option value="">Select severity</option>
                                                                        {["Insignificant", "Slight", "Moderate", "Severe", "Very Severe"].map((level) => (
                                                                            <option key={level} value={level}>{level}</option>
                                                                        ))}
                                                                    </select>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        {/* 4. Overall Structural Condition Assessment */}
                                        <div>
                                            <label className="block font-semibold text-gray-700 mb-2">
                                                4. Overall Structural Condition Assessment
                                            </label>
                                            <select
                                                value={formData.overallCondition || ""}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        overallCondition: e.target.value,
                                                    }))
                                                }
                                                className="w-full border border-gray-300 rounded p-2"
                                            >
                                                <option value="">Select condition</option>
                                                {[
                                                    "Unsafe",
                                                    "Potentially hazardous",
                                                    "Severe",
                                                    "Moderate",
                                                    "Minor",
                                                    "Good condition",
                                                ].map((option, idx) => (
                                                    <option key={idx} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* 5. Recommendations in Table with Inputs */}
                                        <div>
                                            <label className="block font-semibold text-gray-700 mb-2">5. RECOMMENDATIONS</label>
                                            <div className="overflow-auto border border-gray-300 rounded">
                                                <table className="w-full text-sm border-collapse">
                                                    <tbody>
                                                        <tr>
                                                            <td className="border p-2 w-10 text-center font-semibold">5</td>
                                                            <td className="border p-2 font-semibold">RECOMMENDATIONS</td>
                                                            <td className="border p-2">Good condition</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="border p-2"></td>
                                                            <td className="border p-2 whitespace-pre-line">
                                                                (a) No further action required<br />
                                                                (b) Repair/strengthening works necessary<br />
                                                                (c) Detailed assessment required<br />
                                                                (d) Barricade/non-use needed<br />
                                                                (e) Reconstruction or any other reasons
                                                            </td>
                                                            <td className="border p-2">
                                                                <textarea
                                                                    type="text"
                                                                    className="w-full border rounded p-4"
                                                                    value={formData.recommendation_noActionRequired || ""}
                                                                    onChange={(e) =>
                                                                        setFormData((prev) => ({
                                                                            ...prev,
                                                                            recommendation_noActionRequired: e.target.value,
                                                                        }))
                                                                    }
                                                                    placeholder="Enter remarks (optional)"
                                                                />
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step Navigation Buttons */}
                                <div className="flex justify-between mt-6">
                                    {step > 1 && (
                                        <button type="button" onClick={() => setStep(step - 1)} className="px-4 py-2 bg-gray-300 rounded">Back</button>
                                    )}
                                    {step < 3 && (
                                        <button type="button" onClick={() => setStep(step + 1)} className="px-4 py-2 bg-blue-500 text-white rounded">Next</button>
                                    )}
                                    {step === 3 && (
                                        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Update</button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Print Modal */}
            {showPrintModal ? (
                <>
                    <div className="fixed top-0 left-0 z-50 w-full h-screen bg-black/30 backdrop-blur-sm flex justify-center items-start overflow-y-auto">
                        <div className="absolute top-10 z-50 shadow-lg mx-auto w-full max-w-4xl">
                            <div className="p-6 bg-white" ref={contentRef}>
                                <div className="bg-white border border-gray-800 rounded shadow-md">
                                    {/* Header */}
                                    <div className="border-b-1 border-gray-800 bg-gray-50">
                                        <div className="h-16 w-full flex items-center justify-center">
                                            <h2 className="text-center text-xl font-bold text-gray-800">
                                                BUILDING CONDITION ASSESSMENT FORM
                                            </h2>
                                        </div>
                                        <div className="grid grid-cols-2 divide-x divide-gray-800">
                                            <div className="p-4 border-t border-gray-800 text-center">
                                                <p className="text-sm mb-1">
                                                    <span className="font-semibold">Assessed By:</span> {formData.userName || decoded.name || "N/A"}
                                                </p>
                                                <p className="text-sm">
                                                    <span className="font-semibold">Date:</span> {new Date(formData.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="p-4 border-t border-gray-800 text-center">
                                                <p className="text-sm mb-1">
                                                    <span className="font-semibold">Status:</span>
                                                    <span className="ml-1 px-2 py-1 text-xs rounded bg-blue-500 text-white">
                                                        {formData.status}
                                                    </span>
                                                </p>
                                                <p className="text-sm">
                                                    <span className="font-semibold">Form ID:</span> {formData.id}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Part 1: General Information */}
                                    <div className="p-5 border-gray-800">
                                        <h3 className="font-bold text-lg mb-4 pb-2 border-b border-gray-300 text-gray-800">
                                            PART 1 GENERAL INFORMATION OF THE BUILDING
                                        </h3>

                                        <div className="mb-4">
                                            <p className="font-semibold text-sm text-gray-700">1. Name and address of the building, year of construction</p>
                                            <p className="text-sm bg-gray-50 p-2 rounded mt-1">{formData?.part1q_nameOfBuilding || "N/A"}</p>
                                        </div>

                                        <div className="mb-4">
                                            <p className="font-semibold text-sm text-gray-700">2. TYPE OF THE BUILDING - Load bearing/party load bearing and partly RCC/RCC frame</p>
                                            <p className="text-sm bg-gray-50 p-2 rounded mt-1">{formData?.part1q_typeOfBuilding || "N/A"}</p>
                                        </div>

                                        <div className="mb-4">
                                            <p className="font-semibold text-sm text-gray-700">3. Number of stories in each block of the building (Upload Images)</p>
                                            <div className="grid   grid-cols-4 gap-2 mt-2">
                                                {formData?.part1q_numberOfStories?.map((url, index) => (
                                                    <div key={`stories-${index}`} className="border border-gray-300 rounded p-2">
                                                        <img src={url} alt="Building Stories" className="w-full h-24 object-cover rounded" />
                                                        <p className="mt-1 text-xs text-center text-gray-600">Photo {index + 1}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <p className="font-semibold text-sm text-gray-700">4. Description of the main usage of the building:\nResidential/education/office/hostel/workshop\n/hospital/any other specify (Upload Images)</p>
                                            <div className="grid   grid-cols-4 gap-2 mt-2">
                                                {formData?.part1q_usageOfStories?.map((url, index) => (
                                                    <div key={`usage-${index}`} className="border border-gray-300 rounded p-2">
                                                        <img src={url} alt="Building Stories" className="w-full h-24 object-cover rounded" />
                                                        <p className="mt-1 text-xs text-center text-gray-600">Photo {index + 1}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <p className="font-semibold text-sm text-gray-700">5. TYPE OF FLOOR AND ROOF - RCC/Wooden/steel</p>
                                            <p className="text-sm bg-gray-50 p-2 rounded mt-1">{formData?.part1q_TypesOfProff?.replace(/\"/g, '') || "N/A"}</p>
                                        </div>

                                        <div className="mb-4">
                                            <p className="font-semibold text-sm text-gray-700">6. Year of construction, Maintenance history of the building if known to be mentioned</p>
                                            <p className="text-sm bg-gray-50 p-2 rounded mt-1">{formData?.part1q_yearOfConstruction || "N/A"}</p>
                                        </div>
                                    </div>

                                    {/* Part 2: Structural System */}
                                    <div className="p-5 border-t border-gray-800">
                                        <h3 className="font-bold text-lg mb-4 pb-2 border-b border-gray-300 text-gray-800">
                                            PART 2 STRUCTURAL SYSTEM OF THE BUILDING
                                        </h3>

                                        <div className="mb-4">
                                            <p className="font-semibold text-sm text-gray-700">1. Description of the structural forms, systems and materials used in different parts of the building, e.g., RCC, Prestressed concrete, steel, etc.</p>
                                            <p className="text-sm bg-gray-50 p-2 rounded mt-1">{formData?.part2q_descriptionOfStructuralSystem || "N/A"}</p>
                                        </div>

                                        <div className="mb-4">
                                            <p className="font-semibold text-sm text-gray-700">2. Description of soil condition and foundation system, if known</p>
                                            <p className="text-sm bg-gray-50 p-2 rounded mt-1">{formData?.part2q_descriptionOfSoilCondition || "N/A"}</p>
                                        </div>

                                        <div className="mb-4">
                                            <p className="font-semibold text-sm text-gray-700">3. Identification of critical structures (e.g., slender columns, floating columns, cantilever structures, long-span structures, etc.)</p>
                                            <p className="text-sm bg-gray-50 p-2 rounded mt-1">{formData?.part2q_indentificationOfCritical || "N/A"}</p>
                                        </div>

                                        <div className="mb-4">
                                            <p className="font-semibold text-sm text-gray-700">4. Description of any area not covered in visual inspections. State the reasons for the same.</p>
                                            <p className="text-sm bg-gray-50 p-2 rounded mt-1">{formData?.part2q_descriptionOfArea || "N/A"}</p>
                                        </div>

                                        <div className="mb-4">
                                            <p className="font-semibold text-sm text-gray-700">5. State, if the existing usage and loading condition is compatible with the intended purpose of the structure</p>
                                            <p className="text-sm bg-gray-50 p-2 rounded mt-1">{formData?.part2q_stateTheExistingUsage || "N/A"}</p>
                                        </div>

                                        <div className="mb-4">
                                            <p className="font-semibold text-sm text-gray-700">6. State the misuse, abuse, or deviation that has given rise to excessive loading</p>
                                            <p className="text-sm bg-gray-50 p-2 rounded mt-1">{formData?.part2q_stateTheMisuse || "N/A"}</p>
                                        </div>

                                        <div className="mb-4">
                                            <p className="font-semibold text-sm text-gray-700">7. State, if there was any additional/alteration work due to the building structure (Upload Images)</p>
                                            <div className="grid   grid-cols-4 gap-2 mt-2">
                                                {formData?.part2q_additionalWorks?.map((url, index) => (
                                                    <div key={`works-${index}`} className="border border-gray-300 rounded p-2">
                                                        <img src={url} alt="Additional Works" className="w-full h-24 object-cover rounded" />
                                                        <p className="mt-1 text-xs text-center text-gray-600">Photo {index + 1}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Leaning of Building */}

                                    <div className="p-5 border-t border-gray-800">
                                        <h3 className="font-bold text-lg mb-4 pb-2 border-b border-gray-300 text-gray-800">
                                            1. Leaning of Building
                                        </h3>
                                        <span className={`px-3 py-1 rounded text-white text-sm font-medium ${formData.leaningOfBuilding ? "bg-red-500" : "bg-green-500"}`}>
                                            {formData.leaningOfBuilding ? "Yes" : "No"}
                                        </span>
                                    </div>

                                    {/* Settlements */}
                                    <div className="p-5 border-t border-gray-800">
                                        <h3 className="font-bold text-lg mb-4 pb-2 border-b border-gray-300 text-gray-800">
                                            2. Settlements
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="border border-gray-200 rounded p-3">
                                                <p className="font-semibold text-sm text-gray-700 mb-2">Floor:</p>
                                                <span className={`px-3 py-1 rounded text-white text-sm font-medium ${formData.settlement_floor ? "bg-red-500" : "bg-green-500"}`}>
                                                    {formData.settlement_floor ? "Yes" : "No"}
                                                </span>
                                            </div>
                                            <div className="border border-gray-200 rounded p-3">
                                                <p className="font-semibold text-sm text-gray-700 mb-2">Settlement of load-bearing wall:</p>
                                                <span className={`px-3 py-1 rounded text-white text-sm font-medium ${formData.settlement_wall ? "bg-red-500" : "bg-green-500"}`}>
                                                    {formData.settlement_wall ? "Yes" : "No"}
                                                </span>
                                            </div>
                                            <div className="border border-gray-200 rounded p-3">
                                                <p className="font-semibold text-sm text-gray-700 mb-2">Settlement of RCC Foundation:</p>
                                                <span className={`px-3 py-1 rounded text-white text-sm font-medium ${formData.settlement_foundation ? "bg-red-500" : "bg-green-500"}`}>
                                                    {formData.settlement_foundation ? "Yes" : "No"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Defects */}
                                    <div className="p-5 border-t border-gray-800">
                                        <h3 className="font-bold text-lg mb-4 pb-2 border-b border-gray-300 text-gray-800">
                                            3. Defects (Extent of defect)
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                                            {[
                                                { label: "Cracking", key: "defect_cracking" },
                                                { label: "Settlement", key: "defect_settlement" },
                                                { label: "Thermal Cracking", key: "defect_thermalCracking" },
                                                { label: "Structural", key: "defect_structural" },
                                                { label: "Crazing", key: "defect_crazing" },
                                                { label: "Honeycombing", key: "defect_honeycombing" },
                                                { label: "Cracking in Load-Bearing Walls/Infill Walls", key: "defect_wallCracks" },
                                                { label: "Cracking in RCC Components", key: "defect_rccCracks" },
                                                { label: "Water Seepage", key: "defect_waterSeepage" },
                                                { label: "Pop-Outs", key: "defect_popOuts" },
                                                { label: "Spalling", key: "defect_spalling" },
                                                { label: "Rust Staining", key: "defect_rustStaining" },
                                                { label: "Corrosion of Longitudinal Bars", key: "defect_corrosionLongitudinalBars" },
                                                { label: "Corrosion in lateral ties/rings", key: "defect_corrosionLateralTies" },
                                                { label: "Debonding of surface due to corrosion", key: "defect_debondingDueToCorrosion" },
                                                { label: "Delamination/Debonding", key: "defect_delaminationDebonding" },
                                                { label: "Cracking Others (specify)", key: "defect_crackingOthers" },
                                            ].map(({ label, key }) => {
                                                const severity = formData?.[key] || "N/A";
                                                return (
                                                    <div key={key} className="border border-gray-200 rounded p-3">
                                                        <p className="font-semibold text-sm text-gray-700 mb-1">{label}</p>
                                                        <span className={`px-3 py-1 rounded text-white text-sm font-medium ${getSeverityColor(severity)}`}>
                                                            {severity}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="mt-6">
                                            <p className="font-semibold text-sm text-gray-700 mb-2">Deflection in Beams/Slabs/Floors</p>
                                            <div className="grid   grid-cols-4 gap-2 mt-2">
                                                {formData?.defect_deflectionBeamsSlabsFloors &&
                                                    formData.defect_deflectionBeamsSlabsFloors
                                                        .replace(/[{}]/g, '')
                                                        .split(',')
                                                        .map((url, index) => (
                                                            <div key={`deflection-${index}`} className="border border-gray-300 rounded p-2">
                                                                <img src={url.replace(/"/g, '').trim()} alt="Deflection Issue" className="w-full h-24 object-cover rounded" />
                                                                <p className="mt-1 text-xs text-center text-gray-600">Photo {index + 1}</p>
                                                            </div>
                                                        ))
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    {/* Overall Condition */}
                                    <div className="p-5 border-t border-gray-800">
                                        <h3 className="font-bold text-lg mb-4 pb-2 border-b border-gray-300 text-gray-800">
                                            4. Overall Structural Condition Assessment
                                        </h3>
                                        <span className="px-4 py-2 rounded bg-green-500 text-white font-medium">
                                            {formData.overallCondition || "N/A"}
                                        </span>
                                    </div>

                                    {/* Recommendations */}
                                    <div className="p-5 border-t border-gray-800">
                                        <h3 className="font-bold text-lg mb-4 pb-2 border-b border-gray-300 text-gray-800">
                                            5. RECOMMENDATIONS
                                        </h3>
                                        <div className="bg-gray-50 p-4 rounded border border-gray-300">
                                            <p className="text-sm">{formData.recommendation_noActionRequired || "N/A"}</p>
                                        </div>
                                    </div>
                                    {formData.status === "Complete" && (
                                        <div className="grid grid-cols-2 divide-x divide-gray-800">
                                            <div className="p-4 border-t border-gray-800 text-left">
                                                <p className="font-bold text-sm mb-4 text-gray-800">
                                                    This is a system-generated printout. No signature is required.
                                                </p>
                                            </div>
                                            <div className="p-4 border-t border-gray-800 text-left">
                                                <p className="text-sm mb-1">
                                                    <span className="font-semibold">Date:</span>
                                                    <span className="ml-1">
                                                        {formattedDate}
                                                    </span>
                                                </p>
                                                <p className="text-sm">
                                                    <span className="font-semibold">Time:</span>
                                                    <span className="ml-1">{formattedTime}</span>
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="bg-white p-4 text-right">
                                <button
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded mr-2 font-medium transition-colors"
                                    onClick={() => reactToPrintFn()}
                                >
                                    Print
                                </button>
                                <button
                                    className="bg-red-100 hover:bg-red-200 text-red-800 px-6 py-2 rounded font-medium transition-colors"
                                    onClick={handleCrossClick}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </>
    )
}
