import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Users, ShoppingCart, Shield, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Sprout,
      title: 'Fresh Farm Produce',
      description: 'Direct access to fresh, quality crops from local farmers'
    },
    {
      icon: Users,
      title: 'Connect Farmers & Buyers',
      description: 'Bridge the gap between agricultural producers and consumers'
    },
    {
      icon: ShoppingCart,
      title: 'Easy Marketplace',
      description: 'Simple, secure platform for buying and selling crops'
    },
    {
      icon: Shield,
      title: 'Secure Transactions',
      description: 'Safe and reliable transactions with verified users'
    }
  ];

  const stats = [
    { number: '500+', label: 'Active Farmers' },
    { number: '1000+', label: 'Happy Buyers' },
    { number: '10k+', label: 'Crops Sold' },
    { number: '99%', label: 'Satisfaction Rate' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-white bg-opacity-20 rounded-full backdrop-blur-sm">
                <Sprout className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Welcome to <span className="text-green-100">FarmLink</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed text-green-50">
              Connecting farmers and buyers for a sustainable future. Fresh produce, 
              fair prices, and direct relationships.
            </p>
            
            {!user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="group bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="group bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-green-600 transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
                >
                  Sign In
                </Link>
              </div>
            ) : (
              <div className="flex justify-center">
                <Link
                  to={user.role === 'farmer' ? '/farmer/dashboard' : user.role === 'admin' ? '/admin/dashboard' : '/marketplace'}
                  className="group bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 opacity-20">
          <div className="w-20 h-20 bg-white rounded-full"></div>
        </div>
        <div className="absolute bottom-20 right-10 opacity-20">
          <div className="w-32 h-32 bg-white rounded-full"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose FarmLink?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform makes it easier than ever to connect farmers with buyers, 
              ensuring fresh produce and fair prices for everyone.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index} 
                  className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-green-100"
                >
                  <div className="bg-green-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                    <Icon className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to get started with FarmLink
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Register</h3>
              <p className="text-gray-600 leading-relaxed">
                Sign up as a farmer to sell your crops or as a buyer to purchase fresh produce directly from farmers.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">List or Browse</h3>
              <p className="text-gray-600 leading-relaxed">
                Farmers can list their crops with photos and details. Buyers can browse and search for their desired produce.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Connect & Trade</h3>
              <p className="text-gray-600 leading-relaxed">
                Make secure transactions and build lasting relationships between farmers and buyers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Join FarmLink?
            </h2>
            <p className="text-xl mb-8 text-green-100">
              Whether you're a farmer looking to sell your harvest or a buyer seeking fresh produce, 
              FarmLink is your gateway to sustainable agriculture.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="group bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center"
              >
                Start Selling
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/register"
                className="group bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-green-600 transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
              >
                Start Buying
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;