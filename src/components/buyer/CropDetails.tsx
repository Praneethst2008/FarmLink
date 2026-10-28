import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Package, DollarSign, Phone, Mail, ShoppingCart, AlertCircle } from 'lucide-react';
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
    phone?: string;
    address?: string;
  };
  harvestDate?: string;
  expiryDate?: string;
  createdAt: string;
}

const CropDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [crop, setCrop] = useState<Crop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [buyQuantity, setBuyQuantity] = useState(1);
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseError, setPurchaseError] = useState('');

  useEffect(() => {
    if (id) {
      fetchCropDetails();
    }
  }, [id]);

  const fetchCropDetails = async () => {
    try {
      const response = await axios.get(`/crops/${id}`);
      setCrop(response.data.crop);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch crop details');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!crop) return;

    setPurchaseError('');
    setPurchasing(true);

    try {
      await axios.post(`/crops/${crop._id}/buy`, { quantity: buyQuantity });
      
      // Show success message and redirect
      alert(`Successfully purchased ${buyQuantity} ${crop.unit} of ${crop.name}!`);
      navigate('/marketplace');
    } catch (err: any) {
      setPurchaseError(err.response?.data?.message || 'Failed to purchase crop');
    } finally {
      setPurchasing(false);
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const totalPrice = crop ? crop.price * buyQuantity : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error || !crop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-red-200">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Crop Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The crop you\'re looking for doesn\'t exist.'}</p>
            <button
              onClick={() => navigate('/marketplace')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Back to Marketplace
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/marketplace')}
          className="flex items-center space-x-2 text-green-600 hover:text-green-700 mb-6 group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Marketplace</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-green-100">
            <div className="relative h-96 bg-gray-200">
              {crop.image ? (
                <img
                  src={`http://localhost:5000${crop.image}`}
                  alt={crop.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-100">
                  <Package className="h-24 w-24 text-green-400" />
                </div>
              )}
              <div className="absolute top-4 right-4">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getCategoryColor(crop.category)}`}>
                  {crop.category}
                </span>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{crop.name}</h1>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">{crop.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="text-xl font-bold text-green-600">${crop.price}/{crop.unit}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Available</p>
                    <p className="text-lg font-semibold">{crop.quantity} {crop.unit}</p>
                  </div>
                </div>

                {crop.harvestDate && (
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Harvested</p>
                      <p className="text-sm font-medium">{formatDate(crop.harvestDate)}</p>
                    </div>
                  </div>
                )}

                {crop.expiryDate && (
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Best Before</p>
                      <p className="text-sm font-medium">{formatDate(crop.expiryDate)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Farmer Info */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Farmer Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <MapPin className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{crop.farmer.name}</p>
                    <p className="text-gray-600">Farmer</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">{crop.farmer.email}</span>
                  </div>
                  {crop.farmer.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-600">{crop.farmer.phone}</span>
                    </div>
                  )}
                  {crop.farmer.address && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-600">{crop.farmer.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Purchase Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Purchase This Crop</h3>
              
              {purchaseError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span className="text-red-700">{purchaseError}</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity ({crop.unit})
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    max={crop.quantity}
                    value={buyQuantity}
                    onChange={(e) => setBuyQuantity(Math.max(1, Math.min(crop.quantity, parseInt(e.target.value) || 1)))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="text-2xl font-bold text-green-600">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handlePurchase}
                  disabled={purchasing || buyQuantity > crop.quantity}
                  className="w-full bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-lg font-semibold"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>{purchasing ? 'Processing...' : 'Purchase Now'}</span>
                </button>

                <p className="text-sm text-gray-500 text-center">
                  Contact the farmer directly for payment and delivery arrangements
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropDetails;