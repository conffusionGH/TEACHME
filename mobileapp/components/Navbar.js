import { View, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Feather'

export default function Navbar() {
  const navigation = useNavigation()
  
  const navItems = [
    { name: 'Home', icon: 'home' },
    { name: 'Subjects', icon: 'bookmark' },
    { name: 'Assignments', icon: 'book' },
    { name: 'History', icon: 'clock' }
  ]

  return (
    <View className="flex-row justify-around items-center bg-white border-t border-tertiary pt-3 pb-5 px-2">
      {navItems.map((item, index) => (
        <TouchableOpacity 
          key={index}
          className="items-center"
          onPress={() => navigation.navigate(item.name)}
        >
          <View className="bg-tertiary p-3 rounded-full">
            <Icon 
              name={item.icon} 
              size={20} 
              color="#3D3BF3" 
            />
          </View>
          <Text className="text-primary text-xs mt-1">{item.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}