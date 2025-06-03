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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
  const uniqueFarver = [...new Set(bolcher.map(b => b.farve))];
  const uniqueStyrker = [...new Set(bolcher.map(b => b.smagStyrke))];

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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Candy className="h-12 w-12 text-purple-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">Birgers Bolcher</h1>
          </div>
          <p className="text-gray-600">Administration af bolche sortiment</p>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Søg efter bolcher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={filterFarve}
              onChange={(e) => setFilterFarve(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Alle farver</option>
              {uniqueFarver.map(farve => (
                <option key={farve} value={farve}>{farve}</option>
              ))}
            </select>

            <select
              value={filterStyrke}
              onChange={(e) => setFilterStyrke(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Alle styrker</option>
              {uniqueStyrker.map(styrke => (
                <option key={styrke} value={styrke}>{styrke}</option>
              ))}
            </select>
          </div>

          {/* Add button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Tilføj Bolche
          </button>
        </div>

        {/* Bolcher Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBolcher.map((bolche) => (
            <div key={bolche.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg text-gray-800">{bolche.navn}</h3>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(bolche)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(bolche.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Farve:</span>
                  <span className="font-medium">{bolche.farve}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vægt:</span>
                  <span className="font-medium">{bolche.vaegt}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Smag:</span>
                  <span className="font-medium">{bolche.smagType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Styrke:</span>
                  <span className="font-medium">{bolche.smagStyrke}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pris:</span>
                  <span className="font-medium">{bolche.raavarepris} øre</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredBolcher.length === 0 && (
          <div className="text-center py-12">
            <Candy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Ingen bolcher fundet</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {editingBolche ? 'Rediger Bolche' : 'Tilføj Ny Bolche'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Navn</label>
                <input
                  type="text"
                  value={formData.navn}
                  onChange={(e) => setFormData({...formData, navn: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Farve</label>
                <input
                  type="text"
                  value={formData.farve}
                  onChange={(e) => setFormData({...formData, farve: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Vægt (gram)</label>
                <input
                  type="number"
                  value={formData.vaegt}
                  onChange={(e) => setFormData({...formData, vaegt: Number(e.target.value)})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Smag Type</label>
                <input
                  type="text"
                  value={formData.smagType}
                  onChange={(e) => setFormData({...formData, smagType: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Smag Surhed</label>
                <select
                  value={formData.smagSurhed}
                  onChange={(e) => setFormData({...formData, smagSurhed: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Sødt">Sødt</option>
                  <option value="Bittert">Bittert</option>
                  <option value="Let bittert">Let bittert</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Smag Styrke</label>
                <select
                  value={formData.smagStyrke}
                  onChange={(e) => setFormData({...formData, smagStyrke: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Mild">Mild</option>
                  <option value="Medium">Medium</option>
                  <option value="Stærk">Stærk</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Råvarepris (øre)</label>
                <input
                  type="number"
                  value={formData.raavarepris}
                  onChange={(e) => setFormData({...formData, raavarepris: Number(e.target.value)})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuller
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  {editingBolche ? 'Opdater' : 'Tilføj'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BolcherApp;