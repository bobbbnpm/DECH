import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

const OnboardingScreen1 = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* ✅ Změněno: Místo kruhu je zde PNG obrázek */}
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      
      <Text style={styles.text}>
        Vítejte! Naučte se ovládat svůj dech, zmírnit svůj stres a zlepšit spánek!
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("OnboardingScreen2")}>
        <Text style={styles.buttonText}>Pokračovat</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center", 
    backgroundColor: "#EAE6EC", 
    padding: 20 
  },
  logo: { 
    width: 150,  // ✅ Nastav šířku loga
    height: 150, // ✅ Nastav výšku loga
    marginBottom: 20, 
    resizeMode: "contain" // ✅ Logo se přizpůsobí velikosti
  },
  text: { 
    fontSize: 16, 
    textAlign: "center", 
    marginBottom: 20, 
    color: "#333" 
  },
  button: { 
    backgroundColor: "#B39DDB", 
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

export default OnboardingScreen1;
