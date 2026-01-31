import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { IndividualPrediction } from '@/app/components/IndividualPrediction';
import { PopulationInsights } from '@/app/components/PopulationInsights';
import { ModelPerformance } from '@/app/components/ModelPerformance';
import { Activity, Users, BarChart3 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('individual');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Fixed Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl text-gray-900">
                  Diabetes Risk Decision Support Dashboard
                </h1>
                <p className="text-xs text-gray-500">
                  Clinical Analytics & Prediction System
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
                <span className="text-xs text-green-700 font-medium">System Active</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab Navigation */}
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-3 h-auto p-1 bg-white border shadow-sm">
            <TabsTrigger 
              value="individual" 
              className="flex items-center gap-2 py-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              <Activity className="w-4 h-4" />
              <span>Individual Prediction</span>
            </TabsTrigger>
            <TabsTrigger 
              value="population"
              className="flex items-center gap-2 py-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              <Users className="w-4 h-4" />
              <span>Population Insights</span>
            </TabsTrigger>
            <TabsTrigger 
              value="performance"
              className="flex items-center gap-2 py-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Model Performance</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Tab Content */}
          <TabsContent value="individual" className="mt-6">
            <IndividualPrediction />
          </TabsContent>
          
          <TabsContent value="population" className="mt-6">
            <PopulationInsights />
          </TabsContent>
          
          <TabsContent value="performance" className="mt-6">
            <ModelPerformance />
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              <p>© 2026 Healthcare Analytics System. For research and clinical decision support.</p>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-xs">Last updated: January 31, 2026</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
