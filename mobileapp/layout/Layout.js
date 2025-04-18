// components/Layout.js
import { View } from 'react-native';
import Header from '../components/Header.js';
import Navbar from '../components/Navbar.js';

export default function Layout({ children }) {
  return (
    <View className="flex-1">
      <Header />
      <View className="flex-1">
        {children}  {/* This will be your screen content */}
      </View>
      <Navbar />
    </View>
  );
}