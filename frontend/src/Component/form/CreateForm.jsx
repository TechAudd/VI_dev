import React, { useState } from "react";
import axios from "axios";

export default function CreateForm({ setIsVisible, setShowModal }) {
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
    defects: {
      Cracking: null,
      Settlement: null,
      'Thermal Cracking': null,
      Structural: null,
      Crazing: null,
      Honeycombing: null,
      'Cracking in load-bearing walls/ Infill walls': null,
      'Cracking in RCC components': null,
    },
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
      part3SurveySigns: formData,
    };

    try {
      const response = await axios.post("http://localhost:4100/api/form/createForm", payload);
      if (response.status === 200) {
        alert("Form submitted successfully!");
        setShowModal(false);
        setIsVisible(true);
      }
    } catch (err) {
      console.error(err);
      alert("Form submission failed.");
    }
  };

  const severityLevels = ['None', 'Insignificant', 'Slight', 'Moderate', 'Severe', 'Very Severe'];

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-lg p-6">
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
                      {[
                        "Cracking", "Settlement", "Thermal cracking", "Structural",
                        "Crazing", "Honeycombing", "Cracking in load-bearing walls/ Infill walls", "Cracking in RCC components"
                      ].map((defect) => (
                        <tr key={defect}>
                          <td className="border p-2">{defect}</td>
                          <td className="border p-2">
                            <select
                              value={formData.defects[defect] || ""}
                              onChange={(e) => handleDefectChange(defect, e.target.value)}
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

                      {[
                        {
                          title: "(Attach separate sheets for crack details, if required)",
                          items: ['Water seepage', 'Pop-outs', 'Spalling', 'Rust staining']
                        },
                        {
                          title: "(Extent of corrosion)",
                          items: [
                            "(a) Corrosion in longitudinal bars",
                            "(b) Corrosion in lateral ties/rings",
                            "(c) Debonding of surface due to corrosion",
                            "(d) Deflection in beams/slabs/floors (Attach separate sheets for details preferably with photographs) "
                          ]
                        },
                        {
                          title: "State of the existing repairs (if any carried out in structure)",
                          items: ["(a) Delamination/debonding", "(b) Cracking Others (specify)"]
                        }
                      ].map((section, i) => (
                        <React.Fragment key={i}>
                          <tr>
                            <td colSpan={2} className="border p-2 font-semibold text-gray-700 bg-gray-50">
                              {section.title}
                            </td>
                          </tr>
                          {section.items.map((item, idx) => (
                            <tr key={idx}>
                              <td className="border p-2">{item}</td>
                              <td className="border p-2">
                                <select
                                  value={formData.defects[item] || ""}
                                  onChange={(e) => handleDefectChange(item, e.target.value)}
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
                        </React.Fragment>
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
                        "No further action required",
                        "Repair/strengthening works necessary",
                        "Detailed assessment required",
                        "Barricade/non-use of unsafe areas",
                        "Reconstruction or any other reasons"
                      ].map((rec, index) => (
                        <tr key={index}>
                          <td className="border p-2">{rec}</td>
                          <td className="border p-2">
                            <input
                              type="text"
                              className="w-full border rounded p-1"
                              value={formData.recommendations?.[rec]?.remarks || ""}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  recommendations: {
                                    ...prev.recommendations,
                                    [rec]: {
                                      ...prev.recommendations?.[rec],
                                      remarks: e.target.value
                                    }
                                  }
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
