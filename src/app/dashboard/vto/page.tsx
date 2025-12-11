"use client"
import React, { useState } from 'react';
import { Upload, X, Check, Sparkles, Wand2, User, ImageIcon } from 'lucide-react';

interface DummyData {
  id: number;
  img: string;
}

export default function VirtualTryOnUI() {
  const [selectedClothes, setSelectedClothes] = useState<number | null>(null);
  const [selectedModels, setSelectedModels] = useState<number[]>([]);
  const [activeModelTab, setActiveModelTab] = useState('our');
  const [showGenerateModal, setShowGenerateModal] = useState(false);


  const recentClothes: DummyData[] = [
    { id: 1, img: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&h=250&fit=crop' },
    { id: 2, img: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=200&h=250&fit=crop' },
    { id: 3, img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=250&fit=crop' },
    { id: 4, img: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=200&h=250&fit=crop' },
  ];

  const ourModels: DummyData[] = [
    { id: 1, img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=280&fit=crop' },
    { id: 2, img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=280&fit=crop' },
    { id: 3, img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=280&fit=crop' },
    { id: 4, img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=280&fit=crop' },
    { id: 5, img: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=280&fit=crop' },
    { id: 6, img: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&h=280&fit=crop' },
  ];

  const toggleModelSelection = (modelId: number) => {
    setSelectedModels(prev =>
      prev.includes(modelId)
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  const selectAllModels = () => {
    const allIds = ourModels.map(m => m.id);
    setSelectedModels(allIds);
  };

  const clearAllModels = () => {
    setSelectedModels([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-light tracking-wide">Virtual Try-On Studio</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Panel - Clothes Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium">Clothing Item</h2>
                <span className="text-xs text-gray-400">Step 1</span>
              </div>

              {/* Upload Area */}
              <div className="mb-6">
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-gray-300 transition-colors cursor-pointer group">
                  <Upload className="w-8 h-8 mx-auto mb-3 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  <p className="text-sm text-gray-600 mb-1">Upload clothing</p>
                  <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
                </div>
              </div>

              {/* Recent Items */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Recent</h3>
                <div className="grid grid-cols-4 gap-2">
                  {recentClothes.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedClothes(item.id)}
                      className={`relative aspect-[4/5] rounded-lg overflow-hidden cursor-pointer transition-all ${selectedClothes === item.id
                        ? 'ring-2 ring-black ring-offset-2'
                        : 'hover:opacity-80'
                        }`}
                    >
                      <img src={item.img} alt="" className="w-full h-full object-cover" />
                      {selectedClothes === item.id && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {selectedClothes && (
                <div className="mt-6 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-xs text-green-700 flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Clothing selected
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Middle Panel - Model Selection */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium">Select Models</h2>
                <span className="text-xs text-gray-400">Step 2</span>
              </div>

              {/* Model Type Tabs */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setActiveModelTab('our')}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${activeModelTab === 'our'
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  <User className="w-4 h-4" />
                  Our Models
                </button>
                <button
                  onClick={() => setActiveModelTab('upload')}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${activeModelTab === 'upload'
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  <Upload className="w-4 h-4" />
                  Upload Model
                </button>
                <button
                  onClick={() => setActiveModelTab('generate')}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${activeModelTab === 'generate'
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  <Wand2 className="w-4 h-4" />
                  AI Generate
                </button>
              </div>

              {/* Our Models Tab */}
              {activeModelTab === 'our' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-600">
                      Select one or multiple models ({selectedModels.length} selected)
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={selectAllModels}
                        className="text-xs text-gray-600 hover:text-black transition-colors"
                      >
                        Select All
                      </button>
                      {selectedModels.length > 0 && (
                        <>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={clearAllModels}
                            className="text-xs text-gray-600 hover:text-black transition-colors"
                          >
                            Clear
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {ourModels.map((model) => (
                      <div
                        key={model.id}
                        onClick={() => toggleModelSelection(model.id)}
                        className={`relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer transition-all ${selectedModels.includes(model.id)
                          ? 'ring-2 ring-black ring-offset-2'
                          : 'hover:opacity-80 hover:ring-2 hover:ring-gray-300 hover:ring-offset-2'
                          }`}
                      >
                        <img src={model.img} alt="" className="w-full h-full object-cover" />
                        {selectedModels.includes(model.id) && (
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                              <Check className="w-5 h-5 text-white" />
                            </div>
                          </div>
                        )}
                        <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                          <span className="text-xs font-medium text-gray-700">{model.id}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Model Tab */}
              {activeModelTab === 'upload' && (
                <div>
                  <p className="text-sm text-gray-600 mb-4">Upload your own model photo</p>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center hover:border-gray-300 transition-colors cursor-pointer group">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 transition-colors">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Drop your model photo here</p>
                    <p className="text-xs text-gray-400 mb-4">or click to browse</p>
                    <button className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors">
                      Choose File
                    </button>
                  </div>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-700 leading-relaxed">
                      <span className="font-medium">Tip:</span> Use a full-body photo with neutral background for best results. The model should be facing forward.
                    </p>
                  </div>
                </div>
              )}

              {/* AI Generate Tab */}
              {activeModelTab === 'generate' && (
                <div>
                  <p className="text-sm text-gray-600 mb-4">Generate AI models with custom attributes</p>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                      <div className="grid grid-cols-3 gap-2">
                        <button className="py-2 px-4 rounded-lg border-2 border-black bg-black text-white text-sm font-medium">
                          Female
                        </button>
                        <button className="py-2 px-4 rounded-lg border-2 border-gray-200 text-gray-700 text-sm font-medium hover:border-gray-300">
                          Male
                        </button>
                        <button className="py-2 px-4 rounded-lg border-2 border-gray-200 text-gray-700 text-sm font-medium hover:border-gray-300">
                          Non-binary
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
                      <select className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 text-sm focus:border-black focus:outline-none">
                        <option>18-25 years</option>
                        <option>26-35 years</option>
                        <option>36-45 years</option>
                        <option>46+ years</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Body Type</label>
                      <select className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 text-sm focus:border-black focus:outline-none">
                        <option>Average</option>
                        <option>Athletic</option>
                        <option>Slim</option>
                        <option>Plus Size</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Number of Models</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        defaultValue="3"
                        className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 text-sm focus:border-black focus:outline-none"
                      />
                    </div>
                  </div>

                  <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2">
                    <Wand2 className="w-5 h-5" />
                    Generate AI Models
                  </button>
                </div>
              )}

              {/* Generate Try-On Button */}
              {activeModelTab !== 'generate' && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    disabled={!selectedClothes || selectedModels.length === 0}
                    className={`w-full py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${selectedClothes && selectedModels.length > 0
                      ? 'bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    <Sparkles className="w-5 h-5" />
                    {selectedClothes && selectedModels.length > 0
                      ? `Generate Try-On (${selectedModels.length} model${selectedModels.length > 1 ? 's' : ''})`
                      : 'Select clothing and models'}
                  </button>
                </div>
              )}
            </div>

            {/* Preview Section */}
            {selectedClothes && selectedModels.length > 0 && (
              <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-medium mb-4">Preview & Results</h3>
                <div className="grid grid-cols-3 gap-4">
                  {selectedModels.map((modelId) => (
                    <div key={modelId} className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                      <img
                        src={ourModels.find(m => m.id === modelId)?.img}
                        alt=""
                        className="w-full h-full object-cover opacity-40"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <Sparkles className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-xs text-gray-500">Ready to generate</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
