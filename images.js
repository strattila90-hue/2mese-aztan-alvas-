// AI képgenerálás Hugging Face API-val
// Stable Diffusion modellek mesék illusztrációihoz

const HF_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";
const MAX_CACHE_SIZE = 30; // Maximum képek a cache-ben
const RETRY_ATTEMPTS = 2; // API hiba esetén újrapróbálkozás

// Mesékhez optimális promptok kategóriánként
const PROMPT_TEMPLATES = {
  esti: (title, emoji) => {
    const prompt = `children's book illustration, bedtime story, night scene, calm and peaceful, whimsical style, magical atmosphere, ${emoji}, title: "${title}", soft lighting, dreamy, pastel colors, detailed, suitable for kids 3-6 years old`;
    return prompt;
  },
  nepmese: (title, emoji) => {
    const prompt = `children's book illustration, fairy tale, magical castle or forest, whimsical style, adventure, ${emoji}, title: "${title}", vibrant colors, enchanted atmosphere, detailed, suitable for kids 3-6 years old`;
    return prompt;
  },
  allatos: (title, emoji) => {
    const prompt = `children's book illustration, cute animals, nature scene, friendly and adorable, ${emoji}, title: "${title}", bright and cheerful, colorful, detailed, suitable for kids 3-6 years old`;
    return prompt;
  },
  tunderes: (title, emoji) => {
    const prompt = `children's book illustration, fairy tale, magical forest, sparkles and magic, whimsical style, ${emoji}, title: "${title}", pink and purple tones, enchanting, detailed, suitable for kids 3-6 years old`;
    return prompt;
  },
  kaland: (title, emoji) => {
    const prompt = `children's book illustration, adventure scene, mountains and exploration, exciting but safe, ${emoji}, title: "${title}", dynamic composition, colorful, detailed, suitable for kids 3-6 years old`;
    return prompt;
  }
};

// API token ellenőrzése
function hasValidToken() {
  return window.HF_API_TOKEN && window.HF_API_TOKEN.length > 10;
}

// Létező kép ellenőrzése cache-ből
function getCachedImage(id) {
  try {
    return localStorage.getItem('img_' + id);
  } catch (e) {
    console.warn('Cache read error:', e);
    return null;
  }
}

// Kép mentése cache-be (méret optimalizálással)
function setCachedImage(id, dataUrl) {
  try {
    // Ha a data URL túl nagy, nem mentjük
    if (dataUrl.length > 2000000) { // 2MB limit
      console.warn('Image too large for cache, skipping');
      return false;
    }

    localStorage.setItem('img_' + id, dataUrl);
    return true;
  } catch (e) {
    // Ha a cache megtelt, töröljük a régebbeket
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith('img_'));
      if (keys.length >= MAX_CACHE_SIZE) {
        const toDelete = keys.slice(0, Math.ceil(keys.length / 3));
        toDelete.forEach(k => localStorage.removeItem(k));
        console.log(`Cleaned ${toDelete.length} old images from cache`);
        localStorage.setItem('img_' + id, dataUrl);
        return true;
      }
    } catch (e2) {
      console.error('Cache cleanup failed:', e2);
    }
    return false;
  }
}

// Kép törlése a cache-ből
function clearCachedImage(id) {
  try {
    localStorage.removeItem('img_' + id);
    return true;
  } catch (e) {
    console.error('Cache delete error:', e);
    return false;
  }
}

// Összes generált kép törlése
function clearAllCache() {
  try {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('img_'));
    keys.forEach(k => localStorage.removeItem(k));
    console.log(`Cleared ${keys.length} images from cache`);
    return keys.length;
  } catch (e) {
    console.error('Cache clear error:', e);
    return 0;
  }
}

// Kép méret optimalizálás (DataURL tömörítés)
async function optimizeImage(dataUrl, maxWidth = 400, quality = 0.85) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = Math.min(1, maxWidth / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(dataUrl); // Ha hiba, visszaadjuk az eredetit
    img.src = dataUrl;
  });
}

// AI képgenerálás retry mechanizmussal
async function generateImage(story, forceRegenerate = false) {
  // API token ellenőrzés
  if (!hasValidToken()) {
    console.error('No valid HF API token');
    return null;
  }

  const category = story.cat || 'esti';
  const title = story.title;
  const emoji = story.emoji;

  // Ha nem kell újragenerálni és van cache, visszaadjuk azt
  if (!forceRegenerate) {
    const cached = getCachedImage(story.id);
    if (cached) {
      return cached;
    }
  }

  // Prompt generálás
  const promptFn = PROMPT_TEMPLATES[category] || PROMPT_TEMPLATES.esti;
  const prompt = promptFn(title, emoji);

  // Retry mechanizmus
  for (let attempt = 0; attempt < RETRY_ATTEMPTS; attempt++) {
    try {
      const response = await fetch(HF_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${window.HF_API_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            negative_prompt: "text, watermark, blurry, low quality, ugly, distorted, scary, violent, inappropriate for children",
            num_inference_steps: 25, // Csökkentve a sebesség miatt
            guidance_scale: 7.5,
            width: 512,
            height: 384
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HF API error (attempt ${attempt + 1}):`, response.status, errorText);

        // Ha a model betöltődik (503), várunk és újrapróbáljuk
        if (response.status === 503 && attempt < RETRY_ATTEMPTS - 1) {
          await new Promise(r => setTimeout(r, 3000));
          continue;
        }

        return null;
      }

      const blob = await response.blob();
      const dataUrl = await blobToDataUrl(blob);

      // Kép optimalizálása
      const optimized = await optimizeImage(dataUrl);

      // Cache-be mentés
      setCachedImage(story.id, optimized);

      return optimized;
    } catch (error) {
      console.error(`Image generation error (attempt ${attempt + 1}):`, error);
      if (attempt < RETRY_ATTEMPTS - 1) {
        await new Promise(r => setTimeout(r, 2000));
      }
    }
  }

  return null;
}

// Blob átalakítása Data URI-vá
function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Képek előre generálása (a háttérben)
async function preloadImages(stories, limit = 3) {
  if (!hasValidToken() || !navigator.onLine) {
    return;
  }

  const notCached = stories.filter(s => !getCachedImage(s.id)).slice(0, limit);
  for (const story of notCached) {
    try {
      await generateImage(story);
      // Kis szünet a következő generálás előtt (rate limit elkerülése)
      await new Promise(r => setTimeout(r, 1500));
    } catch (e) {
      console.error('Preload error:', e);
    }
  }
}

// Exportálás
window.ImageGenerator = {
  generate: generateImage,
  preload: preloadImages,
  getCached: getCachedImage,
  clearCache: clearCachedImage,
  clearAll: clearAllCache,
  hasToken: hasValidToken,
  PROMPT_TEMPLATES: PROMPT_TEMPLATES
};
