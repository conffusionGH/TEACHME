import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { signInStart, signInSuccess, signInFailure } from '../../redux/userSlice.js';
import APIEndPoints from '../../middleware/APIEndPoints.js';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const signInAPIPOINTS = APIEndPoints.sign_in.url;

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      dispatch(signInStart());
      const response = await axios.post(signInAPIPOINTS, formData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      console.log(response);

      if (response.data.success === false) {
        dispatch(signInFailure(response.data.message));
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: response.data.message,
        });
        return;
      }

      dispatch(signInSuccess(response.data));
      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: 'Welcome back!',
      });
      navigation.navigate('Home');
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Sign in failed';
      dispatch(signInFailure(errMsg));
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errMsg,
      });
      console.log(errMsg);
    }
  };

  const handleRequestLogin = () => {
    // Reset navigation stack to avoid stacking
    navigation.reset({
      index: 0,
      routes: [{ name: 'RequestForm' }],
    });
  };

  return (
    <View className="flex-1 items-center justify-center bg-tertiary p-4">
      <Text className="text-3xl font-bold text-primary mb-6">Sign In</Text>
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
        placeholder="Password"
        placeholderTextColor="#9694FF"
        value={formData.password}
        onChangeText={(text) => handleChange('password', text)}
        secureTextEntry
      />
      <TouchableOpacity
        className={`w-full bg-primary p-3 rounded-lg ${loading ? 'opacity-80' : ''}`}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text className="text-white text-center font-semibold">
          {loading ? 'Signing in...' : 'Sign In'}
        </Text>
      </TouchableOpacity>
      <View className="flex-row mt-4">
        <Text className="text-primary">Don't have an account? </Text>
        <TouchableOpacity onPress={handleRequestLogin}>
          <Text className="text-secondary font-semibold">Request a login</Text>
        </TouchableOpacity>
      </View>
      <Toast />
    </View>
  );
}