/* ============================================================
   My motors Supplies — edita aquí: nombre, WhatsApp, productos, precios.
   Todo lo que ve el cliente sale de este archivo.
   Repuestos ilustrativos de demostración (no son inventario real).
   ============================================================ */

const CONFIG = {
  storeName: "My motors Supplies",    // ← nombre del negocio
  whatsapp: "584128206458",           // ← tu número WhatsApp (código país + número, sin +)
  location: "Venezuela · Envíos a todo el país",  // ← ciudad / zona
  hours: "Lun–Sáb · 8am–6pm",         // ← horario
  currency: "$",                      // USD
};

const BRANDS = ["Todas", "Chevrolet", "Toyota", "Honda", "Ford", "Hyundai", "Kia", "Nissan", "Mazda"];

const CATEGORIES = ["Todos", "Frenos", "Motor", "Suspensión y Dirección", "Transmisión",
  "Sistema Eléctrico", "Refrigeración", "Combustible", "Carrocería e Iluminación",
  "Interior", "Cauchos y Rines", "Mantenimiento", "Accesorios"];

const PRODUCTS = [
  /* ---------- FRENOS ---------- */
  { id: "p01", name: "Pastillas de freno delanteras cerámicas", category: "Frenos",
    brand: "Chevrolet", fits: "Aveo, Spark, Corsa", price: 24.00, img: "img/p01.jpg",
    badge: "Más vendido", oem: "PF-1542 · Equivale: D1542",
    desc: "Compuesto cerámico de frenado silencioso, bajo polvo y larga duración. Juego completo para el eje delantero." },
  { id: "p02", name: "Discos de freno delanteros ventilados", category: "Frenos",
    brand: "Toyota", fits: "Corolla, Yaris", price: 58.00, img: "img/p02.jpg",
    badge: "", oem: "43512-02090 · Par",
    desc: "Discos ventilados que disipan mejor el calor y resisten el alabeo. Se venden por par." },
  { id: "p03", name: "Bandas de freno traseras", category: "Frenos",
    brand: "Hyundai", fits: "Accent, Elantra", price: 19.00, img: "img/p03.jpg",
    badge: "", oem: "58305-25000",
    desc: "Bandas traseras de fricción estable para freno de tambor. Incluye resortes de instalación." },
  { id: "p04", name: "Kit de frenos delanteros (2 discos + pastillas)", category: "Frenos",
    brand: "Ford", fits: "Fiesta, Focus", price: 89.00, img: "img/p04.jpg",
    badge: "Kit", oem: "Kit FK-2201",
    includes: ["2 discos de freno ventilados", "Juego de pastillas cerámicas", "Herrajes de instalación"],
    desc: "Renueva el eje delantero completo en una sola compra: 2 discos ventilados + juego de pastillas cerámicas." },
  { id: "p05", name: "Cilindro maestro de freno", category: "Frenos",
    brand: "Nissan", fits: "Sentra, Tiida", price: 42.00, img: "img/p05.jpg",
    badge: "", oem: "46010-3DN0A",
    desc: "Cilindro maestro nuevo con depósito. Recupera el pedal firme y la respuesta de frenado." },

  /* ---------- MOTOR ---------- */
  { id: "p06", name: "Kit de correa de tiempo completo", category: "Motor",
    brand: "Chevrolet", fits: "Aveo 1.6, Corsa 1.6", price: 65.00, img: "img/p06.jpg",
    badge: "Kit", oem: "KT-1600 · Correa + tensor + polea",
    includes: ["Correa de distribución dentada", "Tensor de correa", "Polea guía"],
    desc: "Todo para el cambio de correa de tiempo: correa dentada, tensor y polea guía. Previene daños graves al motor." },
  { id: "p07", name: "Bujías de iridio (juego x4)", category: "Motor",
    brand: "Toyota", fits: "Corolla, Yaris", price: 28.00, img: "img/p07.jpg",
    badge: "", oem: "90919-01253 · Iridio",
    desc: "Bujías de iridio de larga vida: mejor chispa, menor consumo y encendido parejo. Juego de 4." },
  { id: "p08", name: "Bomba de agua", category: "Motor",
    brand: "Honda", fits: "Civic, Fit", price: 38.00, img: "img/p08.jpg",
    badge: "", oem: "19200-RNA-A01",
    desc: "Bomba de agua nueva con empacadura incluida. Ideal para cambiar junto con la correa de tiempo." },
  { id: "p09", name: "Filtro de aceite sintético", category: "Motor",
    brand: "Hyundai", fits: "Tucson, Accent, Elantra", price: 8.00, img: "img/p09.jpg",
    badge: "", oem: "26300-35505",
    desc: "Filtro de aceite de alta eficiencia para intervalos largos con aceite sintético." },
  { id: "p10", name: "Filtro de aire de motor", category: "Motor",
    brand: "Kia", fits: "Rio, Cerato", price: 12.00, img: "img/p10.jpg",
    badge: "", oem: "28113-1R100",
    desc: "Filtro de aire que protege el motor del polvo y mejora la respuesta del acelerador." },
  { id: "p11", name: "Empacadura de tapa de válvulas", category: "Motor",
    brand: "Ford", fits: "Explorer, Ranger", price: 22.00, img: "img/p11.jpg",
    badge: "", oem: "4.0L V6 · Juego",
    desc: "Juego de empacaduras de tapa de válvulas. Elimina botes de aceite sobre el motor." },
  { id: "p12", name: "Sensor de oxígeno", category: "Motor",
    brand: "Mazda", fits: "Mazda 3, Mazda 6", price: 45.00, img: "img/p12.jpg",
    badge: "", oem: "ZJ38-18-861 · 4 cables",
    desc: "Sensor de oxígeno de 4 cables. Corrige la mezcla, baja el consumo y apaga la luz de check engine." },

  /* ---------- SUSPENSIÓN Y DIRECCIÓN ---------- */
  { id: "p13", name: "Amortiguadores delanteros (par)", category: "Suspensión y Dirección",
    brand: "Chevrolet", fits: "Spark, Aveo", price: 72.00, img: "img/p13.jpg",
    badge: "", oem: "Par delantero · Gas",
    desc: "Par de amortiguadores delanteros a gas. Devuelve la estabilidad y el confort de marcha." },
  { id: "p14", name: "Meseta inferior con rótula", category: "Suspensión y Dirección",
    brand: "Toyota", fits: "Yaris, Corolla", price: 48.00, img: "img/p14.jpg",
    badge: "", oem: "48068-52030 · Delantera",
    desc: "Meseta inferior con rótula y bujes pre-instalados. Elimina ruidos y juego en la dirección." },
  { id: "p15", name: "Terminales de dirección (par)", category: "Suspensión y Dirección",
    brand: "Hyundai", fits: "Elantra, Accent", price: 26.00, img: "img/p15.jpg",
    badge: "", oem: "56820-2H000 · Par",
    desc: "Par de terminales de dirección. Recupera la precisión del volante." },
  { id: "p16", name: "Rodamiento de rueda delantero", category: "Suspensión y Dirección",
    brand: "Honda", fits: "Fit, City", price: 32.00, img: "img/p16.jpg",
    badge: "", oem: "44300-SAA-004",
    desc: "Rodamiento de rueda delantero sellado. Adiós al zumbido a velocidad." },
  { id: "p17", name: "Bomba de dirección hidráulica", category: "Suspensión y Dirección",
    brand: "Ford", fits: "Ranger, Explorer", price: 95.00, img: "img/p17.jpg",
    badge: "", oem: "XL3Z-3A674-AA",
    desc: "Bomba de dirección hidráulica reconstruida con garantía. Dirección suave de nuevo." },

  /* ---------- TRANSMISIÓN ---------- */
  { id: "p18", name: "Kit de embrague completo", category: "Transmisión",
    brand: "Chevrolet", fits: "Aveo, Corsa", price: 120.00, img: "img/p18.jpg",
    badge: "Kit", oem: "Disco + plato + collarín",
    includes: ["Disco de embrague", "Plato de presión", "Collarín"],
    desc: "Kit completo de embrague: disco, plato de presión y collarín. Cambios suaves sin patinaje." },
  { id: "p19", name: "Junta homocinética (punta de tripoide)", category: "Transmisión",
    brand: "Toyota", fits: "Corolla", price: 55.00, img: "img/p19.jpg",
    badge: "", oem: "43470-02070 · Externa",
    desc: "Punta homocinética externa con guardapolvo y grasa. Elimina el traqueteo al cruzar." },
  { id: "p20", name: "Soporte de caja", category: "Transmisión",
    brand: "Nissan", fits: "Tiida, Sentra", price: 30.00, img: "img/p20.jpg",
    badge: "", oem: "11220-ED000",
    desc: "Soporte de transmisión que absorbe vibraciones y golpes al arrancar." },

  /* ---------- SISTEMA ELÉCTRICO ---------- */
  { id: "p21", name: "Alternador 90A", category: "Sistema Eléctrico",
    brand: "Hyundai", fits: "Accent, Elantra", price: 140.00, img: "img/p21.jpg",
    badge: "", oem: "37300-22650 · 90 amperios",
    desc: "Alternador de 90 amperios probado en banco. Carga estable para batería y accesorios." },
  { id: "p22", name: "Motor de arranque", category: "Sistema Eléctrico",
    brand: "Chevrolet", fits: "Corsa, Aveo", price: 110.00, img: "img/p22.jpg",
    badge: "", oem: "1.4–1.6L · 9 dientes",
    desc: "Motor de arranque de giro rápido para encendidos seguros en frío o calor." },
  { id: "p23", name: "Batería 12V 70Ah", category: "Sistema Eléctrico",
    brand: "Universal", fits: "Todas las marcas", price: 95.00, img: "img/p23.jpg",
    badge: "Más vendido", oem: "12V · 70Ah · 600CCA",
    desc: "Batería sellada libre de mantenimiento, 70Ah y 600CCA de arranque. Para la mayoría de carros y camionetas." },
  { id: "p24", name: "Bobina de encendido", category: "Sistema Eléctrico",
    brand: "Ford", fits: "Fiesta, EcoSport", price: 38.00, img: "img/p24.jpg",
    badge: "", oem: "1S7Z-12029-AA",
    desc: "Bobina de encendido de alto voltaje. Corrige fallas de cilindro y pérdida de potencia." },
  { id: "p25", name: "Faro delantero LED", category: "Sistema Eléctrico",
    brand: "Toyota", fits: "Hilux", price: 85.00, img: "img/p25.jpg",
    badge: "", oem: "Luz LED · Lado a elegir",
    desc: "Faro delantero con tecnología LED de alta luminosidad y bajo consumo." },

  /* ---------- REFRIGERACIÓN ---------- */
  { id: "p26", name: "Radiador de aluminio", category: "Refrigeración",
    brand: "Honda", fits: "Civic", price: 98.00, img: "img/p26.jpg",
    badge: "", oem: "19010-RNA-A01",
    desc: "Radiador de aluminio de alta disipación. Mantiene la temperatura estable en tráfico y calor." },
  { id: "p27", name: "Electroventilador 12 pulgadas", category: "Refrigeración",
    brand: "Chevrolet", fits: "Spark, Aveo", price: 52.00, img: "img/p27.jpg",
    badge: "", oem: "12V · Con aspa",
    desc: "Electroventilador de 12 pulgadas con aspa incluida. Refuerza la refrigeración en colas y subidas." },
  { id: "p28", name: "Termostato 82°C", category: "Refrigeración",
    brand: "Mazda", fits: "Mazda 3", price: 14.00, img: "img/p28.jpg",
    badge: "", oem: "82°C · Con empacadura",
    desc: "Termostato de 82°C con empacadura. Regula la temperatura de trabajo del motor." },

  /* ---------- COMBUSTIBLE ---------- */
  { id: "p29", name: "Bomba de gasolina completa", category: "Combustible",
    brand: "Hyundai", fits: "Accent", price: 68.00, img: "img/p29.jpg",
    badge: "", oem: "31110-25000 · Módulo",
    desc: "Módulo completo de bomba de gasolina con flotante. Presión constante para un andar parejo." },
  { id: "p30", name: "Inyectores (juego x4)", category: "Combustible",
    brand: "Kia", fits: "Rio", price: 76.00, img: "img/p30.jpg",
    badge: "", oem: "35310-2B010 · Juego x4",
    desc: "Juego de 4 inyectores calibrados. Pulverización pareja, mejor consumo y potencia." },

  /* ---------- CARROCERÍA E ILUMINACIÓN ---------- */
  { id: "p31", name: "Espejo retrovisor eléctrico", category: "Carrocería e Iluminación",
    brand: "Toyota", fits: "Corolla", price: 46.00, img: "img/p31.jpg",
    badge: "", oem: "Eléctrico · Lado a elegir",
    desc: "Espejo retrovisor eléctrico con ajuste desde el interior. Carcasa lista para pintar." },
  { id: "p32", name: "Stop trasero", category: "Carrocería e Iluminación",
    brand: "Chevrolet", fits: "Aveo", price: 34.00, img: "img/p32.jpg",
    badge: "", oem: "Lado a elegir",
    desc: "Stop trasero con mica nítida y bombillos incluidos. Recupera la apariencia original." },
  { id: "p33", name: "Parachoques delantero", category: "Carrocería e Iluminación",
    brand: "Ford", fits: "Fiesta", price: 120.00, img: "img/p33.jpg",
    badge: "", oem: "Sin pintar",
    desc: "Parachoques delantero de reemplazo, listo para pintar del color de tu carro." },

  /* ---------- INTERIOR ---------- */
  { id: "p34", name: "Elevalunas eléctrico delantero", category: "Interior",
    brand: "Nissan", fits: "Sentra", price: 58.00, img: "img/p34.jpg",
    badge: "", oem: "Con motor · Lado a elegir",
    desc: "Mecanismo elevalunas eléctrico delantero con motor incluido." },

  /* ---------- CAUCHOS Y RINES ---------- */
  { id: "p35", name: "Caucho 195/65R15", category: "Cauchos y Rines",
    brand: "Universal", fits: "Todas las marcas", price: 62.00, img: "img/p35.jpg",
    badge: "", oem: "195/65R15 · 91H",
    desc: "Caucho 195/65R15 para uso mixto ciudad/carretera. Buen agarre en mojado y bajo ruido." },
  { id: "p36", name: "Rin de aluminio 15 pulgadas", category: "Cauchos y Rines",
    brand: "Universal", fits: "Todas las marcas", price: 88.00, img: "img/p36.jpg",
    badge: "", oem: "15\" · 4 huecos",
    desc: "Rin de aluminio liviano de 15 pulgadas, 4 huecos. Mejora la estética y reduce peso no suspendido." },

  /* ---------- MANTENIMIENTO ---------- */
  { id: "p37", name: "Aceite sintético 10W-30 (4 litros)", category: "Mantenimiento",
    brand: "Universal", fits: "Todas las marcas", price: 32.00, img: "img/p37.jpg",
    badge: "", oem: "API SN · Sintético",
    desc: "Aceite 100% sintético 10W-30, norma API SN. Protección superior para 10.000 km." },
  { id: "p38", name: "Kit de mantenimiento 10.000 km", category: "Mantenimiento",
    brand: "Chevrolet", fits: "Aveo, Spark", price: 54.00, img: "img/p38.jpg",
    badge: "Kit", oem: "Aceite + 3 filtros",
    includes: ["Aceite sintético 10W-30 · 4L", "Filtro de aceite", "Filtro de aire", "Filtro de combustible"],
    desc: "Todo para el servicio de 10.000 km: aceite sintético 4L + filtro de aceite, aire y combustible." },
  { id: "p39", name: "Refrigerante concentrado (1 galón)", category: "Mantenimiento",
    brand: "Universal", fits: "Todas las marcas", price: 16.00, img: "img/p39.jpg",
    badge: "", oem: "50/50 · Anticorrosivo",
    desc: "Refrigerante concentrado con anticorrosivos. Protege radiador, bomba y sellos." },

  /* ---------- ACCESORIOS ---------- */
  { id: "p40", name: "Limpiaparabrisas (par 22\"/18\")", category: "Accesorios",
    brand: "Universal", fits: "Todas las marcas", price: 14.00, img: "img/p40.jpg",
    badge: "", oem: "22\" + 18\" · Par",
    desc: "Par de limpiaparabrisas de goma natural. Visibilidad clara en lluvia desde el primer barrido." },
];
