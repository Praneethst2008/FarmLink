import React, { useState, useEffect } from 'react';
import { Search, Filter, ShoppingCart, Eye, MapPin, Calendar, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
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
  };
  harvestDate?: string;
  expiryDate?: string;
  createdAt: string;
}

const Marketplace: React.FC = () => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [filteredCrops, setFilteredCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'grains', label: 'Grains' },
    { value: 'herbs', label: 'Herbs' },
    { value: 'other', label: 'Other' }
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Latest First' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-price', label: 'Price: High to Low' },
    { value: 'name', label: 'Name: A to Z' }
  ];

  useEffect(() => {
    fetchCrops();
  }, []);

  useEffect(() => {
    filterAndSortCrops();
  }, [crops, searchTerm, selectedCategory, sortBy]);

  const fetchCrops = async () => {
    try {
      const response = await axios.get('/crops');
      setCrops(response.data.crops);
    } catch (error) {
      console.error('Failed to fetch crops:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortCrops = () => {
    let filtered = [...crops];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(crop =>
        crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crop.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(crop => crop.category === selectedCategory);
    }

    // Sort crops
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case '-price':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'createdAt':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    setFilteredCrops(filtered);
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
              Fresh Crop Marketplace
            </h1>
            <p className="text-gray-600">
              Discover fresh, quality crops directly from local farmers
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-green-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search crops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {filteredCrops.length} {filteredCrops.length === 1 ? 'crop' : 'crops'}
          </p>
        </div>

        {/* Crops Grid */}
        {filteredCrops.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-green-100">
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ShoppingCart className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No crops found</h3>
            <p className="text-gray-600">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCrops.map((crop) => (
              <div key={crop._id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-green-100 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
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
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-white bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-2xl font-bold text-green-600">
                        ${crop.price}/{crop.unit}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{crop.name}</h3>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">{crop.description}</p>

                  {/* Farmer Info */}
                  <div className="flex items-center mb-4 p-3 bg-green-50 rounded-lg">
                    <div className="p-2 bg-green-100 rounded-full mr-3">
                      <MapPin className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{crop.farmer.name}</p>
                      <p className="text-xs text-gray-500">Farmer</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Available:</span>
                      <span className="text-sm font-medium">{crop.quantity} {crop.unit}</span>
                    </div>
                    {crop.harvestDate && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Harvested:</span>
                        <span className="text-sm font-medium">{formatDate(crop.harvestDate)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      to={`/crop/${crop._id}`}
                      className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 font-medium"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </Link>
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

export default Marketplace;