import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Calendar, DollarSign, Package, AlertCircle, Camera } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import AddCropModal from './AddCropModal';
import EditCropModal from './EditCropModal';

interface Crop {
  _id: string;
  name: string;
  description: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  image: string;
  isAvailable: boolean;
  harvestDate?: string;
  expiryDate?: string;
  createdAt: string;
}

const FarmerDashboard: React.FC = () => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      const response = await axios.get('/crops/farmer/my-crops');
      setCrops(response.data.crops);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch crops');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCrop = async (cropId: string) => {
    if (window.confirm('Are you sure you want to delete this crop?')) {
      try {
        await axios.delete(`/crops/${cropId}`);
        setCrops(crops.filter(crop => crop._id !== cropId));
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete crop');
      }
    }
  };

  const handleEditCrop = (crop: Crop) => {
    setSelectedCrop(crop);
    setShowEditModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600">
              Manage your crop listings and track your farming business
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <Package className="h-6 w-6 text-green-600" />
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
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available Crops</p>
                <p className="text-2xl font-bold text-gray-900">
                  {crops.filter(crop => crop.isAvailable).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-full">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${crops.reduce((sum, crop) => sum + (crop.price * crop.quantity), 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Crop Listings</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 shadow-lg"
          >
            <Plus className="h-5 w-5" />
            <span>Add New Crop</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Crops Grid */}
        {crops.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-green-100">
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No crops listed yet</h3>
            <p className="text-gray-600 mb-6">Start by adding your first crop listing to connect with buyers.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Your First Crop</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {crops.map((crop) => (
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

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditCrop(crop)}
                      className="flex-1 bg-blue-100 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Edit2 className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteCrop(crop._id)}
                      className="flex-1 bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center space-x-2"
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

        {/* Modals */}
        {showAddModal && (
          <AddCropModal
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {
              setShowAddModal(false);
              fetchCrops();
            }}
          />
        )}

        {showEditModal && selectedCrop && (
          <EditCropModal
            crop={selectedCrop}
            onClose={() => {
              setShowEditModal(false);
              setSelectedCrop(null);
            }}
            onSuccess={() => {
              setShowEditModal(false);
              setSelectedCrop(null);
              fetchCrops();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard;