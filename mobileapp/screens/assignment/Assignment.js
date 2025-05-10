import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import APIEndPoints from '../../middleware/APIEndPoints';

export default function AssignmentListScreen() {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const getAssignmentsAPI = APIEndPoints.get_assignments.url;

    const fetchAssignments = async () => {
        try {
            const response = await axios.get(getAssignmentsAPI);
            console.log("Fetched assignments:", response.data);

            // Ensure response.data is an array
            if (!Array.isArray(response.data)) {
                throw new Error("Invalid data format");
            }

            // Filter non-deleted assignments (should already be handled by API, but added for safety)
            const activeAssignments = response.data.filter((assignment) => !assignment.isDeleted);

            setAssignments(activeAssignments);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching assignments:", err);
            setError("Failed to load assignments. Please try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignments();
    }, [getAssignmentsAPI]);

    if (loading) {
        return (
            <View className="flex-1 bg-tertiary justify-center items-center">
                <ActivityIndicator size="large" color="#3D3BF3" />
                <Text className="mt-4 text-primary">Loading assignments...</Text>
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
                        fetchAssignments();
                    }}
                >
                    <Text className="text-white">Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (assignments.length === 0) {
        return (
            <View className="flex-1 bg-tertiary justify-center items-center p-4">
                <Text className="text-primary text-lg">No assignments available</Text>
            </View>
        );
    }

    return (
        <ScrollView className="bg-tertiary p-4">
            <Text className="text-2xl font-bold mb-6 text-primary">Assignments</Text>
            <View className="space-y-4">
                {assignments.map((assignment) => (
                    <View
                        key={assignment._id}
                        className="bg-white rounded-lg shadow-sm p-4 border border-secondary/20"
                    >
                        <Text className="text-lg font-semibold text-primary">{assignment.title}</Text>
                        <Text className="text-sm text-secondary mt-1">
                            Subject: {assignment.subject?.name || 'Unknown'}
                        </Text>
                        <Text className="text-sm text-secondary mt-1">
                            Educator: {assignment.educator?.username || 'Unknown'}
                        </Text>
                        <Text className="text-sm text-secondary mt-1">
                            Due: {new Date(assignment.deadline).toLocaleDateString()}
                        </Text>
                        {assignment.description && (
                            <Text className="text-sm text-gray-600 mt-2">{assignment.description}</Text>
                        )}
                        {assignment.pdf && (
                            <Text className="text-sm text-primary mt-2">PDF Available</Text>
                        )}
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}