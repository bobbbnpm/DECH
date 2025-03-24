import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

const ExercisesScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>VYBER SI CVIČENÍ</Text>

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
    backgroundColor: "#f7f4fb",
    paddingVertical: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#5A189A",
    textAlign: "center",
  },
  card: {
    width: "90%",
    backgroundColor: "#ECE4FF",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
    color: "#4A148C",
  },
  description: {
    fontSize: 14,
    color: "#6B728E",
    textAlign: "center",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#9B5DE5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});


export default ExercisesScreen;
