
import { StyleSheet } from 'react-native';

export const getAuthStyles = (colors: any, colorScheme: string | null | undefined) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 10, // Reduced from 40 to minimize overall top spacing
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  appLogo: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    height: 50,
    backgroundColor: colors.inputBackground,
    borderRadius: 10,
    paddingHorizontal: 15,
    color: colors.text,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputFocused: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: colors.secondary,
    opacity: 0.6,
  },
  buttonText: {
    color: colors.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonTextDisabled: {
    color: colorScheme === 'dark' ? '#666' : '#999',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  stitch: {
    flex: 1,
    height: 1,
    borderTopWidth: 1,
    borderColor: colors.secondary,
    borderStyle: 'dashed',
  },
  dividerText: {
    color: colors.secondary,
    marginHorizontal: 10,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colorScheme === 'dark' ? colors.borderColor : 'transparent',
    backgroundColor: colors.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    fontSize: 24,
    color: colors.text,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: colors.secondary,
  },
  linkText: {
    color: colors.primary,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    paddingTop: 15, // Reduced from 15 to create 5-10% margin from status bar
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
  },
  backButton: {
    position: 'absolute',
    left: 15,
  },
  backButtonText: {
    color: colors.text,
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: 15,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: 15,
  },
  eyeIcon: {
    padding: 10,
  },
  passwordNote: {
    color: colors.secondary,
    fontSize: 12,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
});