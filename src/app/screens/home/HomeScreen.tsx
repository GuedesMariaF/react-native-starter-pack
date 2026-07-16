import { Pressable, Text, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { useAuthStore } from '@/stores/auth-store';
import { styles } from '@/styles/HomeScreen.styles';

export default function HomeScreen() {
  const { user, logout } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
      logout: state.logout,
    })),
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Olá, {user?.name}!</Text>
      <Text style={styles.subtitle}>{user?.email}</Text>

      <Pressable style={styles.button} onPress={() => logout()}>
        <Text style={styles.buttonText}>Sair</Text>
      </Pressable>
    </View>
  );
}
