import React, { useEffect, useState } from 'react';

function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    if (!userId) {
      window.location.href = '/';
      return;
    }

    fetch(`http://127.0.0.1:8000/medicines/${userId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch medicines');
        }
        return response.json();
      })
      .then(data => {
        setMedicines(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <p>Loading medicines...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Your Medicines</h1>
      {medicines.length === 0 ? (
        <p>No medicines found.</p>
      ) : (
        <div style={styles.medicineList}>
          {medicines.map((med, index) => (
            <div key={index} style={styles.card}>
              <h3 style={styles.title}>{med.medicine_name}</h3>
              <p><strong>Dosage:</strong> {med.dosage}</p>
              <p><strong>Frequency:</strong> {med.frequency}</p>
              <p><strong>Reminder Time:</strong> {med.reminder_time}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
    fontFamily: 'Segoe UI, sans-serif',
  },
  heading: {
    fontSize: '2rem',
    color: '#2f8bfd',
    marginBottom: '20px',
  },
  medicineList: {
    display: 'grid',
    gap: '15px',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '15px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'left',
    maxWidth: '300px',
    margin: '0 auto',
  },
  title: {
    color: '#2f8bfd',
    marginBottom: '5px',
  },
};

export default Medicines;
