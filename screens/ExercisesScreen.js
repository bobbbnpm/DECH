// Import React knihovny
import React from "react"; 
// Import základních komponent z React Native
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native"; 
// Import hooku pro navigaci mezi obrazovkami
import { useNavigation } from "@react-navigation/native"; 

// Hlavní komponenta pro obrazovku s výběrem dechových cvičení
const ExercisesScreen = () => {
  const navigation = useNavigation(); // Hook pro navigaci

  return (
    // Hlavní ScrollView kontejner, který umožňuje posouvání obsahu
    <ScrollView contentContainerStyle={styles.container}>
      {/* Nadpis obrazovky */}
      <Text style={styles.header}>VYBER SI CVIČENÍ</Text>

      {/* Mapování seznamu cvičení */}
      {[
        { key: "GoodMorningDescript", title: "DOBRÉ RÁNO", description: "Ranní dechový rituál pro rovnováhu, vitalitu a pozitivní naladění na celý den." },
        { key: "DenBezStresuP", title: "DEN BEZ STRESU", description: "Technika pro zklidnění mysli a udržení rovnováhy během dne." },
        { key: "DychaniPredSpanimP", title: "DÝCHÁNÍ PŘED SPANÍM", description: "Uklidňující dechová technika pro zklidnění těla a přípravu na klidný spánek." },
        { key: "ZmirneniStresuPredZkouskouP", title: "ZMÍRNĚNÍ STRESU PŘED ZKOUŠKOU", description: "Dechové cvičení, které uklidňuje a zlepšuje soustředění." },
        { key: "DychaniProtiPanickymAtakamP", title: "DÝCHÁNÍ PROTI PANICKÝM ATAKÁM", description: "Dechová technika pro udržení klidu a prevenci panické ataky." },
        { key: "JakSpravneDychatCelyDenP", title: "JAK SPRÁVNĚ DÝCHAT CELÝ DEN", description: "Nauč se dýchat přirozeně a efektivně po celý den." },
        { key: "RozdychaniPredBehemP", title: "ROZDÝCHÁNÍ PŘED BĚHEM", description: "Rytmické dýchání pro stabilní tempo a efektivní běh." },
        { key: "WimHofovaMetodaP", title: "WIM HOFOVA METODA", description: "Dechová technika pro okysličení těla a podporu imunity." },
        { key: "RozdychaniPredPotapenimP", title: "ROZDÝCHÁNÍ PŘED POTÁPENÍM", description: "Rozdýchání pro efektivní zadržení dechu při potápění." }
      ].map((exercise) => (
        // Karta pro jednotlivé cvičení
        <View key={exercise.key} style={styles.card}>
          {/* Název cvičení */}
          <Text style={styles.title}>{exercise.title}</Text>
          {/* Popis cvičení */}
          <Text style={styles.description}>{exercise.description}</Text>
          {/* Tlačítko pro přechod na konkrétní cvičení */}
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate(exercise.key)}
          >
            {/* Text tlačítka */}
            <Text style={styles.buttonText}>Přejít na cvičení</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

// Styly pro komponentu
const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // ScrollView se rozšiřuje dle obsahu
    alignItems: "center", // Zarovnání obsahu na střed
    backgroundColor: "#f7f4fb", // Barva pozadí
    paddingVertical: 20, // Vnitřní odsazení nahoře a dole
  },
  header: {
    fontSize: 24, // Velikost textu
    fontWeight: "bold", // Tučné písmo
    marginBottom: 20, // Mezery pod nadpisem
    color: "#5A189A", // Barva textu
    textAlign: "center", // Zarovnání textu na střed
  },
  card: {
    width: "90%", // Šířka karty
    backgroundColor: "#ECE4FF", // Barva pozadí karty
    padding: 20, // Vnitřní odsazení
    borderRadius: 15, // Zaoblené rohy
    marginBottom: 15, // Mezery mezi kartami
    alignItems: "center", // Zarovnání obsahu karty
    shadowColor: "#000", // Barva stínu
    shadowOffset: { width: 0, height: 3 }, // Posun stínu
    shadowOpacity: 0.2, // Průhlednost stínu
    shadowRadius: 5, // Rozostření stínu
    elevation: 5, // Výška stínu (Android)
  },
  title: {
    fontSize: 18, // Velikost nadpisu
    fontWeight: "bold", // Tučné písmo
    marginBottom: 5, // Spodní mezera
    textAlign: "center", // Zarovnání na střed
    color: "#4A148C", // Barva textu
  },
  description: {
    fontSize: 14, // Velikost popisu
    color: "#6B728E", // Barva popisu
    textAlign: "center", // Zarovnání na střed
    marginBottom: 10, // Spodní mezera
  },
  button: {
    backgroundColor: "#9B5DE5", // Fialová barva tlačítka
    paddingVertical: 10, // Svislé vnitřní odsazení
    paddingHorizontal: 20, // Vodorovné vnitřní odsazení
    borderRadius: 25, // Zaoblení rohů
    marginTop: 10, // Horní mezera
    shadowColor: "#000", // Barva stínu
    shadowOffset: { width: 0, height: 3 }, // Posun stínu
    shadowOpacity: 0.2, // Průhlednost stínu
    shadowRadius: 5, // Rozostření
    elevation: 5, // Výška stínu pro Android
  },
  buttonText: {
    color: "#fff", // Barva textu
    fontWeight: "bold", // Tučný text
    fontSize: 16, // Velikost textu
  },
});

// Export komponenty pro použití v aplikaci
export default ExercisesScreen;
