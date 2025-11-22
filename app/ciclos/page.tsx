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

// =============================
// Types
// =============================
interface Pond {
  id: string;
  name: string;
  capacity: number;
  status: "available" | "occupied" | "maintenance";
  area: string;
}

interface StaffMember {
  id: number;
  name: string;
  role: string;
  available: boolean;
}

interface FormData {
  cycleName: string;
  species: string;
  variety: string;
  startDate: string;
  estimatedDuration: string;

  selectedPonds: string[];
  totalCapacity: number;
  plannedDensity: string;

  seedlingSource: string;
  seedlingAge: string;
  initialQuantity: string;
  initialWeight: string;
  initialLength: string;

  targetWeight: string;
  targetLength: string;
  expectedMortality: string;
  feedConversionRatio: string;

  feedType: string;
  feedingFrequency: string;
  initialFeedRate: string;

  tempMin: string;
  tempMax: string;
  phMin: string;
  phMax: string;
  oxygenMin: string;

  assignedStaff: number[];
  supervisor: string;

  seedlingCost: string;
  feedBudget: string;
  laborCost: string;
  otherCosts: string;

  notes: string;
}

// =============================
// Component
// =============================
export default function NewCycleModal() {
  const [isOpen, setIsOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState<FormData>({
    cycleName: "",
    species: "",
    variety: "",
    startDate: new Date().toISOString().split("T")[0],
    estimatedDuration: "",

    selectedPonds: [],
    totalCapacity: 0,
    plannedDensity: "",

    seedlingSource: "",
    seedlingAge: "",
    initialQuantity: "",
    initialWeight: "",
    initialLength: "",

    targetWeight: "",
    targetLength: "",
    expectedMortality: "5",
    feedConversionRatio: "1.5",

    feedType: "",
    feedingFrequency: "3",
    initialFeedRate: "3",

    tempMin: "22",
    tempMax: "28",
    phMin: "6.5",
    phMax: "8.5",
    oxygenMin: "5",

    assignedStaff: [],
    supervisor: "",

    seedlingCost: "",
    feedBudget: "",
    laborCost: "",
    otherCosts: "",

    notes: "",
  });

  const [availablePonds] = useState<Pond[]>([
    { id: "A1", name: "Estanque A1", capacity: 1000, status: "available", area: "500m²" },
    { id: "A2", name: "Estanque A2", capacity: 800, status: "available", area: "400m²" },
    { id: "B1", name: "Estanque B1", capacity: 1200, status: "occupied", area: "600m²" },
    { id: "B2", name: "Estanque B2", capacity: 900, status: "maintenance", area: "450m²" },
    { id: "C1", name: "Estanque C1", capacity: 1500, status: "available", area: "750m²" },
  ]);

  const [staff] = useState<StaffMember[]>([
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

  // Typed generic: K is a key of FormData, value is FormData[K]
  const handleInputChange = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => {
      const updated: FormData = { ...prev, [field]: value };

      // Cuando selectedPonds cambia, recalcular totalCapacity
      if (field === "selectedPonds") {
        // TS no siempre "narrowing" aquí, casteamos con confianza.
        const ponds = value as unknown as string[];
        const totalCap = ponds.reduce<number>((sum, pondId) => {
          const pond = availablePonds.find((p) => p.id === pondId);
          return sum + (pond ? pond.capacity : 0);
        }, 0);
        updated.totalCapacity = totalCap;
      }

      return updated;
    });
  };

  const togglePondSelection = (pondId: string) => {
    const current = formData.selectedPonds;
    const newPonds = current.includes(pondId) ? current.filter((id) => id !== pondId) : [...current, pondId];
    handleInputChange("selectedPonds", newPonds);
  };

  const toggleStaffAssignment = (staffId: number) => {
    const current = formData.assignedStaff;
    const newStaff = current.includes(staffId) ? current.filter((id) => id !== staffId) : [...current, staffId];
    handleInputChange("assignedStaff", newStaff);
  };

  const calculateEstimatedProduction = () => {
    const quantity = parseInt(formData.initialQuantity) || 0;
    const targetWeight = parseFloat(formData.targetWeight) || 0;
    const mortality = parseFloat(formData.expectedMortality) || 0;

    const survivingFish = quantity * (1 - mortality / 100);
    const totalProduction = (survivingFish * targetWeight) / 1000; // kg

    return {
      survivingFish: Math.round(survivingFish),
      totalProduction: totalProduction.toFixed(1),
      densityPerM2: formData.totalCapacity > 0 ? (survivingFish / (formData.totalCapacity / 100)).toFixed(1) : "0",
    };
  };

  const calculateTotalBudget = () => {
    const seedling = parseFloat(formData.seedlingCost) || 0;
    const feed = parseFloat(formData.feedBudget) || 0;
    const labor = parseFloat(formData.laborCost) || 0;
    const other = parseFloat(formData.otherCosts) || 0;
    return (seedling + feed + labor + other).toFixed(2);
  };

  const getStepValidation = (step: number) => {
    switch (step) {
      case 1:
        return !!formData.cycleName && !!formData.species && !!formData.startDate;
      case 2:
        return formData.selectedPonds.length > 0;
      case 3:
        return !!formData.initialQuantity && !!formData.seedlingSource;
      case 4:
        return !!formData.targetWeight && !!formData.feedType;
      case 5:
        return formData.assignedStaff.length > 0;
      default:
        return true;
    }
  };

  const nextStep = () => currentStep < 6 && setCurrentStep((s) => s + 1);
  const prevStep = () => currentStep > 1 && setCurrentStep((s) => s - 1);

  const handleSubmit = () => {
    console.log("Creando nuevo ciclo:", formData);
    alert("Nuevo ciclo creado exitosamente");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 relative">
          <button onClick={() => setIsOpen(false)} className="absolute right-4 top-4 p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold mb-2">Crear Nuevo Ciclo Productivo</h2>
          <p className="text-blue-100">Configure todos los parámetros para el nuevo ciclo de producción</p>
        </div>

        {/* Progress (simplificado para mantener claridad) */}
        <div className="bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            {[
              { number: 1, title: "Información Básica" },
              { number: 2, title: "Estanques" },
              { number: 3, title: "Siembra" },
              { number: 4, title: "Parámetros" },
              { number: 5, title: "Personal" },
              { number: 6, title: "Resumen" },
            ].map((step) => {
              const isActive = step.number === currentStep;
              const isCompleted = step.number < currentStep;
              const isValid = getStepValidation(step.number);
              return (
                <div key={step.number} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCompleted ? "bg-green-500 text-white" : isActive ? (isValid ? "bg-blue-600 text-white" : "bg-red-500 text-white") : "bg-gray-200 text-gray-600"}`}>
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : <span className="text-sm">{step.number}</span>}
                  </div>
                  <span className="text-xs mt-1 text-center">{step.title}</span>
                </div>
              );
            })}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${(currentStep / 6) * 100}%` }} />
          </div>
        </div>

        {/* Content (kept mostly original) */}
        <div className="p-6 overflow-y-auto max-h-96">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Ciclo *</label>
                  <input type="text" className="w-full px-3 py-2 border rounded-md" value={formData.cycleName} onChange={(e) => handleInputChange("cycleName", e.target.value)} placeholder="Ej: Ciclo Tilapia 2025-01" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Inicio *</label>
                  <input type="date" className="w-full px-3 py-2 border rounded-md" value={formData.startDate} onChange={(e) => handleInputChange("startDate", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Especie *</label>
                  <select className="w-full px-3 py-2 border rounded-md" value={formData.species} onChange={(e) => handleInputChange("species", e.target.value)}>
                    <option value="">Seleccionar especie</option>
                    {species.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Variedad</label>
                  <select className="w-full px-3 py-2 border rounded-md" value={formData.variety} onChange={(e) => handleInputChange("variety", e.target.value)} disabled={!formData.species}>
                    <option value="">Seleccionar variedad</option>
                    {formData.species && species.find(s => s.value === formData.species)?.varieties.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duración Estimada (días)</label>
                  <input type="number" className="w-full px-3 py-2 border rounded-md" value={formData.estimatedDuration} onChange={(e) => handleInputChange("estimatedDuration", e.target.value)} placeholder="120" />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Seleccionar Estanques</h3>
                <p className="text-blue-600 text-sm">Elija los estanques para este ciclo</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availablePonds.map((pond) => {
                  const isSelected = formData.selectedPonds.includes(pond.id);
                  const isDisabled = pond.status !== "available";
                  return (
                    <div key={pond.id} className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${isDisabled ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60" : isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`} onClick={() => !isDisabled && togglePondSelection(pond.id)}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{pond.name}</h4>
                        <div className={`w-3 h-3 rounded-full ${pond.status === "available" ? "bg-green-500" : pond.status === "occupied" ? "bg-red-500" : "bg-yellow-500"}`} />
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Capacidad: {pond.capacity.toLocaleString()} peces</p>
                        <p>Área: {pond.area}</p>
                        <p className="capitalize">Estado: {pond.status === "available" ? "Disponible" : pond.status === "occupied" ? "Ocupado" : "Mantenimiento"}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {formData.selectedPonds.length > 0 && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Resumen de Selección</h4>
                  <p className="text-green-600">Estanques seleccionados: {formData.selectedPonds.length} | Capacidad total: {formData.totalCapacity.toLocaleString()} peces</p>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Proveedor de Alevines *</label>
                  <input type="text" className="w-full px-3 py-2 border rounded-md" value={formData.seedlingSource} onChange={(e) => handleInputChange("seedlingSource", e.target.value)} placeholder="Nombre del proveedor" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Edad de Alevines (días)</label>
                  <input type="number" className="w-full px-3 py-2 border rounded-md" value={formData.seedlingAge} onChange={(e) => handleInputChange("seedlingAge", e.target.value)} placeholder="30" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad Inicial *</label>
                  <input type="number" className="w-full px-3 py-2 border rounded-md" value={formData.initialQuantity} onChange={(e) => handleInputChange("initialQuantity", e.target.value)} placeholder="1000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Peso Inicial (g)</label>
                  <input type="number" step="0.1" className="w-full px-3 py-2 border rounded-md" value={formData.initialWeight} onChange={(e) => handleInputChange("initialWeight", e.target.value)} placeholder="5.0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Longitud Inicial (cm)</label>
                  <input type="number" step="0.1" className="w-full px-3 py-2 border rounded-md" value={formData.initialLength} onChange={(e) => handleInputChange("initialLength", e.target.value)} placeholder="3.5" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Densidad Planificada (peces/m²)</label>
                  <input type="number" className="w-full px-3 py-2 border rounded-md" value={formData.plannedDensity} onChange={(e) => handleInputChange("plannedDensity", e.target.value)} placeholder="10" />
                </div>
              </div>

              {formData.initialQuantity && formData.totalCapacity > 0 && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Verificación de Capacidad</h4>
                      <p className="text-yellow-700 text-sm mt-1">
                        Planea sembrar {parseInt(formData.initialQuantity || "0").toLocaleString()} peces en una capacidad total de {formData.totalCapacity.toLocaleString()} peces.
                        {parseInt(formData.initialQuantity || "0") > formData.totalCapacity && (
                          <span className="text-red-600 font-medium block mt-1">⚠️ La cantidad excede la capacidad recomendada</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Steps 4,5,6 (omitidos aquí por brevedad en el ejemplo) */}
          {/* Mantén el mismo contenido que ya tenías para step 4,5 y 6 - los handlers ya están tipados arriba. */}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
          <button onClick={prevStep} disabled={currentStep === 1} className={`px-4 py-2 rounded-lg ${currentStep === 1 ? "bg-gray-200" : "bg-gray-300"}`}>Anterior</button>

          <div>
            {currentStep < 6 ? (
              <button onClick={nextStep} disabled={!getStepValidation(currentStep)} className={`px-6 py-2 rounded-lg ${getStepValidation(currentStep) ? "bg-blue-600 text-white" : "bg-gray-300"}`}>Siguiente</button>
            ) : (
              <button onClick={handleSubmit} className="px-6 py-2 bg-green-600 text-white rounded-lg">Crear Ciclo</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
