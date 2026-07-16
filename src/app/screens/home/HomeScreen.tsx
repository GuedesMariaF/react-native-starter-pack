import { Pressable, Text, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { useAuthStore } from '@/stores/auth-store';
import { useHomeStyles } from '@/styles/HomeScreen.styles';

export default function HomeScreen() {
  const { user, logout } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
      logout: state.logout,
    })),
  );
  const styles = useHomeStyles();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.greeting}>Olá, {user?.name} 👋</Text>
        <Text style={styles.title}>Bem-vindo de volta</Text>
        <Text style={styles.description}>
          Você está conectado e pronto para começar. Explore tudo que preparamos para você.
        </Text>
      </View>

      <Pressable style={styles.button} onPress={() => logout()}>
        <Text style={styles.buttonText}>Sair</Text>
      </Pressable>
    </View>
  );
}
