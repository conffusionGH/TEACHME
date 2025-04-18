import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';

export default function HomeScreen() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <View className="flex-1 items-center justify-center bg-tertiary">
      <Text className="text-primary text-2xl font-bold mb-2">
        Welcome, {currentUser ? currentUser.username : 'Guest'}!
      </Text>
      <Text className="text-primary text-lg">You are now logged in.</Text>
    </View>
  );
}