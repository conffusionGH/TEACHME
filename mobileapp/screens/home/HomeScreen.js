// screens/home/HomeScreen.js
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import Layout from '../../layout/Layout.js';

export default function HomeScreen() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <Layout>
      <Text className="text-primary text-2xl font-bold mb-2">
        Welcome, {currentUser ? currentUser.username : 'Guest'}!
      </Text>
      <Text className="text-primary text-lg">You are now logged in.</Text>
    </Layout>
  );
}