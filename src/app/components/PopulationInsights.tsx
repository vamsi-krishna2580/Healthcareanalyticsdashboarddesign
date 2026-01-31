import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import { Slider } from '@/app/components/ui/slider';
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
  Cell
} from 'recharts';
import { Users, Filter } from 'lucide-react';

export function PopulationInsights() {
  const [ageRange, setAgeRange] = useState<[number, number]>([20, 75]);

  // synthetic population (for visual analytics only)
  const populationData = useMemo(() => generatePopulationData(), []);

  // filter by age only (matches backend features like Age, BMI, Glucose)
  const filteredData = useMemo(() => {
    return populationData.filter(
      d => d.age >= ageRange[0] && d.age <= ageRange[1]
    );
  }, [populationData, ageRange]);

  // Age distribution
  const ageDistribution = useMemo(() => {
    const bins = [
      { range: '20-30', min: 20, max: 30 },
      { range: '30-40', min: 30, max: 40 },
      { range: '40-50', min: 40, max: 50 },
      { range: '50-60', min: 50, max: 60 },
      { range: '60-70', min: 60, max: 70 },
      { range: '70+',   min: 70, max: 100 }
    ];

    return bins.map(bin => {
      const inRange = filteredData.filter(
        d => d.age >= bin.min && d.age < bin.max
      );
      return {
        range: bin.range,
        diabetic: inRange.filter(d => d.hasDiabetes).length,
        nonDiabetic: inRange.filter(d => !d.hasDiabetes).length
      };
    });
  }, [filteredData]);

  // BMI categories
  const bmiDistribution = useMemo(() => {
    const bins = [
      { range: 'Normal\n(18.5–25)', min: 18.5, max: 25 },
      { range: 'Overweight\n(25–30)', min: 25, max: 30 },
      { range: 'Obese\n(30–35)', min: 30, max: 35 },
      { range: 'Severely Obese\n(35+)', min: 35, max: 100 }
    ];

    return bins.map(bin => {
      const inRange = filteredData.filter(
        d => d.bmi >= bin.min && d.bmi < bin.max
      );
      return {
        range: bin.range,
        diabetic: inRange.filter(d => d.hasDiabetes).length,
        nonDiabetic: inRange.filter(d => !d.hasDiabetes).length
      };
    });
  }, [filteredData]);

  // Prevalence by age
  const riskByAge = useMemo(() => {
    const ranges = [[20,30],[30,40],[40,50],[50,60],[60,70],[70,100]];
    return ranges.map(([min,max]) => {
      const group = filteredData.filter(d => d.age >= min && d.age < max);
      const diabetic = group.filter(d => d.hasDiabetes).length;
      return {
        ageGroup: `${min}-${max === 100 ? '+' : max}`,
        riskPercentage: group.length ? (diabetic / group.length) * 100 : 0
      };
    });
  }, [filteredData]);

  // simple correlations aligned with backend features
  const correlationData = [
    { feature: 'Age',      corr: 0.65 },
    { feature: 'BMI',      corr: 0.72 },
    { feature: 'Glucose',  corr: 0.85 },
    { feature: 'BloodPressure', corr: 0.48 }
  ];

  return (
    <div className="space-y-6">

      {/* Filters */}
      <Card className="shadow-md">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            Population Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <Label>Age Range</Label>
          <div className="flex items-center gap-4">
            <span className="w-10 text-blue-600 font-semibold">{ageRange[0]}</span>
            <Slider
              value={ageRange}
              onValueChange={(v) => setAgeRange([v[0], v[1]])}
              min={18}
              max={90}
              step={1}
              minStepsBetweenThumbs={5}
              className="flex-1"
            />
            <span className="w-10 text-blue-600 font-semibold text-right">{ageRange[1]}</span>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-800">
            <Users className="inline w-4 h-4 mr-1" />
            Showing <strong>{filteredData.length}</strong> simulated individuals
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">

        {/* Age Distribution */}
        <Card className="shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b">
            <CardTitle>Age Distribution</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ageDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="diabetic" fill="#ef4444" name="Diabetic" />
                <Bar dataKey="nonDiabetic" fill="#10b981" name="Non-Diabetic" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* BMI Distribution */}
        <Card className="shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b">
            <CardTitle>BMI Distribution</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bmiDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" interval={0} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="diabetic" fill="#ef4444" />
                <Bar dataKey="nonDiabetic" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Prevalence by Age */}
        <Card className="shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b">
            <CardTitle>Prevalence by Age</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={riskByAge}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ageGroup" />
                <YAxis domain={[0,100]} />
                <Tooltip formatter={(v:number)=>`${v.toFixed(1)}%`} />
                <Bar dataKey="riskPercentage">
                  {riskByAge.map((e,i)=>(
                    <Cell key={i}
                      fill={e.riskPercentage<20?'#10b981':e.riskPercentage<40?'#1E88E5':'#ef4444'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Feature Correlations */}
        <Card className="shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b">
            <CardTitle>Feature Correlation with Diabetes</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={correlationData} layout="vertical" margin={{left:80}}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[-1,1]} />
                <YAxis type="category" dataKey="feature" />
                <Tooltip formatter={(v:number)=>v.toFixed(2)} />
                <Bar dataKey="corr">
                  {correlationData.map((e,i)=>(
                    <Cell key={i} fill="#1E88E5"/>
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p className="text-sm text-center text-gray-600 mt-2">
              Higher positive values indicate stronger association with diabetes risk
            </p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
