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

  // --- FUNCIÓN CORREGIDA 1: handleInputChange ---
  // Se mantiene el tipado de la versión anterior
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

  // --- FUNCIÓN CORREGIDA 2: togglePondSelection ---
  const togglePondSelection = (pondId: string) => {
    const currentPonds = formData.selectedPonds;
    
    const newPonds = currentPonds.includes(pondId)
      ? currentPonds.filter(id => id !== pondId)
      : [...currentPonds, pondId];
    
    handleInputChange('selectedPonds', newPonds);
  };

  // --- FUNCIÓN CORREGIDA 3: toggleStaffAssignment ---
  const toggleStaffAssignment = (staffId: number) => {
    const currentStaff = formData.assignedStaff;
    
    const newStaff = currentStaff.includes(staffId)
      ? currentStaff.filter(id => id !== staffId)
      : [...currentStaff, staffId];
    
    handleInputChange('assignedStaff', newStaff);
  };

  // --- FUNCIÓN CORREGIDA 4: calculateEstimatedProduction ---
  const calculateEstimatedProduction = () => {
    // CORRECCIÓN: Usamos || '0' para asegurar que parseFloat reciba un string
    const quantity = parseFloat(formData.initialQuantity || '0') || 0; 
    const targetWeight = parseFloat(formData.targetWeight || '0') || 0;
    const mortality = parseFloat(formData.expectedMortality || '0') || 0;
    
    const survivingFish = quantity * (1 - mortality / 100);
    const totalProduction = (survivingFish * targetWeight) / 1000; // en kg
    
    return {
      survivingFish: Math.round(survivingFish),
      totalProduction: totalProduction.toFixed(1),
      densityPerM2: formData.totalCapacity > 0 ? (survivingFish / (formData.totalCapacity / 100)).toFixed(1) : 0
    };
  };

  // --- FUNCIÓN CORREGIDA 5: calculateTotalBudget ---
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
        return formData.assignedStaff.length > 0;
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
    alert('Nuevo ciclo creado exitosamente');
    setIsOpen(false);
  };

  const steps = [
    { number: 1, title: 'Información Básica', icon: Info },
    { number: 2, title: 'Estanques', icon: MapPin },
    { number: 3, title: 'Siembra', icon: Fish },
    { number: 4, title: 'Parámetros', icon: Calculator },
    { number: 5, title: 'Personal', icon: Users },
    { number: 6, title: 'Resumen', icon: CheckCircle }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden
