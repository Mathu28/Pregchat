import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faPlusCircle, faTrashAlt, faCapsules } from '@fortawesome/free-solid-svg-icons';

function MedicineReminder() {
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem('user_id');

  const fetchMedicines = useCallback(async () => {
    if (!userId) {
      setError('User ID is missing. Please log in.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://127.0.0.1:8000/medicines/${userId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch medicines.');
      }

      const data = await response.json();
      console.log("Fetched medicines:", data);
      setMedicines(data);
    } catch (err) {
      console.error("Error fetching medicines:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setError('User ID is missing. Please log in.');
      return;
    }

    setLoading(true);
    setError(null);

    const newMedicine = {
      patient_id: parseInt(userId),
      medicine_name: medicineName,
      dosage,
      frequency,
      reminder_time: reminderTime,
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/medicines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMedicine),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add medicine.');
      }

      setMedicineName('');
      setDosage('');
      setFrequency('');
      setReminderTime('');

      fetchMedicines();
    } catch (err) {
      console.error("Error adding medicine:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this reminder?')) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://127.0.0.1:8000/medicines/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete medicine.');
      }

      setMedicines((prevMedicines) => prevMedicines.filter((med) => med.id !== id));
    } catch (err) {
      console.error("Error deleting medicine:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <FontAwesomeIcon icon={faClock} size="2x" style={styles.clockIcon} />
        <h1 style={styles.heading}>Medicine Reminders</h1>
      </div>

      <div style={styles.addMedicineSection}>
        <h2 style={styles.addMedicineHeading}>
          <FontAwesomeIcon icon={faPlusCircle} style={styles.plusIcon} /> Add New Reminder
        </h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="medicineName" style={styles.label}>Medicine Name:</label>
            <input type="text" id="medicineName" value={medicineName} onChange={(e) => setMedicineName(e.target.value)} required style={styles.input} />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="dosage" style={styles.label}>Dosage:</label>
            <input type="text" id="dosage" value={dosage} onChange={(e) => setDosage(e.target.value)} required style={styles.input} />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="frequency" style={styles.label}>Frequency:</label>
            <input type="text" id="frequency" placeholder="e.g., 2x daily" value={frequency} onChange={(e) => setFrequency(e.target.value)} required style={styles.input} />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="reminderTime" style={styles.label}>Reminder Time:</label>
            <input type="time" id="reminderTime" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)} required style={styles.input} />
          </div>
          <button type="submit" style={styles.addButton} disabled={loading}>
            {loading ? 'Saving...' : 'Set Reminder'}
          </button>
        </form>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.yourMedicinesSection}>
        <h2 style={styles.yourMedicinesHeading}>
          <FontAwesomeIcon icon={faCapsules} style={styles.capsuleIcon} /> Your Current Medicines
        </h2>
        {loading ? (
          <p>Loading your reminders...</p>
        ) : (
          <div style={styles.medicineList}>
            {medicines.length === 0 ? (
              <p style={styles.noMedicines}>No medicine reminders set yet.</p>
            ) : (
              medicines.map((med) => (
                <div key={med.id} style={styles.medicineCard}>
                  <h3 style={styles.medicineName}>{med.medicine_name}</h3>
                  <p style={styles.medicineInfo}>
                    <strong style={styles.infoLabel}>Dosage:</strong> {med.dosage}
                  </p>
                  <p style={styles.medicineInfo}>
                    <strong style={styles.infoLabel}>Frequency:</strong> {med.frequency}
                  </p>
                  <p style={styles.medicineInfo}>
                    <strong style={styles.infoLabel}>Time:</strong> {med.reminder_time}
                  </p>
                  <button style={styles.deleteButton} onClick={() => handleDelete(med.id)}>
                    <FontAwesomeIcon icon={faTrashAlt} /> Delete
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    maxWidth: '800px',
    margin: '40px auto',
    padding: '30px',
    backgroundColor: '#f4f7f6',
    borderRadius: '12px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '30px',
  },
  clockIcon: {
    color: '#5cb85c',
    marginRight: '10px',
  },
  heading: {
    fontSize: '2.5em',
    color: '#333',
    marginBottom: 0,
  },
  addMedicineSection: {
    backgroundColor: '#fff',
    padding: '25px',
    borderRadius: '8px',
    marginBottom: '30px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
  },
  addMedicineHeading: {
    fontSize: '1.8em',
    color: '#384840',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusIcon: {
    color: '#5cb85c',
    marginRight: '10px',
  },
  form: {
    display: 'grid',
    gap: '15px',
    maxWidth: '400px',
    margin: '0 auto',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left', // Align label to the left
  },
  label: {
    fontSize: '1em',
    color: '#333',
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    boxSizing: 'border-box',
  },
  addButton: {
    backgroundColor: '#5cb85c',
    color: '#fff',
    padding: '15px',
    fontSize: '1.1em',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: '#4cae4c',
    },
    fontWeight: 'bold',
  },
  yourMedicinesSection: {
    backgroundColor: '#fff',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
  },
  yourMedicinesHeading: {
    fontSize: '1.8em',
    color: '#384840',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  capsuleIcon: {
    color: '#007bff',
    marginRight: '10px',
  },
  medicineList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  },
  medicineCard: {
    backgroundColor: '#e9ecef',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    textAlign: 'left',
  },
  medicineName: {
    fontSize: '1.3em',
    color: '#007bff',
    marginBottom: '10px',
    fontWeight: 'bold',
  },
  medicineInfo: {
    fontSize: '1em',
    color: '#495057',
    marginBottom: '8px',
  },
  infoLabel: {
    fontWeight: 'bold',
    marginRight: '5px',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1em',
    marginTop: '15px',
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: '#c82333',
    },
    fontWeight: 'bold',
  },
  error: {
    color: '#dc3545',
    marginTop: '20px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  noMedicines: {
    color: '#6c757d',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: '20px',
  },
};

export default MedicineReminder;