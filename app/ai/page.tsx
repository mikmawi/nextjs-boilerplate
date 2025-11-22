"use client";

import React, { useState } from "react";
import { Brain, Sparkles, BarChart3, Fish, Waves } from "lucide-react";

// ===================== Main Dashboard =====================
export default function AquaDashboard() {
  const [showAI, setShowAI] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Fish className="w-6 h-6 text-blue-500" /> AquaDashboard
          </h1>
          <div className="ml-auto flex items-center gap-2">
            {/* Botón para abrir IA */}
            <button
              onClick={() => setShowAI(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm flex items-center gap-2 shadow hover:scale-105 transition"
            >
              <Brain className="w-4 h-4" /> IA Asistente
            </button>
          </div>
        </div>
      </header>

      {/* Body principal */}
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-12 gap-4">
        {/* Sidebar */}
        <aside className="col-span-3 bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="font-semibold text-slate-700 flex items-center gap-2 mb-3">
            <Waves className="w-5 h-5 text-cyan-500" /> Piscinas
          </h2>
          <ul className="space-y-2 text-sm">
            <li className="p-2 rounded-lg bg-slate-100">Piscina Tilapia A</li>
            <li className="p-2 rounded-lg hover:bg-slate-100 cursor-pointer">
              Piscina Tilapia B
            </li>
            <li className="p-2 rounded-lg hover:bg-slate-100 cursor-pointer">
              Piscina Camarón 1
            </li>
          </ul>
        </aside>

        {/* Panel principal */}
        <main className="col-span-9 bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-500" /> Indicadores
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <KpiCard label="Oxígeno disuelto" value="6.2 mg/L" trend="↑" />
            <KpiCard label="pH" value="7.5" trend="→" />
            <KpiCard label="Temperatura" value="28 °C" trend="↓" />
          </div>
        </main>
      </div>

      {/* Overlay IA */}
      {showAI && <AIAssistantPanel onClose={() => setShowAI(false)} />}
    </div>
  );
}

// ===================== Componente KPI =====================
interface KpiCardProps {
  label: string;
  value: number | string;
  trend?: number | string;
}
function KpiCard({ label, value, trend }) {
  return (
    <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 border rounded-2xl shadow-sm flex flex-col">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-xl font-bold mt-1">{value}</span>
      <span className="text-sm mt-1 text-emerald-600">{trend}</span>
    </div>
  );
}

// ===================== Panel de IA =====================
function AIAssistantPanel({ onClose }) {
  const [tab, setTab] = useState("recs");

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
      <div className="w-full md:w-3/4 lg:w-2/3 bg-white h-full shadow-xl rounded-l-2xl flex flex-col">
        {/* Header IA */}
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" /> Asistente IA
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <Tab
            label="📋 Recomendaciones"
            active={tab === "recs"}
            onClick={() => setTab("recs")}
          />
          <Tab
            label="💬 Chat"
            active={tab === "chat"}
            onClick={() => setTab("chat")}
          />
          <Tab
            label="📊 Reportes"
            active={tab === "reports"}
            onClick={() => setTab("reports")}
          />
        </div>

        {/* Contenido dinámico */}
        <div className="flex-1 overflow-y-auto p-4">
          {tab === "recs" && <AIRecommendations />}
          {tab === "chat" && <AIChat />}
          {tab === "reports" && <AIReports />}
        </div>
      </div>
    </div>
  );
}

// ===================== Tabs Helper =====================
function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 px-3 py-2 text-sm font-medium ${
        active
          ? "border-b-2 border-purple-500 text-purple-600"
          : "text-slate-500"
      }`}
    >
      {label}
    </button>
  );
}

// ===================== Sección Recomendaciones =====================
function AIRecommendations() {
  const recs = [
    {
      text: "Aumentar aireación nocturna para mejorar oxigenación.",
      impact: "+12% supervivencia",
    },
    {
      text: "Reducir alimentación en 5% para evitar sobrecostos.",
      impact: "−8% gasto en balanceado",
    },
    {
      text: "Programar cosecha en 14 días según biomasa proyectada.",
      impact: "+10% rendimiento",
    },
  ];
  return (
    <div className="space-y-3">
      {recs.map((r, i) => (
        <div
          key={i}
          className="p-4 rounded-xl border bg-slate-50 shadow-sm flex flex-col"
        >
          <span className="text-sm">{r.text}</span>
          <span className="text-xs text-emerald-600 mt-1">{r.impact}</span>
          <div className="flex gap-2 mt-2">
            <button className="px-2 py-1 text-xs bg-emerald-500 text-white rounded-lg">
              Aplicar
            </button>
            <button className="px-2 py-1 text-xs bg-slate-200 rounded-lg">
              Descartar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ===================== Sección Chat =====================
function AIChat() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "👋 Hola, soy tu asistente acuícola IA. ¿Qué deseas consultar?" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", text: input }]);
    setInput("");
    // Aquí se conectaría con la API de OpenAI o LLM local
    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        { role: "assistant", text: "🤖 Estoy procesando tu consulta..." },
      ]);
    }, 500);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg text-sm max-w-xs ${
              m.role === "user"
                ? "ml-auto bg-blue-500 text-white"
                : "bg-slate-200"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded-lg p-2 text-sm"
          placeholder="Escribe tu consulta..."
        />
        <button
          onClick={sendMessage}
          className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}

// ===================== Sección Reportes =====================
function AIReports() {
  return (
    <div className="space-y-3">
      <div className="p-4 rounded-xl border bg-slate-50 shadow-sm">
        <h3 className="font-semibold">📅 Reporte Semanal</h3>
        <p className="text-sm mt-1">
          Mortalidad: 2.1% <br />
          Conversión alimenticia: 1.3 FCR <br />
          Biomasa total: 1.2 toneladas
        </p>
      </div>
      <div className="p-4 rounded-xl border bg-slate-50 shadow-sm">
        <h3 className="font-semibold">📈 Proyección de Cosecha</h3>
        <p className="text-sm mt-1">
          Se estima la cosecha de Tilapia A en 14 días con un peso promedio de
          480g.
        </p>
      </div>
    </div>
  );
}
