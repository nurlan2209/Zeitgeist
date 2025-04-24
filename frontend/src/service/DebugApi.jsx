// DebugApi.jsx
import React, { useState, useEffect } from 'react';
import { getAllData } from '../service/api';

const DebugApi = () => {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAllData();
        setApiData(data);
        setError(null);
      } catch (err) {
        console.error('Ошибка при получении данных:', err);
        setError('Не удалось загрузить данные: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Загрузка данных с API...</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Отладка API</h1>
      
      <h2>Новости ({apiData?.news?.length || 0})</h2>
      {apiData?.news?.length > 0 ? (
        <pre>{JSON.stringify(apiData.news[0], null, 2)}</pre>
      ) : (
        <p>Новости не найдены</p>
      )}
      
      <h2>Коллекции ({apiData?.collections?.length || 0})</h2>
      {apiData?.collections?.length > 0 ? (
        <pre>{JSON.stringify(apiData.collections[0], null, 2)}</pre>
      ) : (
        <p>Коллекции не найдены</p>
      )}
      
      <h2>Аудионовости ({apiData?.newsAudio?.length || 0})</h2>
      {apiData?.newsAudio?.length > 0 ? (
        <pre>{JSON.stringify(apiData.newsAudio[0], null, 2)}</pre>
      ) : (
        <p>Аудионовости не найдены</p>
      )}
    </div>
  );
};

export default DebugApi;