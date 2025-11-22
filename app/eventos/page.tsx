"use client";

import React, { useMemo, useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, ScatterChart, Scatter } from "recharts";
import { Fish, Waves, Thermometer, Droplets, Gauge, AlertTriangle, Bell, Camera, Database, Settings, Activity, MapPinned, LayoutDashboard, CloudLightning, Smartphone, Calendar, TrendingUp, Scale, Target, Clock, Users, Utensils, Heart, DollarSign, Package, BarChart3, Eye, Upload, Play, Pause, RotateCcw, ZoomIn, Download, Cpu, Brain, Ruler, ScanLine, FileImage, Video, X, Plus, Save, Edit3, Trash2, CalendarDays, Timer } from "lucide-react";

function classNames(...c){return c.filter(Boolean).join(" ");}

const kpiDefs = [
  { id: "o2", label: "O₂ (mg/L)", icon: Waves },
  { id: "temp", label: "Temp (°C)", icon: Thermometer },
  { id: "ph", label: "pH", icon: Droplets },
  { id: "biomasa", label: "Biomasa (kg)", icon: Gauge },
  { id: "mortalidad", label: "Mortalidad (%)", icon: Fish },
];

const ponds = [
  { id: "A", status: "ok" },
  { id: "B", status: "warn" },
  { id: "C", status: "crit" },
  { id: "D", status: "ok" },
  { id: "E", status: "ok" },
  { id: "F", status: "warn" },
];

// Datos simulados para visión por computadora
const visionAnalysis = {
  lastProcessed: "2025-08-24 14:32:15",
  processingTime: "2.3s",
  accuracy: 94.7,
  fishCount: 1847,
  avgWeight: 0.542,
  totalBiomass: 1001.2,
  healthyFish: 1798,
  stressedFish: 42,
  sickFish: 7,
  confidence: 92.1
};

const sizeDistribution = [
  { range: "0.3-0.4", count: 245, percentage: 13.3, color: "#fbbf24" },
  { range: "0.4-0.5", count: 387, percentage: 21.0, color: "#a3e635" },
  { range: "0.5-0.6", count: 592, percentage: 32.1, color: "#22c55e" },
  { range: "0.6-0.7", count: 418, percentage: 22.6, color: "#06b6d4" },
  { range: "0.7-0.8", count: 205, percentage: 11.1, color: "#3b82f6" }
];

const biometricTrends = [
  { date: "15-Aug", count: 1823, avgWeight: 0.498, biomass: 907.5, density: 4.5 },
  { date: "17-Aug", count: 1815, avgWeight: 0.512, biomass: 928.7, density: 4.4 },
  { date: "19-Aug", count: 1809, avgWeight: 0.526, biomass: 951.5, density: 4.3 },
  { date: "21-Aug", count: 1856, avgWeight: 0.535, biomass: 993.0, density: 4.7 },
  { date: "23-Aug", count: 1847, avgWeight: 0.542, biomass: 1001.2, density: 4.6 }
];

const healthMetrics = [
  { condition: "Saludable", count: 1798, percentage: 97.3, color: "#10b981" },
  { condition: "Estrés", count: 42, percentage: 2.3, color: "#f59e0b" },
  { condition: "Enfermo", count: 7, percentage: 0.4, color: "#ef4444" }
];

const recentImages = [
  { id: 1, timestamp: "14:32", type: "Auto", status: "Procesado", confidence: 94.7 },
  { id: 2, timestamp: "14:27", type: "Manual", status: "Procesado", confidence: 96.2 },
  { id: 3, timestamp: "14:22", type: "Auto", status: "Procesado", confidence: 93.1 },
  { id: 4, timestamp: "14:17", type: "Auto", status: "Procesando...", confidence: null },
  { id: 5, timestamp: "14:12", type: "Manual", status: "Procesado", confidence: 95.8 },
  { id: 6, timestamp: "14:07", type: "Auto", status: "Error", confidence: null }
];

// Datos de producción simulados
const biomasaData = [
  { semana: "Sem 1", biomasa: 180, peces: 2000, pesoPromedio: 0.09 },
  { semana: "Sem 2", biomasa: 240, peces: 1980, pesoPromedio: 0.121 },
  { semana: "Sem 3", biomasa: 320, peces: 1965, pesoPromedio: 0.163 },
  { semana: "Sem 4", biomasa: 420, peces: 1950, pesoPromedio: 0.215 },
  { semana: "Sem 5", biomasa: 540, peces: 1940, pesoPromedio: 0.278 },
  { semana: "Sem 6", biomasa: 680, peces: 1925, pesoPromedio: 0.353 },
  { semana: "Sem 7", biomasa: 840, peces: 1910, pesoPromedio: 0.440 },
  { semana: "Sem 8", biomasa: 1020, peces: 1895, pesoPromedio: 0.538 },
];

const alimentacionData = [
  { dia: "Lun", alimentoKg: 42, veces: 4, costo: 126 },
  { dia: "Mar", alimentoKg: 44, veces: 4, costo: 132 },
  { dia: "Mie", alimentoKg: 43, veces: 4, costo: 129 },
  { dia: "Jue", alimentoKg: 45, veces: 4, costo: 135 },
  { dia: "Vie", alimentoKg: 41, veces: 4, costo: 123 },
  { dia: "Sab", alimentoKg: 39, veces: 3, costo: 117 },
  { dia: "Dom", alimentoKg: 38, veces: 3, costo: 114 },
];

const mortalidadData = [
  { name: "Enfermedad", value: 45, color: "#ef4444" },
  { name: "Predación", value: 25, color: "#f97316" },
  { name: "Estrés", value: 20, color: "#eab308" },
  { name: "Otros", value: 10, color: "#6b7280" },
];

const speciesStages = {
  Trucha: ["Larvas","Juveniles","Adultos"],
  Tilapia: ["Larvas","Juveniles","Adultos"],
  Camarón: ["Larvas","Juveniles","Adultos"],
};

const statusColor = {
  ok: "bg-emerald-500/15 text-emerald-600 ring-1 ring-emerald-400/30",
  warn: "bg-amber-500/15 text-amber-600 ring-1 ring-amber-400/30",
  crit: "bg-rose-500/15 text-rose-600 ring-1 ring-rose-400/30",
}

function genSeries(seed=1){
  const out = []; const now = Date.now();
  let o2 = 6.5, temp = 18.5, ph = 7.2;
  for(let i=60;i>=0;i--){
    o2 += (Math.sin((i+seed)/7)+Math.random()*0.2-0.1)*0.08;
    temp += (Math.cos((i+seed)/9)+Math.random()*0.2-0.1)*0.05;
    ph += (Math.sin((i+seed)/11)+Math.random()*0.2-0.1)*0.03;
    out.push({
      t: new Date(now - i*60*1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      o2: +(o2.toFixed(2)), temp: +(temp.toFixed(2)), ph: +(ph.toFixed(2)),
    });
  }
  return out;
}

export default function AquaDashboard(){
  const [tab, setTab] = useState("cycles");
  const [site, setSite] = useState("Machala");
  const [group, setGroup] = useState("Grupo 1");
  const [pond, setPond] = useState("A");
  const [species, setSpecies] = useState("Trucha");
  const [stage, setStage] = useState("Juveniles");
  const [series, setSeries] = useState(genSeries());
  const [showEventModal, setShowEventModal] = useState(false);

  useEffect(()=>{
    const id = setInterval(()=> setSeries(genSeries(Math.random()*100)), 4000);
    return ()=> clearInterval(id);
  },[]);

  const kpis = useMemo(()=>({
    o2: series[series.length-1]?.o2 ?? 0,
    temp: series[series.length-1]?.temp ?? 0,
    ph: series[series.length-1]?.ph ?? 0,
    biomasa: 1020, 
    mortalidad: 4.75,
    supervivencia: 95.25,
    alimentacion: 294,
    fca: 1.85,
    crecimiento: 12.5,
    costoTotal: 8750,
  }),[series]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <LayoutDashboard className="w-6 h-6"/>
          <h1 className="text-lg font-semibold">AquaSense • Producción y Ciclo</h1>
          <div className="ml-auto flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm">Exportar</button>
            <button className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-sm">Nuevo ciclo</button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500"/>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-12 gap-4">
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3 lg:col-span-2">
          <nav className="bg-white rounded-2xl shadow-sm p-3 border border-slate-200 flex md:block gap-2 md:gap-0">
            <NavItem icon={LayoutDashboard} label="Dashboard" active={tab==='dashboard'} onClick={()=>setTab('dashboard')} />
            <NavItem icon={BarChart3} label="Tiempo Real" active={tab==='realtime'} onClick={()=>setTab('realtime')} />
            <NavItem icon={MapPinned} label="Sedes/Piscinas" active={tab==='sites'} onClick={()=>setTab('sites')} />
            <NavItem icon={Database} label="Producción" active={tab==='cycles'} onClick={()=>setTab('cycles')} />
            <NavItem icon={Camera} label="Visión" active={tab==='vision'} onClick={()=>setTab('vision')} />
            <NavItem icon={Bell} label="Alertas" active={tab==='alerts'} onClick={()=>setTab('alerts')} />
            <NavItem icon={Smartphone} label="App Móvil" active={tab==='mobile'} onClick={()=>setTab('mobile')} />
            <NavItem icon={Settings} label="Ajustes" active={tab==='settings'} onClick={()=>setTab('settings')} />
          </nav>
        </aside>

        {/* Main */}
        <main className="col-span-12 md:col-span-9 lg:col-span-10">
          <Filters
            site={site} setSite={setSite}
            group={group} setGroup={setGroup}
            pond={pond} setPond={setPond}
            species={species} setSpecies={setSpecies}
            stage={stage} setStage={setStage}
          />

          <ProductionCycleView kpis={kpis} onRegisterEvent={() => setShowEventModal(true)} />
          
          {/* Modal para registrar evento */}
          {showEventModal && (
            <EventRegistrationModal 
              onClose={() => setShowEventModal(false)}
              site={site}
              pond={pond}
              species={species}
              stage={stage}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function NavItem({icon:Icon, label, active, onClick}){
  return (
    <button onClick={onClick} className={classNames(
      "w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition", 
      active ? "bg-slate-900 text-white shadow" : "hover:bg-slate-100"
    )}>
      <Icon className="w-4 h-4"/>
      {label}
    </button>
  )
}

function Filters(props){
  const {site,setSite, group,setGroup, pond,setPond, species,setSpecies, stage,setStage} = props;
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-4 grid md:grid-cols-3 lg:grid-cols-6 gap-3">
      <Select label="Sede" value={site} onChange={setSite} options={["Machala","Loja","Cuenca"]} />
      <Select label="Grupo" value={group} onChange={setGroup} options={["Grupo 1","Grupo 2","Grupo 3"]} />
      <Select label="Piscina" value={pond} onChange={setPond} options={["A","B","C","D","E","F"]} />
      <Select label="Especie" value={species} onChange={setSpecies} options={Object.keys(speciesStages)} />
      <Select label="Etapa" value={stage} onChange={setStage} options={speciesStages[species]} />
      <div className="flex items-end"><button className="w-full px-3 py-2 rounded-xl bg-slate-900 text-white text-sm">Aplicar</button></div>
    </div>
  )
}

function Select({label,value,onChange,options}){
  return (
    <label className="text-sm">
      <div className="text-slate-500 mb-1">{label}</div>
      <select value={value} onChange={e=>onChange(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white">
        {options.map(o=> <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  )
}

function Card({children, className = ""}){
  return <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-4 ${className}`}>{children}</div>
}

function ProductionCycleView({kpis, onRegisterEvent}){
  return (
    <div className="space-y-6">
      {/* Encabezado del ciclo actual */}
      <Card className="bg-gradient-to-r from-sky-50 to-blue-50 border-sky-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-sky-100">
                <Fish className="w-6 h-6 text-sky-600"/>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Ciclo Productivo Activo</h2>
                <p className="text-slate-600">Piscina A • Trucha Arcoíris • Etapa Juvenil</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-500"/>
                <span>Iniciado: 01 Jul 2025 (8 semanas)</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-slate-500"/>
                <span>Cosecha esperada: 15 Sep 2025</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-xl bg-white border border-sky-200 text-sky-700 text-sm hover:bg-sky-50">
              Ver historial
            </button>
            <button 
              onClick={onRegisterEvent}
              className="px-4 py-2 rounded-xl bg-sky-600 text-white text-sm hover:bg-sky-700"
            >
              Registrar evento
            </button>
          </div>
        </div>
      </Card>

      {/* KPIs de producción */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <KPICard icon={Scale} label="Biomasa Total" value={`${kpis.biomasa} kg`} trend="+12.5%" trendUp />
        <KPICard icon={Users} label="Población" value="1,895" trend="-5.25%" trendUp={false} />
        <KPICard icon={TrendingUp} label="Peso Promedio" value="0.538 kg" trend="+25%" trendUp />
        <KPICard icon={Heart} label="Supervivencia" value={`${kpis.supervivencia}%`} trend="+0.5%" trendUp />
        <KPICard icon={Utensils} label="Alimento (sem)" value={`${kpis.alimentacion} kg`} trend="+8%" trendUp />
        <KPICard icon={Gauge} label="FCA" value={kpis.fca} trend="-0.15" trendUp />
        <KPICard icon={Activity} label="Crecimiento" value={`${kpis.crecimiento}%/sem`} trend="+2%" trendUp />
        <KPICard icon={DollarSign} label="Costo Total" value={`$${kpis.costoTotal.toLocaleString()}`} trend="+5%" trendUp={false} />
      </div>

      {/* Resto del contenido simplificado para mostrar el modal */}
      <Card>
        <h3 className="font-semibold mb-4">Vista Previa - Producción y Ciclo</h3>
        <p className="text-slate-600 mb-4">
          El contenido completo de gráficos y análisis se encuentra disponible. 
          Haz clic en "Registrar evento" para ver el modal de registro de eventos.
        </p>
        <div className="bg-slate-100 rounded-xl p-8 text-center text-slate-500">
          <Database className="w-12 h-12 mx-auto mb-2 opacity-50"/>
          <p>Gráficos y análisis de producción</p>
        </div>
      </Card>
    </div>
  );
}

function KPICard({icon: Icon, label, value, trend, trendUp}){
  return (
    <Card className="p-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded-lg bg-slate-100">
          <Icon className="w-3 h-3 text-slate-600"/>
        </div>
      </div>
      <div className="text-lg font-bold text-slate-900 mb-1">{value}</div>
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      {trend && (
        <div className={`text-xs font-medium ${trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
          {trendUp ? '↗' : '↘'} {trend}
        </div>
      )}
    </Card>
  );
}

function EventRegistrationModal({onClose, site, pond, species, stage}){
  const [eventType, setEventType] = useState("alimentacion");
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date().toTimeString().slice(0,5),
    // Alimentación
    alimentoKg: '',
    tipoAlimento: 'balanceado',
    veces: '3',
    // Muestreo
    muestrasPeces: '',
    pesoPromedio: '',
    longitudPromedio: '',
    // Mortalidad
    pecesAfectados: '',
    causaMortalidad: 'enfermedad',
    // Tratamiento
    tipoTratamiento: 'preventivo',
    medicamento: '',
    dosis: '',
    // Mantenimiento
    tipoMantenimiento: 'limpieza',
    equiposMantenidos: '',
    // Calidad de agua
    parametroAgua: 'oxigeno',
    valorMedido: '',
    equipoMedicion: '',
    // Otros
    descripcion: '',
    observaciones: '',
    responsable: 'Juan Pérez',
    prioridad: 'normal'
  });

  const eventTypes = [
    { id: 'alimentacion', label: 'Alimentación', icon: Utensils, color: 'bg-green-100 text-green-700' },
    { id: 'muestreo', label: 'Muestreo Biométrico', icon: Scale, color: 'bg-blue-100 text-blue-700' },
    { id: 'mortalidad', label: 'Registro de Mortalidad', icon: AlertTriangle, color: 'bg-red-100 text-red-700' },
    { id: 'tratamiento', label: 'Tratamiento/Medicación', icon: Heart, color: 'bg-purple-100 text-purple-700' },
    { id: 'mantenimiento', label: 'Mantenimiento', icon: Settings, color: 'bg-orange-100 text-orange-700' },
    { id: 'calidad_agua', label: 'Calidad del Agua', icon: Droplets, color: 'bg-cyan-100 text-cyan-700' },
    { id: 'otros', label: 'Otros Eventos', icon: Edit3, color: 'bg-gray-100 text-gray-700' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar el evento
    console.log('Evento registrado:', { eventType, ...formData });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header del modal */}
        <div className="bg-gradient-to-r from-sky-50 to-blue-50 px-6 py-4 border-b border-sky-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Registrar Evento de Producción</h2>
              <p className="text-sm text-slate-600">{site} • Piscina {pond} • {species} ({stage})</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-xl text-slate-600"
            >
              <X className="w-5 h-5"/>
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-100px)]">
          {/* Sidebar de tipos de evento */}
          <div className="w-64 bg-slate-50 p-4 overflow-y-auto">
            <h3 className="font-semibold text-slate-900 mb-3">Tipo de Evento</h3>
            <div className="space-y-2">
              {eventTypes.map(type => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setEventType(type.id)}
                    className={classNames(
                      "w-full flex items-center gap-3 p-3 rounded-xl text-left transition",
                      eventType === type.id 
                        ? "bg-white shadow-sm border border-sky-200" 
                        : "hover:bg-white/50"
                    )}
                  >
                    <div className={`p-1.5 rounded-lg ${type.color}`}>
                      <Icon className="w-4 h-4"/>
                    </div>
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Formulario principal */}
          <div className="flex-1 p-6 overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información básica */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <CalendarDays className="w-4 h-4 inline mr-1"/>
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={formData.fecha}
                    onChange={(e) => handleInputChange('fecha', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Timer className="w-4 h-4 inline mr-1"/>
                    Hora
                  </label>
                  <input
                    type="time"
                    value={formData.hora}
                    onChange={(e) => handleInputChange('hora', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Responsable</label>
                  <select
                    value={formData.responsable}
                    onChange={(e) => handleInputChange('responsable', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  >
                    <option value="Juan Pérez">Juan Pérez</option>
                    <option value="María González">María González</option>
                    <option value="Carlos Ruiz">Carlos Ruiz</option>
                  </select>
                </div>
              </div>

              {/* Formularios específicos por tipo */}
              {eventType === 'alimentacion' && (
                <AlimentacionForm formData={formData} onChange={handleInputChange} />
              )}
              {eventType === 'muestreo' && (
                <MuestreoForm formData={formData} onChange={handleInputChange} />
              )}
              {eventType === 'mortalidad' && (
                <MortalidadForm formData={formData} onChange={handleInputChange} />
              )}
              {eventType === 'tratamiento' && (
                <TratamientoForm formData={formData} onChange={handleInputChange} />
              )}
              {eventType === 'mantenimiento' && (
                <MantenimientoForm formData={formData} onChange={handleInputChange} />
              )}
              {eventType === 'calidad_agua' && (
                <CalidadAguaForm formData={formData} onChange={handleInputChange} />
              )}
              {eventType === 'otros' && (
                <OtrosForm formData={formData} onChange={handleInputChange} />
              )}

              {/* Observaciones generales */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Observaciones</label>
                <textarea
                  value={formData.observaciones}
                  onChange={(e) => handleInputChange('observaciones', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                  placeholder="Observaciones adicionales..."
                />
              </div>

              {/* Botones */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-600 text-white hover:bg-sky-700"
                >
                  Registrar evento
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// Formularios específicos por tipo de evento
function AlimentacionForm({formData, onChange}){
  return (
    <div className="bg-green-50 p-4 rounded-2xl border border-green-200">
      <h4 className="font-semibold text-green-800 mb-3">Detalles de Alimentación</h4>
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Cantidad (kg)</label>
          <input
            type="number"
            step="0.1"
            value={formData.alimentoKg}
            onChange={(e) => onChange('alimentoKg', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200"
            placeholder="0.0"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de Alimento</label>
          <select
            value={formData.tipoAlimento}
            onChange={(e) => onChange('tipoAlimento', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200"
          >
            <option value="balanceado">Balanceado</option>
            <option value="pellets">Pellets</option>
            <option value="harina_pescado">Harina de pescado</option>
            <option value="concentrado">Concentrado</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Veces al día</label>
          <select
            value={formData.veces}
            onChange={(e) => onChange('veces', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200"
          >
            <option value="1">1 vez</option>
            <option value="2">2 veces</option>
            <option value="3">3 veces</option>
            <option value="4">4 veces</option>
            <option value="5">5 veces</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function MuestreoForm({formData, onChange}){
  return (
    <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200">
      <h4 className="font-semibold text-blue-800 mb-3">Datos del Muestreo Biométrico</h4>
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Número de muestras</label>
          <input
            type="number"
            value={formData.muestrasPeces}
            onChange={(e) => onChange('muestrasPeces', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200"
            placeholder="50"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Peso promedio (kg)</label>
          <input
            type="number"
            step="0.001"
            value={formData.pesoPromedio}
            onChange={(e) => onChange('pesoPromedio', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200"
            placeholder="0.500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Longitud promedio (cm)</label>
          <input
            type="number"
            step="0.1"
            value={formData.longitudPromedio}
            onChange={(e) => onChange('longitudPromedio', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200"
            placeholder="25.5"
          />
        </div>
      </div>
    </div>
  );
}

function MortalidadForm({formData, onChange}){
  return (
    <div className="bg-red-50 p-4 rounded-2xl border border-red-200">
      <h4 className="font-semibold text-red-800 mb-3">Registro de Mortalidad</h4>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Peces afectados</label>
          <input
            type="number"
            value={formData.pecesAfectados}
            onChange={(e) => onChange('pecesAfectados', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200"
            placeholder="0"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Causa probable</label>
          <select
            value={formData.causaMortalidad}
            onChange={(e) => onChange('causaMortalidad', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200"
          >
            <option value="enfermedad">Enfermedad</option>
            <option value="estres">Estrés térmico</option>
            <option value="hipoxia">Hipoxia</option>
            <option value="predacion">Predación</option>
            <option value="desconocida">Desconocida</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function TratamientoForm({formData, onChange}){
  return (
    <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200">
      <h4 className="font-semibold text-purple-800 mb-3">Detalles del Tratamiento</h4>
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Tipo</label>
          <select
            value={formData.tipoTratamiento}
            onChange={(e) => onChange('tipoTratamiento', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200"
          >
            <option value="preventivo">Preventivo</option>
            <option value="curativo">Curativo</option>
            <option value="probiotico">Probiótico</option>
            <option value="vitaminas">Vitaminas</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Medicamento/Producto</label>
          <input
            type="text"
            value={formData.medicamento}
            onChange={(e) => onChange('medicamento', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200"
            placeholder="Nombre del producto"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Dosis aplicada</label>
          <input
            type="text"
            value={formData.dosis}
            onChange={(e) => onChange('dosis', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200"
            placeholder="ej: 2ml/kg biomasa"
            required
          />
        </div>
      </div>
    </div>
  );
}

function MantenimientoForm({formData, onChange}){
  return (
    <div className="bg-orange-50 p-4 rounded-2xl border border-orange-200">
      <h4 className="font-semibold text-orange-800 mb-3">Mantenimiento Realizado</h4>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de mantenimiento</label>
          <select
            value={formData.tipoMantenimiento}
            onChange={(e) => onChange('tipoMantenimiento', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200"
          >
            <option value="limpieza">Limpieza</option>
            <option value="reparacion">Reparación</option>
            <option value="calibracion">Calibración</option>
            <option value="cambio_filtros">Cambio de filtros</option>
            <option value="preventivo">Mantenimiento preventivo</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Equipos mantenidos</label>
          <input
            type="text"
            value={formData.equiposMantenidos}
            onChange={(e) => onChange('equiposMantenidos', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200"
            placeholder="ej: Aireador, Filtro, Bomba"
            required
          />
        </div>
      </div>
    </div>
  );
}

function CalidadAguaForm({formData, onChange}){
  return (
    <div className="bg-cyan-50 p-4 rounded-2xl border border-cyan-200">
      <h4 className="font-semibold text-cyan-800 mb-3">Medición de Calidad del Agua</h4>
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Parámetro medido</label>
          <select
            value={formData.parametroAgua}
            onChange={(e) => onChange('parametroAgua', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200"
          >
            <option value="oxigeno">Oxígeno disuelto</option>
            <option value="temperatura">Temperatura</option>
            <option value="ph">pH</option>
            <option value="amonio">Amonio</option>
            <option value="nitritos">Nitritos</option>
            <option value="alcalinidad">Alcalinidad</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Valor medido</label>
          <input
            type="number"
            step="0.01"
            value={formData.valorMedido}
            onChange={(e) => onChange('valorMedido', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200"
            placeholder="0.00"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Equipo usado</label>
          <input
            type="text"
            value={formData.equipoMedicion}
            onChange={(e) => onChange('equipoMedicion', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200"
            placeholder="ej: Oxímetro digital"
          />
        </div>
      </div>
    </div>
  );
}

function OtrosForm({formData, onChange}){
  return (
    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
      <h4 className="font-semibold text-gray-800 mb-3">Otros Eventos</h4>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Prioridad</label>
          <select
            value={formData.prioridad}
            onChange={(e) => onChange('prioridad', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200"
          >
            <option value="baja">Baja</option>
            <option value="normal">Normal</option>
            <option value="alta">Alta</option>
            <option value="critica">Crítica</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">Descripción del evento</label>
          <textarea
            value={formData.descripcion}
            onChange={(e) => onChange('descripcion', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 resize-none"
            placeholder="Describe detalladamente el evento..."
            required
          />
        </div>
      </div>
    </div>
  );
}
                