import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import APIEndPoints from '../../middleware/APIEndPoints.js';

export default function RequestForm() {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    sex: '',
    email: '',
    fatherName: '',
    motherName: '',
    permanentAddress: '',
    temporaryAddress: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const requestFormAPI = APIEndPoints.request_form.url;

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Validate required fields
      const requiredFields = [
        'firstName',
        'lastName',
        'age',
        'sex',
        'email',
        'fatherName',
        'motherName',
        'permanentAddress',
        'temporaryAddress',
        'description',
      ];
      for (const field of requiredFields) {
        if (!formData[field]) {
          throw new Error(`${field} is required`);
        }
      }

      // Validate age (must be a number)
      const ageNumber = parseInt(formData.age);
      if (isNaN(ageNumber) || ageNumber <= 0) {
        throw new Error('Age must be a valid number greater than 0');
      }

      // Validate sex
      if (!['male', 'female', 'other'].includes(formData.sex.toLowerCase())) {
        throw new Error('Sex must be male, female, or other');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Invalid email format');
      }

      const response = await axios.post(
        requestFormAPI,
        { ...formData, age: ageNumber, sex: formData.sex.toLowerCase() },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.data.success === false) {
        throw new Error(response.data.message);
      }

      Toast.show({
        type: 'success',
        text1: 'Request Submitted',
        text2: 'Your login request has been submitted successfully!',
      });

      // Navigate back to Login with reset
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Request failed';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errMsg,
      });
      console.log(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <ScrollView className="flex-1 bg-tertiary p-4">
      <Text className="text-3xl font-bold text-primary mb-6 text-center">
        Request a Login
      </Text>
      <TextInput
        className="w-full border border-tertiary bg-white p-3 rounded-lg mb-4 text-primary"
        placeholder="First Name"
        placeholderTextColor="#9694FF"
        value={formData.firstName}
        onChangeText={(text) => handleChange('firstName', text)}
      />
      <TextInput
        className="w-full border border-tertiary bg-white p-3 rounded-lg mb-4 text-primary"
        placeholder="Last Name"
        placeholderTextColor="#9694FF"
        value={formData.lastName}
        onChangeText={(text) => handleChange('lastName', text)}
      />
      <TextInput
        className="w-full border border-tertiary bg-white p-3 rounded-lg mb-4 text-primary"
        placeholder="Age"
        placeholderTextColor="#9694FF"
        value={formData.age}
        onChangeText={(text) => handleChange('age', text)}
        keyboardType="numeric"
      />
      <TextInput
        className="w-full border border-tertiary bg-white p-3 rounded-lg mb-4 text-primary"
        placeholder="Sex (male/female/other)"
        placeholderTextColor="#9694FF"
        value={formData.sex}
        onChangeText={(text) => handleChange('sex', text)}
      />
      <TextInput
        className="w-full border border-tertiary bg-white p-3 rounded-lg mb-4 text-primary"
        placeholder="Email"
        placeholderTextColor="#9694FF"
        value={formData.email}
        onChangeText={(text) => handleChange('email', text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        className="w-full border border-tertiary bg-white p-3 rounded-lg mb-4 text-primary"
        placeholder="Father's Name"
        placeholderTextColor="#9694FF"
        value={formData.fatherName}
        onChangeText={(text) => handleChange('fatherName', text)}
      />
      <TextInput
        className="w-full border border-tertiary bg-white p-3 rounded-lg mb-4 text-primary"
        placeholder="Mother's Name"
        placeholderTextColor="#9694FF"
        value={formData.motherName}
        onChangeText={(text) => handleChange('motherName', text)}
      />
      <TextInput
        className="w-full border border-tertiary bg-white p-3 rounded-lg mb-4 text-primary"
        placeholder="Permanent Address"
        placeholderTextColor="#9694FF"
        value={formData.permanentAddress}
        onChangeText={(text) => handleChange('permanentAddress', text)}
      />
      <TextInput
        className="w-full border border-tertiary bg-white p-3 rounded-lg mb-4 text-primary"
        placeholder="Temporary Address"
        placeholderTextColor="#9694FF"
        value={formData.temporaryAddress}
        onChangeText={(text) => handleChange('temporaryAddress', text)}
      />
      <TextInput
        className="w-full border border-tertiary bg-white p-3 rounded-lg mb-4 text-primary"
        placeholder="Description"
        placeholderTextColor="#9694FF"
        value={formData.description}
        onChangeText={(text) => handleChange('description', text)}
        multiline
        numberOfLines={4}
      />
      <TouchableOpacity
        className={`w-full bg-primary p-3 rounded-lg ${loading ? 'opacity-80' : ''}`}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text className="text-white text-center font-semibold">
          {loading ? 'Submitting...' : 'Submit Request'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleBackToLogin} className="mt-4">
        <Text className="text-secondary font-semibold text-center">
          Back to Login
        </Text>
      </TouchableOpacity>
      <Toast />
    </ScrollView>
  );
}