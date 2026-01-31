import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import { Slider } from '@/app/components/ui/slider';
import { 
  generateConfusionMatrix, 
  generateROCData,
  calculateAUC
} from '@/app/utils/diabetes-risk';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart
} from 'recharts';
import { Target, TrendingUp } from 'lucide-react';

export function ModelPerformance() {
  const [threshold, setThreshold] = useState(0.5);
  
  const confusionMatrix = useMemo(() => 
    generateConfusionMatrix(threshold), 
    [threshold]
  );
  
  const rocData = useMemo(() => generateROCData(), []);
  const auc = useMemo(() => calculateAUC(rocData), [rocData]);
  
  return (
    <div className="space-y-6">
      {/* Threshold Control */}
      <Card className="shadow-md">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b">
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Classification Threshold
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Decision Threshold</Label>
              <span className="text-lg font-semibold text-blue-600">
                {(threshold * 100).toFixed(0)}%
              </span>
            </div>
            <Slider
              value={[threshold]}
              onValueChange={(val) => setThreshold(val[0])}
              min={0.1}
              max={0.9}
              step={0.05}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>More Sensitive (10%)</span>
              <span>More Specific (90%)</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Adjust the threshold to balance between sensitivity (detecting true positives) 
              and specificity (avoiding false positives).
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="shadow-md border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-sm text-gray-600 uppercase tracking-wide mb-2">
                Accuracy
              </div>
              <div className="text-3xl text-blue-600">
                {(confusionMatrix.accuracy * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Overall Correctness
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-md border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-sm text-gray-600 uppercase tracking-wide mb-2">
                Precision
              </div>
              <div className="text-3xl text-green-600">
                {(confusionMatrix.precision * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Positive Predictive Value
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-md border-l-4 border-l-purple-500">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-sm text-gray-600 uppercase tracking-wide mb-2">
                Recall
              </div>
              <div className="text-3xl text-purple-600">
                {(confusionMatrix.recall * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Sensitivity / TPR
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-md border-l-4 border-l-orange-500">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-sm text-gray-600 uppercase tracking-wide mb-2">
                F1-Score
              </div>
              <div className="text-3xl text-orange-600">
                {(confusionMatrix.f1Score * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Harmonic Mean
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Confusion Matrix and ROC Curve */}
      <div className="grid grid-cols-2 gap-6">
        {/* Confusion Matrix */}
        <Card className="shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b">
            <CardTitle>Confusion Matrix</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Matrix Grid */}
              <div className="grid grid-cols-3 gap-2">
                {/* Header */}
                <div></div>
                <div className="text-center text-sm font-semibold text-gray-700">
                  Predicted Negative
                </div>
                <div className="text-center text-sm font-semibold text-gray-700">
                  Predicted Positive
                </div>
                
                {/* Row 1 */}
                <div className="flex items-center justify-end pr-2 text-sm font-semibold text-gray-700">
                  Actual Negative
                </div>
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center">
                  <div className="text-2xl text-green-700">
                    {confusionMatrix.trueNegative}
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    True Negative
                  </div>
                </div>
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
                  <div className="text-2xl text-red-700">
                    {confusionMatrix.falsePositive}
                  </div>
                  <div className="text-xs text-red-600 mt-1">
                    False Positive
                  </div>
                </div>
                
                {/* Row 2 */}
                <div className="flex items-center justify-end pr-2 text-sm font-semibold text-gray-700">
                  Actual Positive
                </div>
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
                  <div className="text-2xl text-red-700">
                    {confusionMatrix.falseNegative}
                  </div>
                  <div className="text-xs text-red-600 mt-1">
                    False Negative
                  </div>
                </div>
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center">
                  <div className="text-2xl text-green-700">
                    {confusionMatrix.truePositive}
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    True Positive
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-6 text-sm pt-4 border-t">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-200 rounded"></div>
                  <span className="text-gray-600">Correct Prediction</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-200 rounded"></div>
                  <span className="text-gray-600">Incorrect Prediction</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* ROC Curve */}
        <Card className="shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b">
            <CardTitle className="flex items-center justify-between">
              <span>ROC Curve</span>
              <span className="text-sm font-normal text-gray-600">
                AUC: <span className="text-blue-600 font-semibold">{auc.toFixed(3)}</span>
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={rocData}>
                <defs>
                  <linearGradient id="rocGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E88E5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1E88E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="fpr" 
                  label={{ value: 'False Positive Rate', position: 'insideBottom', offset: -5 }}
                  domain={[0, 1]}
                />
                <YAxis 
                  label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft' }}
                  domain={[0, 1]}
                />
                <Tooltip 
                  formatter={(value: number) => value.toFixed(3)}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px'
                  }}
                />
                <ReferenceLine 
                  segment={[{ x: 0, y: 0 }, { x: 1, y: 1 }]}
                  stroke="#94a3b8"
                  strokeDasharray="5 5"
                  label="Random Classifier"
                />
                <Area
                  type="monotone"
                  dataKey="tpr"
                  stroke="#1E88E5"
                  strokeWidth={3}
                  fill="url(#rocGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-4 text-center text-sm text-gray-600">
              <p>Higher AUC indicates better model discrimination ability</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Performance Interpretation */}
      <Card className="shadow-md bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">
                Model Performance Summary
              </h4>
              <p className="text-sm text-blue-800 leading-relaxed">
                The model demonstrates <span className="font-semibold">
                {auc > 0.9 ? 'excellent' : auc > 0.8 ? 'good' : 'moderate'}</span> discriminative 
                ability with an AUC of {auc.toFixed(3)}. At the current threshold 
                of {(threshold * 100).toFixed(0)}%, the model achieves {(confusionMatrix.accuracy * 100).toFixed(1)}% 
                accuracy with a balance between precision ({(confusionMatrix.precision * 100).toFixed(1)}%) 
                and recall ({(confusionMatrix.recall * 100).toFixed(1)}%). Adjust the threshold based on 
                clinical priorities: lower for screening (higher sensitivity) or higher for confirmation 
                (higher specificity).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
