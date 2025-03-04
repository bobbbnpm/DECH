import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const DychaniProtiPanickymAtakamP = () => {
  const navigation = useNavigation();
  const [selectedTime, setSelectedTime] = useState(5); // Výchozí hodnota 5 minut

  return (
    <View style={styles.container}>
      {/* Šipka zpět */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={32} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>DÝCHÁNÍ PROTI PANICKÝM ATAKÁM</Text>
      </View>

      <Text style={styles.description}>
      Panické ataky jsou často spojeny s hyperventilací, kdy dochází k přílišnému vydechování oxidu uhličitého, což může vést k pocitům dušnosti, závratím a dalším nepříjemným stavům. Dýchání do dlaní pomáhá obnovit rovnováhu CO₂ v krvi. Spočívá v pomalém a kontrolovaném dýchání do vlastních spojených dlaní, což umožňuje opětovné vdechování vydechnutého vzduchu a tím zabránění hyperventilaci. Tato metoda pomáhá rychle stabilizovat dech a uklidnit mysl.
      </Text>

      {/* Výběr délky cvičení */}
      <View style={styles.buttonGroup}>
        {[2, 5, 10].map((time) => (
          <TouchableOpacity
            key={time}
            style={[styles.timeButton, selectedTime === time && styles.timeButtonSelected]}
            onPress={() => setSelectedTime(time)}
          >
            <Text
              style={[styles.timeButtonText, selectedTime === time && styles.timeButtonTextSelected]}
            >
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F2F4",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    position: "absolute",
    top: 40,
    left: 20,
  },
  backButton: {
    position: "absolute",
    left: 0,
    zIndex: 10, // ✅ Zajišťuje, že šipka je kliknutelná
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 60,
    marginBottom: 20,
    color: "#333",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },
  timeButton: {
    padding: 10,
    backgroundColor: "#B39DDB",
    borderRadius: 10,
  },
  timeButtonSelected: {
    backgroundColor: "#6200EE",
  },
  timeButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  startButton: {
    backgroundColor: "#6200EE",
    padding: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  startButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DychaniProtiPanickymAtakamP;
