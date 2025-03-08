import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ConfettiCannon from "react-native-confetti-cannon";

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
  const [confettiPosition, setConfettiPosition] = useState(null);
  const confettiRef = useRef(null);

  useEffect(() => {
    const loadCategory = async () => {
      const savedCategory = await AsyncStorage.getItem("selectedCategory");
      if (savedCategory) {
        setSelectedCategory(savedCategory);
      }
    };
    loadCategory();
  }, []);

  useEffect(() => {
    const loadTasks = async () => {
      const savedTasks = await AsyncStorage.getItem("tasksData");
      setTasks(savedTasks ? JSON.parse(savedTasks)[selectedCategory] : []);
    };
    loadTasks();
  }, [selectedCategory]);

  const changeCategory = async (category) => {
    setSelectedCategory(category);
    await AsyncStorage.setItem("selectedCategory", category);
  };

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
  };

  return (
    <View style={styles.container}>

      {/* 📌 nad vybranou kategorií */}
      <View style={styles.filterWrapper}>
        {["Stres", "Panika", "Spánek"].map((category) => (
          <View key={category} style={styles.filterColumn}>
            {selectedCategory === category && <Text style={styles.pin}>📌</Text>}
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedCategory === category && styles.selectedFilterButton,
                styles.loweredCategory
              ]}
              onPress={() => changeCategory(category)}
            >
              <Text style={styles.filterText}>{category}</Text>
            </TouchableOpacity>
          </View>
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
  container: {
    flex: 1,
    backgroundColor: "#f7f4fb",
    alignItems: "center",
    paddingTop: 20, 
  },
  filterWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  filterColumn: {
    alignItems: "center",
    marginHorizontal: 8,
  },
  pin: {
    fontSize: 20,
    marginBottom: 3,
  },
  loweredCategory: {
    marginTop: 10, 
  },
  filterButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#D6C2F0",
  },
  selectedFilterButton: {
    backgroundColor: "#9B5DE5",
  },
  filterText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  taskList: {
    width: "90%",
    alignItems: "center",
  },
  taskCard: {
    width: "100%", 
    maxWidth: 350,
    minWidth: 350,
    backgroundColor: "#ECE4FF",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    alignSelf: "center", 
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  taskCompleted: {
    backgroundColor: "#C7F9CC",
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "#4A148C",
  },
  taskTitleCompleted: {
    textDecorationLine: "line-through",
    color: "#2F7336",
  },
  taskDescription: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
    color: "#6B728E",
  },
  completedText: {
    fontSize: 14,
    color: "#2F7336",
    marginTop: 5,
    fontWeight: "bold",
  },
});

export default TasksScreen;