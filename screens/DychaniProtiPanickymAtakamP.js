import React, { useState } from "react"; // Import Reactu a hooku useState pro práci se stavem
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native"; // Import základních komponent z React Native
import { Ionicons } from "@expo/vector-icons"; // Import ikon z knihovny Expo
import { useNavigation } from "@react-navigation/native"; // Hook pro navigaci mezi obrazovkami
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"; // Komponenta a hook pro bezpečné oblasti (např. pro iPhony s výřezem)

const { width, height } = Dimensions.get("window"); // Získání šířky a výšky okna zařízení

const DychaniProtiPanickymAtakamP = () => {
  const navigation = useNavigation(); // Hook pro navigaci mezi obrazovkami
  const [selectedTime, setSelectedTime] = useState(5); // Výchozí hodnota 5 minut
  const insets = useSafeAreaInsets(); // Získání bezpečných okrajů obrazovky

  return (
    // Bezpečné zobrazení komponenty s ohledem na výřezy
    <SafeAreaView style={[styles.safeContainer, { 
        paddingTop: insets.top, // Bezpečné odsazení odshora
        paddingBottom: insets.bottom, // Bezpečné odsazení odspoda
        paddingLeft: insets.left, // Bezpečné odsazení zleva
        paddingRight: insets.right // Bezpečné odsazení zprava
        }]}> 

      {/* Hlavní kontejner */}
      <View style={styles.container}>

        {/* Hlavička s tlačítkem zpět a nadpisem */}
        <View style={styles.header}>
          {/* Tlačítko pro návrat zpět */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            {/* Ikona šipky zpět */}
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          {/* Nadpis obrazovky */}
          <Text style={styles.title}>DÝCHÁNÍ PROTI{"\n"}PANICKÝM ATAKÁM</Text>
        </View>

        {/* Box s popisem dechového cvičení */}
        <View style={styles.descriptionBox}>
          <Text style={styles.description}>
            Tato dýchací technika je určena ke zklidnění při panických atakách.
            Při této dechové technice je doporučeno dýchat do spojených dlaní přiložených těsně před ú
            sta a nos.
            Nádech nosem trvá 4 sekundy, dech se krátce zadrží na 2 sekundy a následuje pomalý výdech ústy do dlaní po dobu 6 sekund. {"\n\n"}
            Tím se obnovuje hladina oxidu uhličitého v krvi, což pomáhá zmírnit příznaky jako je dušnost, závratě nebo mravenčení.
          </Text>
        </View>

        {/* Výběr délky cvičení */}
        <View style={styles.buttonGroup}>
          {[2, 5, 10].map((time) => (
            <TouchableOpacity
              key={time}
              style={[styles.timeButton, selectedTime === time && styles.timeButtonSelected]}
              onPress={() => setSelectedTime(time)}>
              {/* Text s počtem minut */}
              <Text style={[styles.timeButtonText, selectedTime === time && styles.timeButtonTextSelected]}>
                {time} min
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tlačítko pro pokračování */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate("DychaniProtiPanickymAtakamC", { selectedTime })}>
          <Text style={styles.startButtonText}>Pokračovat</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: { 
    flex: 1, // Zajištění, že komponenta zabere celou výšku obrazovky
    backgroundColor: "#F5F2F4" // Světlé pozadí
  },
  container: {
    flex: 1, // Zajištění plné výšky kontejneru
    backgroundColor: "#F5F2F4", // Stejné světlé pozadí
    alignItems: "center", // Zarovnání obsahu na střed vodorovně
    justifyContent: "center", // Zarovnání obsahu na střed svisle
    paddingHorizontal: width * 0.05, // Vnitřní horizontální odsazení
  },
  header: { 
    flexDirection: "row", // Rozložení prvků vedle sebe
    alignItems: "center", // Zarovnání prvků na střed svisle
    justifyContent: "center", // Zarovnání na střed vodorovně
    width: "100%", // Šířka 100 % kontejneru
    position: "absolute", // Absolutní pozice
    top: height * 0.03, // Odsazení od horního okraje
  },
  backButton: { 
    position: "absolute", // Umístění tlačítka vlevo
    left: width * 0.05, // Odsazení zleva
    backgroundColor: "#9B5DE5", // Fialová barva pozadí
    borderRadius: 50, // Zaoblení rohů do kruhu
    padding: 12, // Vnitřní odsazení
    shadowColor: "#000", // Barva stínu
    shadowOffset: { width: 0, height: 2 }, // Posunutí stínu
    shadowOpacity: 0.2, // Průhlednost stínu
    shadowRadius: 4, // Rozmazání stínu
    elevation: 3, // Stín pro Android
  },
  title: {
    fontSize: width * 0.05, // Velikost písma podle šířky obrazovky
    fontWeight: "bold", // Tučné písmo
    textAlign: "center", // Zarovnání na střed
    color: "#333", // Tmavě šedá barva textu
    marginLeft: width * 0.02, // Odsazení zleva
    marginTop: height * 0.02, // Odsazení shora
  },
  description: {
    fontSize: width * 0.05, // Velikost textu
    textAlign: "center", // Zarovnání na střed
    color: "#444", // Barva textu
  },
  descriptionBox: {
    borderWidth: 2, // Tloušťka okraje
    borderColor: "#9B5DE5", // Fialová barva okraje
    borderRadius: 12, // Zaoblení rohů
    padding: width * 0.05, // Vnitřní odsazení
    marginTop: height * 0.15, // Vnější horní mezera
    marginBottom: height * 0.03, // Vnější dolní mezera
    backgroundColor: "#EDE7F6", // Světle fialové pozadí
    width: "90%", // Šířka boxu
    alignSelf: "center", // Zarovnání na střed horizontálně
  },
  buttonGroup: {
    flexDirection: "row", // Rozložení tlačítek vedle sebe
    justifyContent: "center", // Zarovnání na střed
    gap: width * 0.03, // Mezery mezi tlačítky
    marginBottom: height * 0.04, // Vnější spodní mezera
  },
  timeButton: {
    paddingVertical: height * 0.015, // Svislé vnitřní odsazení
    paddingHorizontal: width * 0.06, // Vodorovné vnitřní odsazení
    backgroundColor: "#B39DDB", // Výchozí barva tlačítka
    borderRadius: 12, // Zaoblení rohů
    elevation: 3, // Stín pro Android
  },
  timeButtonSelected: {
    backgroundColor: "#9B5DE5", // Barva po výběru tlačítka
  },
  timeButtonText: {
    color: "#FFF", // Barva textu
    fontSize: width * 0.04, // Velikost písma
    fontWeight: "bold", // Tučné písmo
  },
  startButton: {
    backgroundColor: "#9B5DE5", // Fialová barva tlačítka
    paddingVertical: height * 0.02, // Vnitřní svislé odsazení
    borderRadius: 12, // Zaoblení rohů
    width: "85%", // Šířka tlačítka
    alignItems: "center", // Zarovnání obsahu na střed
    shadowColor: "#000", // Barva stínu
    shadowOffset: { width: 0, height: 2 }, // Směr stínu
    shadowOpacity: 0.3, // Průhlednost stínu
    shadowRadius: 5, // Rozostření stínu
    elevation: 4, // Výška stínu pro Android
  },
  startButtonText: {
    color: "#FFF", // Barva textu
    fontSize: width * 0.05, // Velikost písma
    fontWeight: "bold", // Tučné písmo
  },
});

export default DychaniProtiPanickymAtakamP; // Export výchozí komponenty
