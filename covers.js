// Borítóképek generálása mesékhez - automatikus SVG/Canvas alapú illusztrációk
// Ez a modul dinamikusan generál témába illő borítóképeket a mesék kategóriája és emoji-ja alapján

const COVER_PATTERNS = {
  // Esti mesék - csillagos, holdas, nyugodt
  esti: {
    elements: ['stars', 'moon', 'clouds', 'trees'],
    bgGradient: ['#1a1a2e', '#16213e'],
    accent: '#e94560'
  },
  // Népmesék - kastély, erdő, vidám
  nepmese: {
    elements: ['castle', 'mountains', 'trees', 'sun'],
    bgGradient: ['#f093fb', '#f5576c'],
    accent: '#4facfe'
  },
  // Állatos - természet, növények
  allatos: {
    elements: ['trees', 'flowers', 'grass', 'sun'],
    bgGradient: ['#a8edea', '#fed6e3'],
    accent: '#56ab2f'
  },
  // Tündéres - varázslatos, virágok
  tunderes: {
    elements: ['stars', 'flowers', 'sparkles', 'moon'],
    bgGradient: ['#e0c3fc', '#8ec5fc'],
    accent: '#d988b9'
  },
  // Kaland - hegység, utak
  kaland: {
    elements: ['mountains', 'path', 'compass', 'sun'],
    bgGradient: ['#4facfe', '#00f2fe'],
    accent: '#ff6b6b'
  }
};

// SVG elemek rajzolása
function generateSVG(category, emoji, colors) {
  const pattern = COVER_PATTERNS[category] || COVER_PATTERNS.esti;
  const [color1, color2] = colors || pattern.bgGradient;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${color1}"/>
        <stop offset="100%" style="stop-color:${color2}"/>
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#bg)"/>`;

  // Kategória alapján elemek hozzáadása
  svg += generateCategoryElements(category, pattern);

  // Emoji középre nagyban
  svg += `<text x="200" y="180" font-size="120" text-anchor="middle">${emoji}</text>`;

  // Kis dekoratív elemek
  svg += generateDecorations(category, pattern.accent);

  svg += '</svg>';
  return svg;
}

function generateCategoryElements(category, pattern) {
  let elements = '';

  switch(category) {
    case 'esti':
      elements += drawStars();
      elements += drawMoon();
      elements += drawTrees();
      break;
    case 'nepmese':
      elements += drawCastle();
      elements += drawMountains();
      break;
    case 'allatos':
      elements += drawTrees();
      elements += drawFlowers();
      elements += drawSun();
      break;
    case 'tunderes':
      elements += drawSparkles();
      elements += drawStars();
      elements += drawFlowers();
      break;
    case 'kaland':
      elements += drawMountains();
      elements += drawPath();
      elements += drawCompass();
      break;
    default:
      elements += drawStars();
  }

  return elements;
}

function drawStars() {
  return `
    <circle cx="50" cy="40" r="3" fill="#fff" opacity="0.8"/>
    <circle cx="120" cy="60" r="2" fill="#fff" opacity="0.6"/>
    <circle cx="300" cy="30" r="4" fill="#fff" opacity="0.9"/>
    <circle cx="350" cy="80" r="2" fill="#fff" opacity="0.7"/>
    <circle cx="80" cy="100" r="3" fill="#fff" opacity="0.5"/>
    <circle cx="250" cy="50" r="2" fill="#fff" opacity="0.8"/>
  `;
}

function drawMoon() {
  return `
    <circle cx="340" cy="50" r="30" fill="#fffacd" opacity="0.9"/>
    <circle cx="330" cy="45" r="28" fill="#f5f5dc"/>
  `;
}

function drawTrees() {
  return `
    <path d="M40 250 L40 200 L20 200 L50 160 L80 200 L60 200 L60 250 Z" fill="#2d5a27" opacity="0.7"/>
    <path d="M360 250 L360 210 L340 210 L370 170 L400 210 L380 210 L380 250 Z" fill="#2d5a27" opacity="0.7"/>
  `;
}

function drawCastle() {
  return `
    <rect x="280" y="140" width="80" height="110" fill="#8b4513" opacity="0.6"/>
    <rect x="290" y="110" width="20" height="30" fill="#8b4513" opacity="0.6"/>
    <rect x="330" y="110" width="20" height="30" fill="#8b4513" opacity="0.6"/>
    <rect x="310" y="160" width="20" height="25" fill="#4a4a4a" opacity="0.5"/>
  `;
}

function drawMountains() {
  return `
    <path d="M0 250 L100 120 L200 250 Z" fill="#6b8e23" opacity="0.5"/>
    <path d="M150 250 L250 80 L350 250 Z" fill="#556b2f" opacity="0.6"/>
    <path d="M300 250 L400 150 L400 250 Z" fill="#6b8e23" opacity="0.5"/>
  `;
}

function drawFlowers() {
  return `
    <circle cx="70" cy="230" r="8" fill="#ff69b4" opacity="0.7"/>
    <circle cx="330" cy="220" r="10" fill="#ff6b6b" opacity="0.7"/>
    <circle cx="150" cy="240" r="6" fill="#ffd700" opacity="0.7"/>
  `;
}

function drawSun() {
  return `
    <circle cx="60" cy="50" r="25" fill="#ffd700" opacity="0.8"/>
    <line x1="60" y1="15" x2="60" y2="5" stroke="#ffd700" stroke-width="3"/>
    <line x1="60" y1="85" x2="60" y2="95" stroke="#ffd700" stroke-width="3"/>
    <line x1="25" y1="50" x2="15" y2="50" stroke="#ffd700" stroke-width="3"/>
    <line x1="95" y1="50" x2="105" y2="50" stroke="#ffd700" stroke-width="3"/>
  `;
}

function drawSparkles() {
  return `
    <text x="80" y="70" font-size="24" fill="#fff" opacity="0.8">✨</text>
    <text x="320" y="100" font-size="20" fill="#fff" opacity="0.7">✨</text>
    <text x="150" y="50" font-size="18" fill="#fff" opacity="0.6">✨</text>
  `;
}

function drawPath() {
  return `
    <path d="M0 280 Q100 260 200 270 T400 260" stroke="#d2b48c" stroke-width="8" fill="none" opacity="0.5"/>
  `;
}

function drawCompass() {
  return `
    <circle cx="350" cy="220" r="20" fill="#fff" opacity="0.6"/>
    <path d="M350 205 L355 220 L350 235 L345 220 Z" fill="#e74c3c"/>
  `;
}

function generateDecorations(category, accent) {
  return `
    <circle cx="200" cy="280" r="40" fill="${accent}" opacity="0.2"/>
    <text x="200" y="285" font-size="20" text-anchor="middle" fill="${accent}" opacity="0.5">📖</text>
  `;
}

// Konvertálás Data URI-vá
function svgToDataURI(svg) {
  const encoded = encodeURIComponent(svg).replace(/'/g, '%27').replace(/"/g, '%22').replace(/\(/g, '%28').replace(/\)/g, '%29');
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}

// Fő függvény: borító generálása meséhez
function generateCover(story) {
  const category = story.cat || 'esti';
  const emoji = story.emoji || '📖';
  const colors = story.bg || (COVER_PATTERNS[category] || COVER_PATTERNS.esti).bgGradient;

  const svg = generateSVG(category, emoji, colors);
  return svgToDataURI(svg);
}

// Exportálás
window.CoverGenerator = {
  generate: generateCover,
  generateSVG: generateSVG,
  COVER_PATTERNS: COVER_PATTERNS
};
