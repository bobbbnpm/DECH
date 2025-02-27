import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const ExercisesScreen = () => {
  const navigation = useNavigation();
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exerciseTimes, setExerciseTimes] = useState({});
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [dropdownAnim] = useState(new Animated.Value(0)); // Animace pro dropdown

  // ✅ Načtení uložených časů při startu
  useEffect(() => {
    const loadSelectedTimes = async () => {
      const exercises = ["DobreRano", "DenBezStresu", "DychanipredSpaním"];
      let times = {};
      for (let exercise of exercises) {
        const savedTime = await AsyncStorage.getItem(`exerciseTime_${exercise}`);
        times[exercise] = savedTime ? parseInt(savedTime) : 5; // Výchozí hodnota 5 minut
      }
      setExerciseTimes(times);
    };
    loadSelectedTimes();
  }, []);

  // ✅ Uloží vybraný čas pro konkrétní cvičení
  const saveSelectedTime = async (exercise, time) => {
    setExerciseTimes((prev) => ({ ...prev, [exercise]: time }));
    await AsyncStorage.setItem(`exerciseTime_${exercise}`, time.toString());
    closeDropdown(); // Zavře dropdown
  };

  // ✅ Otevře dropdown selektor
  const openDropdown = (exercise) => {
    setSelectedExercise(exercise);
    setDropdownVisible(exercise);
    Animated.timing(dropdownAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  // ✅ Zavře dropdown selektor
  const closeDropdown = () => {
    Animated.timing(dropdownAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => setDropdownVisible(null));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>CVIČENÍ</Text>

      {/* ✅ Seznam cvičení */}
      {[
        { key: "DobreRano", title: "DOBRÉ RÁNO", description: "Prodloužený nádech na aktivaci těla" },
        { key: "DenBezStresu", title: "DEN BEZ STRESU", description: "Box breathing 4-4-4-4" },
        { key: "DychanipredSpaním", title: "DÝCHÁNÍ PŘED SPANÍM", description: "4-7-8 dýchání" }
      ].map((exercise) => (
        <View key={exercise.key} style={styles.card}>
          <Text style={styles.title}>{exercise.title}</Text>
          <Text style={styles.description}>{exercise.description}</Text>

          {/* ✅ Tlačítko pro výběr času */}
          <TouchableOpacity 
            style={styles.timeButton} 
            onPress={() => openDropdown(exercise.key)}
          >
            <Text style={styles.buttonText}>Zvolit délku: {exerciseTimes[exercise.key]} min</Text>
          </TouchableOpacity>

          {/* ✅ Dropdown selektor - zobrazí se jen u vybraného cvičení */}
          {dropdownVisible === exercise.key && (
            <Animated.View 
              style={[
                styles.dropdown, 
                { opacity: dropdownAnim, transform: [{ scaleY: dropdownAnim }] }
              ]}
            >
              {[2, 5, 10].map((time) => (
                <TouchableOpacity 
                  key={time} 
                  style={styles.dropdownItem} 
                  onPress={() => saveSelectedTime(exercise.key, time)}
                >
                  <Text style={styles.dropdownItemText}>{time} minut</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={closeDropdown} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Zavřít</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* ✅ Tlačítko pro spuštění cvičení */}
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
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
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
    fontSize: 16,
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
  // ✅ Tlačítka ve stejné barvě
  timeButton: {
    backgroundColor: "#B0B0B0",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#B0B0B0",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  // ✅ DROPDOWN SELEKTOR
  dropdown: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    position: "absolute",
    top: 50,
    width: "100%",
    zIndex: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  dropdownItemText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#B0B0B0",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
  },
  cancelButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ExercisesScreen;
