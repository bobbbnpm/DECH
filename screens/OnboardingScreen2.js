import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Komponenta pro druhou onboarding obrazovku
const OnboardingScreen2 = ({ navigation, setShowOnboarding }) => {
  // Stav pro uchování vybrané kategorie
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Funkce pro výběr kategorie a uložení do AsyncStorage
  const handleSelection = async (category) => {
    setSelectedCategory(category); // Nastaví vybranou kategorii do stavu
    await AsyncStorage.setItem("selectedCategory", category); // Uloží ji i do úložiště
  };

  // Funkce pro dokončení onboardingu
  const finishOnboarding = async () => {
    if (!selectedCategory) return; // Pokud není vybrána žádná kategorie, neprováděj nic

    await AsyncStorage.setItem("hasSeenOnboarding", "true"); // Označí onboarding jako dokončený
    await AsyncStorage.setItem("selectedCategory", selectedCategory); // Znovu uloží vybranou kategorii

    setShowOnboarding(false); // Skryje onboarding obrazovky
  };

  return (
    <View style={styles.container}>
      {/* Výběr kategorie "Stres" */}
      <TouchableOpacity
        style={[styles.option, selectedCategory === "Stres" && styles.selectedOption]}
        onPress={() => handleSelection("Stres")}
      >
        <Text style={styles.optionText}>Zmírnění stresu</Text>
      </TouchableOpacity>

      {/* Výběr kategorie "Spánek" */}
      <TouchableOpacity
        style={[styles.option, selectedCategory === "Spánek" && styles.selectedOption]}
        onPress={() => handleSelection("Spánek")}
      >
        <Text style={styles.optionText}>Lepší spánek</Text>
      </TouchableOpacity>

      {/* Výběr kategorie "Panika" */}
      <TouchableOpacity
        style={[styles.option, selectedCategory === "Panika" && styles.selectedOption]}
        onPress={() => handleSelection("Panika")}
      >
        <Text style={styles.optionText}>Panické ataky</Text>
      </TouchableOpacity>

      {/* Popisový text pod volbami */}
      <Text style={styles.text}>
        Vyberte si oblast zaměření – relaxace, spánek nebo zvládání stresu.
      </Text>

      {/* Tlačítko pro dokončení onboarding obrazovek */}
      <TouchableOpacity style={styles.button} onPress={finishOnboarding} disabled={!selectedCategory}>
        <Text style={styles.buttonText}>Dokončit</Text>
      </TouchableOpacity>
    </View>
  );
};

// Stylování komponenty
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center", 
    backgroundColor: "#EAE6EC", 
    padding: 20 
  },
  option: { 
    width: "90%", 
    backgroundColor: "#B0AAB2", 
    padding: 20, 
    borderRadius: 15, 
    marginBottom: 10, 
    alignItems: "center" 
  },
  selectedOption: { 
    backgroundColor: "#8D8891" 
  },
  optionText: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#333" 
  },
  text: { 
    fontSize: 14, 
    textAlign: "center", 
    marginBottom: 20, 
    color: "#333" 
  },
  button: { 
    backgroundColor: "#8D8891", 
    padding: 12, 
    borderRadius: 10, 
    width: "90%", 
    alignItems: "center" 
  },
  buttonText: { 
    color: "#FFF", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
});

// Export komponenty pro použití v navigaci
export default OnboardingScreen2;
