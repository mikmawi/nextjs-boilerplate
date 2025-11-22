"use client";
import React, { useState } from "react";
import {
  X,
  Calendar,
  Fish,
  Droplets,
  MapPin,
  Users,
  Calculator,
  AlertCircle,
  CheckCircle,
  Info,
  Plus,
  Minus,
} from "lucide-react";

const NewCycleModal = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Información básica
    cycleName: "",
    species: "",
    variety: "",
    startDate: new Date().toISOString().split("T")[0],
    estimatedDuration: "",

    // Estanques y capacidad
    selectedPonds: [],
    totalCapacity: 0,
    plannedDensity: "",

    // Siembra
    seedlingSource: "",
    seedlingAge: "",
    initialQuantity: "",
    initialWeight: "",
    initialLength: "",

    // Parámetros objetivo
    targetWeight: "",
    targetLength: "",
    expectedMortality: "5",
    feedConversionRatio: "1.5",

    // Alimentación
    feedType: "",
    feedingFrequency: "3",
    initialFeedRate: "3",

    // Calidad del agua
    tempMin: "22",
    tempMax: "28",
    phMin: "6.5",
    phMax: "8.5",
    oxygenMin: "5",

    // Personal
    assignedStaff: [],
    supervisor: "",

    // Presupuesto
    seedlingCost: "",
    feedBudget: "",
    laborCost: "",
    otherCosts: "",

    notes: "",
  });

  const [availablePonds] = useState([
    { id: "A1", name: "Estanque A1", capacity: 1000, status: "available", area: "500m²" },
    { id: "A2", name: "Estanque A2", capacity: 800, status: "available", area: "400m²" },
    { id: "B1", name: "Estanque B1", capacity: 1200, status: "occupied", area: "600m²" },
    { id: "B2", name: "Estanque B2", capacity: 900, status: "maintenance", area: "450m²" },
    { id: "C1", name: "Estanque C1", capacity: 1500, status: "available", area: "750m²" },
  ]);

  const [staff] = useState([
    { id: 1, name: "Carlos Mendoza", role: "Supervisor", available: true },
    { id: 2, name: "María González", role: "Técnico Acuícola", available: true },
    { id: 3, name: "José Rivera", role: "Operario", available: true },
    { id: 4, name: "Ana López", role: "Técnico Acuícola", available: false },
    { id: 5, name: "Pedro Morales", role: "Operario", available: true },
  ]);

  const species = [
    { value: "tilapia", label: "Tilapia", varieties: ["Nilótica", "Roja", "Aurea"] },
    { value: "trucha", label: "Trucha", varieties: ["Arcoíris", "Marrón", "Brook"] },
    { value: "salmon", label: "Salmón", varieties: ["Atlántico", "Coho", "Chinook"] },
    { value: "bagre", label: "Bagre", varieties: ["Canal", "Azul", "Flathead"] },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      if (field === "selectedPonds") {
        const totalCap = value.reduce((sum, pondId) => {
          const pond = availablePonds.find((p) => p.id === pondId);
          return sum + (pond ? pond.capacity : 0);
        }, 0);
        updated.totalCapacity = totalCap;
      }

      return updated;
    });
  };

  const togglePondSelection = (pondId) => {
    const newPonds = formData.selectedPonds.includes(pondId)
      ? formData.selectedPonds.filter((id) => id !== pondId)
      : [...formData.selectedPonds, pondId];

    handleInputChange("selectedPonds", newPonds);
  };

  const toggleStaffAssignment = (staffId) => {
    const newStaff = formData.assignedStaff.includes(staffId)
      ? formData.assignedStaff.filter((id) => id !== staffId)
      : [...formData.assignedStaff, staffId];

    handleInputChange("assignedStaff", newStaff);
  };

  const calculateEstimatedProduction = () => {
    const quantity = parseInt(formData.initialQuantity) || 0;
    const targetWeight = parseFloat(formData.targetWeight) || 0;
    const mortality = parseFloat(formData.expectedMortality) || 0;

    const survivingFish = quantity * (1 - mortality / 100);
    const totalProduction = (survivingFish * targetWeight) / 1000;

    return {
      survivingFish: Math.round(survivingFish),
      totalProduction: totalProduction.toFixed(1),
      densityPerM2:
        formData.totalCapacity > 0
          ? (survivingFish / (formData.totalCapacity / 100)).toFixed(1)
          : 0,
    };
  };

  const calculateTotalBudget = () => {
    const seedling = parseFloat(formData.seedlingCost) || 0;
    const feed = parseFloat(formData.feedBudget) || 0;
    const labor = parseFloat(formData.laborCost) || 0;
    const other = parseFloat(formData.otherCosts) || 0;

    return (seedling + feed + labor + other).toFixed(2);
  };

  const getStepValidation = (step) => {
    switch (step) {
      case 1:
        return formData.cycleName && formData.species && formData.startDate;
      case 2:
        return formData.selectedPonds.length > 0;
      case 3:
        return formData.initialQuantity && formData.seedlingSource;
      case 4:
        return formData.targetWeight && formData.feedType;
      case 5:
        return formData.assignedStaff.length > 0;
      default:
        return true;
    }
  };

  const nextStep = () => currentStep < 6 && setCurrentStep(currentStep + 1);
  const prevStep = () => currentStep > 1 && setCurrentStep(currentStep - 1);

  const handleSubmit = () => {
    console.log("Creando nuevo ciclo:", formData);
    alert("Nuevo ciclo creado exitosamente");
    setIsOpen(false);
  };

  const steps = [
    { number: 1, title: "Información Básica", icon: Info },
    { number: 2, title: "Estanques", icon: MapPin },
    { number: 3, title: "Siembra", icon: Fish },
    { number: 4, title: "Parámetros", icon: Calculator },
    { number: 5, title: "Personal", icon: Users },
    { number: 6, title: "Resumen", icon: CheckCircle },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 relative">
          <button onClick={() => setIsOpen(false)} className="absolute right-4 top-4 p-2">
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold mb-2">Crear Nuevo Ciclo Productivo</h2>
          <p className="text-blue-100">Configure todos los parámetros para el ciclo</p>
        </div>

        {/* Progress */}
        <div className="bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = step.number === currentStep;
              const isCompleted = step.number < currentStep;
              const isValid = getStepValidation(step.number);

              return (
                <div key={step.number} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isActive
                        ? isValid
                          ? "bg-blue-600 text-white"
                          : "bg-red-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className="text-xs mt-1 text-center">{step.title}</span>
                </div>
              );
            })}
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6 overflow-y-auto max-h-96">

          {/* --- Steps 1,2,3,4 (NO CAMBIADOS) --- */}
          {/* Ya los tenías completos, no los repito por espacio */}


          {/* ---------------------------- */}
          {/* ⭐ STEP 5: ASIGNACIÓN DE PERSONAL (COMPLETO) */}
          {/* ---------------------------- */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Asignar Personal al Ciclo</h3>
                <p className="text-blue-600 text-sm">
                  Seleccione el equipo que será responsable del ciclo
                </p>
              </div>

              {/* Supervisor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Supervisor Principal *
                </label>

                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.supervisor}
                  onChange={(e) => handleInputChange("supervisor", e.target.value)}
                >
                  <option value="">Seleccionar supervisor</option>
                  {staff
                    .filter((s) => s.role === "Supervisor" && s.available)
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Equipo adicional */}
              <div>
                <h4 className="font-medium mb-3">Equipo Operativo</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {staff.map((person) => {
                    const isSelected = formData.assignedStaff.includes(person.id);
                    return (
                      <div
                        key={person.id}
                        onClick={() => person.available && toggleStaffAssignment(person.id)}
                        className={`border p-4 rounded-lg cursor-pointer ${
                          person.available
                            ? isSelected
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-300 hover:bg-gray-50"
                            : "bg-gray-100 opacity-60 cursor-not-allowed"
                        }`}
                      >
                        <div className="font-medium">{person.name}</div>
                        <div className="text-sm text-gray-600">{person.role}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------- */}
          {/* ⭐ STEP 6: RESUMEN FINAL (COMPLETO) */}
          {/* ---------------------------- */}
          {currentStep === 6 && (
            <div className="space-y-6">

              <h3 className="text-xl font-bold text-gray-800">Resumen del Ciclo</h3>

              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p><strong>Nombre:</strong> {formData.cycleName}</p>
                <p><strong>Especie:</strong> {formData.species}</p>
                <p><strong>Inicio:</strong> {formData.startDate}</p>
                <p>
                  <strong>Estanques:</strong>{" "}
                  {formData.selectedPonds.length > 0
                    ? formData.selectedPonds.join(", ")
                    : "Ninguno"}
                </p>
                <p>
                  <strong>Cantidad Inicial:</strong>{" "}
                  {formData.initialQuantity.toLocaleString()}
                </p>
                <p>
                  <strong>Producción Estimada:</strong>{" "}
                  {calculateEstimatedProduction().totalProduction} kg
                </p>
                <p>
                  <strong>Presupuesto Total:</strong> ${calculateTotalBudget()}
                </p>
              </div>

            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div className="p-4 bg-gray-100 flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-4 py-2 rounded-md ${
              currentStep === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-500 text-white"
            }`}
          >
            Atrás
          </button>

          {currentStep < 6 ? (
            <button
              onClick={nextStep}
              disabled={!getStepValidation(currentStep)}
              className={`px-4 py-2 rounded-md ${
                getStepValidation(currentStep)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Siguiente
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded-md bg-green-600 text-white"
            >
              Crear Ciclo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewCycleModal;
