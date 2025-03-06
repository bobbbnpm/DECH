import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const JakSpravneDychatCelyDenP = () => {
  const navigation = useNavigation();
  const [selectedTime, setSelectedTime] = useState(5); // Výchozí hodnota 5 minut
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={[styles.safeContainer, { 
        paddingTop: insets.top, 
        paddingBottom: insets.bottom, 
        paddingLeft: insets.left, 
        paddingRight: insets.right 
        }]}>
    <View style={styles.container}>
      {/* Šipka zpět */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>JAK SPRÁVNĚ DÝCHAT CELÝ DEN</Text>
      </View>

      <Text style={styles.description}>
      Správné dýchání během dne zahrnuje využití bráničního dýchání a dýchání nosem. Nosní dýchání pomáhá filtrovat a zvlhčovat vzduch, zatímco brániční dýchání umožňuje hlubší a efektivnější přísun kyslíku. Doporučuje se pravidelně kontrolovat svůj dechový vzorec a vyvarovat se povrchnímu dýchání do hrudníku, které může přispívat k napětí a stresu.
      </Text>

      {/* Výběr délky cvičení */}
      <View style={styles.buttonGroup}>
        {[2, 5, 10].map((time) => (
          <TouchableOpacity
            key={time}
            style={[styles.timeButton, selectedTime === time && styles.timeButtonSelected]}
            onPress={() => setSelectedTime(time)}>
            <Text
              style={[styles.timeButtonText, selectedTime === time && styles.timeButtonTextSelected]}>
              {time} min
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Pokračovat na cvičení */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => navigation.navigate("DenBezStresuC", { selectedTime })}
      >
        <Text style={styles.startButtonText}>Pokračovat</Text>
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: { 
    flex: 1, 
    backgroundColor: "#F5F2F4" 
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F2F4",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: width * 0.05,
  },
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "center", 
    width: "100%",
    position: "absolute",
    top: height * 0.03, 
  },
  backButton: { 
    position: "absolute", 
    left: width * 0.05, 
    backgroundColor: "#9B5DE5", 
    borderRadius: 50, 
    padding: 12, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 4, 
    elevation: 3, 
  },
  title: {
    fontSize: width * 0.06, 
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginLeft: width * 0.13,
    marginTop: height * 0.03,
  },
  description: {
    fontSize: width * 0.05,
    textAlign: "center",
    marginTop: height * 0.1,
    marginBottom: height * 0.1,
    color: "#444",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "center",
    gap: width * 0.03,
    marginBottom: height * 0.04,
  },
  timeButton: {
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.06,
    backgroundColor: "#B39DDB",
    borderRadius: 12,
    elevation: 3,
  },
  timeButtonSelected: {
    backgroundColor: "#9B5DE5",
  },
  timeButtonText: {
    color: "#FFF",
    fontSize: width * 0.04,
    fontWeight: "bold",
  },
  startButton: {
    backgroundColor: "#9B5DE5",
    paddingVertical: height * 0.02,
    borderRadius: 12,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  startButtonText: {
    color: "#FFF",
    fontSize: width * 0.05,
    fontWeight: "bold",
  },
});

export default JakSpravneDychatCelyDenP;
