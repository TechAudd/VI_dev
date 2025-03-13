import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

export default function CreateForm({ setIsVisible, setShowModal }) {
  const navigator = useNavigate();
  const part1Questions = [
    "Name and address of the building, year of construction",
    "TYPE OF THE BUILDING - Load bearing/party load bearing and partly RCC/RCC frame",
    "Number of stories in each block of the building",
    "Description of the main usage of the building: Residential/education/office/hostel/workshop/hospital/any other specify",
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

  const [formData, setFormData] = useState({
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

  const handlePart1Change = (index, value) => {
    const updated = [...part1Data];
    updated[index] = value;
    setPart1Data(updated);
  };

  const handlePart2Change = (index, value) => {
    const updated = [...part2Data];
    updated[index] = value;
    setPart2Data(updated);
  };

  const handleDefectChange = (defectType, severityLevel) => {
    setFormData(prev => ({
      ...prev,
      defects: {
        ...prev.defects,
        [defectType]: severityLevel,
      },
    }));
  };

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

    const payload = {
      part1GeneralInformation: part1Data,
      part2StructuralSystem: part2Data,

      // flattening data here
      leaningOfBuilding: formData.leaningOfBuilding,
      settlement_floor: formData.settlements.floor,
      settlement_wall: formData.settlements.wall,
      settlement_foundation: formData.settlements.foundation,

      defect_cracking: formData?.defect_cracking,
      defect_settlement: formData?.defect_settlement,
      defect_thermalCracking: formData?.defect_thermalCracking,
      defect_structural: formData?.defect_structural,
      defect_crazing: formData?.defect_crazing,
      defect_honeycombing: formData?.defect_honeycombing,
      defect_wallCracks: formData?.defect_wallCracks,
      defect_rccCracks: formData?.defect_rccCracks,
      defect_thermalCracking: formData?.defect_thermalCracking,
      defect_waterSeepage: formData?.defect_waterSeepage,
      defect_popOuts: formData?.defect_popOuts,
      defect_spalling: formData?.defect_spalling,
      defect_rustStaining: formData?.defect_rustStaining,
      defect_corrosionLongitudinalBars: formData?.defect_corrosionLongitudinalBars,
      defect_corrosionLateralTies: formData?.defect_corrosionLateralTies,
      defect_debondingDueToCorrosion: formData?.defect_debondingDueToCorrosion,
      defect_deflectionBeamsSlabsFloors: formData?.defect_deflectionBeamsSlabsFloors,
      defect_delaminationDebonding: formData?.defect_delaminationDebonding,
      defect_crackingOthers: formData?.defect_crackingOthers,

      overallCondition: formData?.overallCondition,

      // Add other defect and recommendation fields as needed
      recommendation_noActionRequired: formData.recommendation_noActionRequired || null,
      recommendation_repairStrengthening: formData.recommendation_repairStrengthening || null,
      recommendation_detailedAssessmentRequired: formData.recommendation_detailedAssessmentRequired || null,
      recommendation_reconstruction: formData.recommendation_reconstruction || null,
      recommendation_barricadeNonUse: formData.recommendation_barricadeNonUse || null,
    };

    try {
      const response = await axios.post("http://localhost:4100/api/form/createForm", payload);
      if (response.status === 201) {
        toast.success(`Form Submitted Successfully!`);
        setShowModal(false);
        navigator("/createForm");
        setIsVisible(true);
      }
    } catch (err) {
      console.error(err);
      alert("Form submission failed.");
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <Toaster position="top-center" />
        <h2 className="text-xl font-bold text-center mb-4">Building Assessment Form</h2>

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
              <h2 className="text-xl font-bold text-center mb-4 uppercase">
                Condition Assessment of Residential Building
              </h2>
              <h3 className="text-lg font-semibold text-center mb-4">
                Visual Inspection Form
              </h3>
              <h3 className="text-lg font-semibold mb-2">PART 1 GENERAL INFORMATION OF THE BUILDING</h3>
              {part1Questions.map((q, i) => (
                <div key={i} className="mb-3">
                  <label className="block mb-1">{i + 1}. {q}</label>
                  <input
                    type="text"
                    className="w-full border rounded p-2"
                    value={part1Data[i]}
                    onChange={(e) => handlePart1Change(i, e.target.value)}
                    required
                  />
                </div>
              ))}
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">PART 2 STRUCTURAL SYSTEM OF THE BUILDING</h3>
              {part2Questions.map((q, i) => (
                <div key={i} className="mb-3">
                  <label className="block mb-1">{i + 1}. {q}</label>
                  <input
                    type="text"
                    className="w-full border rounded p-2"
                    value={part2Data[i]}
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
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
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
                        { key: "defect_thermalCracking", label: "Thermal cracking" },
                        { key: "defect_structural", label: "Structural" },
                        { key: "defect_crazing", label: "Crazing" },
                        { key: "defect_honeycombing", label: "Honeycombing" },
                        { key: "defect_wallCracks", label: "Cracking in load-bearing walls/ Infill walls" },
                        { key: "defect_rccCracks", label: "Cracking in RCC components" },
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
                <label className="block font-semibold text-gray-700 mb-2">5. Recommendations</label>
                <div className="overflow-auto border border-gray-300 rounded">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border p-2 text-left">Recommendation</th>
                        <th className="border p-2 text-left">Remarks (if any)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { key: "recommendation_noActionRequired", label: "No further action required" },
                        { key: "recommendation_repairStrengthening", label: "Repair/strengthening works necessary" },
                        { key: "recommendation_detailedAssessmentRequired", label: "Detailed assessment required" },
                        { key: "recommendation_barricadeNonUse", label: "Barricade/non-use of unsafe areas" },
                        { key: "recommendation_reconstruction", label: "Reconstruction or any other reasons" },
                      ].map((item, index) => (
                        <tr key={index}>
                          <td className="border p-2">{item.label}</td>
                          <td className="border p-2">
                            <input
                              type="text"
                              className="w-full border rounded p-1"
                              value={formData[item.key] || ""}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  [item.key]: e.target.value,
                                }))
                              }
                              placeholder="Enter remarks (optional)"
                            />
                          </td>
                        </tr>
                      ))}
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
