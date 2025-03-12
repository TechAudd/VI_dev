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

  const [part1Data, setPart1Data] = useState(Array(part1Questions.length).fill(""));
  const [part2Data, setPart2Data] = useState(Array(part2Questions.length).fill(""));

  const [formData, setFormData] = useState({
    leaningOfBuilding: null, // true or false
    settlements: {
      floor: null,
      wall: null,
      foundation: null,
    },
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

  const handleCheckboxChange = (section, key, value) => {
    if (section === "settlements") {
      setFormData((prev) => ({
        ...prev,
        settlements: {
          ...prev.settlements,
          [key]: value,
        },
      }));
    } else if (section === "defects") {
      setFormData((prev) => ({
        ...prev,
        defects: {
          ...prev.defects,
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  };

  const handleYesNoChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
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

  const handleDefectChange = (defectType, severityLevel) => {
    setFormData(prev => ({
      ...prev,
      defects: {
        ...prev.defects,
        [defectType]: severityLevel,
      },
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
      <div className="bg-white w-full max-w-full rounded-lg shadow-lg mx-auto p-4">
        <div className="flex gap-2 pb-2 items-start">
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
        </div>
        <form onSubmit={handleSubmit}>
          <div className="w-full mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-bold text-center mb-4 uppercase">
              Condition Assessment of Residential Building
            </h2>
            <h3 className="text-lg font-semibold text-center mb-4">
              Visual Inspection Form
            </h3>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2 w-1/10">S.No</th> {/* 10% */}
                  <th className="border border-gray-300 p-2 w-9/20">Description</th> {/* 45% */}
                  <th className="border border-gray-300 p-2 w-9/20">Details</th> {/* 45% */}
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-100 font-bold">
                  <td colSpan="3" className="border border-gray-300 p-2 text-center">
                    PART 1 GENERAL INFORMATION OF THE BUILDING
                  </td>
                </tr>
                {part1Questions.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2 text-center w-1/10">{index + 1}</td>
                    <td className="border border-gray-300 p-2 w-9/20">{item}</td>
                    <td className="border border-gray-300 p-2 w-9/20">
                      <input
                        type="text"
                        className="w-full border p-1 rounded"
                        value={part1Data[index]}
                        onChange={(e) => handlePart1Change(index, e.target.value)}
                        required
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <table className="w-full border-collapse border border-gray-300">
              <thead></thead>
              <tbody>
                <tr className="bg-gray-100 font-bold">
                  <td colSpan="3" className="border border-gray-300 p-2 text-center">
                    PART 2 STRUCTURAL SYSTEM OF THE BUILDING
                  </td>
                </tr>
                {part2Questions.map((item, index) => (
                  <tr key={`part2-${index}`}>
                    <td className="border border-gray-300 p-2 text-center w-1/10">{index + 1}</td>
                    <td className="border border-gray-300 p-2 w-9/20">{item}</td>
                    <td className="border border-gray-300 p-2 w-9/20">
                      <input
                        type="text"
                        className="w-full border p-1 rounded"
                        value={part2Data[index]}
                        onChange={(e) => handlePart2Change(index, e.target.value)}
                        required
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2 w-1/10">S.No</th>
                  <th className="border border-gray-300 p-2 w-9/20">Description</th>
                  <th className="border border-gray-300 p-2 w-9/20">Details</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-100 font-bold">
                  <td colSpan="3" className="border border-gray-300 p-2 text-center">
                    PART 3 SURVEY OF SIGNS OF DISTRESS, DEFORMATION OR DETERIORATION IN BUILDING STRUCTURE (CONDITION ASSESSMENT)
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border border-gray-400 text-center w-1/10"></td>
                  <td className="p-2 border border-gray-400 w-9/20"></td>
                  <td className="p-2 border border-gray-400 w-9/20 text-center">
                    <div className="flex justify-center space-x-50">
                      <span>Yes</span>
                      <span>No</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border border-gray-400 text-center w-1/10">1</td>
                  <td className="p-2 border border-gray-400 w-9/20">LEANING OF BUILDING</td>
                  <td className="p-2 border border-gray-400 w-9/20 text-center">
                    <div className="flex justify-center space-x-50">
                      <input
                        type="checkbox"
                        checked={formData.leaningOfBuilding === true}
                        onChange={() => handleYesNoChange('leaningOfBuilding', true)}
                      />
                      <input
                        type="checkbox"
                        checked={formData.leaningOfBuilding === false}
                        onChange={() => handleYesNoChange('leaningOfBuilding', false)}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border border-gray-400 text-center w-1/10">2</td>
                  <td className="p-2 border border-gray-400 w-9/20">SETTLEMENTS</td>
                  <td className="p-2 border border-gray-400 w-9/20"></td>
                </tr>
                {[
                  { key: "floor", label: "(a) Floor" },
                  { key: "wall", label: "(b) Settlement of load-bearing wall" },
                  { key: "foundation", label: "(c) Settlement of RCC Foundation" },
                ].map(({ key, label }, index) => (
                  <tr key={key}>
                    <td className="border p-2"></td>
                    <td className="border p-2 pl-6">{label}</td>
                    <td className="border p-2 text-center">
                      <div className="flex justify-center space-x-50">
                        <input
                          type="checkbox"
                          checked={formData.settlements[key] === true}
                          onChange={() => handleNestedYesNoChange('settlements', key, true)}
                        />
                        <input
                          type="checkbox"
                          checked={formData.settlements[key] === false}
                          onChange={() => handleNestedYesNoChange('settlements', key, false)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="p-2 border border-gray-400 text-center w-1/10">3</td>
                  <td className="p-2 border border-gray-400 w-9/20">DEFECTS (Extent of defect)</td>
                  <td className="p-2 border border-gray-400 w-9/20 text-center font-bold">
                    <div className="flex justify-between">
                      {severityLevels.map(level => (
                        <span key={level} className="text-sm">{level}</span>
                      ))}
                    </div>
                  </td>
                </tr>
                {Object.keys(formData.defects).map((defect, index) => (
                  <tr key={index}>
                    <td className="border p-2 text-center">{index + 1}</td>
                    <td className="border p-2">{defect}</td>
                    <td className="border p-2 text-center">
                      <div className="flex justify-between">
                        {severityLevels.map((level, i) => (
                          <input
                            key={i}
                            type="checkbox"
                            checked={formData.defects[defect] === level}
                            onChange={() => handleDefectChange(defect, level)}
                          />
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <td className="p-2 border border-gray-400 text-center w-1/10"></td>
                  <td className="p-2 border border-gray-400 w-9/20">(Attach separate sheets for crack details, if required) </td>
                  <td className="p-2 border border-gray-400 w-9/20"></td>
                </tr>
              </thead>
              <tbody>
                {['Water seepage', 'Pop-outs', 'Spalling', 'Rust staining'].map((item, index) => (
                  <tr key={index}>
                    <td className="p-2 border border-gray-400 text-center w-1/10">{ }</td>
                    <td className="p-2 border border-gray-400 w-9/20">{item}</td>
                    <td className="p-2 border border-gray-400 w-9/20">
                      <div className="flex justify-between">
                        {[...Array(5)].map((_, i) => (
                          <input key={i} type="checkbox" className="mx-2" />
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <td className="p-2 border border-gray-400 text-center w-1/10"></td>
                  <td className="p-2 border border-gray-400 w-9/20">(Extent of corrosion) </td>
                  <td className="p-2 border border-gray-400 w-9/20"></td>
                </tr>
              </thead>
              <tbody>
                {['(a) Corrosion in longitudinal bars', '(b) Corrosion in lateral ties/rings', '(c) Debonding of surface due to corrosion', '(d) Deflection in beams/slabs/floors (Attach separate sheets for details preferably with photographs)',].map((item, index) => (
                  <tr key={index}>
                    <td className="p-2 border border-gray-400 text-center w-1/10">{ }</td>
                    <td className="p-2 border border-gray-400 w-9/20">{item}</td>
                    <td className="p-2 border border-gray-400 w-9/20">
                      <div className="flex justify-between">
                        {[...Array(5)].map((_, i) => (
                          <input key={i} type="checkbox" className="mx-2" />
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <thead>
                <tr>
                  <td className="p-2 border border-gray-400 text-center w-1/10"></td>
                  <td className="p-2 border border-gray-400 w-9/20">State of the existing repairs (if any carried out in structure)</td>
                  <td className="p-2 border border-gray-400 w-9/20"></td>
                </tr>
              </thead>
              <tbody>
                {['(a) Delamination/debonding', '(b) Cracking Others(specify)',].map((item, index) => (
                  <tr key={index}>
                    <td className="p-2 border border-gray-400 text-center w-1/10">{ }</td>
                    <td className="p-2 border border-gray-400 w-9/20">{item}</td>
                    <td className="p-2 border border-gray-400 w-9/20">
                      <div className="flex justify-between">
                        {[...Array(5)].map((_, i) => (
                          <input key={i} type="checkbox" className="mx-2" />
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <thead>

              </thead>
              <tbody>
                {['OVERALL STRUCTURAL CONDITION ASSESSMENT (Based on initial design and construction and present structural condition assessments)'].map((item, index) => (
                  <tr key={index}>
                    <td className="p-2 border border-gray-400 text-center w-1/10">{5}</td>
                    <td className="p-2 border border-gray-400 w-9/20">{item}</td>
                    <td className="p-2 border border-gray-400 w-[40%]">
                      <div className="flex flex-col gap-2">
                        {[
                          "Unsafe",
                          "Potentially hazardous",
                          "Severe",
                          "Moderate",
                          "Minor",
                          "Good condition",
                        ].map((label, index) => (
                          <label key={index} className="flex justify-between items-center">
                            <span className="text-sm">{label}</span>
                            <input type="checkbox" className="ml-2" />
                          </label>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <thead>

              </thead>
              <tbody>
                {['RECOMMENDATIONS', '(a) No further action required ', '(b) Repair/strengthening works necessary', '(c) Detailed assessment required', '(d) Barricade/non-use needed', '(e) Reconstruction or any other sons',].map((item, index) => (
                  <tr key={index}>
                    <td className="p-2 border border-gray-400 text-center w-1/10">{ }</td>
                    <td className="p-2 border border-gray-400 w-9/20">{item}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end p-2 gap-5">
            <button
              type="button"
              className="border border-gray-500 text-gray-500 px-3 py-1 rounded-lg"
              onClick={() => {
                setShowModal(false);
                setIsVisible(true);
              }}
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
        </form>
      </div>
    </div>
  );
}