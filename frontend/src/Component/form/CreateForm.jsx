import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

export default function CreateForm({ setIsVisible, setShowModal }) {
  const navigator = useNavigate();
  const token = localStorage.getItem("accessToken");
  const decode = jwtDecode(token);
  const userId = decode.id;
  const userName = decode.name;

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

  const [step, setStep] = useState(1);
  const [part1Data, setPart1Data] = useState(Array(part1Questions.length).fill(""));
  const [part2Data, setPart2Data] = useState(Array(part2Questions.length).fill(""));
  const [images, setImages] = useState({});

  const [formData, setFormData] = useState({
    //part1
    part1q_nameOfBuilding: "",
    part1q_typeOfBuilding: "",
    part1q_numberOfStories: [],
    part1q_usageOfStories: [],
    part1q_TypesOfProff: "",
    part1q_yearOfConstruction: "",

    //part2
    part2q_descriptionOfStructuralSystem: "",
    part2q_descriptionOfSoilCondition: "",
    part2q_indentificationOfCritical: "",
    part2q_descriptionOfArea: "",
    part2q_stateTheExistingUsage: "",
    part2q_stateTheMisuse: "",
    part2q_additionalWorks: [],

    // part2 end 
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
    recommendation_noActionRequired: "",
  });

  const handleNestedYesNoChange = (parentKey, key, value) => {
    setFormData(prev => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [key]: value,
      },
    }));
  };

  const handleYesNoChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("userId", userId);
      formDataToSend.append("userName", userName);

      formDataToSend.append("part1q_nameOfBuilding", formData.part1q_nameOfBuilding);
      formDataToSend.append("part1q_typeOfBuilding", formData.part1q_typeOfBuilding);
      formDataToSend.append("part1q_yearOfConstruction", formData.part1q_yearOfConstruction);
      formDataToSend.append("part1q_TypesOfProff", JSON.stringify(formData.part1q_TypesOfProff));

      formDataToSend.append("part2q_descriptionOfStructuralSystem", formData.part2q_descriptionOfStructuralSystem);
      formDataToSend.append("part2q_descriptionOfSoilCondition", formData.part2q_descriptionOfSoilCondition);
      formDataToSend.append("part2q_indentificationOfCritical", formData.part2q_indentificationOfCritical);
      formDataToSend.append("part2q_descriptionOfArea", formData.part2q_descriptionOfArea);
      formDataToSend.append("part2q_stateTheExistingUsage", formData.part2q_stateTheExistingUsage);
      formDataToSend.append("part2q_stateTheMisuse", formData.part2q_stateTheMisuse);
      formDataToSend.append("part2q_additionalWorks", JSON.stringify(formData.part2q_additionalWorks));

      formDataToSend.append("leaningOfBuilding", formData.leaningOfBuilding);
      formDataToSend.append("settlement_floor", formData.settlements.floor);
      formDataToSend.append("settlement_wall", formData.settlements.wall);
      formDataToSend.append("settlement_foundation", formData.settlements.foundation);

      formDataToSend.append("defect_cracking", formData.defect_cracking);
      formDataToSend.append("defect_settlement", formData.defect_settlement);
      formDataToSend.append("defect_thermalCracking", formData.defect_thermalCracking);
      formDataToSend.append("defect_structural", formData.defect_structural);
      formDataToSend.append("defect_crazing", formData.defect_crazing);
      formDataToSend.append("defect_honeycombing", formData.defect_honeycombing);
      formDataToSend.append("defect_wallCracks", formData.defect_wallCracks);
      formDataToSend.append("defect_rccCracks", formData.defect_rccCracks);
      formDataToSend.append("defect_waterSeepage", formData.defect_waterSeepage);
      formDataToSend.append("defect_popOuts", formData.defect_popOuts);
      formDataToSend.append("defect_spalling", formData.defect_spalling);
      formDataToSend.append("defect_rustStaining", formData.defect_rustStaining);
      formDataToSend.append("defect_corrosionLongitudinalBars", formData.defect_corrosionLongitudinalBars);
      formDataToSend.append("defect_corrosionLateralTies", formData.defect_corrosionLateralTies);
      formDataToSend.append("defect_debondingDueToCorrosion", formData.defect_debondingDueToCorrosion);
      formDataToSend.append("defect_deflectionBeamsSlabsFloors", formData.defect_deflectionBeamsSlabsFloors);
      formDataToSend.append("defect_delaminationDebonding", formData.defect_delaminationDebonding);
      formDataToSend.append("defect_crackingOthers", formData.defect_crackingOthers);
      formDataToSend.append("overallCondition", formData.overallCondition);
      formDataToSend.append("recommendation_noActionRequired", formData.recommendation_noActionRequired);

      const appendArrayToFormData = (key, array) => {
        array.forEach((item, index) => {
          Object.keys(item).forEach((field) => {
            if (field === "images" && item[field]) {
              item[field].forEach((image, imgIndex) => {
                formDataToSend.append(`${key}`, image);
              });
            } else {
              formDataToSend.append(`${key}[${index}][${field}]`, item[field]);
            }
          });
        });
      };

      if (Array.isArray(formData.part1q_numberOfStories)) {
        appendArrayToFormData("part1q_numberOfStories", formData.part1q_numberOfStories);
      }
      if (Array.isArray(formData.part1q_usageOfStories)) {
        appendArrayToFormData("part1q_usageOfStories", formData.part1q_usageOfStories);
      }
      if (Array.isArray(formData.part2q_additionalWorks)) {
        appendArrayToFormData("part2q_additionalWorks", formData.part2q_additionalWorks);
      }
      if (Array.isArray(formData.defect_deflectionBeamsSlabsFloors)) {
        appendArrayToFormData("defect_deflectionBeamsSlabsFloors", formData.defect_deflectionBeamsSlabsFloors);
      }

      // Debug FormData
      for (const pair of formDataToSend.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }

      const response = await axios.post(
        "http://localhost:4100/api/form/createForm",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        toast.success("Form Submitted Successfully!");
        setShowModal(false);
        navigator("/createForm");
        setIsVisible(true);
      }
    } catch (err) {
      console.error(err);
      toast.error("Form submission failed: " + (err.response?.data?.message || err.message));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleImageChange = (field, files) => {
    const images = Array.from(files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setFormData((prevData) => ({
      ...prevData,
      [field]: prevData[field] ? [...prevData[field], ...images] : [...images],
    }));
  };

  const removeImage = (field, index) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: prevData[field].filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <button
          className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
          onClick={() => {
            setShowModal(false);
            setIsVisible(true);
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
        <form onSubmit={handleSubmit}>
          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">PART 1 GENERAL INFORMATION OF THE BUILDING</h3>

              <div className="mb-3">
                <label className="block mb-1">1. Name and address of the building, year of construction</label>
                <input
                  type="text"
                  className="w-[50%] border rounded p-2"
                  value={formData.part1q_nameOfBuilding}
                  onChange={(e) => handleInputChange("part1q_nameOfBuilding", e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block mb-1">2. TYPE OF THE BUILDING - Load bearing/party load bearing and partly RCC/RCC frame</label>
                <input
                  type="text"
                  className="w-[50%] border rounded p-2"
                  value={formData.part1q_typeOfBuilding}
                  onChange={(e) => handleInputChange("part1q_typeOfBuilding", e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block mb-1">3. Number of stories in each block of the building (Upload Images)</label>
                <input
                  type="file"
                  className="w-[50%] border rounded p-2"
                  multiple
                  onChange={(e) => handleImageChange("part1q_numberOfStories", e.target.files)}
                />
                <div className="flex flex-wrap mt-2">
                  {formData.part1q_numberOfStories.map((img, index) => (
                    <div key={index} className="relative w-24 h-24 m-1">
                      <img src={img.url} alt="Uploaded" className="w-full h-full object-cover rounded" />
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

              <div className="mb-3">
                <label className="block mb-1">{`4. Description of the main usage of the building:\nResidential/education/office/hostel/workshop\n/hospital/any other specify (Upload Images)`}</label>
                <input
                  type="file"
                  className="w-[50%] border rounded p-2"
                  multiple
                  onChange={(e) => handleImageChange("part1q_usageOfStories", e.target.files)}
                />
                <div className="flex flex-wrap mt-2">
                  {formData.part1q_usageOfStories.map((img, index) => (
                    <div key={index} className="relative w-24 h-24 m-1">
                      <img src={img.url} alt="Uploaded" className="w-full h-full object-cover rounded" />
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
              <div className="mb-3">
                <label className="block mb-1">5. TYPE OF FLOOR AND ROOF - RCC/Wooden/steel.    </label>
                <input
                  type="text"
                  className="w-[50%] border rounded p-2"
                  value={formData.part1q_TypesOfProff}
                  onChange={(e) => handleInputChange("part1q_TypesOfProff", e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block mb-1">6. Year of construction, Maintenance history of the building if known to be mentioned</label>
                <input
                  type="text"
                  className="w-[50%] border rounded p-2"
                  value={formData.part1q_yearOfConstruction}
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

              <div className="mb-3">
                <label className="block mb-1">1. Description of the structural forms, systems and materials used in different parts of the building, e.g., RCC, Prestressed concrete, steel, etc.</label>
                <textarea
                  className="w-[50%] border rounded p-2"
                  value={formData.part2q_descriptionOfStructuralSystem}
                  onChange={(e) => handleInputChange("part2q_descriptionOfStructuralSystem", e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block mb-1">2. Description of soil condition and foundation system, if known</label>
                <textarea
                  className="w-[50%] border rounded p-2"
                  value={formData.part2q_descriptionOfSoilCondition}
                  onChange={(e) => handleInputChange("part2q_descriptionOfSoilCondition", e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block mb-1">3. Identification of critical structures (e.g., slender columns, floating columns, cantilever structures, long-span structures, etc.)</label>
                <textarea
                  className="w-[50%] border rounded p-2"
                  value={formData.part2q_indentificationOfCritical}
                  onChange={(e) => handleInputChange("part2q_indentificationOfCritical", e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block mb-1">4. Description of any area not covered in visual inspections. State the reasons for the same.</label>
                <textarea
                  className="w-[50%] border rounded p-2"
                  value={formData.part2q_descriptionOfArea}
                  onChange={(e) => handleInputChange("part2q_descriptionOfArea", e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block mb-1">5. State, if the existing usage and loading condition is compatible with the intended purpose of the structure</label>
                <textarea
                  className="w-[50%] border rounded p-2"
                  value={formData.part2q_stateTheExistingUsage}
                  onChange={(e) => handleInputChange("part2q_stateTheExistingUsage", e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block mb-1">6. State the misuse, abuse, or deviation that has given rise to excessive loading</label>
                <textarea
                  className="w-[50%] border rounded p-2"
                  value={formData.part2q_stateTheMisuse}
                  onChange={(e) => handleInputChange("part2q_stateTheMisuse", e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block mb-1">7. State, if there was any additional/alteration work due to the building structure (Upload Images)</label>
                <input
                  type="file"
                  className="w-[50%] border rounded p-2"
                  multiple
                  onChange={(e) => handleImageChange("part2q_additionalWorks", e.target.files)}
                />
                <div className="flex flex-wrap mt-2">
                  {formData.part2q_additionalWorks.map((img, index) => (
                    <div key={index} className="relative w-24 h-24 m-1">
                      <img src={img.url} alt="Uploaded" className="w-full h-full object-cover rounded" />
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
                        <th className="border p-2 text-left">Severity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Basic Defects */}
                      {[
                        { key: "defect_cracking", label: "Cracking" },
                        { key: "defect_settlement", label: "Settlement" },
                        { key: "defect_thermalCracking", label: "Thermal Cracking" },
                        { key: "defect_structural", label: "Structural" },
                        { key: "defect_crazing", label: "Crazing" },
                        { key: "defect_honeycombing", label: "Honeycombing" },
                        { key: "defect_wallCracks", label: "Cracking in Load-Bearing Walls/Infill Walls" },
                        { key: "defect_rccCracks", label: "Cracking in RCC Components" },
                      ].map((item) => {
                        const severityLevels = ["Insignificant", "Slight", "Moderate", "Severe", "Very Severe"];
                        const colors = ["bg-green-500", "bg-yellow-400", "bg-orange-500", "bg-purple-600", "bg-red-500"];

                        const valueIndex = severityLevels.indexOf(formData[item.key]) ?? 0;
                        const color = colors[valueIndex];

                        return (
                          <tr key={item.key} className="border-b hover:bg-gray-100 transition-all">
                            <td className="p-4 border">{item.label}</td>
                            <td className="p-4 border">
                              <div className="flex items-center gap-4">
                                {/* Progress Bar Slider */}
                                <div className="relative w-full">
                                  <input
                                    type="range"
                                    min="0"
                                    max="4"
                                    step="1"
                                    value={valueIndex}
                                    onChange={(e) =>
                                      setFormData((prev) => ({
                                        ...prev,
                                        [item.key]: severityLevels[e.target.value]
                                      }))
                                    }
                                    className="w-full appearance-none bg-transparent cursor-pointer z-10 relative"
                                    style={{
                                      outline: "none",
                                      WebkitAppearance: "none",
                                    }}
                                  />
                                  {/* Colored Track */}
                                  <div
                                    className={`absolute top-1/2 left-0 h-2 w-full -translate-y-1/2 rounded-full transition-all duration-300 ${color}`}
                                    style={{
                                      width: `${(valueIndex / 4) * 100}%`,
                                    }}
                                  ></div>
                                </div>

                                {/* Display Selected Value */}
                                <span
                                  className={`text-sm font-medium text-white px-3 py-1 rounded transition-all duration-300 ${color}`}
                                >
                                  {severityLevels[valueIndex]}
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}

                      {/* Water Seepage Section */}
                      <tr>
                        <td colSpan={2} className="border p-2 font-semibold text-gray-700 bg-gray-50">
                          (Attach separate sheets for crack details, if required)
                        </td>
                      </tr>
                      {[
                        { key: "defect_waterSeepage", label: "Water Seepage" },
                        { key: "defect_popOuts", label: "Pop-outs" },
                        { key: "defect_spalling", label: "Spalling" },
                        { key: "defect_rustStaining", label: "Rust Staining" },
                      ].map((item) => {
                        const severityLevels = ["Insignificant", "Slight", "Moderate", "Severe", "Very Severe"];
                        const colors = ["bg-green-500", "bg-yellow-400", "bg-orange-500", "bg-purple-600", "bg-red-500"];

                        const valueIndex = severityLevels.indexOf(formData[item.key]) ?? 0;
                        const color = colors[valueIndex];

                        return (
                          <tr key={item.key} className="border-b hover:bg-gray-100 transition-all">
                            <td className="p-4 border">{item.label}</td>
                            <td className="p-4 border">
                              <div className="flex items-center gap-4">
                                {/* Progress Bar Slider */}
                                <div className="relative w-full">
                                  <input
                                    type="range"
                                    min="0"
                                    max="4"
                                    step="1"
                                    value={valueIndex}
                                    onChange={(e) =>
                                      setFormData((prev) => ({
                                        ...prev,
                                        [item.key]: severityLevels[e.target.value],
                                      }))
                                    }
                                    className="w-full appearance-none bg-transparent cursor-pointer z-10 relative"
                                    style={{
                                      outline: "none",
                                      WebkitAppearance: "none",
                                    }}
                                  />
                                  {/* Colored Track */}
                                  <div
                                    className={`absolute top-1/2 left-0 h-2 w-full -translate-y-1/2 rounded-full transition-all duration-300 ${color}`}
                                    style={{
                                      width: `${(valueIndex / 4) * 100}%`,
                                    }}
                                  ></div>
                                </div>

                                {/* Display Selected Value */}
                                <span
                                  className={`text-sm font-medium text-white px-3 py-1 rounded transition-all duration-300 ${color}`}
                                >
                                  {severityLevels[valueIndex]}
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}


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
                        // { key: "defect_deflectionBeamsSlabsFloors", label: "(d) Deflection in beams/slabs/floors (Attach separate sheets for details preferably with photographs)" },
                      ].map((item) => {
                        const severityLevels = ["Insignificant", "Slight", "Moderate", "Severe", "Very Severe"];
                        const colors = ["bg-green-500", "bg-yellow-400", "bg-orange-500", "bg-purple-600", "bg-red-500"];

                        const valueIndex = severityLevels.indexOf(formData[item.key]) ?? 0;
                        const color = colors[valueIndex];

                        return (
                          <tr key={item.key} className="border-b hover:bg-gray-100 transition-all">
                            <td className="p-4 border">{item.label}</td>
                            <td className="p-4 border">
                              <div className="flex items-center gap-4">
                                {/* Progress Bar Slider */}
                                <div className="relative w-full">
                                  <input
                                    type="range"
                                    min="0"
                                    max="4"
                                    step="1"
                                    value={valueIndex}
                                    onChange={(e) =>
                                      setFormData((prev) => ({
                                        ...prev,
                                        [item.key]: severityLevels[e.target.value],
                                      }))
                                    }
                                    className="w-full appearance-none bg-transparent cursor-pointer z-10 relative"
                                    style={{
                                      outline: "none",
                                      WebkitAppearance: "none",
                                    }}
                                  />
                                  {/* Colored Track */}
                                  <div
                                    className={`absolute top-1/2 left-0 h-2 w-full -translate-y-1/2 rounded-full transition-all duration-300 ${color}`}
                                    style={{
                                      width: `${(valueIndex / 4) * 100}%`,
                                    }}
                                  ></div>
                                </div>

                                {/* Display Selected Value */}
                                <span
                                  className={`text-sm font-medium text-white px-3 py-1 rounded transition-all duration-300 ${color}`}
                                >
                                  {severityLevels[valueIndex]}
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}

                      <div className="mb-3 p-2">
                        <label className="block mb-1">(d) Deflection in beams/slabs/floors (Upload Images)</label>
                        <input
                          type="file"
                          className="w-[50%] border rounded p-2"
                          multiple
                          accept="image/*"
                          onChange={(e) => handleImageChange("defect_deflectionBeamsSlabsFloors", e.target.files)}
                        />

                        {/* Display Uploaded Images */}
                        <div className="flex flex-wrap mt-2">
                          {formData.defect_deflectionBeamsSlabsFloors.map((img, index) => (
                            <div key={index} className="relative w-24 h-24 m-1">
                              <img src={img.url} alt="Uploaded" className="w-full h-full object-cover rounded" />
                              <button
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2"
                                onClick={() => removeImage("defect_deflectionBeamsSlabsFloors", index)}
                              >
                                X
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>


                      {/* State of Existing Repairs Section */}
                      <tr>
                        <td colSpan={2} className="border p-2 font-semibold text-gray-700 bg-gray-50">
                          State of the existing repairs (if any carried out in structure)
                        </td>
                      </tr>
                      {[
                        { key: "defect_delaminationDebonding", label: "(a) Delamination/debonding" },
                        { key: "defect_crackingOthers", label: "(b) Cracking Others (specify)" },
                      ].map((item) => {
                        const severityLevels = ["Insignificant", "Slight", "Moderate", "Severe", "Very Severe"];
                        const colors = ["bg-green-500", "bg-yellow-400", "bg-orange-500", "bg-purple-600", "bg-red-500"];

                        const valueIndex = severityLevels.indexOf(formData[item.key]) ?? 0;
                        const color = colors[valueIndex];

                        return (
                          <tr key={item.key} className="border-b hover:bg-gray-100 transition-all">
                            <td className="p-4 border">{item.label}</td>
                            <td className="p-4 border">
                              <div className="flex items-center gap-4">
                                {/* Progress Bar Slider */}
                                <div className="relative w-full">
                                  <input
                                    type="range"
                                    min="0"
                                    max="4"
                                    step="1"
                                    value={valueIndex}
                                    onChange={(e) =>
                                      setFormData((prev) => ({
                                        ...prev,
                                        [item.key]: severityLevels[e.target.value],
                                      }))
                                    }
                                    className="w-full appearance-none bg-transparent cursor-pointer z-10 relative"
                                    style={{
                                      outline: "none",
                                      WebkitAppearance: "none",
                                    }}
                                  />
                                  {/* Colored Track */}
                                  <div
                                    className={`absolute top-1/2 left-0 h-2 w-full -translate-y-1/2 rounded-full transition-all duration-300 ${color}`}
                                    style={{
                                      width: `${(valueIndex / 4) * 100}%`,
                                    }}
                                  ></div>
                                </div>

                                {/* Display Selected Value */}
                                <span
                                  className={`text-sm font-medium text-white px-3 py-1 rounded transition-all duration-300 ${color}`}
                                >
                                  {severityLevels[valueIndex]}
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
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
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Submit</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}