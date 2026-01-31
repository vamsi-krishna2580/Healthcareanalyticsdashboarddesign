import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import { Slider } from '@/app/components/ui/slider';
import { RiskGauge } from '@/app/components/RiskGauge';
import { 
  fetchBackendRisk,
  calculateFeatureContributions,
  type PatientData,
  type RiskResult
} from '@/app/utils/diabetes-risk';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { User, Droplet, Heart, Ruler, Syringe, TrendingUp, Users, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function IndividualPrediction() {
  const [patientData, setPatientData] = useState<PatientData>({
    gender: 'male',
    pregnancies: 0,
    glucose: 120,
    bloodPressure: 70,
    skinThickness: 20,
    insulin: 80,
    bmi: 32,
    diabetesPedigreeFunction: 0.5,
    age: 33
  });

  const [riskResult, setRiskResult] = useState<RiskResult>({
    score: 0,
    level: 'low',
    color: '#10b981',
    recommendation: 'Adjust inputs to calculate diabetes risk.'
  });

  const contributions = calculateFeatureContributions(patientData);

  // call backend whenever any input changes
  useEffect(() => {
    const getRisk = async () => {
      try {
        const result = await fetchBackendRisk(patientData);
        setRiskResult(result);
      } catch (err) {
        console.error('Backend error:', err);
      }
    };

    getRisk();
  }, [patientData]);

  const updateField = (field: keyof PatientData, value: number | string) => {
    setPatientData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Left Panel - Input Form */}
      <div className="col-span-4">
        <Card className="shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">

            {/* Gender Toggle */}
            <div className="space-y-3">
              <Label>Gender</Label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
                <button
                  onClick={() => {
                    updateField('gender', 'male');
                    updateField('pregnancies', 0); // reset for male
                  }}
                  className={`py-2.5 px-4 rounded-md transition-all duration-200 ${
                    patientData.gender === 'male'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-transparent text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Male
                </button>
                <button
                  onClick={() => updateField('gender', 'female')}
                  className={`py-2.5 px-4 rounded-md transition-all duration-200 ${
                    patientData.gender === 'female'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-transparent text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Female
                </button>
              </div>

              <AnimatePresence>
                {patientData.gender === 'female' && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-xs text-muted-foreground"
                  >
                    Pregnancy history is used as a diabetes risk factor.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Pregnancies (only female) */}
            <AnimatePresence>
              {patientData.gender === 'female' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3 overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      Pregnancies
                    </Label>
                    <span className="text-lg font-semibold text-blue-600">
                      {patientData.pregnancies}
                    </span>
                  </div>
                  <Slider
                    value={[patientData.pregnancies]}
                    onValueChange={(v) => updateField('pregnancies', v[0])}
                    min={0}
                    max={20}
                    step={1}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Plasma Glucose */}
            <Field label="Plasma Glucose" icon={<Droplet className="w-4 h-4 text-gray-500" />}
              value={`${patientData.glucose} mg/dL`}>
              <Slider value={[patientData.glucose]} onValueChange={(v)=>updateField('glucose',v[0])} min={0} max={200}/>
            </Field>

            {/* Blood Pressure */}
            <Field label="Blood Pressure (Systolic)" icon={<Heart className="w-4 h-4 text-gray-500" />}
              value={`${patientData.bloodPressure} mmHg`}>
              <Slider value={[patientData.bloodPressure]} onValueChange={(v)=>updateField('bloodPressure',v[0])} min={0} max={180}/>
            </Field>

            {/* Skin Thickness */}
            <Field label="Skin Thickness (Triceps)" icon={<Ruler className="w-4 h-4 text-gray-500" />}
              value={`${patientData.skinThickness} mm`}>
              <Slider value={[patientData.skinThickness]} onValueChange={(v)=>updateField('skinThickness',v[0])} min={0} max={100}/>
            </Field>

            {/* Insulin */}
            <Field label="Serum Insulin" icon={<Syringe className="w-4 h-4 text-gray-500" />}
              value={`${patientData.insulin} µU/mL`}>
              <Slider value={[patientData.insulin]} onValueChange={(v)=>updateField('insulin',v[0])} min={0} max={900}/>
            </Field>

            {/* BMI */}
            <Field label="BMI" icon={<TrendingUp className="w-4 h-4 text-gray-500" />}
              value={patientData.bmi.toFixed(1)}>
              <Slider value={[patientData.bmi]} onValueChange={(v)=>updateField('bmi',v[0])} min={10} max={60} step={0.1}/>
            </Field>

            {/* Family History */}
            <Field label="Family History Index" icon={<Users className="w-4 h-4 text-gray-500" />}
              value={patientData.diabetesPedigreeFunction.toFixed(3)}>
              <Slider value={[patientData.diabetesPedigreeFunction]} onValueChange={(v)=>updateField('diabetesPedigreeFunction',v[0])} min={0} max={3} step={0.001}/>
            </Field>

            {/* Age */}
            <Field label="Age" icon={<Calendar className="w-4 h-4 text-gray-500" />}
              value={`${patientData.age} years`}>
              <Slider value={[patientData.age]} onValueChange={(v)=>updateField('age',v[0])} min={18} max={90}/>
            </Field>

          </CardContent>
        </Card>
      </div>

      {/* Right Panel */}
      <div className="col-span-8 space-y-6">
        <Card className="shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b">
            <CardTitle>Diabetes Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent className="pt-8 pb-6">
            <RiskGauge score={riskResult.score} level={riskResult.level} color={riskResult.color}/>
            <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
              <h4 className="text-sm uppercase tracking-wide text-gray-600 mb-2">
                Clinical Recommendation
              </h4>
              <p className="text-gray-700">{riskResult.recommendation}</p>
            </div>
          </CardContent>
        </Card>

        {/* Feature Contribution */}
        <Card className="shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b">
            <CardTitle>Risk Factor Contribution</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={contributions} layout="vertical" margin={{ left:120 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0,35]}/>
                <YAxis type="category" dataKey="feature"/>
                <Tooltip formatter={(v:number)=>`${v.toFixed(1)} pts`}/>
                <Bar dataKey="value" radius={[0,4,4,0]}>
                  {contributions.map((e,i)=>(
                    <Cell key={i} fill={e.value>0?'#ef4444':'#10b981'}/>
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* Small reusable field wrapper */
function Field({label,icon,value,children}:{label:string,icon:React.ReactNode,value:string,children:React.ReactNode}){
  return(
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2">{icon}{label}</Label>
        <span className="text-lg font-semibold text-blue-600">{value}</span>
      </div>
      {children}
    </div>
  );
}
