"use client";

import React, { useMemo, useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { Fish, Waves, Thermometer, Droplets, Gauge, AlertTriangle, Bell, Camera, Database, Settings, Activity, MapPinned, LayoutDashboard, CloudLightning, Smartphone, Calendar, TrendingUp, Scale, Target, Clock, Users, Utensils, Heart, DollarSign, Package, BarChart3 } from "lucide-react";

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

export default function AquaDashboard(){
  const [tab, setTab] = useState("cycles");
  const [site, setSite] = useState("Machala");
  const [group, setGroup] = useState("Grupo 1");
  const [pond, setPond] = useState("A");
  const [species, setSpecies] = useState("Trucha");
  const [stage, setStage] = useState("Juveniles");
  const [series, setSeries] = useState(genSeries());

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
          <h1 className="text-lg font-semibold">SoluvIA • Producción y Ciclo</h1>
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

          <ProductionCycleView kpis={kpis} />
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

function ProductionCycleView({kpis}){
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
            <button className="px-4 py-2 rounded-xl bg-sky-600 text-white text-sm hover:bg-sky-700">
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

      {/* Gráficos principales */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Evolución de biomasa y peso */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Evolución de Biomasa y Peso Promedio</h3>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-sky-500 rounded-full"></div>
              <span className="text-xs text-slate-500">Biomasa</span>
              <div className="w-3 h-3 bg-emerald-500 rounded-full ml-2"></div>
              <span className="text-xs text-slate-500">Peso Prom.</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={biomasaData} margin={{left:20, right:20, top:10, bottom:10}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="semana" stroke="#64748b" fontSize={12} />
                <YAxis yAxisId="biomasa" orientation="left" stroke="#64748b" fontSize={12} />
                <YAxis yAxisId="peso" orientation="right" stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Line 
                  yAxisId="biomasa" 
                  type="monotone" 
                  dataKey="biomasa" 
                  stroke="#0ea5e9" 
                  strokeWidth={3}
                  dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }}
                  name="Biomasa (kg)"
                />
                <Line 
                  yAxisId="peso" 
                  type="monotone" 
                  dataKey="pesoPromedio" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  name="Peso Prom. (kg)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Alimentación semanal */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Alimentación Esta Semana</h3>
            <div className="text-sm text-slate-500">Total: 294 kg • $876</div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={alimentacionData} margin={{left:20, right:20, top:10, bottom:10}}>
                <defs>
                  <linearGradient id="alimentoGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="dia" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="alimentoKg" 
                  stroke="#f59e0b" 
                  fill="url(#alimentoGradient)"
                  strokeWidth={2}
                  name="Alimento (kg)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Segunda fila de gráficos */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Análisis de mortalidad */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">Causas de Mortalidad</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mortalidadData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {mortalidadData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Porcentaje']}
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
          <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
            {mortalidadData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></div>
                <span>{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Métricas de eficiencia */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">Eficiencia Productiva</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Factor de Conversión (FCA)</span>
              <div className="text-right">
                <div className="font-semibold">1.85</div>
                <div className="text-xs text-emerald-600">Excelente</div>
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-emerald-500 h-2 rounded-full" style={{width: '85%'}}></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Tasa de Supervivencia</span>
              <div className="text-right">
                <div className="font-semibold">95.25%</div>
                <div className="text-xs text-emerald-600">Meta: 95%</div>
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-emerald-500 h-2 rounded-full" style={{width: '95.25%'}}></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Tasa de Crecimiento</span>
              <div className="text-right">
                <div className="font-semibold">12.5%/sem</div>
                <div className="text-xs text-sky-600">Por encima promedio</div>
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-sky-500 h-2 rounded-full" style={{width: '78%'}}></div>
            </div>
          </div>
        </Card>

        {/* Proyecciones */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">Proyecciones de Cosecha</h3>
          <div className="space-y-4">
            <div className="bg-sky-50 p-3 rounded-xl">
              <div className="text-sm text-sky-700 font-medium mb-1">Peso estimado por pez</div>
              <div className="text-lg font-bold text-sky-800">0.85 - 1.2 kg</div>
            </div>
            
            <div className="bg-emerald-50 p-3 rounded-xl">
              <div className="text-sm text-emerald-700 font-medium mb-1">Biomasa total esperada</div>
              <div className="text-lg font-bold text-emerald-800">1,800 - 2,100 kg</div>
            </div>

            <div className="bg-amber-50 p-3 rounded-xl">
              <div className="text-sm text-amber-700 font-medium mb-1">Ingreso estimado</div>
              <div className="text-lg font-bold text-amber-800">$14,400 - $16,800</div>
            </div>

            <div className="text-xs text-slate-500 pt-2 border-t">
              Basado en tendencia actual y condiciones ambientales
            </div>
          </div>
        </Card>
      </div>

      {/* Timeline de eventos */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Cronología del Ciclo</h3>
          <button className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm">
            Ver completo
          </button>
        </div>
        <div className="space-y-3">
          <TimelineEvent 
            date="24 Ago 2025" 
            time="14:30" 
            event="Alimentación registrada - 45kg" 
            type="normal"
            icon={Utensils}
          />
          <TimelineEvent 
            date="23 Ago 2025" 
            time="09:15" 
            event="Muestreo biométrico - Peso promedio: 0.538kg" 
            type="important"
            icon={Scale}
          />
          <TimelineEvent 
            date="22 Ago 2025" 
            time="16:45" 
            event="Mortalidad registrada - 3 peces (estrés térmico)" 
            type="warning"
            icon={AlertTriangle}
          />
          <TimelineEvent 
            date="20 Ago 2025" 
            time="08:00" 
            event="Tratamiento preventivo aplicado" 
            type="normal"
            icon={Heart}
          />
          <TimelineEvent 
            date="18 Ago 2025" 
            time="10:30" 
            event="Análisis de calidad de agua - Parámetros normales" 
            type="normal"
            icon={Droplets}
          />
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

function TimelineEvent({date, time, event, type, icon: Icon}){
  const typeStyles = {
    normal: "text-slate-600 bg-slate-100",
    important: "text-sky-600 bg-sky-100",
    warning: "text-amber-600 bg-amber-100"
  };

  return (
    <div className="flex items-start gap-3 py-2">
      <div className={`p-2 rounded-full ${typeStyles[type]}`}>
        <Icon className="w-4 h-4"/>
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-slate-900">{event}</div>
        <div className="text-xs text-slate-500">{date} • {time}</div>
      </div>
    </div>
  );
}