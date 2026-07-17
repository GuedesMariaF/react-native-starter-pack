import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
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
import { useTheme } from '@/lib/theme';
import { signInFormSchema } from '@/schema/auth';
import { useAuthStore } from '@/stores/auth-store';
import { useLoginStyles } from '@/styles/LoginScreen.styles';
import { onError as showErrorToast } from '@/utils/on-error';

export default function SignIn() {
  const completeLogin = useAuthStore((state) => state.completeLogin);
  const { mutateAsync } = useLoginEmailAndPassword();
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
  const styles = useLoginStyles();

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
        <View style={styles.header}>
          <Text style={styles.title}>Bem-vindo de volta</Text>
          <Text style={styles.subtitle}>
            Bom te ver aqui! Insira suas credenciais para continuar.
          </Text>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>E-mail</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange } }) => (
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
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
        </View>

        <View style={styles.fieldGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Senha</Text>
            <Pressable>
              <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
            </Pressable>
          </View>
          <Controller
            control={control}
            name="password"
            render={({ field: { value, onChange } }) => (
              <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
                <TextInput
                  style={styles.inputInner}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={value}
                  onChangeText={onChange}
                  editable={!isSubmitting}
                />
                <Pressable
                  onPress={() => setShowPassword((prev) => !prev)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={theme.colors.textMuted}
                  />
                </Pressable>
              </View>
            )}
          />
          {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
        </View>

        <Pressable
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={theme.colors.onPrimary} />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
