import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import { Slider } from '@/app/components/ui/slider';
import {
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
  Area, AreaChart, BarChart, Bar, Cell
} from 'recharts';
import { Target, TrendingUp } from 'lucide-react';

export function ModelPerformance() {
  const [threshold, setThreshold] = useState(0.5);
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    const loadMetrics = async () => {
      const res = await fetch(
        `http://127.0.0.1:5000/model-metrics?threshold=${threshold}`
      );
      const data = await res.json();
      setMetrics(data);
    };
    loadMetrics();
  }, [threshold]);

  if (!metrics) return <div>Loading model metrics...</div>;

  const { confusion, roc, auc } = metrics;

  return (
    <div className="space-y-6">

      {/* Threshold */}
      <Card>
        <CardHeader><CardTitle className="flex gap-2"><Target/>Classification Threshold</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Label>{(threshold*100).toFixed(0)}%</Label>
            <Slider value={[threshold]} onValueChange={v=>setThreshold(v[0])}
              min={0.1} max={0.9} step={0.05}/>
          </div>
        </CardContent>
      </Card>

      {/* Metric cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          ["Accuracy", confusion.accuracy, "#1E88E5"],
          ["Precision", confusion.precision, "#10b981"],
          ["Recall", confusion.recall, "#a855f7"],
          ["F1-Score", confusion.f1Score, "#f97316"]
        ].map(([name,val,color]:any,i)=>(
          <Card key={i}><CardContent className="text-center pt-6">
            <div className="text-sm text-gray-600">{name}</div>
            <div className="text-3xl" style={{color}}>
              {(val*100).toFixed(1)}%
            </div>
          </CardContent></Card>
        ))}
      </div>

      {/* Confusion Matrix */}
      <Card>
        <CardHeader><CardTitle>Confusion Matrix</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-green-50 p-6">TN<br/>{confusion.trueNegative}</div>
          <div className="bg-red-50 p-6">FP<br/>{confusion.falsePositive}</div>
          <div className="bg-red-50 p-6">FN<br/>{confusion.falseNegative}</div>
          <div className="bg-green-50 p-6">TP<br/>{confusion.truePositive}</div>
        </CardContent>
      </Card>

      {/* ROC */}
      <Card>
        <CardHeader>
          <CardTitle>
            ROC Curve (AUC {auc.toFixed(3)})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={roc}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="fpr"/>
              <YAxis/>
              <Tooltip/>
              <ReferenceLine segment={[{x:0,y:0},{x:1,y:1}]} strokeDasharray="5 5"/>
              <Area type="monotone" dataKey="tpr" stroke="#1E88E5" fill="#93c5fd"/>
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-blue-50">
        <CardContent className="pt-6 flex gap-3">
          <TrendingUp className="text-blue-600"/>
          <p className="text-blue-900 text-sm">
            Model shows {auc>0.9?'excellent':auc>0.8?'good':'moderate'} discrimination
            with AUC {auc.toFixed(3)} at threshold {(threshold*100).toFixed(0)}%.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
