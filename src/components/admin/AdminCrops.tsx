import React, { useState, useEffect } from 'react';
import { Sprout, Search, Trash2, AlertCircle, Calendar, DollarSign, Package, Camera } from 'lucide-react';
import axios from 'axios';

interface Crop {
  _id: string;
  name: string;
  description: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  image: string;
  farmer: {
    _id: string;
    name: string;
    email: string;
  };
  isAvailable: boolean;
  harvestDate?: string;
  expiryDate?: string;
  createdAt: string;
}

const AdminCrops: React.FC = () => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [filteredCrops, setFilteredCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [error, setError] = useState('');

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'grains', label: 'Grains' },
    { value: 'herbs', label: 'Herbs' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    fetchCrops();
  }, []);

  useEffect(() => {
    filterCrops();
  }, [crops, searchTerm, selectedCategory]);

  const fetchCrops = async () => {
    try {
      const response = await axios.get('/admin/crops');
      setCrops(response.data.crops);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch crops');
    } finally {
      setLoading(false);
    }
  };

  const filterCrops = () => {
    let filtered = [...crops];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(crop =>
        crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crop.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crop.farmer.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(crop => crop.category === selectedCategory);
    }

    setFilteredCrops(filtered);
  };

  const handleDeleteCrop = async (cropId: string, cropName: string) => {
    if (window.confirm(`Are you sure you want to delete crop "${cropName}"? This action cannot be undone.`)) {
      try {
        await axios.delete(`/admin/crops/${cropId}`);
        setCrops(crops.filter(crop => crop._id !== cropId));
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete crop');
      }
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      vegetables: 'bg-green-100 text-green-800',
      fruits: 'bg-orange-100 text-orange-800',
      grains: 'bg-yellow-100 text-yellow-800',
      herbs: 'bg-purple-100 text-purple-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Crop Management
            </h1>
            <p className="text-gray-600">
              Monitor and manage crop listings from farmers
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <Sprout className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Crops</p>
                <p className="text-2xl font-bold text-gray-900">{crops.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-gray-900">
                  {crops.filter(crop => crop.isAvailable).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full">
                <Package className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sold Out</p>
                <p className="text-2xl font-bold text-gray-900">
                  {crops.filter(crop => !crop.isAvailable).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${crops.reduce((sum, crop) => sum + (crop.price * crop.quantity), 0).toFixed(0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-green-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search crops or farmers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Crops Grid */}
        {filteredCrops.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-green-100">
            <Sprout className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No crops found</h3>
            <p className="text-gray-500">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCrops.map((crop) => (
              <div key={crop._id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-green-100 hover:shadow-xl transition-shadow">
                <div className="relative h-48 bg-gray-200">
                  {crop.image ? (
                    <img
                      src={`http://localhost:5000${crop.image}`}
                      alt={crop.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-100">
                      <Camera className="h-12 w-12 text-green-400" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(crop.category)}`}>
                      {crop.category}
                    </span>
                  </div>
                  {!crop.isAvailable && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
                        Sold Out
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{crop.name}</h3>
                    <span className="text-2xl font-bold text-green-600">
                      ${crop.price}/{crop.unit}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">{crop.description}</p>

                  {/* Farmer Info */}
                  <div className="bg-green-50 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{crop.farmer.name}</p>
                        <p className="text-xs text-gray-500">{crop.farmer.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Quantity:</span>
                      <span className="text-sm font-medium">{crop.quantity} {crop.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Listed:</span>
                      <span className="text-sm font-medium">{formatDate(crop.createdAt)}</span>
                    </div>
                    {crop.harvestDate && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Harvested:</span>
                        <span className="text-sm font-medium">{formatDate(crop.harvestDate)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleDeleteCrop(crop._id, crop.name)}
                      className="bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors flex items-center space-x-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCrops;