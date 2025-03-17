import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";

export default function AllForm() {
    const token = localStorage.getItem("accessToken");
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState([]);

    // Fetch data from API on component mount
    useEffect(() => {
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
                toast.error("Failed to load forms");
            }
        };

        fetchForms();
    }, []);

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
            setFormData(prevForms =>
                prevForms.map(form =>
                    form.id === id ? { ...form, status: newStatus } : form
                )
            );

            toast.success(`Status updated to ${newStatus}`);
        } catch (error) {
            console.error("Error updating form status:", error.message);
            toast.error("Access Denied: Admins Only");
        }
    };
    // `${import.meta.env.VITE_APP_BASE_URL}/api/employee/updateFormById/${id}`,

    const handleDelete = async (id) => {
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
                                    <th className="p-3 border border-gray-300">Structural System</th>
                                    <th className="p-3 border border-gray-300">Cracking</th>
                                    <th className="p-3 border border-gray-300">Settlement</th>
                                    <th className="p-3 border border-gray-300">Status</th>
                                    <th className="p-3 border border-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.length > 0 ? (
                                    formData.map((form, index) => (
                                        <tr key={form.id} className="text-center border border-gray-300">
                                            <td className="p-3 border border-gray-300">{index + 1}</td>
                                            <td className="p-3 border border-gray-300">{form.part1GeneralInformation?.join(", ") || "N/A"}</td>
                                            <td className="p-3 border border-gray-300">{form.part2StructuralSystem?.join(", ") || "N/A"}</td>
                                            <td className="p-3 border border-gray-300">{form.defect_cracking || "N/A"}</td>
                                            <td className="p-3 border border-gray-300">{form.defect_settlement || "N/A"}</td>
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
                                            <td className="p-6 flex justify-center">
                                                {/* <button className="text-blue-500">
                                                    <AiFillEdit size={20} />
                                                </button> */}
                                                <button className="ml-3 cursor-pointer text-red-600"
                                                    onClick={() => handleDelete(form.id)}
                                                >
                                                    <AiFillDelete size={20} />
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
            {showModal && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-4 w-full max-w-[60%]">
                        <h2 className="text-lg font-medium mb-4">Edit Item</h2>
                        <div className="flex flex-col gap-4 ">
                            <div className=" gap-4 mb-4">
                                {/* Branch Name */}
                                <div>
                                    <label
                                        className="block text-sm font-medium text-gray-700"
                                        htmlFor="branchName"
                                    >
                                        Branch Name
                                    </label>
                                    <input
                                        type="text"
                                        id="branchName"
                                        name="branchName"

                                        placeholder="Enter Branch Name"
                                        className="p-2 border w-full rounded-sm"
                                    />
                                </div>

                                {/* Branch Address */}
                                <div>
                                    <label
                                        className="block text-sm font-medium text-gray-700"
                                        htmlFor="branchAddress"
                                    >
                                        Branch Address
                                    </label>
                                    <input
                                        type="text"
                                        id="branchAddress"
                                        name="branchAddress"
                                        placeholder="Enter Branch Address"
                                        className="p-2 border w-full rounded-sm"
                                    />
                                </div>

                                {/* Warehouse Mapped */}
                                <div>
                                    <label
                                        className="block text-sm font-medium text-gray-700"
                                        htmlFor="warehouseMapped"
                                    >
                                        Warehouse Mapped
                                    </label>
                                    <select
                                        id="warehouseMapped"
                                        name="warehouseMapped"
                                        className="p-2 border w-full rounded-sm"
                                    >
                                        <option value="">Select Warehouse</option>
                                        {/* Add warehouse options dynamically if needed */}
                                    </select>
                                </div>

                                {/* GSTIN Checkbox */}
                                <div className="flex items-center mt-6">
                                    <input
                                        type="checkbox"
                                        id="gstinCheckbox"
                                        name="gstinCheckbox"
                                        className="mr-2"
                                    />
                                    <label
                                        className="text-sm font-medium text-gray-700"
                                        htmlFor="gstinCheckbox"
                                    >
                                        GSTIN
                                    </label>
                                </div>

                            </div>
                            <div className="flex justify-end p-2 gap-5">
                                <button
                                    type="button"
                                    className="border border-gray-500 text-gray-500 px-3 py-1 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="border border-blue-500 text-blue-500 px-3 py-1 rounded-lg"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
