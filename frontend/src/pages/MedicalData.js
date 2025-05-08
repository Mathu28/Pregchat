import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeartbeat,
  faStethoscope,
  faNotesMedical,
  faUserNurse,
  faSyringe,
  faPills,
  faBandAid,
  faThermometer,
} from '@fortawesome/free-solid-svg-icons';

function MedicalData() {
  const [patientData, setPatientData] = useState(null);
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/medical_data/${userId}`);
        const data = await res.json();
        setPatientData(data);
      } catch (err) {
        console.error('Failed to fetch medical data:', err);
      }
    };
    fetchData();
  }, [userId]);

  const fieldsToDisplay = [
    { label: 'Name', key: 'name' },
    { label: 'Age', key: 'age' },
    { label: 'Pregnancies', key: 'pregnancies' },
    { label: 'TT Vaccination', key: 'tt_vaccination' },
    { label: 'Gestational Age', key: 'gestational_age' },
    { label: 'Gestational Age Units', key: 'gestational_age_units', isUnit: true },
    { label: 'Weight', key: 'weight' },
    { label: 'Weight Unit', key: 'weight_unit', isUnit: true },
    { label: 'Height', key: 'height' },
    { label: 'Height Unit', key: 'height_unit', isUnit: true },
    { label: 'Blood Pressure', key: 'blood_pressure' },
    { label: 'Anemia', key: 'anemia' },
    { label: 'Jaundice', key: 'jaundice' },
    { label: 'Fetal Position', key: 'fetal_position' },
    { label: 'Fetal Movement', key: 'fetal_movement' },
    { label: 'Fetal Heartbeat', key: 'fetal_heartbeat' },
    { label: 'Urine Test Albumin', key: 'urine_test_albumin' },
    { label: 'Urine Test Sugar', key: 'urine_test_sugar', isBoolean: true },
    { label: 'VDRL', key: 'vdrl' },
    { label: 'HRsAG', key: 'hrsag' },
    { label: 'High-Risk Pregnancy', key: 'high_risk_pregnancy', isBoolean: true },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.backgroundIcons}>
        <FontAwesomeIcon icon={faHeartbeat} size="3x" style={styles.bgIcon1} />
        <FontAwesomeIcon icon={faStethoscope} size="3x" style={styles.bgIcon2} />
        <FontAwesomeIcon icon={faNotesMedical} size="3x" style={styles.bgIcon3} />
        <FontAwesomeIcon icon={faUserNurse} size="3x" style={styles.bgIcon4} />
        <FontAwesomeIcon icon={faSyringe} size="3x" style={styles.bgIcon5} />
        <FontAwesomeIcon icon={faPills} size="3x" style={styles.bgIcon6} />
        <FontAwesomeIcon icon={faBandAid} size="3x" style={styles.bgIcon7} />
        <FontAwesomeIcon icon={faThermometer} size="3x" style={styles.bgIcon8} />
      </div>
      <h2 style={styles.heading}>My Medical Data</h2>
      {patientData ? (
        <div style={styles.dataBox}>
          {fieldsToDisplay.map((field) => (
            <div key={field.key} style={styles.dataRow}>
              <strong style={styles.label}>{field.label}:</strong>
              <span style={styles.value}>
                {field.isBoolean
                  ? patientData[field.key]
                    ? 'Yes'
                    : 'No'
                  : patientData[field.key] || 'Not Provided'}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading medical data...</p>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '30px auto',
    padding: '30px',
    fontFamily: 'Segoe UI, sans-serif',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  backgroundIcons: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  },
  bgIcon1: {
    position: 'absolute',
    top: '5%',
    left: '5%',
    color: '#f8bbd0',
    opacity: 0.3,
  },
  bgIcon2: {
    position: 'absolute',
    top: '20%',
    right: '10%',
    color: '#a1887f',
    opacity: 0.3,
  },
  bgIcon3: {
    position: 'absolute',
    top: '45%',
    left: '15%',
    color: '#80cbc4',
    opacity: 0.3,
  },
  bgIcon4: {
    position: 'absolute',
    top: '60%',
    right: '20%',
    color: '#ce93d8',
    opacity: 0.3,
  },
  bgIcon5: {
    position: 'absolute',
    bottom: '15%',
    left: '10%',
    color: '#f48fb1', // Another pink shade
    opacity: 0.3,
  },
  bgIcon6: {
    position: 'absolute',
    bottom: '5%',
    right: '5%',
    color: '#dcedc8', // Light green
    opacity: 0.3,
  },
  bgIcon7: {
    position: 'absolute',
    top: '35%',
    right: '30%',
    color: '#ffe0b2', // Light orange
    opacity: 0.3,
  },
  bgIcon8: {
    position: 'absolute',
    bottom: '30%',
    left: '25%',
    color: '#b3e5fc', // Light blue
    opacity: 0.3,
  },
  heading: {
    textAlign: 'center',
    fontSize: '2rem',
    color: 'black',
    marginBottom: '30px',
    padding: '10px 20px',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    alignSelf: 'center',
  },
  dataBox: {
    padding: '25px',
    borderRadius: '12px',
    backgroundColor: 'white',
    width: '80%',
  },
  dataRow: {
    display: 'flex',
    alignItems: 'baseline',
    marginBottom: '15px',
    paddingBottom: '10px',
    borderBottom: '1px solid #e0e0e0',
  },
  label: {
    color: '#333',
    fontWeight: '600',
    width: '40%',
    textAlign: 'left',
  },
  value: {
    color: '#555',
    width: '60%',
    textAlign: 'left',
  },
};

export default MedicalData;