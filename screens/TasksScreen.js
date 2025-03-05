import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ConfettiCannon from "react-native-confetti-cannon";

const tasksData = {
  Stres: [
    { id: 1, title: "Pochval se za malé úspěchy", description: "Každý splněný úkol je krok vpřed.", completed: false },
    { id: 2, title: "Dej si pauzu na oběd alespoň 20 minut", description: "Jídlo v klidu pomáhá regulovat stresové hormony.", completed: false },
  ],
  Panika: [
    { id: 10, title: "Hned po probuzení procvič dechovou techniku", description: "Klidné dýchání stabilizuje nervový systém.", completed: false },
  ],
  Spánek: [
    { id: 25, title: "Nedávej si kofein po obědě", description: "Kofein může zvýšit večerní úzkost a ztížit usínání.", completed: false },
  ],
};

const TasksScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState("Stres");
  const [tasks, setTasks] = useState([]);
  const [confettiPosition, setConfettiPosition] = useState(null);
  const confettiRef = useRef(null);

  // 🔄 Načíst vybranou kategorii z onboardingu
  useEffect(() => {
    const loadCategory = async () => {
      const savedCategory = await AsyncStorage.getItem("selectedCategory");
      if (savedCategory) {
        setSelectedCategory(savedCategory);
      }
    };
    loadCategory();
  }, []);

  // 🔄 Načíst úkoly pro vybranou kategorii
  useEffect(() => {
    const loadTasks = async () => {
      const savedTasks = await AsyncStorage.getItem("tasksData");
      setTasks(savedTasks ? JSON.parse(savedTasks)[selectedCategory] : tasksData[selectedCategory]);
    };
    loadTasks();
  }, [selectedCategory]);

  // 🔄 Uložit úkoly do AsyncStorage
  const saveTasks = async (updatedTasks) => {
    const allTasks = await AsyncStorage.getItem("tasksData");
    const parsedTasks = allTasks ? JSON.parse(allTasks) : tasksData;
    parsedTasks[selectedCategory] = updatedTasks;
    await AsyncStorage.setItem("tasksData", JSON.stringify(parsedTasks));
  };

  // 🔄 Uložit vybranou kategorii do AsyncStorage při změně
  const changeCategory = async (category) => {
    setSelectedCategory(category);
    await AsyncStorage.setItem("selectedCategory", category);
  };

  // 🎉 Spustit konfety jen při prvním dokončení úkolu
  const toggleTask = (taskId, event) => {
    const { pageX, pageY } = event.nativeEvent;
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        if (!task.completed) {
          setConfettiPosition({ x: pageX, y: pageY });
          if (confettiRef.current) confettiRef.current.start();
        }
        return { ...task, completed: !task.completed };
      }
      return task;
    });

    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📌</Text>

      {/* Přepínač kategorií */}
      <View style={styles.filterContainer}>
        {["Stres", "Panika", "Spánek"].map((category) => (
          <TouchableOpacity
            key={category}
            style={[styles.filterButton, selectedCategory === category && styles.selectedFilterButton]}
            onPress={() => changeCategory(category)}
          >
            <Text style={styles.filterText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Seznam úkolů */}
      <ScrollView contentContainerStyle={styles.taskList}>
        {tasks.map((task) => (
          <TouchableOpacity
            key={task.id}
            style={[styles.taskCard, task.completed && styles.taskCompleted]}
            onPress={(event) => toggleTask(task.id, event)}
          >
            <Text style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}>{task.title}</Text>
            <Text style={styles.taskDescription}>{task.description}</Text>
            {task.completed && <Text style={styles.completedText}>✔️ Splněno!</Text>}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Animace konfet */}
      {confettiPosition && (
        <ConfettiCannon
          count={40}
          origin={{ x: confettiPosition.x, y: confettiPosition.y }}
          fadeOut={true}
          autoStart={false}
          ref={confettiRef}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f4fb", alignItems: "center", paddingVertical: 20 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 15, color: "#5A189A" },
  filterContainer: { flexDirection: "row", marginBottom: 15 },
  filterButton: { padding: 10, borderRadius: 20, marginHorizontal: 5, backgroundColor: "#D6C2F0" },
  selectedFilterButton: { backgroundColor: "#9B5DE5" },
  filterText: { fontSize: 16, fontWeight: "bold", color: "white" },
  taskList: { width: "90%", alignItems: "center" },
  taskCard: {
    backgroundColor: "#ECE4FF",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  taskCompleted: { backgroundColor: "#C7F9CC" },
  taskTitle: { fontSize: 16, fontWeight: "bold", textAlign: "center", color: "#4A148C" },
  taskTitleCompleted: { textDecorationLine: "line-through", color: "#2F7336" },
  taskDescription: { fontSize: 14, textAlign: "center", marginTop: 5, color: "#6B728E" },
  completedText: { fontSize: 14, color: "#2F7336", marginTop: 5, fontWeight: "bold" },
});

export default TasksScreen;
