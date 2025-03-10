import React, { useEffect, useRef, useState, useCallback } from "react";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import CreateForm from "./CreateForm";
import AllForm from "./AllForm";
import { debounce } from "lodash"; 

export default function Form() {
    const [allBranchData, setAllBranchData] = useState([]);
    const [isVisible, setIsVisible] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);

    return (
        <div className="flex flex-col justify-center items-center my-4 w-full px-4 py-2">
            <Toaster />
            {isVisible && (
                <div className="m-4 w-full flex justify-between items-center">
                    <button
                        className="bg-blue-700 mx-4 self-start text-white active:bg-blue-900 font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => {
                            setShowModal(true);
                            setIsVisible(false);
                        }}
                    >
                        Create Form
                    </button>
                    <div className="relative w-full max-w-xs mx-4">
                        <input
                            type="text"
                            placeholder="Search by Branch name"
                            className="p-2 pl-10 border border-gray-500 rounded w-full"
                        />
                        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                            <FiSearch size={18} />
                        </span>
                    </div>
                </div>
            )}
            {showModal ? (
                <CreateForm setIsVisible={setIsVisible} setShowModal={setShowModal} />
            ) : (
                <AllForm
                    allBranchData={allBranchData}
                    totalPages={totalPages}
                    page={page}
                    setPage={setPage}
                    setAllBranchData={setAllBranchData}
                />
            )}
        </div>
    )
}
