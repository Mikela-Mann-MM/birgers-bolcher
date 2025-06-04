'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Candy, Search, Filter, X } from 'lucide-react';
import { Bolche, CreateBolche } from '@/types/bolcher';

const BolcherApp = () => {
  const [bolcher, setBolcher] = useState<Bolche[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBolche, setEditingBolche] = useState<Bolche | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFarve, setFilterFarve] = useState('all');
  const [filterStyrke, setFilterStyrke] = useState('all');

  // Form state
  const [formData, setFormData] = useState<CreateBolche>({
    navn: '',
    farve: '',
    vaegt: 0,
    smagSurhed: 'Sødt',
    smagStyrke: 'Mild',
    smagType: '',
    raavarepris: 0
  });

  // Color mapping for visual appeal
  const getColorClass = (farve: string) => {
    const colorMap: Record<string, string> = {
      'Rød': 'bg-red-100 border-red-300 text-red-800',
      'Orange': 'bg-orange-100 border-orange-300 text-orange-800',
      'Gul': 'bg-yellow-100 border-yellow-300 text-yellow-800',
      'Grøn': 'bg-green-100 border-green-300 text-green-800',
      'Blå': 'bg-blue-100 border-blue-300 text-blue-800',
      'Lyseblå': 'bg-sky-100 border-sky-300 text-sky-800',
      'Lilla': 'bg-purple-100 border-purple-300 text-purple-800',
      'Sort': 'bg-gray-100 border-gray-300 text-gray-800',
      'Hvid': 'bg-gray-50 border-gray-200 text-gray-700'
    };
    return colorMap[farve] || 'bg-gray-100 border-gray-300 text-gray-800';
  };

  // Hent bolcher fra API
  const fetchBolcher = async () => {
    try {
      const response = await fetch('/api/bolcher');
      if (response.ok) {
        const data = await response.json();
        setBolcher(data);
      }
    } catch (error) {
      console.error('Fejl ved hentning af bolcher:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load data når komponenten mounter
  useEffect(() => {
    fetchBolcher();
  }, []);

  // Handle submit (create or update)
  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.navn || !formData.farve || !formData.smagType || formData.vaegt <= 0) {
      alert('Udfyld venligst alle påkrævede felter');
      return;
    }

    try {
      if (editingBolche) {
        // Update existing bolche
        const response = await fetch(`/api/bolcher/${editingBolche.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        
        if (response.ok) {
          await fetchBolcher(); // Refresh data
        }
      } else {
        // Create new bolche
        const response = await fetch('/api/bolcher', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        
        if (response.ok) {
          await fetchBolcher(); // Refresh data
        }
      }
      
      resetForm();
    } catch (error) {
      console.error('Fejl ved gem:', error);
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (window.confirm('Er du sikker på, at du vil slette denne bolche?')) {
      try {
        const response = await fetch(`/api/bolcher/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          await fetchBolcher(); // Refresh data
        }
      } catch (error) {
        console.error('Fejl ved sletning:', error);
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      navn: '',
      farve: '',
      vaegt: 0,
      smagSurhed: 'Sødt',
      smagStyrke: 'Mild',
      smagType: '',
      raavarepris: 0
    });
    setEditingBolche(null);
    setIsModalOpen(false);
  };

  // Handle edit
  const handleEdit = (bolche: Bolche) => {
    setEditingBolche(bolche);
    setFormData({
      navn: bolche.navn,
      farve: bolche.farve,
      vaegt: bolche.vaegt,
      smagSurhed: bolche.smagSurhed,
      smagStyrke: bolche.smagStyrke,
      smagType: bolche.smagType,
      raavarepris: bolche.raavarepris
    });
    setIsModalOpen(true);
  };

  // Filter bolcher
  const filteredBolcher = bolcher.filter(bolche => {
    const matchesSearch = bolche.navn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bolche.smagType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFarve = filterFarve === 'all' || bolche.farve === filterFarve;
    const matchesStyrke = filterStyrke === 'all' || bolche.smagStyrke === filterStyrke;
    
    return matchesSearch && matchesFarve && matchesStyrke;
  });

  // Get unique values for filters
  const uniqueFarver = bolcher
  .map(b => b.farve)
  .filter((value, index, self) => self.indexOf(value) === index);

const uniqueStyrker = bolcher
  .map(b => b.smagStyrke)
  .filter((value, index, self) => self.indexOf(value) === index);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Candy className="h-16 w-16 text-purple-500 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Indlæser bolcher...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-gradient-to-r from-pink-400 to-purple-500">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-3 rounded-full">
                <Candy className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Birgers Bolcher
                </h1>
                <p className="text-gray-600">Administrer dine lækre bolcher</p>
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-full font-semibold flex items-center space-x-2 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <Plus className="h-5 w-5" />
              <span>Tilføj Bolche</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Søg efter navn eller smagtype..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <select
                  value={filterFarve}
                  onChange={(e) => setFilterFarve(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">Alle farver</option>
                  {uniqueFarver.map(farve => (
                    <option key={farve} value={farve}>{farve}</option>
                  ))}
                </select>
              </div>
              <select
                value={filterStyrke}
                onChange={(e) => setFilterStyrke(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">Alle styrker</option>
                {uniqueStyrker.map(styrke => (
                  <option key={styrke} value={styrke}>{styrke}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Bolcher Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBolcher.map(bolche => (
            <div key={bolche.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border overflow-hidden">
              <div className={`h-4 ${getColorClass(bolche.farve).split(' ')[0]}`}></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{bolche.navn}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(bolche)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(bolche.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Farve:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getColorClass(bolche.farve)}`}>
                      {bolche.farve}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Vægt:</span>
                    <span className="font-semibold">{bolche.vaegt}g</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Smag:</span>
                    <span className="font-medium">{bolche.smagType}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Styrke:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      bolche.smagStyrke === 'Mild' ? 'bg-green-100 text-green-800' :
                      bolche.smagStyrke === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {bolche.smagStyrke}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Surhed:</span>
                    <span className="text-sm">{bolche.smagSurhed}</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-gray-600">Råvarepris:</span>
                    <span className="font-bold text-green-600">{bolche.raavarepris} øre</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredBolcher.length === 0 && (
          <div className="text-center py-12">
            <Candy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Ingen bolcher fundet</h3>
            <p className="text-gray-500">Prøv at ændre dine søgekriterier eller tilføj en ny bolche</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                {editingBolche ? 'Ret Bolche' : 'Ny Bolche'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Navn</label>
                  <input
                    type="text"
                    required
                    value={formData.navn}
                    onChange={(e) => setFormData(prev => ({ ...prev, navn: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Farve</label>
                  <select
                    required
                    value={formData.farve}
                    onChange={(e) => setFormData(prev => ({ ...prev, farve: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Vælg farve</option>
                    <option value="Rød">Rød</option>
                    <option value="Orange">Orange</option>
                    <option value="Gul">Gul</option>
                    <option value="Grøn">Grøn</option>
                    <option value="Blå">Blå</option>
                    <option value="Lyseblå">Lyseblå</option>
                    <option value="Lilla">Lilla</option>
                    <option value="Sort">Sort</option>
                    <option value="Hvid">Hvid</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vægt (g)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.vaegt}
                      onChange={(e) => setFormData(prev => ({ ...prev, vaegt: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Råvarepris (øre)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.raavarepris}
                      onChange={(e) => setFormData(prev => ({ ...prev, raavarepris: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Smagtype</label>
                  <input
                    type="text"
                    required
                    value={formData.smagType}
                    onChange={(e) => setFormData(prev => ({ ...prev, smagType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="f.eks. Jordbær, Citron, Anis"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Surhed</label>
                    <select
                      value={formData.smagSurhed}
                      onChange={(e) => setFormData(prev => ({ ...prev, smagSurhed: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="Sødt">Sødt</option>
                      <option value="Let bittert">Let bittert</option>
                      <option value="Bittert">Bittert</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Styrke</label>
                    <select
                      value={formData.smagStyrke}
                      onChange={(e) => setFormData(prev => ({ ...prev, smagStyrke: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="Mild">Mild</option>
                      <option value="Medium">Medium</option>
                      <option value="Stærk">Stærk</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Annuller
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200"
                  >
                    {editingBolche ? 'Opdater' : 'Opret'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BolcherApp;