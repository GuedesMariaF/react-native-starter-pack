import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { z } from 'zod';
import { useLoginEmailAndPassword } from '@/api/generated/auth/auth';
import { signInFormSchema } from '@/schema/auth';
import { useAuthStore } from '@/stores/auth-store';
import { onError as showErrorToast } from '@/utils/on-error';
import { styles } from '../../../styles/LoginScreen.styles';

export default function LoginScreen() {
  const completeLogin = useAuthStore((state) => state.completeLogin);
  const { mutateAsync } = useLoginEmailAndPassword();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof signInFormSchema>, unknown, z.output<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async ({ email, password }: z.output<typeof signInFormSchema>) => {
    await mutateAsync(
      { data: { email, password } },
      {
        onSuccess: async ({ data }) => {
          await completeLogin(data.user, data.token);
        },
        onError: (error) => {
          showErrorToast(error, 'Não foi possível entrar. Verifique suas credenciais.');
        },
      },
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.form}>
        <Text style={styles.title}>Entrar</Text>

        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange } }) => (
            <TextInput
              style={styles.input}
              placeholder="Email"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              value={value}
              onChangeText={onChange}
              editable={!isSubmitting}
            />
          )}
        />
        {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange } }) => (
            <TextInput
              style={styles.input}
              placeholder="Senha"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              value={value}
              onChangeText={onChange}
              editable={!isSubmitting}
            />
          )}
        />
        {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

        <Pressable
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
