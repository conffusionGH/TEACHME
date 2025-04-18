

import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Feather'; // Using Feather icons
import { useNavigation } from '@react-navigation/native';
import LogoImage from '../assets/images/logo/teachMeLogo.png'

export default function Header() {
    const navigation = useNavigation();

    return (
        <View className="bg-white rounded-lg shadow-lg p-4 flex-row justify-between items-center">
            {/* Left Side: Logo and Title */}
            <View className="flex-row items-center">
                <View className="w-10 h-10">

                    <Image
                        source={LogoImage} className='object-cover w-full h-full'
                    />
                </View>
                <Text className="text-primary text-xl font-bold">My App</Text>
            </View>

            {/* Right Side: Notification and Profile Icons */}
            <View className="flex-row justify-around items-center space-x-4">
                <View className=''>

                    <TouchableOpacity onPress={() => navigation.navigate('Notifications')} className='px-2'>
                        <Icon name="bell" size={24} color="#3D3BF3" /> {/* Notification Icon */}
                    </TouchableOpacity>
                </View>
                <View>

                    <TouchableOpacity onPress={() => navigation.navigate('Profile')} className='px-2'>
                        <Icon name="user" size={24} color="#3D3BF3" /> {/* Profile Icon */}
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    );
}