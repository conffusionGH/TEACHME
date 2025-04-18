import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';

const classrooms = [
  {
    id: 1,
    title: 'Computer Lab',
    description: 'Fully equipped with modern computers and software for practical learning.',
    image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1478&q=80',
    capacity: '30 students',
  },
  {
    id: 2,
    title: 'Science Laboratory',
    description: 'Complete with scientific equipment for chemistry, biology, and physics experiments.',
    image: 'https://images.unsplash.com/photo-1575505586569-646b2ca898fc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1452&q=80',
    capacity: '25 students',
  },
  {
    id: 3,
    title: 'Lecture Hall',
    description: 'Spacious auditorium with modern audio-visual equipment for large classes.',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    capacity: '100 students',
  },
];

export default function Classroom() {
  return (
    <ScrollView className="bg-tertiary p-4">
      <Text className="text-2xl font-bold mb-6 text-primary">Classrooms</Text>
      
      <View className="space-y-4">
        {classrooms.map((classroom) => (
          <TouchableOpacity 
            key={classroom.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden border border-secondary/20"
            activeOpacity={0.9}
          >
            <View className="flex-row">
              <Image
                source={{ uri: classroom.image }}
                className="w-1/3 h-36"
                resizeMode="cover"
              />
              <View className="p-4 flex-1">
                <Text className="text-lg font-semibold text-primary">{classroom.title}</Text>
                <Text className="text-sm text-gray-600 mt-1">{classroom.description}</Text>
                <View className="mt-2 flex-row items-center">
                  <Text className="text-xs bg-secondary/10 text-primary px-2 py-1 rounded-full">
                    Capacity: {classroom.capacity}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}