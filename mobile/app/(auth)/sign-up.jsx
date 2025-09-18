import { useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import {styles} from "../../assets/styles/auth.styles.js";
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../../constants/colors.js';
import { Image } from 'expo-image'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState()

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
    } catch (err) {
      if (err.errors?.[0]?.code === "form_identifier_exists") {
        setError("That email address is already in use. Please try another.");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  if (pendingVerification) {
    return (
      <View style={styles.verificationContainer}>
        <Text style={styles.verificationTitle}>Verify your email</Text>
          {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense}/>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError(null)}>
              <Ionicons name="close" size={20} color={COLORS.textLight}/>
            </TouchableOpacity>
          </View>
        ) : null}

        <TextInput
          style={[styles.verificationInput, error && styles.errorInput]}
          value={code}
          placeholder="Enter your verification code"
          onChangeText={(code) => setCode(code)}
        />
        <TouchableOpacity onPress={onVerifyPress} style={styles.button}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <KeyboardAwareScrollView style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={false}
      enableAutomaticScroll={true}>
      <View style={styles.container}>
        <Image source={require("../../assets/images/revenue-i2.png")} style={styles.illustration} />

        <Text style={styles.title}>Create Account</Text>
        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense}/>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError(null)}>
              <Ionicons name="close" size={20} color={COLORS.textLight}/>
            </TouchableOpacity>
          </View>
        ) : null}
        <TextInput
          style={[styles.input, error && styles.errorInput]}
          autoCapitalize="none"
          value={emailAddress}
          placeholderTextColor="#9A8478"
          placeholder="Enter email"
          onChangeText={(email) => setEmailAddress(email)}
        />

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          value={password}
          placeholder="Enter password"
          placeholderTextColor="#9A8478"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
        <TouchableOpacity style={styles.button} onPress={onSignUpPress}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.linkText}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  )
}