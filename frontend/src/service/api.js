// api.js
const API_URL = 'http://127.0.0.1:5000/api'; // URL нашего API

/**
 * Получить все новости
 * @returns {Promise<Array>} Массив новостей
 */
export const getNews = async () => {
  try {
    const response = await fetch(`${API_URL}/news`);
    const data = await response.json();
    return data.news || [];
  } catch (error) {
    console.error('Ошибка при получении новостей:', error);
    return [];
  }
};

/**
 * Получить новость по ID
 * @param {number} id ID новости
 * @returns {Promise<Object|null>} Объект новости или null
 */
export const getNewsById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/news/${id}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error(`Ошибка при получении новости #${id}:`, error);
    return null;
  }
};

/**
 * Получить все коллекции
 * @returns {Promise<Array>} Массив коллекций
 */
export const getCollections = async () => {
  try {
    const response = await fetch(`${API_URL}/collections`);
    const data = await response.json();
    return data.collections || [];
  } catch (error) {
    console.error('Ошибка при получении коллекций:', error);
    return [];
  }
};

/**
 * Получить коллекцию по ID
 * @param {number} id ID коллекции
 * @returns {Promise<Object|null>} Объект коллекции или null
 */
export const getCollectionById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/collections/${id}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error(`Ошибка при получении коллекции #${id}:`, error);
    return null;
  }
};

/**
 * Получить все аудионовости
 * @returns {Promise<Array>} Массив аудионовостей
 */
export const getAudioNews = async () => {
  try {
    const response = await fetch(`${API_URL}/audio`);
    const data = await response.json();
    return data.newsAudio || [];
  } catch (error) {
    console.error('Ошибка при получении аудионовостей:', error);
    return [];
  }
};

/**
 * Получить аудионовость по ID
 * @param {number} id ID аудионовости
 * @returns {Promise<Object|null>} Объект аудионовости или null
 */
export const getAudioNewsById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/audio/${id}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error(`Ошибка при получении аудионовости #${id}:`, error);
    return null;
  }
};

/**
 * Получить все данные (новости, коллекции, аудио)
 * @returns {Promise<Object>} Объект со всеми данными
 */
export const getAllData = async () => {
  try {
    const response = await fetch(`${API_URL}/data`);
    return await response.json();
  } catch (error) {
    console.error('Ошибка при получении всех данных:', error);
    return { news: [], collections: [], newsAudio: [] };  // Изменено newsItems на news
  }
};