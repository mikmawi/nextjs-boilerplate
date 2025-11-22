"use client";
import React, { useState } from 'react';
import { X, Calendar, Fish, Droplets, MapPin, Users, Calculator, AlertCircle, CheckCircle, Info, Plus, Minus } from 'lucide-react';

// --- 1. DEFINICIÓN DE INTERFACES TS ---

// Interfaz para los estanques disponibles
interface Pond {
  id: string;
  name: string;
  capacity: number;
  status: 'available' | 'occupied' | 'maintenance';
  area: string;
}

// Interfaz para el personal
interface StaffMember {
  id: number;
  name: string;
  role: 'Supervisor' | 'Técnico Acuícola' | 'Operario';
  available: boolean;
}

// Interfaz para el estado principal 'formData'
interface FormDataState {
  // Información básica
  cycleName: string;
  species: string;
  variety: string;
  startDate: string;
  estimatedDuration: string;
  
  // Estanques y capacidad
  selectedPonds: string[]; // <-- TIPO: Array de strings (IDs de estanques)
  totalCapacity: number;   // <-- TIPO: Number
  plannedDensity: string;
  
  // Siembra
  seedlingSource: string;
  seedlingAge: string;
  initialQuantity: string;
  initialWeight: string;
  initialLength: string;
  
  // Parámetros objetivo
  targetWeight: string;
  targetLength: string;
  expectedMortality: string;
  feedConversionRatio: string;
  
  // Alimentación
  feedType: string;
  feedingFrequency: string;
  initialFeedRate: string;
  
  // Calidad del agua - rangos objetivo
  tempMin: string;
  tempMax: string;
  phMin: string;
  phMax: string;
  oxygenMin: string;
  
  // Personal asignado
  assignedStaff: number[]; // <-- TIPO: Array de numbers (IDs de personal)
  supervisor: string;      // <-- TIPO: String (ID del supervisor, asumimos string por comodidad)
  
  // Presupuesto
  seedlingCost: string;
  feedBudget: string;
  laborCost: string;
  otherCosts: string;
  
  notes: string;
}
// --- FIN INTERFACES ---

const NewCycleModal = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormDataState>({ // <- Estado inicial tipado
    // Información básica
    cycleName: '',
    species: '',
    variety: '',
    startDate: new Date().toISOString().split('T')[0],
    estimatedDuration: '',
    
    // Estanques y capacidad
    selectedPonds: [],
    totalCapacity: 0,
    plannedDensity: '',
    
    // Siembra
    seedlingSource: '',
    seedlingAge: '',
    initialQuantity: '',
    initialWeight: '',
    initialLength: '',
    
    // Parámetros objetivo
    targetWeight: '',
    targetLength: '',
    expectedMortality: '5',
    feedConversionRatio: '1.5',
    
    // Alimentación
    feedType: '',
    feedingFrequency: '3',
    initialFeedRate: '3',
    
    // Calidad del agua - rangos objetivo
    tempMin: '22',
    tempMax: '28',
    phMin: '6.5',
    phMax: '8.5',
    oxygenMin: '5',
    
    // Personal asignado
    assignedStaff: [],
    supervisor: '',
    
    // Presupuesto
    seedlingCost: '',
    feedBudget: '',
    laborCost: '',
    otherCosts: '',
    
    notes: ''
  });

  const [availablePonds] = useState<Pond[]>([ // <- Array tipado
    { id: 'A1', name: 'Estanque A1', capacity: 1000, status: 'available', area: '500m²' },
    { id: 'A2', name: 'Estanque A2', capacity: 800, status: 'available', area: '400m²' },
    { id: 'B1', name: 'Estanque B1', capacity: 1200, status: 'occupied', area: '600m²' },
    { id: 'B2', name: 'Estanque B2', capacity: 900, status: 'maintenance', area: '450m²' },
    { id: 'C1', name: 'Estanque C1', capacity: 1500, status: 'available', area: '750m²' }
  ]);

  const [staff] = useState<StaffMember[]>([ // <- Array tipado
    { id: 1, name: 'Carlos Mendoza', role: 'Supervisor', available: true },
    { id: 2, name: 'María González', role: 'Técnico Acuícola', available: true },
    { id: 3, name: 'José Rivera', role: 'Operario', available: true },
    { id: 4, name: 'Ana López', role: 'Técnico Acuícola', available: false },
    { id: 5, name: 'Pedro Morales', role: 'Operario', available: true }
  ]);

  const species = [
    { value: 'tilapia', label: 'Tilapia', varieties: ['Nilótica', 'Roja', 'Aurea'] },
    { value: 'trucha', label: 'Trucha', varieties: ['Arcoíris', 'Marrón', 'Brook'] },
    { value: 'salmon', label: 'Salmón', varieties: ['Atlántico', 'Coho', 'Chinook'] },
    { value: 'bagre', label: 'Bagre', varieties: ['Canal', 'Azul', 'Flathead'] }
  ];

  // --- FUNCIÓN 1: handleInputChange ---
  const handleInputChange = (field: keyof FormDataState, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Calcular capacidad total cuando se seleccionan estanques
      if (field === 'selectedPonds') {
        // Aseguramos que 'value' es un array de strings para usar 'reduce'
        const pondIds = value as string[]; 
        
        const totalCap = pondIds.reduce((sum, pondId) => {
          const pond = availablePonds.find(p => p.id === pondId);
          return sum + (pond ? pond.capacity : 0);
        }, 0);
        
        // La actualización de 'totalCapacity' necesita ser tipada dentro de la función de estado
        return { ...updated, totalCapacity: totalCap } as FormDataState;
      }
      
      return updated;
    });
  };

  // --- FUNCIÓN 2: togglePondSelection ---
  const togglePondSelection = (pondId: string) => {
    // Aquí 'formData.selectedPonds' es un string[] (tipado en la interfaz)
    const currentPonds = formData.selectedPonds;
    
    // Ahora 'pondId' (string) se usa correctamente con 'currentPonds' (string[])
    const newPonds = currentPonds.includes(pondId)
      ? currentPonds.filter(id => id !== pondId)
      : [...currentPonds, pondId];
    
    handleInputChange('selectedPonds', newPonds);
  };

  // --- FUNCIÓN 3: toggleStaffAssignment ---
  const toggleStaffAssignment = (staffId: number) => {
    // Aquí 'formData.assignedStaff' es un number[] (tipado en la interfaz)
    const currentStaff = formData.assignedStaff;
    
    // Ahora 'staffId' (number) se usa correctamente con 'currentStaff' (number[])
    const newStaff = currentStaff.includes(staffId)
      ? currentStaff.filter(id => id !== staffId)
      : [...currentStaff, staffId];
    
    handleInputChange('assignedStaff', newStaff);
  };

  const calculateEstimatedProduction = () => {
    // CORRECCIÓN: Usamos || '0' para asegurar que parseFloat reciba un string
    const quantity = parseFloat(formData.initialQuantity || '0') || 0; 
    const targetWeight = parseFloat(formData.targetWeight || '0') || 0;
    const mortality = parseFloat(formData.expectedMortality || '0') || 0;
    
    const survivingFish = quantity * (1 - mortality / 100);
    const totalProduction = (survivingFish * targetWeight) / 1000; // en kg
    
    // Asumiendo que la capacidad total es proporcional a los metros cuadrados (50% de la capacidad)
    const totalAreaM2 = availablePonds
      .filter(p => formData.selectedPonds.includes(p.id))
      .reduce((sum, pond) => sum + parseFloat(pond.area.replace('m²', '')), 0);
      
    return {
      survivingFish: Math.round(survivingFish),
      totalProduction: totalProduction.toFixed(1),
      densityPerM2: totalAreaM2 > 0 ? (survivingFish / totalAreaM2).toFixed(1) : 0
    };
  };

  const calculateTotalBudget = () => {
    // CORRECCIÓN: Usamos || '0' para asegurar que parseFloat reciba un string
    const seedling = parseFloat(formData.seedlingCost || '0') || 0; 
    const feed = parseFloat(formData.feedBudget || '0') || 0;
    const labor = parseFloat(formData.laborCost || '0') || 0;
    const other = parseFloat(formData.otherCosts || '0') || 0;
    
    return (seedling + feed + labor + other).toFixed(2);
  };

  const getStepValidation = (step: number): boolean => { // <- Función tipada
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
        // Validamos que haya al menos un supervisor asignado y un miembro de staff
        return !!formData.supervisor && formData.assignedStaff.length > 0;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Creando nuevo ciclo:', formData);
    // Usamos console.log o un modal personalizado en lugar de alert()
    // En un entorno real, aquí se enviaría la data a Firestore o a un API
    alert('Nuevo ciclo creado exitosamente'); // Se mantiene alert() para el ejemplo sencillo
    setIsOpen(false);
  };

  const steps = [
    { number: 1, title: 'Información Básica', icon: Info },
    { number: 2, title: 'Estanques', icon: MapPin },
    { number: 3, title: 'Siembra', icon: Fish },
    { number: 4, title: 'Parámetros', icon: Calculator },
    { number: 5, title: 'Personal y Costos', icon: Users },
    { number: 6, title: 'Resumen', icon: CheckCircle }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header del Modal */}
        <div className="bg-gradient-to-r from-teal-700 to-emerald-600 text-white p-6 relative">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute right-4 top-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold mb-2">Crear Nuevo Ciclo Productivo</h2>
          <p className="text-teal-100">Configure todos los parámetros para el nuevo ciclo de producción</p>
        </div>

        {/* Progress Bar */}
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
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      isCompleted
                        ? 'bg-emerald-500 text-white'
                        : isActive
                        ? isValid
                          ? 'bg-teal-600 text-white'
                          : 'bg-red-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className="text-xs mt-1 text-center max-w-20">{step.title}</span>
                </div>
              );
            })}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-teal-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Contenido del Modal */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]"> {/* Ajuste de altura dinámica */}
          {/* Step 1: Información Básica */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-teal-700 border-b pb-2 mb-4">Paso 1: Datos Generales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Ciclo *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={formData.cycleName}
                    onChange={(e) => handleInputChange('cycleName', e.target.value)}
                    placeholder="Ej: Ciclo Tilapia 2025-01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Inicio *
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Especie *
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={formData.species}
                    onChange={(e) => handleInputChange('species', e.target.value)}
                  >
                    <option value="">Seleccionar especie</option>
                    {species.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Variedad
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={formData.variety}
                    onChange={(e) => handleInputChange('variety', e.target.value)}
                    disabled={!formData.species}
                  >
                    <option value="">Seleccionar variedad</option>
                    {formData.species && species.find(s => s.value === formData.species)?.varieties.map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duración Estimada (días)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={formData.estimatedDuration}
                    onChange={(e) => handleInputChange('estimatedDuration', e.target.value)}
                    placeholder="120"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Selección de Estanques */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-teal-700 border-b pb-2 mb-4">Paso 2: Estanques y Capacidad</h3>
              <div className="bg-teal-50 p-4 rounded-lg flex items-start gap-3">
                <MapPin className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-teal-800">Seleccionar Estanques *</h4>
                  <p className="text-teal-600 text-sm">Elija solo los estanques con estado 'Disponible' (verde).</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availablePonds.map(pond => {
                  const isSelected = formData.selectedPonds.includes(pond.id);
                  const isDisabled = pond.status !== 'available';
                  
                  return (
                    <div
                      key={pond.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        isDisabled
                          ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                          : isSelected
                          ? 'border-teal-500 bg-teal-50 shadow-md'
                          : 'border-gray-200 hover:border-teal-200'
                      }`}
                      onClick={() => !isDisabled && togglePondSelection(pond.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-800">{pond.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
                            pond.status === 'available' 
                              ? 'bg-green-100 text-green-700' 
                              : pond.status === 'occupied' 
                              ? 'bg-red-100 text-red-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {pond.status === 'available' ? 'Disponible' : pond.status === 'occupied' ? 'Ocupado' : 'Mantenimiento'}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p><span className="font-medium">Capacidad Máx:</span> {pond.capacity.toLocaleString()} peces</p>
                        <p><span className="font-medium">Área:</span> {pond.area}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {formData.selectedPonds.length > 0 && (
                <div className="bg-emerald-50 p-4 rounded-lg border-l-4 border-emerald-500">
                  <h4 className="font-medium text-emerald-800 mb-1">Resumen de Selección</h4>
                  <p className="text-emerald-600 text-sm">
                    Estanques: <span className="font-semibold">{formData.selectedPonds.length}</span> | 
                    Capacidad Total: <span className="font-semibold">{formData.totalCapacity.toLocaleString()}</span> peces
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Parámetros de Siembra */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-teal-700 border-b pb-2 mb-4">Paso 3: Siembra y Alevines</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proveedor de Alevines *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={formData.seedlingSource}
                    onChange={(e) => handleInputChange('seedlingSource', e.target.value)}
                    placeholder="Nombre del proveedor"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cantidad Inicial (Unidades) *
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={formData.initialQuantity}
                    onChange={(e) => handleInputChange('initialQuantity', e.target.value)}
                    placeholder="10000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Edad de Alevines (días)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={formData.seedlingAge}
                    onChange={(e) => handleInputChange('seedlingAge', e.target.value)}
                    placeholder="30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Peso Inicial Promedio (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={formData.initialWeight}
                    onChange={(e) => handleInputChange('initialWeight', e.target.value)}
                    placeholder="5.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitud Inicial Promedio (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={formData.initialLength}
                    onChange={(e) => handleInputChange('initialLength', e.target.value)}
                    placeholder="3.5"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Densidad Planificada (peces/m²)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={formData.plannedDensity}
                    onChange={(e) => handleInputChange('plannedDensity', e.target.value)}
                    placeholder="10"
                  />
                </div>
              </div>
              
              {formData.initialQuantity && formData.totalCapacity > 0 && (
                <div className="bg-yellow-50 p-4 rounded-lg flex items-start gap-3 border-l-4 border-yellow-500">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Verificación de Capacidad</h4>
                    <p className="text-yellow-700 text-sm mt-1">
                      Cantidad a sembrar: <span className="font-semibold">{parseFloat(formData.initialQuantity || '0').toLocaleString()}</span> peces. Capacidad Máx. de Estanques: <span className="font-semibold">{formData.totalCapacity.toLocaleString()}</span> peces.
                      {parseFloat(formData.initialQuantity || '0') > formData.totalCapacity && (
                        <span className="text-red-600 font-medium block mt-1">
                          ⚠️ La cantidad excede la capacidad recomendada de los estanques seleccionados.
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Parámetros de Producción */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-teal-700 border-b pb-2 mb-4">Paso 4: Objetivos y Calidad del Agua</h3>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2"><Calculator className="w-4 h-4 text-gray-600" /> Objetivos de Cosecha y Eficiencia</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Peso Objetivo (g) *
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      value={formData.targetWeight}
                      onChange={(e) => handleInputChange('targetWeight', e.target.value)}
                      placeholder="250"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mortalidad Esperada (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      value={formData.expectedMortality}
                      onChange={(e) => handleInputChange('expectedMortality', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      FCA Objetivo (FCR)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      value={formData.feedConversionRatio}
                      onChange={(e) => handleInputChange('feedConversionRatio', e.target.value)}
                      placeholder="1.5"
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2"><Fish className="w-4 h-4 text-gray-600" /> Alimentación Inicial</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Alimento *
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      value={formData.feedType}
                      onChange={(e) => handleInputChange('feedType', e.target.value)}
                    >
                      <option value="">Seleccionar alimento</option>
                      <option value="starter">Iniciador</option>
                      <option value="growth">Crecimiento</option>
                      <option value="finishing">Engorde</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frecuencia Diaria
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      value={formData.feedingFrequency}
                      onChange={(e) => handleInputChange('feedingFrequency', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tasa Alimenticia Inicial (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      value={formData.initialFeedRate}
                      onChange={(e) => handleInputChange('initialFeedRate', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2"><Droplets className="w-4 h-4 text-gray-600" /> Rangos de Calidad del Agua</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Temp. Mín (°C)</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      value={formData.tempMin}
                      onChange={(e) => handleInputChange('tempMin', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Temp. Máx (°C)</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      value={formData.tempMax}
                      onChange={(e) => handleInputChange('tempMax', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">pH Mín</label>
                    <input
                      type="number"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      value={formData.phMin}
                      onChange={(e) => handleInputChange('phMin', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">pH Máx</label>
                    <input
                      type="number"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      value={formData.phMax}
                      onChange={(e) => handleInputChange('phMax', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">O₂ Mín (mg/L)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      value={formData.oxygenMin}
                      onChange={(e) => handleInputChange('oxygenMin', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Proyección de producción */}
              {formData.initialQuantity && formData.targetWeight && (
                <div className="bg-emerald-50 p-4 rounded-lg border-l-4 border-emerald-500">
                  <h4 className="font-medium text-emerald-800 mb-3">Proyección de Producción</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-white p-3 rounded shadow-sm">
                      <div className="text-2xl font-bold text-emerald-600">{calculateEstimatedProduction().survivingFish.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Peces Supervivientes</div>
                    </div>
                    <div className="bg-white p-3 rounded shadow-sm">
                      <div className="text-2xl font-bold text-teal-600">{calculateEstimatedProduction().totalProduction} kg</div>
                      <div className="text-sm text-gray-600">Producción Estimada</div>
                    </div>
                    <div className="bg-white p-3 rounded shadow-sm">
                      <div className="text-2xl font-bold text-cyan-600">{calculateEstimatedProduction().densityPerM2}</div>
                      <div className="text-sm text-gray-600">Peces/m² (al final)</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Asignación de Personal y Presupuesto */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-teal-700 border-b pb-2 mb-4">Paso 5: Equipo y Finanzas</h3>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2"><Users className="w-4 h-4 text-gray-600" /> Asignación de Personal *</h4>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Supervisor Principal
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {staff.filter(s => s.role === 'Supervisor').map(person => (
                      <div
                        key={person.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          formData.supervisor === person.id.toString()
                            ? 'border-teal-500 bg-teal-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${!person.available ? 'opacity-60 cursor-not-allowed' : ''}`}
                        onClick={() => person.available && handleInputChange('supervisor', person.id.toString())}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-800">{person.name}</h4>
                            <p className="text-sm text-gray-600">{person.role}</p>
                          </div>
                          <div className={`w-3 h-3 rounded-full ${person.available ? 'bg-green-500' : 'bg-red-500'}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Equipo de Trabajo (Técnicos/Operarios)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {staff.filter(s => s.role !== 'Supervisor').map(person => {
                      const isSelected = formData.assignedStaff.includes(person.id);
                      const isDisabled = !person.available;
                      
                      return (
                        <div
                          key={person.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            isDisabled
                              ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                              : isSelected
                              ? 'border-teal-500 bg-teal-50 shadow-md'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => !isDisabled && toggleStaffAssignment(person.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-800">{person.name}</h4>
                              <p className="text-sm text-gray-600">{person.role}</p>
                            </div>
                            <div className={`w-3 h-3 rounded-full ${person.available ? 'bg-green-500' : 'bg-red-500'}`} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2"><Plus className="w-4 h-4 text-gray-600" /> Presupuesto Estimado</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Costo Alevines ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      value={formData.seedlingCost}
                      onChange={(e) => handleInputChange('seedlingCost', e.target.value)}
                      placeholder="5000.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Presupuesto Alimento ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      value={formData.feedBudget}
                      onChange={(e) => handleInputChange('feedBudget', e.target.value)}
                      placeholder="15000.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Costo Mano de Obra ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      value={formData.laborCost}
                      onChange={(e) => handleInputChange('laborCost', e.target.value)}
                      placeholder="8000.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Otros Costos ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      value={formData.otherCosts}
                      onChange={(e) => handleInputChange('otherCosts', e.target.value)}
                      placeholder="2000.00"
                    />
                  </div>
                </div>
                
                {(formData.seedlingCost || formData.feedBudget || formData.laborCost || formData.otherCosts) && (
                  <div className="mt-4 p-3 bg-teal-100 rounded-lg border-l-4 border-teal-500">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-teal-800">${calculateTotalBudget()}</div>
                      <div className="text-teal-600 text-sm">Presupuesto Total Estimado</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 6: Resumen Final */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-teal-700 border-b pb-2 mb-4">Paso 6: Revisión y Confirmación</h3>
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-lg shadow-inner">
                <h4 className="text-xl font-bold text-gray-800 mb-5 text-center">Resumen Final del Ciclo</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Bloque 1: General y Estanques */}
                  <div className="bg-white p-4 rounded-lg shadow-sm border-t-4 border-teal-500">
                    <h5 className="font-semibold text-teal-700 mb-3 flex items-center gap-2"><Info className="w-4 h-4" /> Datos del Ciclo</h5>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Nombre:</span> {formData.cycleName}</div>
                      <div><span className="font-medium">Especie:</span> {species.find(s => s.value === formData.species)?.label} {formData.variety && `- ${formData.variety}`}</div>
                      <div><span className="font-medium">Inicio:</span> {new Date(formData.startDate).toLocaleDateString()}</div>
                      <div><span className="font-medium">Estanques:</span> {formData.selectedPonds.length} ({formData.totalCapacity.toLocaleString()} Capacidad)</div>
                    </div>
                  </div>

                  {/* Bloque 2: Siembra y Objetivos */}
                  <div className="bg-white p-4 rounded-lg shadow-sm border-t-4 border-emerald-500">
                    <h5 className="font-semibold text-emerald-700 mb-3 flex items-center gap-2"><Fish className="w-4 h-4" /> Siembra y Metas</h5>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Cantidad Inicial:</span> {parseFloat(formData.initialQuantity || '0').toLocaleString()} peces</div>
                      <div><span className="font-medium">Proveedor:</span> {formData.seedlingSource}</div>
                      <div><span className="font-medium">Peso Objetivo:</span> {formData.targetWeight}g</div>
                      <div><span className="font-medium">Mortalidad Est.:</span> {formData.expectedMortality}%</div>
                    </div>
                  </div>

                  {/* Bloque 3: Proyección */}
                  {formData.initialQuantity && formData.targetWeight && (
                    <div className="md:col-span-2 bg-teal-600 text-white p-4 rounded-lg shadow-md">
                      <h5 className="font-semibold mb-3 text-center flex items-center justify-center gap-2">
                        <Calculator className="w-4 h-4" /> Proyección de Cosecha
                      </h5>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold">{calculateEstimatedProduction().survivingFish.toLocaleString()}</div>
                          <div className="text-sm opacity-90">Peces Finales</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">{calculateEstimatedProduction().totalProduction} kg</div>
                          <div className="text-sm opacity-90">Producción Estimada</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">${calculateTotalBudget()}</div>
                          <div className="text-sm opacity-90">Costo Total Est.</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bloque 4: Personal y Finanzas */}
                  <div className="bg-white p-4 rounded-lg shadow-sm border-t-4 border-amber-500">
                    <h5 className="font-semibold text-amber-700 mb-3 flex items-center gap-2"><Users className="w-4 h-4" /> Equipo y Costos</h5>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Supervisor:</span> {staff.find(s => s.id.toString() === formData.supervisor)?.name || 'N/A'}</div>
                      <div><span className="font-medium">Miembros del equipo:</span> {formData.assignedStaff.length}</div>
                      <div><span className="font-medium">Costo Alevines:</span> ${parseFloat(formData.seedlingCost || '0').toFixed(2)}</div>
                      <div><span className="font-medium">Costo Alimento:</span> ${parseFloat(formData.feedBudget || '0').toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notas adicionales */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas y Observaciones
                </label>
                <textarea
                  // CORRECCIÓN APLICADA AQUÍ: Se cierra la comilla del className
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Observaciones especiales, condiciones particulares, recordatorios..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer con botones de navegación */}
        <div className="bg-gray-100 px-6 py-4 flex justify-between items-center border-t border-gray-200">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-1 ${
              currentStep === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }`}
          >
            <Minus className="w-4 h-4" />
            Anterior
          </button>

          <div className="flex gap-2">
            <span className="text-sm text-gray-600 self-center">Paso {currentStep} de 6</span>
            {currentStep < 6 ? (
              <button
                onClick={nextStep}
                disabled={!getStepValidation(currentStep)}
                className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                  getStepValidation(currentStep)
                    ? 'bg-teal-600 text-white hover:bg-teal-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Siguiente
                <Plus className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/50"
              >
                <CheckCircle className="w-4 h-4" />
                Crear Ciclo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCycleModal;
