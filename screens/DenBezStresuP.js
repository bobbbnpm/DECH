import React, { useState } from "react"; // Import Reactu a hooku useState pro stav
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native"; // Import základních komponent pro rozvržení a stylování
import { Ionicons } from "@expo/vector-icons"; // Import ikon z knihovny Expo
import { useNavigation } from "@react-navigation/native"; // Hook pro navigaci mezi obrazovkami
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"; // Komponenta a hook pro bezpečné oblasti

const { width, height } = Dimensions.get("window"); // Získání šířky a výšky obrazovky

const DenBezStresuP = () => {
  const navigation = useNavigation(); // Navigace
  const [selectedTime, setSelectedTime] = useState(5); // Výchozí délka cvičení: 5 minut
  const insets = useSafeAreaInsets(); // Okraje zařízení (notche atd.)

  return (
    <SafeAreaView style={[styles.safeContainer, {
      paddingTop: insets.top, // Odsazení od horního okraje zařízení
      paddingBottom: insets.bottom, // Odsazení od spodního okraje
      paddingLeft: insets.left, // Odsazení zleva
      paddingRight: insets.right // Odsazení zprava
    }]}> 

      {/* Hlavní kontejner obrazovky */}
      <View style={styles.container}> 
        {/* Hlavička se šipkou zpět a nadpisem */}
        <View style={styles.header}> 
          {/* Tlačítko zpět */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}> 
            {/* Ikona šipky */}
            <Ionicons name="arrow-back" size={24} color="#FFF" /> 
          </TouchableOpacity>
          {/* Nadpis obrazovky */}
          <Text style={styles.title}>DEN BEZ STRESU</Text> 
        </View>

        {/* Box s popisem dechového cvičení */}
        <View style={styles.descriptionBox}> 
          <Text style={styles.description}>
            Tato dechová technika je založená na rovnoměrném rytmu.
            Nádech trvá 4 sekundy, poté následuje zadržení dechu na 4 sekundy, výdech po dobu 4 sekund a opět zadržení na 4 sekundy.
            Tento cyklus se několikrát opakuje.{"\n\n"}
            Technika napomáhá stabilizaci srdečního tepu, snižuje hladinu stresového hormonu a podporuje vnitřní klid, soustředění a mentální odolnost v náročných nebo stresových situacích během dne.
          </Text>
        </View>

        {/* Skupina tlačítek pro výběr délky */}
        <View style={styles.buttonGroup}>
          {[2, 5, 10].map((time) => (
            <TouchableOpacity
              key={time}
              style={[styles.timeButton, selectedTime === time && styles.timeButtonSelected]} // Zvýraznění vybraného tlačítka
              onPress={() => setSelectedTime(time)}>
              <Text style={[styles.timeButtonText, selectedTime === time && styles.timeButtonTextSelected]}>
                {time} min
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.startButton} // Tlačítko pro pokračování
          onPress={() => navigation.navigate("DenBezStresuC", { selectedTime })}>
          <Text style={styles.startButtonText}>Pokračovat</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: { 
    flex: 1, // Zabírá celou výšku obrazovky
    backgroundColor: "#F5F2F4" // Světlé pozadí
  },
  container: {
    flex: 1, // Zabírá celý dostupný prostor
    backgroundColor: "#F5F2F4", // Stejné světlé pozadí
    alignItems: "center", // Zarovnání obsahu na střed vodorovně
    justifyContent: "center", // Zarovnání obsahu na střed svisle
    paddingHorizontal: width * 0.05, // Vnitřní odsazení zleva a zprava
  },
  header: { 
    flexDirection: "row", // Rozložení prvků vedle sebe
    alignItems: "center", // Zarovnání prvků na střed svisle
    justifyContent: "center", // Zarovnání na střed vodorovně
    width: "100%", // Celá šířka
    position: "absolute", // Absolutní pozice
    top: height * 0.03, // Odsazení shora
  },
  backButton: { 
    position: "absolute", // Umístění tlačítka vlevo
    left: width * 0.05, // Odsazení zleva
    backgroundColor: "#9B5DE5", // Fialová barva pozadí
    borderRadius: 50, // Kulaté rohy
    padding: 12, // Vnitřní odsazení
    shadowColor: "#000", // Barva stínu
    shadowOffset: { width: 0, height: 2 }, // Směr stínu
    shadowOpacity: 0.2, // Průhlednost stínu
    shadowRadius: 4, // Rozostření stínu
    elevation: 3, // Stín na Androidu
  },
  title: {
    fontSize: width * 0.06, // Velikost nadpisu
    fontWeight: "bold", // Tučný text
    textAlign: "center", // Zarovnání na střed
    color: "#333", // Tmavě šedá barva
  },
  description: {
    fontSize: width * 0.045, // Velikost textu
    textAlign: "center", // Zarovnání na střed
    color: "#444", // Barva textu
  },
  descriptionBox: {
    borderWidth: 2, // Tloušťka okraje
    borderColor: "#9B5DE5", // Barva okraje
    borderRadius: 12, // Zaoblení rohů
    padding: width * 0.05, // Vnitřní odsazení
    marginVertical: height * 0.05, // Vnější odsazení vertikálně
    backgroundColor: "#EDE7F6", // Světle fialové pozadí
    width: "90%", // Šířka boxu
    alignSelf: "center", // Zarovnání na střed
  },
  buttonGroup: {
    flexDirection: "row", // Rozložení tlačítek vedle sebe
    justifyContent: "center", // Zarovnání na střed
    gap: width * 0.03, // Mezera mezi tlačítky
    marginBottom: height * 0.04, // Vnější spodní mezera
  },
  timeButton: {
    paddingVertical: height * 0.015, // Svislé vnitřní odsazení
    paddingHorizontal: width * 0.06, // Vodorovné vnitřní odsazení
    backgroundColor: "#B39DDB", // Výchozí barva tlačítka
    borderRadius: 12, // Zaoblení
    elevation: 3, // Stín na Androidu
  },
  timeButtonSelected: {
    backgroundColor: "#9B5DE5", // Barva při výběru tlačítka
  },
  timeButtonText: {
    color: "#FFF", // Barva textu
    fontSize: width * 0.04, // Velikost textu
    fontWeight: "bold", // Tučný text
  },
  startButton: {
    backgroundColor: "#9B5DE5", // Fialové tlačítko
    paddingVertical: height * 0.02, // Svislé vnitřní odsazení
    borderRadius: 12, // Zaoblení rohů
    width: "85%", // Šířka tlačítka
    alignItems: "center", // Zarovnání obsahu na střed
    shadowColor: "#000", // Barva stínu
    shadowOffset: { width: 0, height: 2 }, // Směr stínu
    shadowOpacity: 0.3, // Průhlednost stínu
    shadowRadius: 5, // Rozmazání stínu
    elevation: 4, // Stín pro Android
  },
  startButtonText: {
    color: "#FFF", // Barva textu
    fontSize: width * 0.05, // Velikost písma
    fontWeight: "bold", // Tučný text
  },
});

export default DenBezStresuP; // Export komponenty
