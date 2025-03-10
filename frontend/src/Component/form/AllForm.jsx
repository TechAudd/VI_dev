import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { IoMdArrowDropdown } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";

export default function AllForm(
    {
        allBranchData,
        totalPages,
        page,
        setPage,
        setAllBranchData,
    }
) {
    const [branchUpdateData, setBranchUpdateData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [branchId, setBranchId] = useState(null);
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
                                    <th className="p-3 border border-gray-300">Name</th>
                                    <th className="p-3 border border-gray-300">Address</th>
                                    <th className="p-3 border border-gray-300">GSTIN</th>
                                    <th className="p-2 border  text-center border-gray-300">
                                        Enable/Disable
                                    </th>
                                    <th className="p-3 border border-gray-300">Action</th>
                                </tr>
                            </thead>
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
