"use client";

import React, { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";
import {
  Fish,
  Droplets,
  Thermometer,
  Activity,
  AlertTriangle,
  TrendingUp,
  Users,
  Calendar,
  Settings,
  RefreshCw,
  Eye,
  Bell,
  Download,
  X as CloseIcon,
  Filter,
  Search,
  Camera,
  Plus,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

// ===================== Types =====================
interface FishPond {
  id: string;
  name: string;
  species: string; // Tilapia | Trucha | Camarón | etc.
  stage: "larvas" | "juveniles" | "adultos";
  site: string; // Sede
  group: string; // Grupo de piscinas
  capacity: number;
  currentStock: number;
  waterTemp: number;
  ph: number;
  oxygenLevel: number;
  feedingSchedule: string;
  lastFed: string;
  healthStatus: "excellent" | "good" | "warning" | "critical";
  location: { lat: number; lng: number };
  createdDate: string;
  harvestDate: string;
}

interface Sensor {
  id: string;
  pondId: string;
  type: "temperature" | "ph" | "oxygen" | "turbidity";
  value: number;
  unit: string;
  timestamp: string;
  status: "online" | "offline" | "maintenance";
}

interface AlertItem {
  id: string;
  pondId: string;
  type: "temperature" | "ph" | "oxygen" | "feeding" | "health" | "maintenance";
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  timestamp: string;
  resolved: boolean;
}

// ===================== Component =====================
const AquacultureDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "ponds" | "sensors" | "analytics" | "alerts" | "reports"
  >("overview");
  const [showAddPond, setShowAddPond] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedPond, setExpandedPond] = useState<string | null>(null);

  // ---------- Sample Data (replace with API later) ----------
  const [ponds, setPonds] = useState<FishPond[]>([
    {
      id: "1",
      name: "Estanque Principal A",
      species: "Tilapia",
      stage: "adultos",
      site: "Machala",
      group: "Lote 1",
      capacity: 5000,
      currentStock: 4200,
      waterTemp: 24.5,
      ph: 7.2,
      oxygenLevel: 8.5,
      feedingSchedule: "3 veces al día",
      lastFed: "2025-08-27 08:00",
      healthStatus: "excellent",
      location: { lat: -0.1807, lng: -78.4678 },
      createdDate: "2025-01-15",
      harvestDate: "2025-12-15",
    },
    {
      id: "2",
      name: "Estanque Juvenil B",
      species: "Trucha",
      stage: "juveniles",
      site: "Machala",
      group: "Lote 2",
      capacity: 3000,
      currentStock: 2800,
      waterTemp: 16.8,
      ph: 6.8,
      oxygenLevel: 9.2,
      feedingSchedule: "4 veces al día",
      lastFed: "2025-08-27 07:30",
      healthStatus: "good",
      location: { lat: -0.185, lng: -78.472 },
      createdDate: "2025-02-01",
      harvestDate: "2025-11-30",
    },
    {
      id: "3",
      name: "Estanque Reproductivo C",
      species: "Camarón",
      stage: "larvas",
      site: "Loja",
      group: "Lote 3",
      capacity: 4000,
      currentStock: 3500,
      waterTemp: 28.1,
      ph: 7.9,
      oxygenLevel: 6.9,
      feedingSchedule: "2 veces al día",
      lastFed: "2025-08-27 06:45",
      healthStatus: "warning",
      location: { lat: -0.189, lng: -78.465 },
      createdDate: "2025-01-20",
      harvestDate: "2025-10-20",
    },
  ]);

  const [sensors, setSensors] = useState<Sensor[]>([
    { id: "s1", pondId: "1", type: "temperature", value: 24.5, unit: "°C", timestamp: "2025-08-27 12:00", status: "online" },
    { id: "s2", pondId: "1", type: "ph", value: 7.2, unit: "pH", timestamp: "2025-08-27 12:00", status: "online" },
    { id: "s3", pondId: "2", type: "oxygen", value: 9.2, unit: "mg/L", timestamp: "2025-08-27 12:00", status: "online" },
    { id: "s4", pondId: "3", type: "temperature", value: 28.1, unit: "°C", timestamp: "2025-08-27 12:00", status: "maintenance" },
  ]);

  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: "a1",
      pondId: "3",
      type: "oxygen",
      severity: "medium",
      message: "Nivel de oxígeno por debajo del óptimo en Estanque C",
      timestamp: "2025-08-27 11:30",
      resolved: false,
    },
    {
      id: "a2",
      pondId: "2",
      type: "feeding",
      severity: "low",
      message: "Próxima alimentación programada en 30 minutos",
      timestamp: "2025-08-27 12:00",
      resolved: false,
    },
  ]);

  // ---------- Memos ----------
  const filteredPonds = useMemo(() => {
    return ponds.filter((pond) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        pond.name.toLowerCase().includes(q) ||
        pond.species.toLowerCase().includes(q) ||
        pond.site.toLowerCase().includes(q) ||
        pond.group.toLowerCase().includes(q);
      const matchesStatus = filterStatus === "all" || pond.healthStatus === (filterStatus as FishPond["healthStatus"]);
      return matchesSearch && matchesStatus;
    });
  }, [ponds, searchTerm, filterStatus]);

  const totalCapacity = ponds.reduce((sum, p) => sum + p.capacity, 0);
  const totalStock = ponds.reduce((sum, p) => sum + p.currentStock, 0);
  const averageTemp = ponds.reduce((sum, p) => sum + p.waterTemp, 0) / ponds.length;
  const unresolvedAlerts = alerts.filter((a) => !a.resolved).length;

  const getStatusColor = (status: FishPond["healthStatus"]) => {
    switch (status) {
      case "excellent":
        return "text-green-600 bg-green-100";
      case "good":
        return "text-blue-600 bg-blue-100";
      case "warning":
        return "text-yellow-600 bg-yellow-100";
      case "critical":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getSeverityColor = (severity: AlertItem["severity"]) => {
    switch (severity) {
      case "low":
        return "text-green-600 bg-green-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "high":
        return "text-orange-600 bg-orange-100";
      case "critical":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const resolveAlert = (id: string) => setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, resolved: true } : a)));

  // ---------- Chart Data ----------
  const waterQualityData = useMemo(
    () => [
      { time: "00:00", temp: 24.2, ph: 7.1, oxygen: 8.3 },
      { time: "04:00", temp: 23.8, ph: 7.0, oxygen: 8.1 },
      { time: "08:00", temp: 24.5, ph: 7.2, oxygen: 8.5 },
      { time: "12:00", temp: 25.1, ph: 7.3, oxygen: 8.7 },
      { time: "16:00", temp: 25.8, ph: 7.4, oxygen: 8.9 },
      { time: "20:00", temp: 25.2, ph: 7.2, oxygen: 8.6 },
    ],
    []
  );

  const productionData = useMemo(
    () => [
      { month: "Ene", tilapia: 1200, trucha: 800, salmon: 600 },
      { month: "Feb", tilapia: 1350, trucha: 900, salmon: 750 },
      { month: "Mar", tilapia: 1400, trucha: 950, salmon: 800 },
      { month: "Abr", tilapia: 1500, trucha: 1000, salmon: 850 },
      { month: "May", tilapia: 1600, trucha: 1100, salmon: 900 },
      { month: "Jun", tilapia: 1750, trucha: 1200, salmon: 950 },
    ],
    []
  );

  const speciesDistribution = useMemo(
    () => [
      { name: "Tilapia", value: 4200, color: "#3B82F6" },
      { name: "Trucha", value: 2800, color: "#10B981" },
      { name: "Camarón", value: 3500, color: "#F59E0B" },
    ],
    []
  );

  // ---------- Sections ----------
  const renderOverview = () => (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Stock Total</p>
              <p className="text-2xl font-bold text-gray-900">{totalStock.toLocaleString()}</p>
              <p className="text-xs text-green-600">+12% vs mes anterior</p>
            </div>
            <Fish className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Capacidad Total</p>
              <p className="text-2xl font-bold text-gray-900">{totalCapacity.toLocaleString()}</p>
              <p className="text-xs text-gray-500">{((totalStock / totalCapacity) * 100).toFixed(1)}% ocupación</p>
            </div>
            <Droplets className="h-8 w-8 text-cyan-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Temp. Promedio</p>
              <p className="text-2xl font-bold text-gray-900">{averageTemp.toFixed(1)}°C</p>
              <p className="text-xs text-green-600">Óptimo</p>
            </div>
            <Thermometer className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Alertas Activas</p>
              <p className="text-2xl font-bold text-gray-900">{unresolvedAlerts}</p>
              <p className="text-xs text-yellow-600">Requieren atención</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Water Quality Chart */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Calidad del Agua (24h)</h3>
            <div className="flex space-x-2">
              <button className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">24h</button>
              <button className="text-xs text-gray-500 px-2 py-1 rounded hover:bg-gray-100">7d</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={waterQualityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="temp" stroke="#ef4444" name="Temperatura (°C)" />
              <Line type="monotone" dataKey="ph" stroke="#3b82f6" name="pH" />
              <Line type="monotone" dataKey="oxygen" stroke="#10b981" name="Oxígeno (mg/L)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Species Distribution */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Distribución por Especies</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={speciesDistribution}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {speciesDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [value.toLocaleString(), "Peces"]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Production Chart */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Producción Mensual (kg)</h3>
          <button className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            <Download className="h-4 w-4" />
            <span>Exportar</span>
          </button>
        </div>
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={productionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="tilapia" fill="#3b82f6" name="Tilapia" />
            <Bar dataKey="trucha" fill="#10b981" name="Trucha" />
            <Bar dataKey="salmon" fill="#f59e0b" name="Salmón" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderPonds = () => (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar estanques..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Todos los estados</option>
                <option value="excellent">Excelente</option>
                <option value="good">Bueno</option>
                <option value="warning">Advertencia</option>
                <option value="critical">Crítico</option>
              </select>
            </div>
          </div>
          <button
            onClick={() => setShowAddPond(true)}
            className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Agregar Estanque</span>
          </button>
        </div>
      </div>

      {/* Ponds Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPonds.map((pond) => (
          <div key={pond.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{pond.name}</h3>
                  <p className="text-sm text-gray-500">{pond.species} · {pond.stage}</p>
                  <p className="text-xs text-gray-400">{pond.site} · {pond.group}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(pond.healthStatus)}`}>
                    {pond.healthStatus}
                  </span>
                  <button
                    onClick={() => setExpandedPond(expandedPond === pond.id ? null : pond.id)}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label={expandedPond === pond.id ? "Contraer" : "Expandir"}
                  >
                    {expandedPond === pond.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Ocupación</span>
                  <span className="text-sm font-medium">
                    {pond.currentStock}/{pond.capacity} ({((pond.currentStock / pond.capacity) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(pond.currentStock / pond.capacity) * 100}%` }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Thermometer className="h-4 w-4 text-red-500" />
                      <span className="text-xs text-gray-500">Temp</span>
                    </div>
                    <p className="text-sm font-medium">{pond.waterTemp}°C</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      <span className="text-xs text-gray-500">pH</span>
                    </div>
                    <p className="text-sm font-medium">{pond.ph}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Activity className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-gray-500">O₂</span>
                    </div>
                    <p className="text-sm font-medium">{pond.oxygenLevel} mg/L</p>
                  </div>
                </div>

                {expandedPond === pond.id && (
                  <div className="mt-4 pt-4 border-t space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Última alimentación</p>
                        <p className="font-medium">{pond.lastFed}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Horario</p>
                        <p className="font-medium">{pond.feedingSchedule}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Fecha creación</p>
                        <p className="font-medium">{pond.createdDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Cosecha estimada</p>
                        <p className="font-medium">{pond.harvestDate}</p>
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <button className="flex-1 flex items-center justify-center space-x-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                        <Eye className="h-4 w-4" />
                        <span>Ver detalles</span>
                      </button>
                      <button className="flex-1 flex items-center justify-center space-x-1 bg-green-50 text-green-600 px-3 py-2 rounded-lg hover:bg-green-100 transition-colors">
                        <Camera className="h-4 w-4" />
                        <span>Monitorear</span>
                      </button>
                      <button className="flex items-center justify-center space-x-1 bg-gray-50 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <Settings className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSensors = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Estado de Sensores</h3>
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500">Actualizado hace 2 min</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sensors.map((sensor) => {
            const pond = ponds.find((p) => p.id === sensor.pondId);
            return (
              <div key={sensor.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {sensor.type === "temperature" && <Thermometer className="h-4 w-4 text-red-500" />}
                    {sensor.type === "ph" && <Droplets className="h-4 w-4 text-blue-500" />}
                    {sensor.type === "oxygen" && <Activity className="h-4 w-4 text-green-500" />}
                    {sensor.type === "turbidity" && <Eye className="h-4 w-4 text-yellow-500" />}
                    <span className="text-sm font-medium capitalize">{sensor.type}</span>
                  </div>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      sensor.status === "online"
                        ? "bg-green-500"
                        : sensor.status === "offline"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-2xl font-bold">
                    {sensor.value} {sensor.unit}
                  </p>
                  <p className="text-xs text-gray-500">{pond?.name}</p>
                  <p className="text-xs text-gray-400">{sensor.timestamp}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        sensor.status === "online"
                          ? "bg-green-100 text-green-600"
                          : sensor.status === "offline"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {sensor.status}
                    </span>
                    <button className="text-xs text-blue-600 hover:text-blue-800">Calibrar</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-time monitoring */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Monitoreo en Tiempo Real</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPonds.map((pond) => (
            <div key={pond.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">{pond.name}</h4>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(pond.healthStatus)}`}>
                  {pond.healthStatus}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Temperatura</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(pond.waterTemp / 35) * 100}%` }} />
                    </div>
                    <span className="text-sm font-medium">{pond.waterTemp}°C</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">pH</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(pond.ph / 14) * 100}%` }} />
                    </div>
                    <span className="text-sm font-medium">{pond.ph}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Oxígeno</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(pond.oxygenLevel / 12) * 100}%` }} />
                    </div>
                    <span className="text-sm font-medium">{pond.oxygenLevel} mg/L</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Alertas del Sistema</h3>
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-500">{unresolvedAlerts} sin resolver</span>
          </div>
        </div>

        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`border-l-4 rounded-lg p-4 ${
                alert.resolved
                  ? "bg-gray-50 border-gray-300"
                  : alert.severity === "critical"
                  ? "bg-red-50 border-red-500"
                  : alert.severity === "high"
                  ? "bg-orange-50 border-orange-500"
                  : alert.severity === "medium"
                  ? "bg-yellow-50 border-yellow-500"
                  : "bg-blue-50 border-blue-500"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(alert.severity)}`}>
                      {alert.severity}
                    </span>
                    <span className="text-xs text-gray-500">{alert.timestamp}</span>
                    {alert.resolved && (
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">Resuelto</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-900 mb-1">{alert.message}</p>
                  <p className="text-xs text-gray-500">Estanque: {ponds.find((p) => p.id === alert.pondId)?.name ?? "Desconocido"}</p>
                </div>
                {!alert.resolved && (
                  <button
                    onClick={() => resolveAlert(alert.id)}
                    className="ml-4 bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition-colors"
                  >
                    Resolver
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Tendencias de Crecimiento</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={productionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="tilapia" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.7} />
              <Area type="monotone" dataKey="trucha" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.7} />
              <Area type="monotone" dataKey="salmon" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.7} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Tendencias de Calidad del Agua</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={waterQualityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="temp" stroke="#ef4444" strokeWidth={3} />
              <Line type="monotone" dataKey="ph" stroke="#3b82f6" strokeWidth={3} />
              <Line type="monotone" dataKey="oxygen" stroke="#10b981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <h4 className="text-lg font-semibold">Eficiencia de Alimentación</h4>
          <p className="text-3xl font-bold text-green-600 my-2">94.2%</p>
          <p className="text-sm text-gray-500">+2.1% vs mes anterior</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <Activity className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <h4 className="text-lg font-semibold">Tasa de Supervivencia</h4>
          <p className="text-3xl font-bold text-blue-600 my-2">96.8%</p>
          <p className="text-sm text-gray-500">+0.5% vs mes anterior</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
          <h4 className="text-lg font-semibold">Densidad Promedio</h4>
          <p className="text-3xl font-bold text-purple-600 my-2">84.0%</p>
          <p className="text-sm text-gray-500">Capacidad utilizada</p>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Generador de Reportes</h3>
          <div className="flex items-center space-x-2">
            <select className="border rounded-lg px-3 py-2">
              <option>Último mes</option>
              <option>Últimos 3 meses</option>
              <option>Último año</option>
            </select>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Generar</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: <Fish className="h-8 w-8 text-blue-500" />, title: "Reporte de Producción", format: "PDF", pages: "~15 páginas", desc: "Análisis de producción, crecimiento y rendimiento" },
            { icon: <Activity className="h-8 w-8 text-green-500" />, title: "Calidad del Agua", format: "Excel", pages: "~8 hojas", desc: "Histórico de parámetros, tendencias y alertas" },
            { icon: <TrendingUp className="h-8 w-8 text-purple-500" />, title: "Análisis Financiero", format: "PDF", pages: "~12 páginas", desc: "Costos, ingresos y proyecciones" },
            { icon: <AlertTriangle className="h-8 w-8 text-yellow-500" />, title: "Reporte de Alertas", format: "PDF", pages: "~6 páginas", desc: "Historial y estadísticas de incidentes" },
            { icon: <Users className="h-8 w-8 text-indigo-500" />, title: "Eficiencia Operativa", format: "PDF", pages: "~10 páginas", desc: "KPIs y optimizaciones" },
            { icon: <Calendar className="h-8 w-8 text-red-500" />, title: "Planificación", format: "Excel", pages: "~5 hojas", desc: "Cronograma de actividades y cosechas" },
          ].map((card) => (
            <div key={card.title} className="border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center space-x-3 mb-4">
                {card.icon}
                <h4 className="font-medium">{card.title}</h4>
              </div>
              <p className="text-sm text-gray-600 mb-4">{card.desc}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Formato: {card.format}</span>
                <span className="text-blue-600">{card.pages}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6">
          <h4 className="text-lg font-semibold mb-2">Total Reportes</h4>
          <p className="text-3xl font-bold">147</p>
          <p className="text-sm opacity-80">Este año</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6">
          <h4 className="text-lg font-semibold mb-2">Última Exportación</h4>
          <p className="text-lg font-bold">Hace 2 días</p>
          <p className="text-sm opacity-80">Reporte de producción</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6">
          <h4 className="text-lg font-semibold mb-2">Tamaño Promedio</h4>
          <p className="text-3xl font-bold">2.4 MB</p>
          <p className="text-sm opacity-80">Por reporte</p>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-6">
          <h4 className="text-lg font-semibold mb-2">Automatizados</h4>
          <p className="text-3xl font-bold">85%</p>
          <p className="text-sm opacity-80">De los reportes</p>
        </div>
      </div>
    </div>
  );

  // ---------- Layout ----------
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Fish className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">AquaCulture Pro</h1>
                <p className="text-sm text-gray-500">Sistema de Gestión Acuícola v19</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-green-100 text-green-700 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium">Sistema Online</span>
              </div>
              <div className="flex items-center space-x-2 relative">
                <Bell className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
                {unresolvedAlerts > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unresolvedAlerts}
                  </div>
                )}
                <Settings className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: "overview", label: "Resumen", icon: Activity },
              { id: "ponds", label: "Estanques", icon: Fish },
              { id: "sensors", label: "Sensores", icon: Thermometer },
              { id: "analytics", label: "Análisis", icon: TrendingUp },
              { id: "alerts", label: "Alertas", icon: AlertTriangle },
              { id: "reports", label: "Reportes", icon: Download },
            ].map((tab) => {
              const Icon = tab.icon as any;
              const id = tab.id as typeof activeTab;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  {tab.id === "alerts" && unresolvedAlerts > 0 && (
                    <span className="bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {unresolvedAlerts}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && renderOverview()}
        {activeTab === "ponds" && renderPonds()}
        {activeTab === "sensors" && renderSensors()}
        {activeTab === "analytics" && renderAnalytics()}
        {activeTab === "alerts" && renderAlerts()}
        {activeTab === "reports" && renderReports()}
      </div>

      {/* Add Pond Modal */}
      {showAddPond && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Agregar Nuevo Estanque</h3>
              <button onClick={() => setShowAddPond(false)} className="text-gray-400 hover:text-gray-600">
                <CloseIcon className="h-6 w-6" />
              </button>
            </div>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                // minimal demo: agrega un estanque vacío
                const newPond: FishPond = {
                  id: String(Date.now()),
                  name: "Nuevo Estanque",
                  species: "Tilapia",
                  stage: "juveniles",
                  site: "Machala",
                  group: "Lote X",
                  capacity: 1000,
                  currentStock: 0,
                  waterTemp: 24,
                  ph: 7,
                  oxygenLevel: 8,
                  feedingSchedule: "3 veces al día",
                  lastFed: new Date().toISOString().slice(0, 16).replace("T", " "),
                  healthStatus: "good",
                  location: { lat: 0, lng: 0 },
                  createdDate: new Date().toISOString().slice(0, 10),
                  harvestDate: "2025-12-31",
                };
                setPonds((prev) => [newPond, ...prev]);
                setShowAddPond(false);
              }}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Estanque</label>
                <input type="text" className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej. Piscina 7" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Especie</label>
                  <select className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Tilapia</option>
                    <option>Trucha</option>
                    <option>Camarón</option>
                    <option>Carpa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad (peces)</label>
                  <input type="number" className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" defaultValue={1000} />
                </div>
              </div>
              <div className="flex space-x-4 pt-4">
                <button type="button" onClick={() => setShowAddPond(false)} className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                  Crear Estanque
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AquacultureDashboard;
