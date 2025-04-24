import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function CurrencyRates({ currencies = ['USD', 'EUR', 'CNY'] }) {
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCurrencyRates() {
      try {
        // Fetch USD rates
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();

        // Log the entire rates object to see what's available
        console.log('Full rates object:', data.rates);

        // Conversion rates to KZT (Tenge) for 1 unit of each currency
        const processedRates = {
          USD: (1 * data.rates.KZT).toFixed(2),
          EUR: (1 * data.rates.KZT / data.rates.EUR).toFixed(2),
          CNY: (1 * data.rates.KZT / data.rates.CNY).toFixed(2),
          RUB: (1 * data.rates.KZT / data.rates.RUB).toFixed(2),
        };

        // Log the processed rates
        console.log('Processed rates:', processedRates);

        setRates(processedRates);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка загрузки курсов валют:', error);
        setLoading(false);
      }
    }

    fetchCurrencyRates();
  }, []);

  if (loading) {
    return <div className="currency-rates-loading">Загрузка...</div>;
  }

  return (
    <div className="currency-rates-container" style={{
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      padding: '5px 10px',
      borderRadius: '5px',
      marginLeft: '-10px',
      flexWrap: 'wrap',
      marginTop: '-10px',
    }}>
      {currencies.map((currency) => (
        <div 
          key={currency} 
          className="currency-rate-item"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontSize: '15px',
            margin: '0 5px',
          }}
        >
          <span>{currency}</span>
          <strong>{rates[currency]} ₸</strong>
        </div>
      ))}
    </div>
  );
}

CurrencyRates.propTypes = {
  currencies: PropTypes.arrayOf(PropTypes.string)
};

export default CurrencyRates;