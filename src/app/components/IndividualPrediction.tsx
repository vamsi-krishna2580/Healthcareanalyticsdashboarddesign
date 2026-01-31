import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import { Slider } from '@/app/components/ui/slider';
import { RiskGauge } from '@/app/components/RiskGauge';
import { 
  calculateRiskScore, 
  calculateFeatureContributions,
  type PatientData 
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
  
  const riskResult = calculateRiskScore(patientData);
  const contributions = calculateFeatureContributions(patientData);
  
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
                  onClick={() => updateField('gender', 'male')}
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
              
              {/* Helper text for female selection */}
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
            
            {/* Pregnancies - Conditional for Female */}
            <AnimatePresence>
              {patientData.gender === 'female' && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: '1.5rem' }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
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
                    onValueChange={(val) => updateField('pregnancies', val[0])}
                    min={0}
                    max={20}
                    step={1}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0</span>
                    <span>20</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Plasma Glucose */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-gray-500" />
                  Plasma Glucose
                </Label>
                <span className="text-lg font-semibold text-blue-600">
                  {patientData.glucose} mg/dL
                </span>
              </div>
              <Slider
                value={[patientData.glucose]}
                onValueChange={(val) => updateField('glucose', val[0])}
                min={0}
                max={200}
                step={1}
                className="cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0</span>
                <span>200 mg/dL</span>
              </div>
            </div>
            
            {/* Blood Pressure (Systolic) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-gray-500" />
                  Blood Pressure (Systolic)
                </Label>
                <span className="text-lg font-semibold text-blue-600">
                  {patientData.bloodPressure} mmHg
                </span>
              </div>
              <Slider
                value={[patientData.bloodPressure]}
                onValueChange={(val) => updateField('bloodPressure', val[0])}
                min={0}
                max={180}
                step={1}
                className="cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0</span>
                <span>180 mmHg</span>
              </div>
            </div>
            
            {/* Skin Thickness (Triceps) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-gray-500" />
                  Skin Thickness (Triceps)
                </Label>
                <span className="text-lg font-semibold text-blue-600">
                  {patientData.skinThickness} mm
                </span>
              </div>
              <Slider
                value={[patientData.skinThickness]}
                onValueChange={(val) => updateField('skinThickness', val[0])}
                min={0}
                max={100}
                step={1}
                className="cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0</span>
                <span>100 mm</span>
              </div>
            </div>
            
            {/* Serum Insulin */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Syringe className="w-4 h-4 text-gray-500" />
                  Serum Insulin
                </Label>
                <span className="text-lg font-semibold text-blue-600">
                  {patientData.insulin} µU/mL
                </span>
              </div>
              <Slider
                value={[patientData.insulin]}
                onValueChange={(val) => updateField('insulin', val[0])}
                min={0}
                max={900}
                step={1}
                className="cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0</span>
                <span>900 µU/mL</span>
              </div>
            </div>
            
            {/* BMI */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                  BMI
                </Label>
                <span className="text-lg font-semibold text-blue-600">
                  {patientData.bmi.toFixed(1)}
                </span>
              </div>
              <Slider
                value={[patientData.bmi]}
                onValueChange={(val) => updateField('bmi', val[0])}
                min={10}
                max={60}
                step={0.1}
                className="cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>10</span>
                <span>60</span>
              </div>
            </div>
            
            {/* Family History Index */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  Family History Index
                </Label>
                <span className="text-lg font-semibold text-blue-600">
                  {patientData.diabetesPedigreeFunction.toFixed(3)}
                </span>
              </div>
              <Slider
                value={[patientData.diabetesPedigreeFunction]}
                onValueChange={(val) => updateField('diabetesPedigreeFunction', val[0])}
                min={0}
                max={3}
                step={0.001}
                className="cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0.000</span>
                <span>3.000</span>
              </div>
            </div>
            
            {/* Age */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  Age
                </Label>
                <span className="text-lg font-semibold text-blue-600">
                  {patientData.age} years
                </span>
              </div>
              <Slider
                value={[patientData.age]}
                onValueChange={(val) => updateField('age', val[0])}
                min={18}
                max={90}
                step={1}
                className="cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>18</span>
                <span>90</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Center Panel - Risk Display */}
      <div className="col-span-8 space-y-6">
        <Card className="shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b">
            <CardTitle>Diabetes Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent className="pt-8 pb-6">
            <RiskGauge 
              score={riskResult.score} 
              level={riskResult.level}
              color={riskResult.color}
            />
            <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-sm uppercase tracking-wide text-gray-600 mb-2">
                Clinical Recommendation
              </h4>
              <p className="text-gray-700 leading-relaxed">
                {riskResult.recommendation}
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Feature Contribution Chart */}
        <Card className="shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b">
            <CardTitle>Risk Factor Contribution</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={contributions}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  type="number" 
                  domain={[0, 35]}
                  label={{ value: 'Contribution to Risk', position: 'insideBottom', offset: -5 }}
                />
                <YAxis type="category" dataKey="feature" />
                <Tooltip 
                  formatter={(value: number) => [
                    `${value > 0 ? '+' : ''}${value.toFixed(1)} points`,
                    'Impact'
                  ]}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px'
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {contributions.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.value > 0 ? '#ef4444' : '#10b981'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-gray-600">Increases Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-gray-600">Decreases Risk</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
