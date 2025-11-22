"use client";
import React, { useState, useRef } from 'react';
import { Camera, Upload, Wifi, WifiOff, Play, Pause, Settings, Eye, Droplets, Activity, AlertTriangle, CheckCircle, Loader } from 'lucide-react';

const AquacultureEventForm = () => {
  const [selectedEvent, setSelectedEvent] = useState('');
  const [isAutoCapture, setIsAutoCapture] = useState(false);
  const [captureInterval, setCaptureInterval] = useState(30);
  const [sensorStatus, setSensorStatus] = useState({
    temperature: 'connected',
    ph: 'connected',
    oxygen: 'disconnected',
    turbidity: 'connected'
  });
  const [visionModule, setVisionModule] = useState({ status: 'ready', processing: false });
  const [formData, setFormData] = useState({
    pond: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].slice(0,5),
    // Muestreo Biométrico
    sampleSize: '',
    averageWeight: '',
    averageLength: '',
    biometricPhotos: [],
    // Mortalidad
    mortalityCount: '',
    mortalityCause: '',
    mortalityPhotos: [],
    // Calidad del agua
    temperature: '',
    ph: '',
    dissolvedOxygen: '',
    turbidity: '',
    ammonia: '',
    nitrites: '',
    notes: ''
  });

  const fileInputRef = useRef(null);
  const [currentPhotoType, setCurrentPhotoType] = useState('');

  const eventTypes = [
    { value: 'biometric', label: 'Muestreo Biométrico', icon: Activity },
    { value: 'mortality', label: 'Registro de Mortalidad', icon: AlertTriangle },
    { value: 'water_quality', label: 'Calidad del Agua', icon: Droplets }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoCapture = (type) => {
    setCurrentPhotoType(type);
    // Simular captura de cámara
    const newPhoto = {
      id: Date.now(),
      url: `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...`, // Placeholder
      timestamp: new Date().toISOString(),
      type: type
    };
    
    if (type === 'biometric') {
      setFormData(prev => ({
        ...prev,
        biometricPhotos: [...prev.biometricPhotos, newPhoto]
      }));
    } else if (type === 'mortality') {
      setFormData(prev => ({
        ...prev,
        mortalityPhotos: [...prev.mortalityPhotos, newPhoto]
      }));
    }
  };

  const handleVisionAnalysis = async (type) => {
    setVisionModule(prev => ({ ...prev, processing: true }));
    
    // Simular procesamiento del módulo de visión
    setTimeout(() => {
      if (type === 'biometric') {
        setFormData(prev => ({
          ...prev,
          sampleSize: '50',
          averageWeight: '125.6',
          averageLength: '18.2'
        }));
      } else if (type === 'mortality') {
        setFormData(prev => ({
          ...prev,
          mortalityCount: '3',
          mortalityCause: 'Detección automática: Posible enfermedad bacteriana'
        }));
      }
      setVisionModule(prev => ({ ...prev, processing: false }));
    }, 3000);
  };

  const handleSensorRead = () => {
    // Simular lectura de sensores
    const sensorData = {
      temperature: (22 + Math.random() * 6).toFixed(1),
      ph: (6.5 + Math.random() * 2).toFixed(1),
      dissolvedOxygen: (5 + Math.random() * 3).toFixed(1),
      turbidity: (10 + Math.random() * 20).toFixed(0),
      ammonia: (0.1 + Math.random() * 0.5).toFixed(2),
      nitrites: (0.05 + Math.random() * 0.3).toFixed(2)
    };

    Object.keys(sensorData).forEach(key => {
      handleInputChange(key, sensorData[key]);
    });
  };

  const toggleAutoCapture = () => {
    setIsAutoCapture(!isAutoCapture);
    if (!isAutoCapture) {
      // Simular inicio de captura automática
      console.log(`Iniciando captura automática cada ${captureInterval} minutos`);
    }
  };

  const SensorIndicator = ({ sensor, status }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'connected': return 'text-green-500';
        case 'disconnected': return 'text-red-500';
        case 'warning': return 'text-yellow-500';
        default: return 'text-gray-500';
      }
    };

    const getStatusIcon = (status) => {
      return status === 'connected' ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />;
    };

    return (
      <div className={`flex items-center gap-2 ${getStatusColor(status)}`}>
        {getStatusIcon(status)}
        <span className="text-sm capitalize">{sensor}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Registro de Eventos</h1>
          <p className="text-gray-600">Captura y monitoreo de datos de acuicultura</p>
        </div>

        <div className="space-y-6">
          {/* Información básica */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Información General</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estanque</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.pond}
                  onChange={(e) => handleInputChange('pond', e.target.value)}
                >
                  <option value="">Seleccionar estanque</option>
                  <option value="A1">Estanque A1</option>
                  <option value="A2">Estanque A2</option>
                  <option value="B1">Estanque B1</option>
                  <option value="B2">Estanque B2</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hora</label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Selección de tipo de evento */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Tipo de Evento</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {eventTypes.map((event) => {
                const Icon = event.icon;
                return (
                  <button
                    key={event.value}
                    type="button"
                    onClick={() => setSelectedEvent(selectedEvent === event.value ? '' : event.value)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      selectedEvent === event.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-sm font-medium">{event.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Muestreo Biométrico */}
          {selectedEvent === 'biometric' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-800">Muestreo Biométrico</h2>
              </div>

              {/* Botones de captura */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => handlePhotoCapture('biometric')}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Camera className="w-5 h-5" />
                  Capturar Foto
                </button>
                <button
                  type="button"
                  onClick={() => handleVisionAnalysis('biometric')}
                  disabled={visionModule.processing}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {visionModule.processing ? <Loader className="w-5 h-5 animate-spin" /> : <Eye className="w-5 h-5" />}
                  {visionModule.processing ? 'Analizando...' : 'Análisis con IA'}
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  Subir Imagen
                </button>
              </div>

              {/* Datos biométricos */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tamaño de muestra</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.sampleSize}
                    onChange={(e) => handleInputChange('sampleSize', e.target.value)}
                    placeholder="Número de peces"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Peso promedio (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.averageWeight}
                    onChange={(e) => handleInputChange('averageWeight', e.target.value)}
                    placeholder="125.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Longitud promedio (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.averageLength}
                    onChange={(e) => handleInputChange('averageLength', e.target.value)}
                    placeholder="18.2"
                  />
                </div>
              </div>

              {/* Preview de fotos */}
              {formData.biometricPhotos.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Fotos capturadas</h3>
                  <div className="flex gap-2">
                    {formData.biometricPhotos.map((photo, index) => (
                      <div key={photo.id} className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Camera className="w-6 h-6 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Registro de Mortalidad */}
          {selectedEvent === 'mortality' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <h2 className="text-xl font-semibold text-gray-800">Registro de Mortalidad</h2>
              </div>

              {/* Botones de captura */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => handlePhotoCapture('mortality')}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Camera className="w-5 h-5" />
                  Fotografiar Mortalidad
                </button>
                <button
                  type="button"
                  onClick={() => handleVisionAnalysis('mortality')}
                  disabled={visionModule.processing}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                >
                  {visionModule.processing ? <Loader className="w-5 h-5 animate-spin" /> : <Eye className="w-5 h-5" />}
                  {visionModule.processing ? 'Detectando...' : 'Detectar Causa'}
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  Subir Imagen
                </button>
              </div>

              {/* Datos de mortalidad */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Número de peces muertos</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.mortalityCount}
                    onChange={(e) => handleInputChange('mortalityCount', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Causa aparente</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.mortalityCause}
                    onChange={(e) => handleInputChange('mortalityCause', e.target.value)}
                    placeholder="Descripción o detección automática"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Calidad del Agua */}
          {selectedEvent === 'water_quality' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Droplets className="w-6 h-6 text-cyan-600" />
                  <h2 className="text-xl font-semibold text-gray-800">Calidad del Agua</h2>
                </div>
                
                {/* Control de captura automática */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Intervalo (min):</label>
                    <input
                      type="number"
                      value={captureInterval}
                      onChange={(e) => setCaptureInterval(e.target.value)}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                      min="5"
                      max="240"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={toggleAutoCapture}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isAutoCapture 
                        ? 'bg-red-600 text-white hover:bg-red-700' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {isAutoCapture ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isAutoCapture ? 'Pausar Auto' : 'Inicio Auto'}
                  </button>
                </div>
              </div>

              {/* Estado de sensores */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-700">Estado de Sensores</h3>
                  <button
                    type="button"
                    onClick={handleSensorRead}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Leer Sensores
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <SensorIndicator sensor="temperatura" status={sensorStatus.temperature} />
                  <SensorIndicator sensor="pH" status={sensorStatus.ph} />
                  <SensorIndicator sensor="oxígeno" status={sensorStatus.oxygen} />
                  <SensorIndicator sensor="turbidez" status={sensorStatus.turbidity} />
                </div>
              </div>

              {/* Parámetros de calidad del agua */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Temperatura (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.temperature}
                    onChange={(e) => handleInputChange('temperature', e.target.value)}
                    placeholder="25.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">pH</label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.ph}
                    onChange={(e) => handleInputChange('ph', e.target.value)}
                    placeholder="7.2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Oxígeno Disuelto (mg/L)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.dissolvedOxygen}
                    onChange={(e) => handleInputChange('dissolvedOxygen', e.target.value)}
                    placeholder="6.8"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Turbidez (NTU)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.turbidity}
                    onChange={(e) => handleInputChange('turbidity', e.target.value)}
                    placeholder="15"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amoníaco (mg/L)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.ammonia}
                    onChange={(e) => handleInputChange('ammonia', e.target.value)}
                    placeholder="0.25"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nitritos (mg/L)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.nitrites}
                    onChange={(e) => handleInputChange('nitrites', e.target.value)}
                    placeholder="0.15"
                  />
                </div>
              </div>

              {/* Indicador de captura automática activa */}
              {isAutoCapture && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-700 text-sm font-medium">
                      Captura automática activa - Próxima lectura en {captureInterval} minutos
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notas adicionales */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Notas Adicionales</h2>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Observaciones adicionales, condiciones especiales, etc."
            />
          </div>

          {/* Botones de acción */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => {
                // Simular guardado del evento
                console.log('Guardando evento:', formData);
                alert('Evento guardado exitosamente');
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Guardar Evento
            </button>
          </div>
        </div>

        {/* Input oculto para archivos */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            // Manejar subida de archivos
            console.log('Archivos seleccionados:', e.target.files);
          }}
        />
      </div>
    </div>
  );
};

export default AquacultureEventForm;