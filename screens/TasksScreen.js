import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const tasksData = {
  Stres: [
    { id: 1, title: "Pochval se za malé úspěchy", description: "Každý splněný úkol je krok vpřed. Oceň i drobné pokroky, protože posilují pozitivní myšlení.", completed: false },
    { id: 2, title: "Dej si pauzu na oběd alespoň 20 minut", description: "Jídlo v klidu a bez rozptylování pomáhá regulovat stresové hormony a podporuje trávení.", completed: false },
    { id: 3, title: "Nepřepínej se, nastav si realistická očekávání", description: "Perfekcionismus je častým spouštěčem stresu. Stanov si dosažitelné cíle a rozděl úkoly na menší kroky.", completed: false },
    { id: 4, title: "Jdi na procházku alespoň na 30 minut", description: "Pravidelný pohyb venku, ideálně v přírodě, snižuje hladinu kortizolu a zlepšuje náladu.", completed: false },
    { id: 5, title: "Dýchej podle cvičení alespoň 5 minut", description: "Dechová cvičení aktivují parasympatický nervový systém a pomáhají rychle snížit stres.", completed: false },
    { id: 6, title: "Podívej se na vtipná videa nebo něco, co tě rozesměje", description: "Smích snižuje stresové hormony a podporuje tvorbu endorfinů.", completed: false },
    { id: 7, title: "Buď milý na ostatní", description: "Laskavost a drobná gesta vůči ostatním zvyšují hladinu oxytocinu, který pomáhá zmírnit stres.", completed: false },
    { id: 8, title: "Vyhni se nadměrnému sledování zpráv a sociálních sítí", description: "Neustálý příval informací může zvyšovat stres a zahlcení.", completed: false },
    { id: 9, title: "Před spaním odlož telefon a relaxuj", description: "Modré světlo narušuje produkci melatoninu a ztěžuje usínání.", completed: false },
  ],
  Panika: [
    { id: 10, title: "Hned po probuzení procvič dechovou techniku", description: "Klidné dýchání hned po probuzení pomáhá stabilizovat nervový systém a snižuje riziko ranní úzkosti.", completed: false },
    { id: 11, title: "Protahuj se alespoň 5 minut", description: "Jemné protažení svalů a kloubů pomáhá aktivovat tělo bez stresu a podporuje uvolnění.", completed: false },
    { id: 12, title: "Dej si teplý nápoj", description: "Teplá tekutina pomáhá tělu pomalu se probudit a snižuje ranní napětí.", completed: false },
    { id: 13, title: "Před začátkem dne si dej jeden pozitivní cíl", description: "Zaměření se na něco konkrétního dává mysli směr a snižuje pocit nejistoty.", completed: false },
    { id: 14, title: "Vyhni se telefonu alespoň prvních 30 minut po probuzení", description: "Ranní kontakt se sociálními sítěmi a zprávami může okamžitě zvýšit stres.", completed: false },
    { id: 15, title: "Každou hodinu si dej krátkou pauzu", description: "Stačí minuta na vědomé dýchání nebo protažení, což pomáhá zabránit přetížení nervového systému.", completed: false },
    { id: 16, title: "Napij se každých 30 minut", description: "Dostatečná hydratace stabilizuje tělesné funkce a zabraňuje pocitům slabosti, které mohou spustit úzkost.", completed: false },
    { id: 17, title: "Dej si dopolední procházku alespoň na 15 minut", description: "Přirozené světlo a pohyb pomáhají regulovat kortizol a udržet stabilní hladinu energie.", completed: false },
    { id: 18, title: "Jez pomalu a soustředěně", description: "Jíst v klidu a věnovat se jídlu vědomě pomáhá zabránit stresové reakci těla.", completed: false },
    { id: 19, title: "Na 10 minut si dej mindfulness cvičení", description: "Zaměř se na přítomný okamžik, například sleduj svůj dech nebo si uvědomuj své smysly.", completed: false },
    { id: 20, title: "Omezení kofeinu po obědě", description: "Kofein odpoledne může zvýšit večerní úzkost a ztížit usínání.", completed: false },
    { id: 21, title: "Pusť si uklidňující hudbu nebo bílý šum", description: "Relaxační zvuky pomáhají snižovat aktivitu sympatického nervového systému.", completed: false },
    { id: 22, title: "Buď venku alespoň 20 minut", description: "Pobyt na čerstvém vzduchu snižuje hladinu stresových hormonů a pomáhá udržet stabilní psychický stav.", completed: false },
    { id: 23, title: "Dechové cvičení před spaním: 4-7-8", description: "Nádech na 4 sekundy, zadržení dechu na 7 sekund, výdech na 8 sekund – tato technika aktivuje parasympatický nervový systém a pomáhá usnout.", completed: false },
    { id: 24, title: "Ulož se do postele s pocitem klidu a bezpečí", description: "Představ si svůj ideální bezpečný prostor, místo, kde se cítíš dobře a chráněný.", completed: false },
  ],
  Spánek: [
    { id: 25, title: "Nedávej si kofein po obědě", description: "Kofein odpoledne může zvýšit večerní úzkost a ztížit usínání.", completed: false },
    { id: 26, title: "Dodrž pravidelný spánkový režim", description: "Chodit spát a vstávat každý den ve stejnou dobu pomáhá regulovat cirkadiánní rytmus a zlepšuje kvalitu spánku.", completed: false },
    { id: 27, title: "Dvě hodiny před spaním ztlum světla", description: "Vypni jasná světla a používej jen tlumené osvětlení nebo svíčku. Pomůže to tělu lépe se připravit na spánek.", completed: false },
    { id: 28, title: "Hodinu před spaním vypni telefon a počítač", description: "Odlož elektroniku a místo toho se věnuj klidné činnosti jako čtení nebo poslech hudby.", completed: false },
    { id: 29, title: "Připrav si bylinkový čaj nebo teplou vodu s medem", description: "Místo kávy nebo slazených nápojů si dej něco uklidňujícího na podporu spánku.", completed: false },
    { id: 30, title: "Sepiš si tři věci, které se ti dnes povedly", description: "Před spaním si do deníku napiš, co tě dnes potěšilo nebo co se podařilo. Pomůže to uklidnit mysl.", completed: false },
    { id: 31, title: "Před spaním si zapni na 5 minut dechové cvičení 4-7-8", description: "Technika dýchání 4-7-8 aktivuje parasympatický nervový systém a pomáhá usnout.", completed: false },
    { id: 32, title: "Vyvětrej ložnici a nastav si teplotu mezi 16-19 °C", description: "Otevři okno nebo nastav termostat, aby v místnosti bylo chladněji.", completed: false },
    { id: 33, title: "Pusť si před spaním relaxační hudbu nebo bílý šum na 10 minut", description: "Lehnout si do postele s uklidňujícími zvuky pomůže rychleji usnout.", completed: false },
    { id: 34, title: "Ujdi alespoň 10 000 kroků nebo buď 30 minut aktivní", description: "Pravidelný pohyb přes den pomáhá regulovat hladinu kortizolu a zlepšuje spánek.", completed: false },
  ],
};

const TasksScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState("Stres");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const loadCategory = async () => {
      const savedCategory = await AsyncStorage.getItem("selectedCategory");
      setSelectedCategory(savedCategory || "Stres");

      const savedTasks = await AsyncStorage.getItem("tasksData");
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        setTasks(parsedTasks[savedCategory] || tasksData[savedCategory]);
      } else {
        setTasks(tasksData[savedCategory]);
      }
    };
    loadCategory();
  }, []);

  useEffect(() => {
    const loadTasks = async () => {
      const savedTasks = await AsyncStorage.getItem("tasksData");
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks)[selectedCategory] || tasksData[selectedCategory]);
      } else {
        setTasks(tasksData[selectedCategory]);
      }
    };
    loadTasks();
  }, [selectedCategory]);

  const saveTasks = async (updatedTasks) => {
    const allTasks = await AsyncStorage.getItem("tasksData");
    const parsedTasks = allTasks ? JSON.parse(allTasks) : tasksData;
    parsedTasks[selectedCategory] = updatedTasks;
    await AsyncStorage.setItem("tasksData", JSON.stringify(parsedTasks));
  };

  const toggleTask = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>ÚKOLY</Text>
      <Text style={styles.subHeader}>Změnit zaměření</Text>

      <View style={styles.filterContainer}>
        {["Stres", "Panika", "Spánek"].map((category) => (
          <TouchableOpacity
            key={category}
            style={[styles.filterButton, selectedCategory === category && styles.selectedFilterButton]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.taskList}>
        {tasks.map((task) => (
          <TouchableOpacity
            key={task.id}
            style={[styles.taskCard, task.completed && styles.taskCompleted]}
            onPress={() => toggleTask(task.id)}
          >
            <Text style={styles.taskTitle}>{task.title}</Text>
            <Text style={styles.taskDescription}>{task.description}</Text>
            {task.completed && <Text style={styles.completedText}>Splněno!</Text>}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: "center", backgroundColor: "#F5F2F4", paddingVertical: 20 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  subHeader: { fontSize: 18, marginBottom: 10, textAlign: "center" },
  filterContainer: { flexDirection: "row", marginBottom: 15 },
  filterButton: { padding: 10, borderRadius: 10, marginHorizontal: 5, backgroundColor: "#E3E1E3" },
  selectedFilterButton: { backgroundColor: "#B0B0B0" },
  taskList: { width: "90%" },
  taskCard: { 
  backgroundColor: "#E3E1E3", 
  padding: 20, 
  borderRadius: 15, 
  marginBottom: 15, 
  alignItems: "center", 
  justifyContent: "center", 
  },
  taskCompleted: { backgroundColor: "#A8E6A3" },
  taskTitle: { 
    fontSize: 16, 
    fontWeight: "bold", 
    textAlign: "center", 
  },
  taskTitleCompleted: { 
    textDecorationLine: "line-through", 
    color: "#2F7336", 
    textAlign: "center", 
  },
  taskDescription: { 
    fontSize: 14, 
    textAlign: "center", 
    marginTop: 5,
  },
  completedText: { 
    fontSize: 14, 
    color: "#2F7336", 
    marginTop: 5, 
    fontWeight: "bold", 
    textAlign: "center", 
  },
});

export default TasksScreen;
