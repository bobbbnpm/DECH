import React from "react"; // Import React knihovny
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native"; // Import potřebných komponent z React Native

// Komponenta pro první onboarding obrazovku
const OnboardingScreen1 = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Logo aplikace */}
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      
      {/* Úvodní text */}
      <Text style={styles.text}>
        Vítejte! Naučte se ovládat svůj dech, zmírnit svůj stres a zlepšit spánek!
      </Text>

      {/* Tlačítko pro přechod na další onboarding obrazovku */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("OnboardingScreen2")}>
        <Text style={styles.buttonText}>Pokračovat</Text>
      </TouchableOpacity>
    </View>
  );
};

// Stylování pro onboarding obrazovku
const styles = StyleSheet.create({
  container: { 
    flex: 1, // Zabere celou obrazovku
    alignItems: "center", // Zarovná obsah na střed horizontálně
    justifyContent: "center", // Zarovná obsah na střed vertikálně
    backgroundColor: "#EAE6EC", // Světle šedé pozadí
    padding: 20 // Vnitřní odsazení
  },
  logo: { 
    width: 150,  // Šířka loga
    height: 150, // Výška loga
    marginBottom: 20, // Mezery pod logem
    resizeMode: "contain" // Zajišťuje, že se obrázek nedeformuje
  },
  text: { 
    fontSize: 16, // Velikost textu
    textAlign: "center", // Zarovnání textu na střed
    marginBottom: 20, // Mezery pod textem
    color: "#333" // Tmavší šedá barva textu
  },
  button: { 
    backgroundColor: "#B39DDB", // Fialová barva pozadí tlačítka
    padding: 12, // Vnitřní výplň
    borderRadius: 10, // Zaoblené rohy
    width: "90%", // Tlačítko má 90 % šířky obrazovky
    alignItems: "center" // Zarovná text na střed
  },
  buttonText: { 
    color: "#FFF", // Bílá barva textu
    fontSize: 16, // Velikost textu
    fontWeight: "bold" // Tučný text
  },
});

// Export komponenty pro použití v navigaci
export default OnboardingScreen1;
