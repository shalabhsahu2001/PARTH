import * as Google from 'expo-auth-session/providers/google';
import { AuthSessionResult, ResponseType } from 'expo-auth-session';
import { Alert } from 'react-native';

// Use a custom type to define the expected structure of the Google Auth result
type GoogleAuthResult = AuthSessionResult & {
  params?: {
    id_token?: string; // Define id_token as optional
  };
};

// Directly using the Google API Key
const GOOGLE_API_KEY = '518473285890-s2mkggtejovfs8kajs6pp7nfuekfgci5.apps.googleusercontent.com';

export const useGoogleOAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: GOOGLE_API_KEY, // Use the direct client ID
    responseType: ResponseType.IdToken, // Request token or id_token depending on your needs
  });

  return { request, response, promptAsync };
};

export const handleGoogleOAuth = async (promptAsync: () => Promise<GoogleAuthResult>) => {
  try {
    const result = await promptAsync(); // Call the promptAsync function

    // Check if result is of type success and has params with id_token
    if (result.type === 'success' && result.params?.id_token) {
      const { id_token } = result.params; // Safely access id_token
      // Now you can use this id_token to authenticate with your backend or Firebase
      Alert.alert("Success", "Google OAuth sign-in successful!");
    } else {
      Alert.alert('Error', 'Google sign-in was cancelled');
    }
  } catch (error) {
    console.error("Google Sign-in failed: ", error);
    Alert.alert('Error', 'Google sign-in failed. Please try again.');
  }
};
