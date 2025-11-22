"use client";
import React, { useState, useEffect, useRef } from 'react';
import { BarChart3, Activity, Building2, RotateCcw, Camera, Bell, Smartphone, Settings } from 'lucide-react';

interface PondData {
  id: string;
  name: string;
  status: 'normal' | 'warning' | 'critical';
  emoji: string;
}

interface KPIData {
  label: string;
  value: string | number;
  icon: string;
  isPulsing?: boolean;
}

interface AlertItem {
  type: 'critical' | 'warning' | 'info';
  message: string;
  time: string;
  icon: string;
}

interface ChartPoint {
  x: number;
  y: number;
  value: number;
}

interface LineData {
  data: number[];
  color: string;
  label: string;
}

const SoluviaDashboard: React.FC = () => {
  const [selectedSede, setSelectedSede] = useState<string>('Machala');
  const [selectedGrupo, setSelectedGrupo] = useState<string>('Grupo 1');
  const [selectedPiscina, setSelectedPiscina] = useState<string>('A');
  const [selectedEspecie, setSelectedEspecie] = useState<string>('Camarón');
  const [selectedEtapa, setSelectedEtapa] = useState<string>('Larvas');
  
  const chartRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { icon: BarChart3, label: 'Dashboard', active: true },
    { icon: Activity, label: 'Tiempo Real', active: false },
    { icon: Building2, label: 'Sedes/Piscinas', active: false },
    { icon: RotateCcw, label: 'Ciclos', active: false },
    { icon: Camera, label: 'Visión', active: false },
    { icon: Bell, label: 'Alertas', active: false },
    { icon: Smartphone, label: 'App Móvil', active: false },
    { icon: Settings, label: 'Ajustes', active: false },
  ];

  const kpiData: KPIData[] = [
    { label: 'O₂ (mg/L)', value: 6.42, icon: '🌊', isPulsing: true },
    { label: 'Temp (°C)', value: 18.7, icon: '🌡️' },
    { label: 'pH', value: 7.18, icon: '💧' },
    { label: 'Biomasa (kg)', value: 320, icon: '⚖️' },
    { label: 'Mortalidad (%)', value: 1.2, icon: '🐟' },
    { label: 'Eficiencia (%)', value: 87.5, icon: '📈' },
    { label: 'Días p/Cosecha', value: 45, icon: '📅' },
    { label: 'Causa Principal', value: 'Hipoxia', icon: '🔬' },
    { label: 'Talla Prom (cm)', value: '12.3', icon: '📏' },
    { label: 'FCR', value: 1.35, icon: '🥄' },
  ];

  const pondData: PondData[] = [
    { id: 'A', name: 'Piscina A', status: 'normal', emoji: '🟢' },
    { id: 'B', name: 'Piscina B', status: 'warning', emoji: '🟡' },
    { id: 'C', name: 'Piscina C', status: 'critical', emoji: '🔴' },
    { id: 'D', name: 'Piscina D', status: 'normal', emoji: '🟢' },
    { id: 'E', name: 'Piscina E', status: 'normal', emoji: '🟢' },
    { id: 'F', name: 'Piscina F', status: 'warning', emoji: '🟡' },
  ];

  const alerts: AlertItem[] = [
    {
      type: 'critical',
      message: 'Piscina C: O₂ < 4.5 mg/L (crítica) hace 5min',
      time: '5min',
      icon: '⚠️'
    },
    {
      type: 'warning',
      message: 'Predicción: riesgo de hipoxia en 2h (0.78) hace 10min',
      time: '10min',
      icon: '⚡'
    },
    {
      type: 'info',
      message: 'pH en descenso en Piscina B hace 1 hora',
      time: '1h',
      icon: '📊'
    }
  ];

  const chartData: LineData[] = [
    { data: [2.5, 2.7, 2.6, 2.9, 2.8, 3.1, 3.0], color: '#0ea5e9', label: 'Piscina A' },
    { data: [3.0, 3.2, 3.1, 3.3, 3.5, 3.4, 3.6], color: '#10b981', label: 'Piscina B' },
    { data: [2.0, 2.2, 2.1, 2.4, 2.3, 2.5, 2.4], color: '#f59e0b', label: 'Piscina C' },
  ];

  const createSVGLine = (data: number[], color: string, width: number, height: number): string => {
    const maxVal = 4.0;
    const minVal = 2.0;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - (((value - minVal) / (maxVal - minVal)) * height);
      return `${x},${y}`;
    }).join(' ');

    return points;
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'normal':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-600';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const getAlertColor = (type: string): string => {
    switch (type) {
      case 'critical':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      case 'info':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Browser Bar */}
        <div className="bg-gray-100 px-5 py-3 flex items-center gap-2 border-b border-gray-200">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="ml-5 flex-1 bg-white border border-gray-300 rounded-lg px-3 py-1 text-sm text-gray-600">
            🔒 https://soluvia.dashboard.com
          </div>
        </div>

        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            📊 <span>SoluvIA • Panel</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm hover:bg-slate-200 transition-colors">
              Guía
            </button>
            <button className="px-3 py-2 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800 transition-colors">
              Nueva alerta
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600"></div>
          </div>
        </div>

        <div className="flex gap-4 p-6">
          {/* Sidebar */}
          <div className="w-48 bg-white rounded-xl p-4 h-fit shadow-sm border border-slate-100">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-1 cursor-pointer transition-all text-sm ${
                    item.active
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </div>
              );
            })}
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Filters */}
            <div className="bg-white rounded-xl p-5 mb-5 grid grid-cols-6 gap-4 shadow-sm border border-slate-100">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-500 font-medium uppercase tracking-wider">Sede</label>
                <select 
                  className="px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm"
                  value={selectedSede}
                  onChange={(e) => setSelectedSede(e.target.value)}
                >
                  <option>Machala</option>
                  <option>Cuenca</option>
                  <option>Riobamba</option>
                  <option>Ibarra</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-500 font-medium uppercase tracking-wider">Grupo</label>
                <select 
                  className="px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm"
                  value={selectedGrupo}
                  onChange={(e) => setSelectedGrupo(e.target.value)}
                >
                  <option>Grupo 1</option>
                  <option>Grupo 2</option>
                  <option>Grupo 3</option>
                  <option>Grupo 4</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-500 font-medium uppercase tracking-wider">Piscina</label>
                <select 
                  className="px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm"
                  value={selectedPiscina}
                  onChange={(e) => setSelectedPiscina(e.target.value)}
                >
                  <option>A</option>
                  <option>B</option>
                  <option>C</option>
                  <option>D</option>
                  <option>E</option>
                  <option>F</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-500 font-medium uppercase tracking-wider">Especie</label>
                <select 
                  className="px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm"
                  value={selectedEspecie}
                  onChange={(e) => setSelectedEspecie(e.target.value)}
                >
                  <option>Camarón</option>
                  <option>Tilapia</option>
                  <option>Trucha</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-500 font-medium uppercase tracking-wider">Etapa</label>
                <select 
                  className="px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm"
                  value={selectedEtapa}
                  onChange={(e) => setSelectedEtapa(e.target.value)}
                >
                  <option>Larvas</option>
                  <option>Juveniles</option>
                  <option>Adultos</option>
                </select>
              </div>
              <div className="flex items-end">
                <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800 transition-colors w-full">
                  Aplicar
                </button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-5 gap-3 mb-6">
              {kpiData.map((kpi, index) => (
                <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center gap-3 min-h-[90px]">
                  <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                    {kpi.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-1 truncate">
                      {kpi.label}
                    </h4>
                    <div className={`text-lg font-bold text-slate-800 truncate ${kpi.isPulsing ? 'animate-pulse' : ''}`}>
                      {kpi.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dashboard Grid - Enhanced with additional cards */}
            <div className="grid grid-cols-4 gap-5 mb-6">
              {/* Pond Status */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-800">Estado de piscinas</h3>
                  <span className="text-xs text-slate-500">6 piscinas</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {pondData.map((pond) => (
                    <div key={pond.id} className={`rounded-xl p-3 text-center border ${getStatusColor(pond.status)}`}>
                      <div className="text-xs mb-1">{pond.name}</div>
                      <div className="text-xl mb-1">{pond.emoji}</div>
                      <div className="text-xs opacity-80 capitalize">{pond.status === 'warning' ? 'Precaución' : pond.status === 'critical' ? 'Crítica' : 'Normal'}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Productivity Metrics */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-800">Eficiencia Productiva</h3>
                  <span className="text-xs text-slate-500">Esta semana</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">FCR Actual</span>
                    <span className="font-semibold text-green-600">1.35</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">FCR Meta</span>
                    <span className="font-semibold text-slate-800">1.40</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                  </div>
                  <div className="text-center">
                    <span className="text-2xl font-bold text-green-600">87.5%</span>
                    <p className="text-xs text-slate-500">Eficiencia general</p>
                  </div>
                </div>
              </div>

              {/* Harvest Projections */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-800">Proyección Cosecha</h3>
                  <span className="text-xs text-slate-500">Grupo 1</span>
                </div>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">45</div>
                    <p className="text-xs text-slate-500">Días restantes</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Peso proyectado</span>
                      <span className="font-semibold">2.4 ton</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Talla objetivo</span>
                      <span className="font-semibold">18-20 cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Supervivencia</span>
                      <span className="font-semibold text-green-600">82%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Alerts */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <h3 className="font-semibold text-slate-800 mb-4">Alertas recientes</h3>
                <ul className="space-y-2 mb-3">
                  {alerts.slice(0, 3).map((alert, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className={`mt-0.5 text-sm ${getAlertColor(alert.type)}`}>
                        {alert.icon}
                      </span>
                      <span className="text-xs leading-relaxed">{alert.message}</span>
                    </li>
                  ))}
                </ul>
                <button className="px-3 py-2 bg-slate-900 text-white rounded-lg text-xs hover:bg-slate-800 transition-colors w-full">
                  Ver todas
                </button>
              </div>
            </div>

            {/* Second Row - Mortality Analysis and Size Distribution */}
            <div className="grid grid-cols-3 gap-5 mb-6">
              {/* Mortality Causes */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-800">Causas de Mortalidad</h3>
                  <span className="text-xs text-slate-500">Últimos 30 días</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm">Hipoxia</span>
                    </div>
                    <span className="text-sm font-semibold text-red-600">45%</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-sm">Enfermedad</span>
                    </div>
                    <span className="text-sm font-semibold text-orange-600">28%</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Estrés térmico</span>
                    </div>
                    <span className="text-sm font-semibold text-yellow-600">18%</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                      <span className="text-sm">Otros</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-600">9%</span>
                  </div>
                </div>
              </div>

              {/* Size Distribution */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-800">Distribución por Tamaño</h3>
                  <span className="text-xs text-slate-500">Piscina A</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">8-10 cm</span>
                    <div className="flex items-center gap-2 flex-1 mx-3">
                      <div className="flex-1 bg-slate-100 rounded-full h-2">
                        <div className="bg-blue-400 h-2 rounded-full" style={{ width: '15%' }}></div>
                      </div>
                      <span className="text-xs text-slate-600 w-8">15%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">10-12 cm</span>
                    <div className="flex items-center gap-2 flex-1 mx-3">
                      <div className="flex-1 bg-slate-100 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                      </div>
                      <span className="text-xs text-slate-600 w-8">35%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">12-14 cm</span>
                    <div className="flex items-center gap-2 flex-1 mx-3">
                      <div className="flex-1 bg-slate-100 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '40%' }}></div>
                      </div>
                      <span className="text-xs text-slate-600 w-8">40%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">14+ cm</span>
                    <div className="flex items-center gap-2 flex-1 mx-3">
                      <div className="flex-1 bg-slate-100 rounded-full h-2">
                        <div className="bg-blue-700 h-2 rounded-full" style={{ width: '10%' }}></div>
                      </div>
                      <span className="text-xs text-slate-600 w-8">10%</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-center p-2 bg-blue-50 rounded-lg">
                  <span className="text-sm font-semibold text-blue-800">Talla promedio: 12.3 cm</span>
                </div>
              </div>

              {/* Trends Chart */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-800">Tendencias</h3>
                  <span className="text-xs text-slate-500">últimos 60 min</span>
                </div>
                <div className="h-44 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg relative overflow-hidden">
                  <div className="absolute bottom-5 left-2 right-2 h-0.5 bg-blue-500 opacity-80">
                    <div className="absolute left-1/4 -top-7 w-15 h-15 border-2 border-blue-500 rounded-full bg-blue-50"></div>
                    <div className="absolute right-1/4 -top-11 w-15 h-15 border-2 border-blue-500 rounded-full bg-blue-50"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Large Comparison Chart */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800">Comparativa entre piscinas (O₂)</h3>
                <span className="text-xs text-slate-500">A vs B vs C</span>
              </div>
              <div className="h-72 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg relative overflow-hidden">
                <div ref={chartRef} className="absolute inset-5">
                  <svg className="w-full h-full">
                    {chartData.map((line, index) => (
                      <polyline
                        key={index}
                        points={createSVGLine(line.data, line.color, 700, 200)}
                        stroke={line.color}
                        strokeWidth="2"
                        fill="none"
                      />
                    ))}
                  </svg>
                </div>
                <div className="absolute top-4 right-4 flex gap-4 text-xs">
                  {chartData.map((line, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: line.color }}></div>
                      <span>{line.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoluviaDashboard;