"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Gauge, Droplets, Fish, Skull, Settings, Play, Pause, RefreshCw, Wifi, WifiOff } from 'lucide-react';

const AquacultureEventForm = () => {
  const [activeTab, setActiveTab] = useState('biometric');
  const [sensorStatus, setSensorStatus] = useState('connected');
  const [autoCapture, setAutoCapture] = useState(false);
  const [captureInterval, setCaptureInterval] = useState(30);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Estados para cada tipo de evento
  const [biometricData, setBiometricData] = useState({
    species: '',
    averageWeight: '',
    averageLength: '',
    sampleSize: 10,
    capturedImages: [],
    visionAnalysis: null
  });

  const [mortalityData, setMortalityData] = useState({
    count: '',
    cause: '',
    images: [],
    notes: ''
  });

  const [waterQuality, setWaterQuality] = useState({
    temperature: '',
    ph: '',
    oxygen: '',
    ammonia: '',
    nitrites: '',
    nitrates: '',
    salinity: '',
    autoReading: false
  });

  // Simular datos de sensores
  const simulateSensorReading = () => {
    const newData = {
      temperature: (22 + Math.random() * 6).toFixed(1),
      ph: (6.8 + Math.random() * 1.4).toFixed(2),
      oxygen: (5 + Math.random() * 3).toFixed(1),
      ammonia: (0.1 + Math.random() * 0.5).toFixed(2),
      nitrites: (0.05 + Math.random() * 0.15).toFixed(3),
      nitrates: (10 + Math.random() * 20).toFixed(1),
      salinity: (34 + Math.random() * 2).toFixed(1)
    };
    setWaterQuality(prev => ({ ...prev, ...newData }));
    setLastUpdate(new Date());
  };

  // Captura automática periódica
  useEffect(() => {
    let interval;
    if (autoCapture && waterQuality.autoReading) {
      interval = setInterval(() => {
        simulateSensorReading();
      }, captureInterval * 1000);
    }
    return () => clearInterval(interval);
  }, [autoCapture, captureInterval, waterQuality.autoReading]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    
    const imageData = canvas.toDataURL('image/jpeg');
    
    if (activeTab === 'biometric') {
      setBiometricData(prev => ({
        ...prev,
        capturedImages: [...prev.capturedImages, {
          id: Date.now(),
          data: imageData,
          timestamp: new Date().toISOString()
        }]
      }));
      // Simular análisis de visión
      setTimeout(() => {
        setBiometricData(prev => ({
          ...prev,
          visionAnalysis: {
            detectedFish: Math.floor(Math.random() * 20) + 5,
            avgWeight: (150 + Math.random() * 100).toFixed(1),
            avgLength: (12 + Math.random() * 5).toFixed(1),
            confidence: (85 + Math.random() * 10).toFixed(1)
          }
        }));
      }, 2000);
    } else if (activeTab === 'mortality') {
      setMortalityData(prev => ({
        ...prev,
        images: [...prev.images, {
          id: Date.now(),
          data: imageData,
          timestamp: new Date().toISOString()
        }]
      }));
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        if (activeTab === 'biometric') {
          setBiometricData(prev => ({
            ...prev,
            capturedImages: [...prev.capturedImages, {
              id: Date.now(),
              data: imageData,
              timestamp: new Date().toISOString(),
              filename: file.name
            }]
          }));
        } else if (activeTab === 'mortality') {
          setMortalityData(prev => ({
            ...prev,
            images: [...prev.images, {
              id: Date.now(),
              data: imageData,
              timestamp: new Date().toISOString(),
              filename: file.name
            }]
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const eventData = {
      type: activeTab,
      timestamp: new Date().toISOString(),
      data: activeTab === 'biometric' ? biometricData : 
             activeTab === 'mortality' ? mortalityData : waterQuality
    };
    console.log('Evento registrado:', eventData);
    alert('Evento registrado exitosamente');
  };

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
        activeTab === id
          ? 'bg-blue-600 text-white shadow-lg'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Registro de Eventos</h2>
        <p className="text-gray-600">Sistema integrado de captura automática y manual</p>
      </div>

      {/* Control de captura automática */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Settings size={20} />
            Captura Automática
          </h3>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
              sensorStatus === 'connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {sensorStatus === 'connected' ? <Wifi size={12} /> : <WifiOff size={12} />}
              {sensorStatus === 'connected' ? 'Sensores Conectados' : 'Sensores Desconectados'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setAutoCapture(!autoCapture)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              autoCapture 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {autoCapture ? <Pause size={16} /> : <Play size={16} />}
            {autoCapture ? 'Pausar' : 'Iniciar'} Captura
          </button>
          
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Intervalo:</label>
            <select
              value={captureInterval}
              onChange={(e) => setCaptureInterval(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value={10}>10 seg</option>
              <option value={30}>30 seg</option>
              <option value={60}>1 min</option>
              <option value={300}>5 min</option>
              <option value={900}>15 min</option>
            </select>
          </div>
          
          <div className="text-sm text-gray-600">
            Última actualización: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Tabs de navegación */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        <TabButton id="biometric" label="Muestreo Biométrico" icon={Fish} />
        <TabButton id="mortality" label="Registro Mortalidad" icon={Skull} />
        <TabButton id="water" label="Calidad del Agua" icon={Droplets} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Muestreo Biométrico */}
        {activeTab === 'biometric' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Fish size={20} />
                  Datos Biométricos
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Especie
                  </label>
                  <select
                    value={biometricData.species}
                    onChange={(e) => setBiometricData(prev => ({...prev, species: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar especie</option>
                    <option value="tilapia">Tilapia</option>
                    <option value="salmon">Salmón</option>
                    <option value="trucha">Trucha</option>
                    <option value="corvina">Corvina</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Peso Promedio (g)
                    </label>
                    <input
                      type="number"
                      value={biometricData.averageWeight}
                      onChange={(e) => setBiometricData(prev => ({...prev, averageWeight: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="150"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Longitud Promedio (cm)
                    </label>
                    <input
                      type="number"
                      value={biometricData.averageLength}
                      onChange={(e) => setBiometricData(prev => ({...prev, averageLength: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="12.5"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tamaño de Muestra
                  </label>
                  <input
                    type="number"
                    value={biometricData.sampleSize}
                    onChange={(e) => setBiometricData(prev => ({...prev, sampleSize: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                  />
                </div>

                {biometricData.visionAnalysis && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-800 mb-2">Análisis de Visión AI</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Peces detectados: <span className="font-medium">{biometricData.visionAnalysis.detectedFish}</span></div>
                      <div>Peso promedio: <span className="font-medium">{biometricData.visionAnalysis.avgWeight}g</span></div>
                      <div>Longitud promedio: <span className="font-medium">{biometricData.visionAnalysis.avgLength}cm</span></div>
                      <div>Confianza: <span className="font-medium">{biometricData.visionAnalysis.confidence}%</span></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Camera size={20} />
                  Captura Visual
                </h3>
                
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={startCamera}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Camera size={16} />
                    Tomar foto
                  </button>
                  <button
                    type="button"
                    onClick={captureImage}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <RefreshCw size={16} />
                    Análisis con IA
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Upload size={16} />
                    Subir Foto
                  </button>
                </div>

                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full max-w-md h-48 bg-gray-100 rounded-lg object-cover"
                />
                <canvas ref={canvasRef} style={{ display: 'none' }} />

                {biometricData.capturedImages.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-700">Imágenes Capturadas ({biometricData.capturedImages.length})</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {biometricData.capturedImages.slice(-6).map((img) => (
                        <img
                          key={img.id}
                          src={img.data}
                          alt="Captura biométrica"
                          className="w-full h-20 object-cover rounded-lg border border-gray-200"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Registro de Mortalidad */}
        {activeTab === 'mortality' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Skull size={20} />
                  Datos de Mortalidad
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Individuos
                  </label>
                  <input
                    type="number"
                    value={mortalityData.count}
                    onChange={(e) => setMortalityData(prev => ({...prev, count: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    placeholder="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Causa Probable
                  </label>
                  <select
                    value={mortalityData.cause}
                    onChange={(e) => setMortalityData(prev => ({...prev, cause: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar causa</option>
                    <option value="disease">Enfermedad</option>
                    <option value="water_quality">Calidad del agua</option>
                    <option value="stress">Estrés</option>
                    <option value="predation">Depredación</option>
                    <option value="unknown">Desconocida</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observaciones
                  </label>
                  <textarea
                    value={mortalityData.notes}
                    onChange={(e) => setMortalityData(prev => ({...prev, notes: e.target.value}))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describir síntomas observados, condiciones del entorno, etc."
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Camera size={20} />
                  Documentación Visual
                </h3>
                
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={startCamera}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Camera size={16} />
                    Tomar foto
                  </button>
                  <button
                    type="button"
                    onClick={captureImage}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <RefreshCw size={16} />
                    Detectar causa con IA
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Upload size={16} />
                    Subir Foto
                  </button>
                </div>

                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full max-w-md h-48 bg-gray-100 rounded-lg object-cover"
                />

                {mortalityData.images.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-700">Evidencia Fotográfica ({mortalityData.images.length})</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {mortalityData.images.slice(-6).map((img) => (
                        <img
                          key={img.id}
                          src={img.data}
                          alt="Evidencia mortalidad"
                          className="w-full h-20 object-cover rounded-lg border border-gray-200"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Calidad del Agua */}
        {activeTab === 'water' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Droplets size={20} />
                Parámetros de Calidad del Agua
              </h3>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={waterQuality.autoReading}
                    onChange={(e) => setWaterQuality(prev => ({...prev, autoReading: e.target.checked}))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Lectura automática</span>
                </label>
                <button
                  type="button"
                  onClick={simulateSensorReading}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Gauge size={14} />
                  Leer Sensores
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Temperatura (°C)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={waterQuality.temperature}
                    onChange={(e) => setWaterQuality(prev => ({...prev, temperature: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="25.0"
                  />
                  {waterQuality.autoReading && (
                    <div className="absolute right-2 top-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  pH
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={waterQuality.ph}
                  onChange={(e) => setWaterQuality(prev => ({...prev, ph: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="7.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Oxígeno Disuelto (mg/L)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={waterQuality.oxygen}
                  onChange={(e) => setWaterQuality(prev => ({...prev, oxygen: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="6.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amoníaco (mg/L)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={waterQuality.ammonia}
                  onChange={(e) => setWaterQuality(prev => ({...prev, ammonia: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.25"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nitritos (mg/L)
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={waterQuality.nitrites}
                  onChange={(e) => setWaterQuality(prev => ({...prev, nitrites: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nitratos (mg/L)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={waterQuality.nitrates}
                  onChange={(e) => setWaterQuality(prev => ({...prev, nitrates: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="15.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salinidad (‰)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={waterQuality.salinity}
                  onChange={(e) => setWaterQuality(prev => ({...prev, salinity: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="35.0"
                />
              </div>
            </div>

            {waterQuality.autoReading && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-blue-800">Monitoreo Automático Activo</span>
                </div>
                <p className="text-sm text-blue-700">
                  Los sensores están capturando datos cada {captureInterval} segundos. 
                  Los valores se actualizan automáticamente en tiempo real.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Input file oculto */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Botones de acción */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={() => {
              setBiometricData({
                species: '', averageWeight: '', averageLength: '', 
                sampleSize: 10, capturedImages: [], visionAnalysis: null
              });
              setMortalityData({ count: '', cause: '', images: [], notes: '' });
              setWaterQuality({
                temperature: '', ph: '', oxygen: '', ammonia: '', 
                nitrites: '', nitrates: '', salinity: '', autoReading: false
              });
            }}
          >
            Limpiar Formulario
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Registrar Evento
          </button>
        </div>
      </form>

      {/* Panel de estado del sistema */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-800 mb-2">Estado del Sistema</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${sensorStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>Sensores: {sensorStatus === 'connected' ? 'Conectados' : 'Desconectados'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${autoCapture ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span>Captura Auto: {autoCapture ? 'Activa' : 'Inactiva'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>Módulo Visión: Operativo</span>
          </div>
        </div>
      </div>

      {/* Alertas y notificaciones */}
      {(waterQuality.temperature && parseFloat(waterQuality.temperature) > 28) && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-800">
            <span className="font-medium">⚠️ Alerta:</span>
            <span>Temperatura elevada detectada ({waterQuality.temperature}°C)</span>
          </div>
        </div>
      )}

      {(waterQuality.oxygen && parseFloat(waterQuality.oxygen) < 4) && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-800">
            <span className="font-medium">🚨 Crítico:</span>
            <span>Nivel de oxígeno bajo ({waterQuality.oxygen} mg/L)</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AquacultureEventForm;
                