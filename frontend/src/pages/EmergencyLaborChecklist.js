import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmergencyLaborChecklist = () => {
  const [checklist, setChecklist] = useState([]);

  useEffect(() => {
    const fetchChecklist = async () => {
      try {
        const response = await axios.get('http://localhost:8000/emergency-labor-checklist');
        setChecklist(response.data.map(item => ({ ...item, checked: false })));
      } catch (error) {
        console.error('Error fetching labor checklist:', error);
      }
    };

    fetchChecklist();
  }, []);

  const handleCheckboxChange = (index) => {
    const updatedChecklist = [...checklist];
    updatedChecklist[index].checked = !updatedChecklist[index].checked;
    setChecklist(updatedChecklist);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Emergency Labor Checklist</h2>
      <ul style={styles.items}>
        {checklist.map((item, index) => (
          <li key={index} style={styles.item}>
            <input
              type="checkbox"
              style={styles.checkbox}
              checked={item.checked}
              onChange={() => handleCheckboxChange(index)}
            />
            <label style={{ ...styles.label, ...(item.checked ? styles.labelChecked : {}) }}>
              {item.item}
            </label>
          </li>
        ))}
      </ul>
      {checklist.length === 0 && <p>Loading checklist...</p>}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f9f9f9',
    border: '1px solid #ddd',
    borderRadius: '8px',
    maxWidth: '600px',
    margin: '20px auto',
  },
  title: {
    color: '#e44d26',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
  },
  items: {
    listStyle: 'none',
    padding: '0',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  checkbox: {
    marginRight: '10px',
    width: '20px',
    height: '20px',
    accentColor: '#e44d26',
  },
  label: {
    fontSize: '16px',
    color: '#333',
  },
  labelChecked: {
    color: '#777',
    textDecoration: 'line-through',
  },
};

export default EmergencyLaborChecklist;