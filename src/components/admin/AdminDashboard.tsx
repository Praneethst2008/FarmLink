import React, { useState, useEffect } from 'react';
import { Users, Sprout, TrendingUp, Activity, Eye, UserCheck, Package, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Stats {
  totalUsers: number;
  totalFarmers: number;
  totalBuyers: number;
  totalCrops: number;
  availableCrops: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalFarmers: 0,
    totalBuyers: 0,
    totalCrops: 0,
    availableCrops: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
      bgColor: 'bg-blue-50',
      link: '/admin/users'
    },
    {
      title: 'Farmers',
      value: stats.totalFarmers,
      icon: UserCheck,
      color: 'bg-green-100 text-green-600',
      bgColor: 'bg-green-50',
      link: '/admin/users'
    },
    {
      title: 'Buyers',
      value: stats.totalBuyers,
      icon: Users,
      color: 'bg-purple-100 text-purple-600',
      bgColor: 'bg-purple-50',
      link: '/admin/users'
    },
    {
      title: 'Total Crops',
      value: stats.totalCrops,
      icon: Package,
      color: 'bg-orange-100 text-orange-600',
      bgColor: 'bg-orange-50',
      link: '/admin/crops'
    },
    {
      title: 'Available Crops',
      value: stats.availableCrops,
      icon: Sprout,
      color: 'bg-emerald-100 text-emerald-600',
      bgColor: 'bg-emerald-50',
      link: '/admin/crops'
    }
  ];

  const quickActions = [
    {
      title: 'Manage Users',
      description: 'View, activate, deactivate, or delete user accounts',
      icon: Users,
      color: 'bg-blue-600',
      link: '/admin/users'
    },
    {
      title: 'Manage Crops',
      description: 'Monitor and moderate crop listings from farmers',
      icon: Sprout,
      color: 'bg-green-600',
      link: '/admin/crops'
    },
    {
      title: 'View Marketplace',
      description: 'Browse the marketplace as users see it',
      icon: Eye,
      color: 'bg-purple-600',
      link: '/marketplace'
    }
  ];

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
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Monitor and manage the FarmLink platform
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Link
                key={index}
                to={stat.link}
                className="bg-white rounded-xl shadow-lg p-6 border border-green-100 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  to={action.link}
                  className="bg-white rounded-xl shadow-lg p-6 border border-green-100 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-full ${action.color} text-white mr-4`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                      {action.title}
                    </h3>
                  </div>
                  <p className="text-gray-600">{action.description}</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* System Overview */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">System Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* User Distribution */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Farmers</span>
                  </div>
                  <span className="font-semibold">{stats.totalFarmers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">Buyers</span>
                  </div>
                  <span className="font-semibold">{stats.totalBuyers}</span>
                </div>
              </div>
            </div>

            {/* Crop Statistics */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Crop Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-600">Total Listings</span>
                  </div>
                  <span className="font-semibold">{stats.totalCrops}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
                    <span className="text-gray-600">Available</span>
                  </div>
                  <span className="font-semibold">{stats.availableCrops}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-gray-600">Sold Out</span>
                  </div>
                  <span className="font-semibold">{stats.totalCrops - stats.availableCrops}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;