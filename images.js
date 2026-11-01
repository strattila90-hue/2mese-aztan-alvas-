// AI képgenerálás Hugging Face API-val
// Stable Diffusion modellek mesék illusztrációihoz

const HF_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";

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

// Létező kép ellenőrzése cache-ből
function getCachedImage(id) {
  try {
    return localStorage.getItem('img_' + id);
  } catch (e) {
    return null;
  }
}

// Kép mentése cache-be
function setCachedImage(id, dataUrl) {
  try {
    localStorage.setItem('img_' + id, dataUrl);
  } catch (e) {
    // Ha a cache megtelt, töröljük a régebbeket
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith('img_'));
      if (keys.length > 20) {
        keys.slice(0, 5).forEach(k => localStorage.removeItem(k));
        localStorage.setItem('img_' + id, dataUrl);
      }
    } catch (e2) {}
  }
}

// AI képgenerálás
async function generateImage(story) {
  const category = story.cat || 'esti';
  const title = story.title;
  const emoji = story.emoji;

  // Ellenőrizzük, hogy van-e már generált kép
  const cached = getCachedImage(story.id);
  if (cached) {
    return cached;
  }

  // Prompt generálás
  const promptFn = PROMPT_TEMPLATES[category] || PROMPT_TEMPLATES.esti;
  const prompt = promptFn(title, emoji);

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
          num_inference_steps: 30,
          guidance_scale: 7.5,
          width: 512,
          height: 384
        }
      })
    });

    if (!response.ok) {
      console.error('HF API error:', response.status);
      return null;
    }

    const blob = await response.blob();
    const dataUrl = await blobToDataUrl(blob);

    // Cache-be mentés
    setCachedImage(story.id, dataUrl);

    return dataUrl;
  } catch (error) {
    console.error('Image generation error:', error);
    return null;
  }
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

// Képek előre generálása (opcionális - a háttérben)
async function preloadImages(stories, limit = 5) {
  const notCached = stories.filter(s => !getCachedImage(s.id)).slice(0, limit);
  for (const story of notCached) {
    try {
      await generateImage(story);
      // Kis szünet a következő generálás előtt
      await new Promise(r => setTimeout(r, 1000));
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
  PROMPT_TEMPLATES: PROMPT_TEMPLATES
};
