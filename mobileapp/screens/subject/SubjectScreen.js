import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import APIEndPoints from '../../middleware/APIEndPoints';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export default function SubjectScreen() {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const getSubjectsAPI = APIEndPoints.get_subjects.url;
    const navigation = useNavigation();

    const fetchSubjects = async () => {
        try {
            const response = await axios.get(getSubjectsAPI);
            console.log("Fetched data:", response.data);

            // Use response.data.data if API returns { data: [...] }
            const data = Array.isArray(response.data) ? response.data : response.data.data;

            if (!Array.isArray(data)) {
                throw new Error("Invalid data format");
            }

            setSubjects(data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching subjects:", err);
            setError("Failed to load subjects. Please try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, [getSubjectsAPI]);

    if (loading) {
        return (
            <View className="flex-1 bg-tertiary justify-center items-center">
                <ActivityIndicator size="large" color="#3D3BF3" />
                <Text className="mt-4 text-primary">Loading subjects...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 bg-tertiary justify-center items-center p-4">
                <Text className="text-error text-lg">{error}</Text>
                <TouchableOpacity
                    className="mt-4 bg-primary px-4 py-2 rounded-lg"
                    onPress={() => {
                        setLoading(true);
                        setError(null);
                        fetchSubjects();
                    }}
                >
                    <Text className="text-white">Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (subjects.length === 0) {
        return (
            <View className="flex-1 bg-tertiary justify-center items-center p-4">
                <Text className="text-primary text-lg">No subjects available</Text>
            </View>
        );
    }

    return (
        <ScrollView className="bg-tertiary p-4">
            <Text className="text-2xl font-bold mb-6 text-primary">Subjects</Text>
            <View className="space-y-4">
                {subjects.map((subject) => (
                    <TouchableOpacity
                        key={subject._id}
                        className="bg-white rounded-lg shadow-sm overflow-hidden border border-secondary/20"
                        activeOpacity={0.9}
                        onPress={() => navigation.navigate('SubjectDetail', { subject })}
                    >
                        <View className="flex-row">
                            <Image
                                source={{ uri: subject.image }}
                                className="w-1/3 h-36"
                                resizeMode="cover"
                                defaultSource={{ uri: "https://play-lh.googleusercontent.com/2kD49Sc5652DmjJNf7Kh17DEXx9HiD2Zz3LsNc6929yTW6VBbGBCr-CQLoOA7iUf6hk" }}
                            />
                            <View className="p-4 flex-1">
                                <Text className="text-lg font-semibold text-primary">{subject.name}</Text>
                                <Text className="text-xs text-secondary mb-1">Code: {subject.code}</Text>
                                {subject.description && (
                                    <Text className="text-sm text-gray-600 mt-1">{subject.description}</Text>
                                )}
                                <View className="mt-2 flex-row items-center space-x-2">
                                    <Text className="text-xs bg-secondary/10 text-primary px-2 py-1 rounded-full">
                                        Credits: {subject.creditHours}
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