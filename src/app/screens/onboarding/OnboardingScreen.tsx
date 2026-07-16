import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import GrainyGradient from '@/components/ui/organisms/grainy-gradient';
import { useTheme } from '@/lib/theme';
import { useOnboardingStyles } from '@/styles/OnboardingScreen.styles';

export default function OnboardingScreen() {
  const router = useRouter();
  const theme = useTheme();
  const styles = useOnboardingStyles();

  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <GrainyGradient
          colors={[...theme.colors.gradient]}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.top}>
          <Text style={styles.title}>
            Bem-vindo(a) de volta!
          </Text>
          <Text style={styles.description}>
            Gerencie sua conta, acompanhe suas atividades e mantenha tudo organizado com facilidade.
          </Text>
        </View>

        <View style={styles.bottom}>
          <Pressable style={styles.button} onPress={() => router.push('/sign-in')}>
            <Text style={styles.buttonText}>Começar</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
