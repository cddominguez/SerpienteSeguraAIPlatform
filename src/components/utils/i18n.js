// Simple i18n implementation
let currentLanguage = 'en';

const translations = {
  en: {
    dashboard: 'Dashboard',
    executiveDashboard: 'Executive Dashboard',
    advancedAISecurityCenter: 'AI Security Center',
    threatHunting: 'Threat Hunting',
    userSecurity: 'User Security',
    deviceManagement: 'Device Management',
    networkSecurity: 'Network Security',
    complianceCenter: 'Compliance Center',
    web3Security: 'Web3 Security',
    dataSecurity: 'Data Security',
    incidentResponse: 'Incident Response',
    devSecOps: 'DevSecOps',
    iotSecurity: 'IoT Security',
    quantumSafety: 'Quantum Safety',
    trainingCenter: 'Training Center',
    settings: 'Settings',
    save: 'Save',
    serpienteAIGreeting: 'Hello! I\'m Serpiente AI, your security assistant for the {{page}} page.',
    askSerpienteAI: 'Ask Serpiente AI...'
  },
  es: {
    dashboard: 'Panel de Control',
    executiveDashboard: 'Panel Ejecutivo',
    advancedAISecurityCenter: 'Centro de Seguridad IA',
    threatHunting: 'Caza de Amenazas',
    userSecurity: 'Seguridad de Usuario',
    deviceManagement: 'Gestión de Dispositivos',
    networkSecurity: 'Seguridad de Red',
    complianceCenter: 'Centro de Cumplimiento',
    web3Security: 'Seguridad Web3',
    dataSecurity: 'Seguridad de Datos',
    incidentResponse: 'Respuesta a Incidentes',
    devSecOps: 'DevSecOps',
    iotSecurity: 'Seguridad IoT',
    quantumSafety: 'Seguridad Cuántica',
    trainingCenter: 'Centro de Entrenamiento',
    settings: 'Configuración',
    save: 'Guardar',
    serpienteAIGreeting: '¡Hola! Soy Serpiente AI, tu asistente de seguridad para la página {{page}}.',
    askSerpienteAI: 'Pregunta a Serpiente AI...'
  }
};

export const getCurrentLanguage = () => currentLanguage;

export const setCurrentLanguage = (lang) => {
  currentLanguage = lang;
};

export const t = (key, params = {}) => {
  let translation = translations[currentLanguage]?.[key] || translations.en[key] || key;
  
  // Simple parameter replacement
  Object.keys(params).forEach(param => {
    translation = translation.replace(`{{${param}}}`, params[param]);
  });
  
  return translation;
};