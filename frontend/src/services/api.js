const HISTORY_KEY = 'url_shortner_history';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const shortenUrl = async ({ originalUrl, customalias, expiresIn }) => {
  const payload = { originalUrl };
  if (customalias && customalias.trim()) {
    payload.customalias = customalias.trim();
  }
  if (expiresIn) {
    const expNum = parseInt(expiresIn, 10);
    if (!isNaN(expNum) && expNum > 0) {
      payload.expiresIn = expNum;
    }
  }

  const response = await fetch(`${API_BASE_URL}/url`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to shorten URL');
  }

  // Construct item record
  const newItem = {
    shortcode: data.shortcode,
    originalUrl: data.originalurl || originalUrl,
    shorturl: data.shorturl || `${window.location.origin}/url/${data.shortcode}`,
    expiresAt: data.expiresAt || null,
    expiresInSeconds: payload.expiresIn || null,
    createdAt: new Date().toISOString(),
    clicks: 0,
  };

  saveToLocalHistory(newItem);

  return { data, newItem };
};

export const getLocalHistory = () => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Error reading local history:', err);
    return [];
  }
};

export const saveToLocalHistory = (item) => {
  try {
    const current = getLocalHistory();
    // Prepend new item, remove duplicates by shortcode
    const filtered = current.filter(x => x.shortcode !== item.shortcode);
    const updated = [item, ...filtered];
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving local history:', err);
  }
};

export const updateLocalHistory = (items) => {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Error updating local history:', err);
  }
};
