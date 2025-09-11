import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const TermsScreen = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#006400', '#006400']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerText}>Terms & Conditions</Text>
      </LinearGradient>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Welcome to Pure Prakrti</Text>
        <Text style={styles.paragraph}>
          By using our app, you agree to follow the terms and conditions mentioned here.
          Please read them carefully before using Pure Prakrti services.
        </Text>

        <Text style={styles.sectionTitle}>1. Account Responsibility</Text>
        <Text style={styles.paragraph}>
          You are responsible for maintaining the confidentiality of your account and PIN.
          Any activity carried out under your account will be considered your responsibility.
        </Text>

        <Text style={styles.sectionTitle}>2. Service Usage</Text>
        <Text style={styles.paragraph}>
          Our services are provided for personal and lawful use only. You agree not to misuse
          the app or engage in fraudulent activities.
        </Text>

        <Text style={styles.sectionTitle}>3. Privacy</Text>
        <Text style={styles.paragraph}>
          We value your privacy. Your personal details such as phone number are kept secure and
          used only for authentication and communication purposes.
        </Text>

        <Text style={styles.sectionTitle}>4. Limitation of Liability</Text>
        <Text style={styles.paragraph}>
          Pure Prakrti shall not be liable for any indirect, incidental, or consequential damages
          arising out of the use of our services.
        </Text>

        <Text style={styles.sectionTitle}>5. Changes to Terms</Text>
        <Text style={styles.paragraph}>
          We may update these terms from time to time. Continued use of the app implies acceptance
          of the revised terms.
        </Text>

        <Text style={styles.sectionTitle}>6. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions regarding these Terms & Conditions, please reach out to us at:
          siddycash@gmail.com
        </Text>

        <Text style={styles.footerText}>
          © {new Date().getFullYear()} Pure Prakrti. All Rights Reserved.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 1,
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0d47a1',
    marginTop: 16,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#888',
    marginTop: 30,
  },
});

export default TermsScreen;
