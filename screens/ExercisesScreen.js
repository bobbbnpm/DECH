import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

const ExercisesScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>CVIČENÍ</Text>

      {[
        { key: "GoodMorningDescript", title: "DOBRÉ RÁNO", description: "Probuzení pomocí Wim Hofovy metody." },
        { key: "DenBezStresuP", title: "DEN BEZ STRESU", description: "Box breathing 4-4-4-4 pro redukci stresu." },
        { key: "DychaniPredSpanimP", title: "DÝCHÁNÍ PŘED SPANÍM", description: "4-7-8 dýchání pro lepší spánek." },
        { key: "ZmirneniStresuPredZkouskouP", title: "ZMÍRNĚNÍ STRESU PŘED ZKOUŠKOU", description: "3-3-3-3 Box Breathing" },
        { key: "DychaniProtiPanickymAtakamP", title: "DÝCHÁNÍ PROTI PANICKÝM ATAKÁM", description: "Dýchání do dlaní, Box breathing (4-4-4-4)" },
        { key: "JakSpravneDychatCelyDenP", title: "JAK SPRÁVNĚ DÝCHAT CELÝ DEN", description: "Nauč se techniku, jak správně dýchat po celý den" },
        { key: "RozdychaniPredBehemP", title: "ROZDÝCHÁNÍ PŘED BĚHEM", description: "Rytmické dýchání (2-2), nosní dýchání pro vytrvalost, brániční dýchání" },
        { key: "RozdychaniPredSportemP", title: "ROZDÝCHÁNÍ PŘED SPORTEM", description: "Dýchání do břicha, cyklické dýchání." },
        { key: "RozdychaniPredPotapenimP", title: "ROZDÝCHÁNÍ PŘED POTÁPENÍM", description: "Dýchání do břicha." }
      ].map((exercise) => (
        <View key={exercise.key} style={styles.card}>
          <Text style={styles.title}>{exercise.title}</Text>
          <Text style={styles.description}>{exercise.description}</Text>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate(exercise.key)}
          >
            <Text style={styles.buttonText}>Přejít na cvičení</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#F5F2F4",
    paddingVertical: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    width: "90%",
    backgroundColor: "#E3E1E3",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#d6eadf",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ExercisesScreen;
