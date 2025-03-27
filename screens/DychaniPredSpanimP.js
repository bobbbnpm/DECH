import React, { useState } from "react"; // Import Reactu a hooku useState pro práci se stavem
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native"; // Import základních komponent z React Native
import { Ionicons } from "@expo/vector-icons"; // Import ikon z knihovny Expo
import { useNavigation } from "@react-navigation/native"; // Import hooku pro navigaci mezi obrazovkami
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"; // Import pro bezpečné zobrazení s ohledem na notche atd.

const { width, height } = Dimensions.get("window"); // Získání rozměrů obrazovky zařízení

const DychaniPredSpanimP = () => {
  const navigation = useNavigation(); // Hook pro navigaci
  const [selectedTime, setSelectedTime] = useState(5); // Stav pro uchování zvolené délky cvičení
  const insets = useSafeAreaInsets(); // Získání bezpečných okrajů zařízení

  return (
    <SafeAreaView style={[styles.safeContainer, {
        paddingTop: insets.top, // Bezpečné odsazení odshora
        paddingBottom: insets.bottom, // Bezpečné odsazení odspoda
        paddingLeft: insets.left, // Bezpečné odsazení zleva
        paddingRight: insets.right // Bezpečné odsazení zprava
        }]}> 

      {/* Hlavní kontejner obsahu */}
      <View style={styles.container}>

        {/* Hlavička s tlačítkem zpět a nadpisem */}
        <View style={styles.header}>
          {/* Tlačítko pro návrat zpět */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            {/* Ikona šipky zpět */}
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>

          {/* Nadpis obrazovky */}
          <Text style={styles.title}>DÝCHÁNÍ PŘED SPANÍM</Text>
        </View>

        {/* Box s popisným textem dechové techniky */}
        <View style={styles.descriptionBox}>
          <Text style={styles.description}>
            Tato dechová technika se doporučuje především před spaním, protože pomáhá zpomalit srdeční rytmus a připravit tělo na hluboký a klidný spánek.
            Nádech trvá 4 sekundy, následuje zadržení dechu na 7 sekund a poté pomalý výdech po dobu 8 sekund.{"\n\n"}
            Díky aktivaci parasympatického nervového systému snižuje stres, navozuje pocit uvolnění a usnadňuje usínání, zejména u lidí trpících nespavostí nebo úngstí.
          </Text>
        </View>

        {/* Skupina tlačítek pro výběr délky cvičení */}
        <View style={styles.buttonGroup}>
          {[2, 5, 10].map((time) => (
            <TouchableOpacity
              key={time} // Klíč pro iteraci
              style={[styles.timeButton, selectedTime === time && styles.timeButtonSelected]} // Styl podle zvolené hodnoty
              onPress={() => setSelectedTime(time)} // Při kliknutí nastavíme délku
            >
              <Text style={[styles.timeButtonText, selectedTime === time && styles.timeButtonTextSelected]}>
                {time} min
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tlačítko pro pokračování na další obrazovku */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate("DychaniPredSpanimC", { selectedTime })}
        >
          <Text style={styles.startButtonText}>Pokračovat</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: { 
    flex: 1, // Zabere celou obrazovku
    backgroundColor: "#F5F2F4" // Barva pozadí
  },
  container: {
    flex: 1, // Flexbox kontejner
    backgroundColor: "#F5F2F4", // Barva pozadí
    alignItems: "center", // Zarovnání obsahu na střed
    justifyContent: "center", // Vertikální zarovnání
    paddingHorizontal: width * 0.05, // Odsazení z boku
  },
  header: { 
    flexDirection: "row", // Prvky vedle sebe
    alignItems: "center", // Zarovnání na střed
    justifyContent: "center", // Zarovnání na střed
    width: "100%", // Plná šířka
    position: "absolute", // Absolutní pozice
    top: height * 0.03, // Odsazení shora
  },
  backButton: { 
    position: "absolute", // Umístění vlevo
    left: width * 0.05, // Vzdálenost od kraje
    backgroundColor: "#9B5DE5", // Barva pozadí
    borderRadius: 50, // Kulaté rohy
    padding: 12, // Vnitřní odsazení
    shadowColor: "#000", // Barva stínu
    shadowOffset: { width: 0, height: 2 }, // Směr stínu
    shadowOpacity: 0.2, // Průhlednost stínu
    shadowRadius: 4, // Rozmazání stínu
    elevation: 3, // Android stín
  },
  title: {
    fontSize: width * 0.05, // Velikost textu
    fontWeight: "bold", // Tučný text
    textAlign: "center", // Zarovnání na střed
    color: "#333", // Barva textu
    marginLeft: width * 0.08, // Posun doprava kvůli tlačítku
  },
  description: {
    fontSize: width * 0.05, // Velikost textu
    textAlign: "center", // Zarovnání textu
    color: "#444", // Barva textu
  },
  descriptionBox: {
    borderWidth: 2, // Tloušťka okraje
    borderColor: "#9B5DE5", // Barva okraje
    borderRadius: 12, // Zaoblené rohy
    padding: width * 0.05, // Vnitřní mezera
    marginVertical: height * 0.05, // Svislé mezery
    backgroundColor: "#EDE7F6", // Barva pozadí boxu
    width: "90%", // Šířka boxu
    alignSelf: "center", // Zarovnání na střed
    marginBottom: height * 0.04, // Spodní mezera
    marginTop: height * 0.1, // Horní mezera
  },
  buttonGroup: {
    flexDirection: "row", // Rozložení vedle sebe
    justifyContent: "center", // Zarovnání na střed
    gap: width * 0.03, // Mezera mezi tlačítky
    marginBottom: height * 0.04, // Spodní mezera
  },
  timeButton: {
    paddingVertical: height * 0.015, // Vnitřní odsazení nahoru/dolu
    paddingHorizontal: width * 0.06, // Vnitřní odsazení do stran
    backgroundColor: "#B39DDB", // Barva pozadí tlačítka
    borderRadius: 12, // Zaoblení rohů
    elevation: 3, // Stín pro Android
  },
  timeButtonSelected: {
    backgroundColor: "#9B5DE5", // Barva vybraného tlačítka
  },
  timeButtonText: {
    color: "#FFF", // Barva textu
    fontSize: width * 0.04, // Velikost písma
    fontWeight: "bold", // Tučný text
  },
  startButton: {
    backgroundColor: "#9B5DE5", // Barva pozadí tlačítka
    paddingVertical: height * 0.02, // Vnitřní odsazení
    borderRadius: 12, // Zaoblení rohů
    width: "85%", // Šířka tlačítka
    alignItems: "center", // Zarovnání obsahu
    shadowColor: "#000", // Barva stínu
    shadowOffset: { width: 0, height: 2 }, // Směr stínu
    shadowOpacity: 0.3, // Průhlednost stínu
    shadowRadius: 5, // Rozostření stínu
    elevation: 4, // Stín na Androidu
  },
  startButtonText: {
    color: "#FFF", // Barva textu
    fontSize: width * 0.05, // Velikost textu
    fontWeight: "bold", // Tučný text
  },
});

export default DychaniPredSpanimP; // Export hlavní komponenty
