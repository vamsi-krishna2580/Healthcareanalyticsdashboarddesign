import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import { Slider } from '@/app/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { generatePopulationData } from '@/app/utils/diabetes-risk';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { Users, Filter } from 'lucide-react';

export function PopulationInsights() {
  const [ageRange, setAgeRange] = useState<[number, number]>([20, 75]);
  const [gender, setGender] = useState<string>('all');
  
  const populationData = useMemo(() => generatePopulationData(), []);
  
  // Filter data based on controls
  const filteredData = useMemo(() => {
    return populationData.filter(d => 
      d.age >= ageRange[0] && d.age <= ageRange[1]
    );
  }, [populationData, ageRange]);
  
  // Age distribution comparison
  const ageDistribution = useMemo(() => {
    const bins = [
      { range: '20-30', min: 20, max: 30 },
      { range: '30-40', min: 30, max: 40 },
      { range: '40-50', min: 40, max: 50 },
      { range: '50-60', min: 50, max: 60 },
      { range: '60-70', min: 60, max: 70 },
      { range: '70+', min: 70, max: 100 }
    ];
    
    return bins.map(bin => {
      const inRange = filteredData.filter(d => d.age >= bin.min && d.age < bin.max);
      return {
        range: bin.range,
        diabetic: inRange.filter(d => d.hasDiabetes).length,
        nonDiabetic: inRange.filter(d => !d.hasDiabetes).length
      };
    });
  }, [filteredData]);
  
  // BMI distribution comparison
  const bmiDistribution = useMemo(() => {
    const bins = [
      { range: 'Underweight\n(<18.5)', min: 0, max: 18.5 },
      { range: 'Normal\n(18.5-25)', min: 18.5, max: 25 },
      { range: 'Overweight\n(25-30)', min: 25, max: 30 },
      { range: 'Obese\n(30-35)', min: 30, max: 35 },
      { range: 'Severely Obese\n(35+)', min: 35, max: 100 }
    ];
    
    return bins.map(bin => {
      const inRange = filteredData.filter(d => d.bmi >= bin.min && d.bmi < bin.max);
      return {
        range: bin.range,
        diabetic: inRange.filter(d => d.hasDiabetes).length,
        nonDiabetic: inRange.filter(d => !d.hasDiabetes).length
      };
    });
  }, [filteredData]);
  
  // Risk by age group
  const riskByAge = useMemo(() => {
    const bins = ['20-30', '30-40', '40-50', '50-60', '60-70', '70+'];
    const ranges = [[20,30], [30,40], [40,50], [50,60], [60,70], [70,100]];
    
    return bins.map((bin, idx) => {
      const [min, max] = ranges[idx];
      const inRange = filteredData.filter(d => d.age >= min && d.age < max);
      const diabeticCount = inRange.filter(d => d.hasDiabetes).length;
      const riskPct = inRange.length > 0 ? (diabeticCount / inRange.length) * 100 : 0;
      
      return {
        ageGroup: bin,
        riskPercentage: riskPct
      };
    });
  }, [filteredData]);
  
  // Correlation data (simplified heatmap representation)
  const correlationData = [
    { feature1: 'Age', feature2: 'Diabetes', correlation: 0.65 },
    { feature1: 'BMI', feature2: 'Diabetes', correlation: 0.72 },
    { feature1: 'Glucose', feature2: 'Diabetes', correlation: 0.85 },
    { feature1: 'BP', feature2: 'Diabetes', correlation: 0.48 },
    { feature1: 'Activity', feature2: 'Diabetes', correlation: -0.42 },
    { feature1: 'Age', feature2: 'BMI', correlation: 0.35 },
    { feature1: 'Age', feature2: 'BP', correlation: 0.55 },
    { feature1: 'BMI', feature2: 'Glucose', correlation: 0.58 }
  ];
  
  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <Card className="shadow-md">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            Population Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label>Age Range</Label>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-blue-600 w-12">
                  {ageRange[0]}
                </span>
                <Slider
                  value={ageRange}
                  onValueChange={(val) => setAgeRange([val[0], val[1]])}
                  min={18}
                  max={90}
                  step={1}
                  minStepsBetweenThumbs={5}
                  className="flex-1"
                />
                <span className="text-sm font-semibold text-blue-600 w-12 text-right">
                  {ageRange[1]}
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label>Gender</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-800">
              <Users className="inline w-4 h-4 mr-1" />
              Showing data for <span className="font-semibold">{filteredData.length}</span> individuals
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Age Distribution */}
        <Card className="shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b">
            <CardTitle>Age Distribution Comparison</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ageDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="range" />
                <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px'
                  }}
                />
                <Legend />
                <Bar dataKey="diabetic" fill="#ef4444" name="Diabetic" radius={[4, 4, 0, 0]} />
                <Bar dataKey="nonDiabetic" fill="#10b981" name="Non-Diabetic" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* BMI Distribution */}
        <Card className="shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b">
            <CardTitle>BMI Category Distribution</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bmiDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="range" 
                  tick={{ fontSize: 11 }}
                  interval={0}
                />
                <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px'
                  }}
                />
                <Legend />
                <Bar dataKey="diabetic" fill="#ef4444" name="Diabetic" radius={[4, 4, 0, 0]} />
                <Bar dataKey="nonDiabetic" fill="#10b981" name="Non-Diabetic" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Risk by Age Group */}
        <Card className="shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b">
            <CardTitle>Diabetes Prevalence by Age Group</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={riskByAge}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="ageGroup" />
                <YAxis 
                  label={{ value: 'Prevalence (%)', angle: -90, position: 'insideLeft' }}
                  domain={[0, 100]}
                />
                <Tooltip 
                  formatter={(value: number) => `${value.toFixed(1)}%`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px'
                  }}
                />
                <Bar dataKey="riskPercentage" radius={[4, 4, 0, 0]}>
                  {riskByAge.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={entry.riskPercentage < 20 ? '#10b981' : entry.riskPercentage < 40 ? '#1E88E5' : '#ef4444'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Correlation Overview */}
        <Card className="shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b">
            <CardTitle>Feature Correlations with Diabetes</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={correlationData.filter(d => d.feature2 === 'Diabetes')}
                layout="vertical"
                margin={{ left: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  type="number" 
                  domain={[-1, 1]}
                  ticks={[-1, -0.5, 0, 0.5, 1]}
                  label={{ value: 'Correlation Coefficient', position: 'insideBottom', offset: -5 }}
                />
                <YAxis type="category" dataKey="feature1" />
                <Tooltip 
                  formatter={(value: number) => value.toFixed(2)}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px'
                  }}
                />
                <Bar dataKey="correlation" radius={[0, 4, 4, 0]}>
                  {correlationData.filter(d => d.feature2 === 'Diabetes').map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={entry.correlation > 0 ? '#1E88E5' : '#10b981'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 text-center text-sm text-gray-600">
              <p>Positive correlation indicates increased risk association</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
