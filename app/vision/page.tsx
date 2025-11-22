"use client";

import React, { useMemo, useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, ScatterChart, Scatter } from "recharts";
import { Fish, Waves, Thermometer, Droplets, Gauge, AlertTriangle, Bell, Camera, Database, Settings, Activity, MapPinned, LayoutDashboard, CloudLightning, Smartphone, Calendar, TrendingUp, Scale, Target, Clock, Users, Utensils, Heart, DollarSign, Package, BarChart3, Eye, Upload, Play, Pause, RotateCcw, ZoomIn, Download, Cpu, Brain, Ruler, ScanLine, FileImage, Video } from "lucide-react";

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
  { range: "0.7-0.8", count: 305, percentage: 11.1, color: "#3b82f6" }
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
  const [tab, setTab] = useState("vision");
  const [site, setSite] = useState("Machala");
  const [group, setGroup] = useState("Grupo 1");
  const [pond, setPond] = useState("A");
  const [species, setSpecies] = useState("Trucha");
  const [stage, setStage] = useState("Juveniles");
  const [series, setSeries] = useState(genSeries());
  const [isLiveView, setIsLiveView] = useState(false);

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
  }),[series]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <Eye className="w-6 h-6"/>
          <h1 className="text-lg font-semibold">SoluvIA • Visión por Computadora</h1>
          <div className="ml-auto flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm">Entrenar modelo</button>
            <button className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-sm">Capturar imagen</button>
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

          <VisionView isLiveView={isLiveView} setIsLiveView={setIsLiveView} />
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

function VisionView({isLiveView, setIsLiveView}){
  return (
    <div className="space-y-6">
      {/* Panel de control principal */}
      <Card className="bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Vista de cámara/imagen */}
          <div className="lg:w-1/2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-900">Vista en Tiempo Real</h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsLiveView(!isLiveView)}
                  className={`p-2 rounded-xl ${isLiveView ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}
                >
                  {isLiveView ? <Pause className="w-4 h-4"/> : <Play className="w-4 h-4"/>}
                </button>
                <button className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200">
                  <Camera className="w-4 h-4"/>
                </button>
                <button className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200">
                  <Upload className="w-4 h-4"/>
                </button>
              </div>
            </div>
            <div className="relative aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden">
              {/* Simulación de vista de cámara */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="absolute top-3 left-3 text-white text-xs bg-black/40 px-2 py-1 rounded">
                {isLiveView ? 'EN VIVO' : 'IMAGEN ESTÁTICA'} • Piscina A
              </div>
              <div className="absolute top-3 right-3 text-white text-xs bg-black/40 px-2 py-1 rounded">
                14:32:15
              </div>
              
              {/* Overlay de detecciones */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-4 text-center text-white">
                  {Array.from({length: 6}).map((_, i) => (
                    <div key={i} className="w-8 h-8 border-2 border-green-400 rounded-full animate-pulse opacity-60"></div>
                  ))}
                </div>
              </div>
              
              <div className="absolute bottom-3 left-3 right-3 flex justify-between text-white text-xs">
                <span className="bg-black/40 px-2 py-1 rounded">🎯 Detectados: 1847</span>
                <span className="bg-black/40 px-2 py-1 rounded">📊 Confianza: 94.7%</span>
                <span className="bg-black/40 px-2 py-1 rounded">⚡ Procesando: 2.3s</span>
              </div>
            </div>
          </div>

          {/* Métricas instantáneas */}
          <div className="lg:w-1/2 grid grid-cols-2 gap-3">
            <MetricCard 
              icon={Fish} 
              label="Conteo Total" 
              value={visionAnalysis.fishCount.toLocaleString()} 
              change="+23"
              changeType="positive"
            />
            <MetricCard 
              icon={Scale} 
              label="Peso Promedio" 
              value={`${visionAnalysis.avgWeight} kg`}
              change="+0.012kg"
              changeType="positive"
            />
            <MetricCard 
              icon={Gauge} 
              label="Biomasa Total" 
              value={`${visionAnalysis.totalBiomass} kg`}
              change="+15.2kg"
              changeType="positive"
            />
            <MetricCard 
              icon={Brain} 
              label="Precisión IA" 
              value={`${visionAnalysis.accuracy}%`}
              change="+1.2%"
              changeType="positive"
            />
            <MetricCard 
              icon={Heart} 
              label="Peces Sanos" 
              value={`${visionAnalysis.healthyFish}`}
              change="-2"
              changeType="negative"
            />
            <MetricCard 
              icon={Cpu} 
              label="Tiempo Proc." 
              value={visionAnalysis.processingTime}
              change="-0.3s"
              changeType="positive"
            />
          </div>
        </div>
      </Card>

      {/* Análisis biométrico */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Distribución de tamaños */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Distribución por Tamaños</h3>
            <div className="text-sm text-slate-500">
              Total: {sizeDistribution.reduce((sum, item) => sum + item.count, 0)} peces
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sizeDistribution} margin={{left:20, right:20, top:10, bottom:10}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="range" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                  formatter={(value, name) => [`${value} peces`, 'Cantidad']}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {sizeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
            {sizeDistribution.slice(0, 3).map((item) => (
              <div key={item.range} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></div>
                <span>{item.range}kg: {item.percentage}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Estado de salud */}
        <Card>
          <h3 className="font-semibold mb-4">Análisis de Salud</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={healthMetrics}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="count"
                >
                  {healthMetrics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value} peces (${props.payload.percentage}%)`, 
                    props.payload.condition
                  ]}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-3">
            {healthMetrics.map((metric) => (
              <div key={metric.condition} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: metric.color}}></div>
                  <span>{metric.condition}</span>
                </div>
                <span className="font-medium">{metric.count} ({metric.percentage}%)</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Tendencias biométricas */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Tendencias Biométricas (Últimos 5 análisis)</h3>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Conteo</span>
            <div className="w-3 h-3 bg-green-500 rounded-full ml-2"></div>
            <span>Peso Prom.</span>
            <div className="w-3 h-3 bg-purple-500 rounded-full ml-2"></div>
            <span>Biomasa</span>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={biometricTrends} margin={{left:20, right:20, top:10, bottom:10}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
              <YAxis yAxisId="count" orientation="left" stroke="#64748b" fontSize={12} />
              <YAxis yAxisId="weight" orientation="right" stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}
              />
              <Line 
                yAxisId="count" 
                type="monotone" 
                dataKey="count" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                name="Conteo de peces"
              />
              <Line 
                yAxisId="weight" 
                type="monotone" 
                dataKey="avgWeight" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                name="Peso prom. (kg)"
              />
              <Line 
                yAxisId="weight" 
                type="monotone" 
                dataKey="biomass" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                name="Biomasa total (kg)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Panel inferior */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Historial de procesamiento */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Historial de Imágenes</h3>
            <button className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm">
              Ver todo
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b">
                  <th className="py-2">Hora</th>
                  <th className="py-2">Tipo</th>
                  <th className="py-2">Estado</th>
                  <th className="py-2">Confianza</th>
                  <th className="py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {recentImages.map(img => (
                  <tr key={img.id} className="border-b hover:bg-slate-50">
                    <td className="py-2">{img.timestamp}</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded-lg text-xs ${
                        img.type === 'Auto' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {img.type}
                      </span>
                    </td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded-lg text-xs ${
                        img.status === 'Procesado' ? 'bg-green-100 text-green-700' :
                        img.status === 'Error' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {img.status}
                      </span>
                    </td>
                    <td className="py-2">
                      {img.confidence ? `${img.confidence}%` : '-'}
                    </td>
                    <td className="py-2">
                      <div className="flex gap-1">
                        <button className="p-1 rounded text-slate-400 hover:text-slate-600">
                          <Eye className="w-4 h-4"/>
                        </button>
                        <button className="p-1 rounded text-slate-400 hover:text-slate-600">
                          <Download className="w-4 h-4"/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Configuración del modelo */}
        <Card>
          <h3 className="font-semibold mb-4">Configuración del Modelo</h3>
          <div className="space-y-4 text-sm">
            <div>
              <div className="text-slate-600 mb-1">Modelo activo</div>
              <div className="font-medium">AquaVision v3.2.1</div>
            </div>
            
            <div>
              <div className="text-slate-600 mb-1">Precisión actual</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '94.7%'}}></div>
                </div>
                <span className="font-medium">94.7%</span>
              </div>
            </div>

            <div>
              <div className="text-slate-600 mb-1">Última actualización</div>
              <div className="font-medium">20 Ago 2025</div>
            </div>

            <div>
              <div className="text-slate-600 mb-1">Imágenes entrenamiento</div>
              <div className="font-medium">15,847 imágenes</div>
            </div>

            <button className="w-full px-3 py-2 rounded-xl bg-slate-900 text-white text-sm mt-4">
              Entrenar modelo
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({icon: Icon, label, value, change, changeType}){
  return (
    <Card className="p-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded-lg bg-slate-100">
          <Icon className="w-4 h-4 text-slate-600"/>
        </div>
      </div>
      <div className="text-lg font-bold text-slate-900 mb-1">{value}</div>
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      {change && (
        <div className={`text-xs font-medium ${changeType === 'positive' ? 'text-emerald-600' : 'text-rose-600'}`}>
          {changeType === 'positive' ? '↗' : '↘'} {change}
        </div>
      )}
    </Card>
  );
}