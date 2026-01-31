// Utility functions for diabetes risk prediction and calculations (Pima Indians Dataset)

export interface PatientData {
  gender: 'male' | 'female';
  pregnancies: number; // only for females
  glucose: number; // plasma glucose concentration (mg/dL)
  bloodPressure: number; // diastolic blood pressure (mmHg)
  skinThickness: number; // triceps skin fold thickness (mm)
  insulin: number; // 2-hour serum insulin (µU/mL)
  bmi: number; // body mass index
  diabetesPedigreeFunction: number; // diabetes pedigree function (family history index)
  age: number; // age in years
}

export interface RiskResult {
  score: number; // 0-100
  level: 'low' | 'medium' | 'high';
  color: string;
  recommendation: string;
}

export interface FeatureContribution {
  feature: string;
  value: number; // -100 to 100 (negative decreases risk, positive increases)
}

// Calculate diabetes risk score based on Pima dataset features
export function calculateRiskScore(data: PatientData): RiskResult {
  let score = 0;
  
  // Pregnancies contribution (females only, 0-15 points)
  if (data.gender === 'female') {
    if (data.pregnancies === 0) score += 0;
    else if (data.pregnancies <= 3) score += 5;
    else if (data.pregnancies <= 6) score += 10;
    else score += 15;
  }
  
  // Plasma glucose contribution (0-30 points)
  if (data.glucose === 0) score += 0; // Missing data
  else if (data.glucose < 100) score += 0;
  else if (data.glucose < 126) score += 15; // Prediabetes range
  else score += 30; // Diabetic range
  
  // Blood pressure contribution (0-12 points)
  if (data.bloodPressure === 0) score += 0; // Missing data
  else if (data.bloodPressure < 80) score += 0;
  else if (data.bloodPressure < 90) score += 6;
  else score += 12;
  
  // Skin thickness contribution (0-8 points)
  if (data.skinThickness === 0) score += 0; // Missing data
  else if (data.skinThickness < 20) score += 0;
  else if (data.skinThickness < 30) score += 4;
  else score += 8;
  
  // Insulin contribution (0-12 points)
  if (data.insulin === 0) score += 0; // Missing data
  else if (data.insulin < 100) score += 0;
  else if (data.insulin < 200) score += 6;
  else score += 12;
  
  // BMI contribution (0-20 points)
  if (data.bmi < 18.5) score += 2;
  else if (data.bmi < 25) score += 0;
  else if (data.bmi < 30) score += 8;
  else if (data.bmi < 35) score += 14;
  else score += 20;
  
  // Diabetes Pedigree Function (family history, 0-18 points)
  if (data.diabetesPedigreeFunction < 0.5) score += 0;
  else if (data.diabetesPedigreeFunction < 1.0) score += 6;
  else if (data.diabetesPedigreeFunction < 1.5) score += 12;
  else score += 18;
  
  // Age contribution (0-20 points)
  if (data.age < 30) score += 0;
  else if (data.age < 40) score += 5;
  else if (data.age < 50) score += 10;
  else if (data.age < 60) score += 15;
  else score += 20;
  
  // Normalize to 0-100
  score = Math.min(100, score);
  
  // Determine risk level
  let level: 'low' | 'medium' | 'high';
  let color: string;
  let recommendation: string;
  
  if (score < 35) {
    level = 'low';
    color = '#10b981'; // green
    recommendation = 'Your diabetes risk is low. Continue maintaining a healthy lifestyle with regular exercise and balanced nutrition. Regular screening is recommended.';
  } else if (score < 65) {
    level = 'medium';
    color = '#1E88E5'; // blue
    recommendation = 'Your diabetes risk is moderate. Consider lifestyle modifications including weight management, dietary improvements, and regular physical activity. Consult with your healthcare provider for personalized guidance.';
  } else {
    level = 'high';
    color = '#ef4444'; // red
    recommendation = 'Your diabetes risk is elevated. We strongly recommend scheduling a consultation with your healthcare provider for comprehensive evaluation, possible glucose tolerance testing, and a personalized intervention plan.';
  }
  
  return { score, level, color, recommendation };
}

// Calculate feature contributions to risk
export function calculateFeatureContributions(data: PatientData): FeatureContribution[] {
  const contributions: FeatureContribution[] = [];
  
  // Pregnancies (females only)
  if (data.gender === 'female') {
    let pregContrib = 0;
    if (data.pregnancies > 6) pregContrib = 15;
    else if (data.pregnancies > 3) pregContrib = 10;
    else if (data.pregnancies > 0) pregContrib = 5;
    contributions.push({ feature: 'Pregnancies', value: pregContrib });
  }
  
  // Plasma glucose
  let glucoseContrib = 0;
  if (data.glucose >= 126) glucoseContrib = 30;
  else if (data.glucose >= 100) glucoseContrib = 15;
  contributions.push({ feature: 'Plasma Glucose', value: glucoseContrib });
  
  // Blood pressure
  let bpContrib = 0;
  if (data.bloodPressure >= 90) bpContrib = 12;
  else if (data.bloodPressure >= 80) bpContrib = 6;
  contributions.push({ feature: 'Blood Pressure', value: bpContrib });
  
  // Skin thickness
  let skinContrib = 0;
  if (data.skinThickness >= 30) skinContrib = 8;
  else if (data.skinThickness >= 20) skinContrib = 4;
  contributions.push({ feature: 'Skin Thickness', value: skinContrib });
  
  // Insulin
  let insulinContrib = 0;
  if (data.insulin >= 200) insulinContrib = 12;
  else if (data.insulin >= 100) insulinContrib = 6;
  contributions.push({ feature: 'Serum Insulin', value: insulinContrib });
  
  // BMI
  let bmiContrib = 0;
  if (data.bmi >= 35) bmiContrib = 20;
  else if (data.bmi >= 30) bmiContrib = 14;
  else if (data.bmi >= 25) bmiContrib = 8;
  else if (data.bmi < 18.5) bmiContrib = 2;
  contributions.push({ feature: 'BMI', value: bmiContrib });
  
  // Family history
  let familyContrib = 0;
  if (data.diabetesPedigreeFunction >= 1.5) familyContrib = 18;
  else if (data.diabetesPedigreeFunction >= 1.0) familyContrib = 12;
  else if (data.diabetesPedigreeFunction >= 0.5) familyContrib = 6;
  contributions.push({ feature: 'Family History', value: familyContrib });
  
  // Age
  let ageContrib = 0;
  if (data.age >= 60) ageContrib = 20;
  else if (data.age >= 50) ageContrib = 15;
  else if (data.age >= 40) ageContrib = 10;
  else if (data.age >= 30) ageContrib = 5;
  contributions.push({ feature: 'Age', value: ageContrib });
  
  return contributions.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
}

// Generate mock population data for charts
export function generatePopulationData() {
  const data = [];
  for (let i = 0; i < 500; i++) {
    const hasDiabetes = Math.random() > 0.7;
    data.push({
      age: hasDiabetes 
        ? Math.floor(Math.random() * 30 + 45) // 45-75
        : Math.floor(Math.random() * 50 + 20), // 20-70
      bmi: hasDiabetes
        ? Math.random() * 15 + 27 // 27-42
        : Math.random() * 12 + 20, // 20-32
      glucose: hasDiabetes
        ? Math.random() * 80 + 110 // 110-190
        : Math.random() * 40 + 70, // 70-110
      bloodPressure: hasDiabetes
        ? Math.random() * 50 + 120 // 120-170
        : Math.random() * 40 + 90, // 90-130
      physicalActivity: hasDiabetes
        ? Math.random() * 3 // 0-3 hours
        : Math.random() * 8, // 0-8 hours
      hasDiabetes
    });
  }
  return data;
}

// Generate confusion matrix data based on threshold
export function generateConfusionMatrix(threshold: number) {
  // Simulate predictions
  const total = 1000;
  const actualPositive = 300;
  const actualNegative = 700;
  
  // True positive rate increases with lower threshold
  const sensitivity = 0.5 + (1 - threshold) * 0.4;
  const specificity = 0.4 + threshold * 0.5;
  
  const truePositive = Math.round(actualPositive * sensitivity);
  const falseNegative = actualPositive - truePositive;
  const trueNegative = Math.round(actualNegative * specificity);
  const falsePositive = actualNegative - trueNegative;
  
  return {
    truePositive,
    falsePositive,
    trueNegative,
    falseNegative,
    accuracy: (truePositive + trueNegative) / total,
    precision: truePositive / (truePositive + falsePositive),
    recall: truePositive / (truePositive + falseNegative),
    f1Score: 2 * (truePositive / (truePositive + falsePositive)) * (truePositive / (truePositive + falseNegative)) / 
             ((truePositive / (truePositive + falsePositive)) + (truePositive / (truePositive + falseNegative)))
  };
}

// Generate ROC curve data
export function generateROCData() {
  const points = [];
  for (let i = 0; i <= 100; i += 5) {
    const threshold = i / 100;
    const tpr = 0.5 + (1 - threshold) * 0.4 + Math.random() * 0.05;
    const fpr = 0.05 + (1 - threshold) * 0.5 + Math.random() * 0.05;
    points.push({
      threshold,
      fpr: Math.min(1, fpr),
      tpr: Math.min(1, tpr)
    });
  }
  // Sort by FPR for proper curve
  return points.sort((a, b) => a.fpr - b.fpr);
}

// Calculate AUC (Area Under Curve)
export function calculateAUC(rocData: any[]) {
  let auc = 0;
  for (let i = 1; i < rocData.length; i++) {
    const width = rocData[i].fpr - rocData[i - 1].fpr;
    const height = (rocData[i].tpr + rocData[i - 1].tpr) / 2;
    auc += width * height;
  }
  return auc;
}

// Call Flask backend SVM model for real prediction
export async function fetchBackendRisk(data: PatientData): Promise<RiskResult> {
  const response = await fetch("http://127.0.0.1:5000/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      gender: data.gender,
      pregnancies: data.gender === 'female' ? data.pregnancies : 0,
      glucose: data.glucose,
      bloodPressure: data.bloodPressure,
      skinThickness: data.skinThickness,
      insulin: data.insulin,
      bmi: data.bmi,
      dpf: data.diabetesPedigreeFunction,
      age: data.age,
    }),
  });

  if (!response.ok) {
    throw new Error("Backend prediction failed");
  }

  const result = await response.json();

  const score: number = result.risk_score; // 0–100 from backend

  // Map backend score to UI levels/colors/recommendations
  let level: 'low' | 'medium' | 'high';
  let color: string;
  let recommendation: string;

  if (score < 35) {
    level = 'low';
    color = '#10b981'; // green
    recommendation =
      'Your diabetes risk is low. Continue maintaining a healthy lifestyle with regular exercise and balanced nutrition. Regular screening is recommended.';
  } else if (score < 65) {
    level = 'medium';
    color = '#1E88E5'; // blue
    recommendation =
      'Your diabetes risk is moderate. Consider lifestyle modifications including weight management, dietary improvements, and regular physical activity. Consult with your healthcare provider for personalized guidance.';
  } else {
    level = 'high';
    color = '#ef4444'; // red
    recommendation =
      'Your diabetes risk is elevated. We strongly recommend scheduling a consultation with your healthcare provider for comprehensive evaluation, possible glucose tolerance testing, and a personalized intervention plan.';
  }

  return {
    score,
    level,
    color,
    recommendation,
  };
}
