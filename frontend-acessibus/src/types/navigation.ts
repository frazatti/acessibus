import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  LoginScreen: undefined;
  SignUp: undefined;
  Recents: undefined;
  Favorites: undefined;
  User: undefined;
  Update: undefined;
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'LoginScreen'>;
export type SignUpScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;
export type RecentsScreenProps = NativeStackScreenProps<RootStackParamList, 'Recents'>;
export type FavoritesScreenProps = NativeStackScreenProps<RootStackParamList, 'Favorites'>;
export type UserScreenProps = NativeStackScreenProps<RootStackParamList, 'User'>;
export type UpdateScreenProps = NativeStackScreenProps<RootStackParamList, 'Update'>;
