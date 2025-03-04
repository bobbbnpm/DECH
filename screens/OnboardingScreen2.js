import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OnboardingScreen2 = ({ navigation, setShowOnboarding }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleSelection = async (category) => {
    setSelectedCategory(category);
    await AsyncStorage.setItem("selectedCategory", category);
  };

  const finishOnboarding = async () => {
    if (!selectedCategory) return;

    await AsyncStorage.setItem("hasSeenOnboarding", "true"); 
    await AsyncStorage.setItem("selectedCategory", selectedCategory);

    setShowOnboarding(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.option, selectedCategory === "Stres" && styles.selectedOption]}
        onPress={() => handleSelection("Stres")}
      >
        <Text style={styles.optionText}>Zmírnění stresu</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.option, selectedCategory === "Spánek" && styles.selectedOption]}
        onPress={() => handleSelection("Spánek")}
      >
        <Text style={styles.optionText}>Lepší spánek</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.option, selectedCategory === "Panika" && styles.selectedOption]}
        onPress={() => handleSelection("Panika")}
      >
        <Text style={styles.optionText}>Panické ataky</Text>
      </TouchableOpacity>

      <Text style={styles.text}>
        Vyberte si oblast zaměření – relaxace, spánek nebo zvládání stresu.
      </Text>

      <TouchableOpacity style={styles.button} onPress={finishOnboarding} disabled={!selectedCategory}>
        <Text style={styles.buttonText}>Dokončit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#EAE6EC", padding: 20 },
  option: { width: "90%", backgroundColor: "#B0AAB2", padding: 20, borderRadius: 15, marginBottom: 10, alignItems: "center" },
  selectedOption: { backgroundColor: "#8D8891" },
  optionText: { fontSize: 16, fontWeight: "bold", color: "#333" },
  text: { fontSize: 14, textAlign: "center", marginBottom: 20, color: "#333" },
  button: { backgroundColor: "#8D8891", padding: 12, borderRadius: 10, width: "90%", alignItems: "center" },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});

export default OnboardingScreen2;
