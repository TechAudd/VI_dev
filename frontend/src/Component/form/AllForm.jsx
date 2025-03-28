import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";

export default function AllForm() {
    const token = localStorage.getItem("accessToken");
    const decoded = jwtDecode(token);
    const [showModal, setShowModal] = useState(false);
    const [forms, setForms] = useState([]);
    const [selectedForm, setSelectedForm] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [editingIndex, setEditingIndex] = useState(null);
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        part1GeneralInformation: [],
        part2StructuralSystem: [],
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
        defect_deflectionBeamsSlabsFloors: "",
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
            part1GeneralInformation: [...form.part1GeneralInformation],
            part2StructuralSystem: [...form.part2StructuralSystem],
            settlements: { ...form.settlements }
        });
        setShowModal(true);

        setStep(1);
    };

    // Handle form field changes
    const handlePart1Change = (index, value) => {
        const updatedPart1 = [...formData.part1GeneralInformation];
        updatedPart1[index] = value;
        setFormData(prev => ({ ...prev, part1GeneralInformation: updatedPart1 }));
    };

    const handlePart2Change = (index, value) => {
        const updatedPart2 = [...formData.part2StructuralSystem];
        updatedPart2[index] = value;
        setFormData(prev => ({ ...prev, part2StructuralSystem: updatedPart2 }));
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

    // Fetch data from API on component mount
    const handleGetFormData = async (id) => {
        try {
            await axios.get(`http://localhost:4100/api/form/getFormById/${id}`, {
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

    // Toggle status between "Inprocess" and "Complete"
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
    // `${import.meta.env.VITE_APP_BASE_URL}/api/employee/updateFormById/${id}`,

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

    // Handle Update Form Submission
    const handleUpdate = async () => {
        try {
            await axios.patch(
                `http://localhost:4100/api/form/updateFormById/${selectedForm.id}`,
                editedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            setFormData((prevForms) =>
                prevForms.map((form) => (form.id === selectedForm.id ? { ...form, ...editedData } : form))
            );

            toast.success("Form updated successfully!");
            setShowModal(false);
        } catch (error) {
            console.error("Error updating form:", error.message);
            toast.error("Error updating form");
        }
    };

    const handleCrossClick = () => {
        fetchForms();
        setShowModal(false);
        setIsVisible(true);
    }

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
                                    <th className="p-3 border border-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.length > 0 ? (
                                    formData.map((form, index) => (
                                        <tr key={form.id} className="text-center border border-gray-300">
                                            <td className="p-3 border border-gray-300">{index + 1}</td>
                                            <td className="p-3 border border-gray-300">
                                                {form.part1GeneralInformation?.slice(0, 2).join(", ") || "N/A"}
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
                                            {/* <td className="p-3 border border-gray-300">
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
                                            </td> */}
                                            <td className="p-3 border border-gray-300">{form.status || "N/A"}</td>
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
                    <div className="bg-white mt-6 p-6 rounded-md w-full max-h-[95vh] max-w-[75%] flex flex-col">
                        <button
                            className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                            onClick={() => {
                                handleCrossClick();

                            }}
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
                                        {part1Questions.map((q, i) => (
                                            <div key={i} className="mb-3">
                                                <label className="block mb-1">{i + 1}. {q}</label>
                                                <textarea
                                                    type="text"
                                                    className="w-[50%] border rounded p-2"
                                                    value={formData.part1GeneralInformation[i] || ""}
                                                    onChange={(e) => handlePart1Change(i, e.target.value)}
                                                    required
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {/* w-96 */}
                                {/* STEP 2 */}
                                {step === 2 && (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">PART 2 STRUCTURAL SYSTEM OF THE BUILDING</h3>
                                        {part2Questions.map((q, i) => (
                                            <div key={i} className="mb-3">
                                                <label className="block mb-1">{i + 1}. {q}</label>
                                                <textarea
                                                    type="text"
                                                    className="w-[50%] border rounded p-2"
                                                    value={formData.part2StructuralSystem[i] || ""}
                                                    onChange={(e) => handlePart2Change(i, e.target.value)}
                                                    required
                                                />
                                            </div>
                                        ))}
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
        </>
    )
}
