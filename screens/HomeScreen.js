import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";

// Získání šířky obrazovky zařízení pro responzivní stylování
const { width } = Dimensions.get("window");

// Komponenta úvodní obrazovky s výběrem typu pomoci
const HomeScreen = () => {
  const navigation = useNavigation(); // Hook pro ovládání navigace

  return (
    <View style={styles.container}>
      {/* Hlavní nadpis */}
      <Text style={styles.header}>VYBER S ČÍM POTŘEBUJEŠ POMOCI</Text>

      {/* Scrollovatelný výběr karet s jednotlivými možnostmi cvičení */}
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Karta pro stres */}
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("ZklidnitStres")}>
          <Text style={styles.title}>ZKLIDNIT STRES ➤</Text>
          <Text style={styles.description}>
            Dechové cvičení pro uvolnění napětí a zklidnění mysli při nadměrném stresu.
          </Text>
        </TouchableOpacity>

        {/* Karta pro panickou ataku */}
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("PanickaAtaka")}>
          <Text style={styles.title}>PANICKÁ ATAKA ➤</Text>
          <Text style={styles.description}>
            Dechové cvičení pro zmírnění panické ataky a navrácení pocitu klidu.
          </Text>
        </TouchableOpacity>

        {/* Karta pro spánek */}
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("SnadneUsinani")}>
          <Text style={styles.title}>SNADNÉ USÍNÁNÍ ➤</Text>
          <Text style={styles.description}>
            Dechové cvičení pro rychlé usnutí a hlubší, kvalitnější spánek.
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// Stylování celé obrazovky
const styles = StyleSheet.create({
  container: {
    flex: 1, // Zajišťuje, že komponenta zabírá celé dostupné místo
    alignItems: "center", // Zarovnání obsahu na střed horizontálně
    backgroundColor: "#f7f4fb", // Světlé pozadí
    paddingTop: 40, // Horní mezera
    paddingBottom: 30, // Spodní mezera
  },
  header: {
    fontSize: 24, // Velikost písma
    fontWeight: "bold", // Tučný text
    marginBottom: 25, // Vzdálenost od dalších prvků
    color: "#5A189A", // Fialová barva textu
    textAlign: "center", // Zarovnání na střed
  },
  scrollContainer: {
    width: "100%", // Šířka kontejneru
    alignItems: "center", // Zarovnání všech prvků na střed
    paddingBottom: 50, // Spodní mezera pro pohodlné scrollování
  },
  card: {
    width: width * 0.9, // 90 % šířky obrazovky
    backgroundColor: "#ECE4FF", // Světle fialové pozadí karty
    padding: 27, // Vnitřní odsazení
    borderRadius: 15, // Zaoblené rohy
    marginBottom: 20, // Vzdálenost mezi kartami
    alignItems: "center", // Zarovnání textu
    shadowColor: "#5A189A", // Barva stínu
    shadowOffset: { width: 0, height: 3 }, // Směr stínu
    shadowOpacity: 0.2, // Průhlednost stínu
    shadowRadius: 1, // Rozostření stínu
    elevation: 5, // Výška stínu pro Android
  },
  title: {
    fontSize: 23, // Velikost písma pro název
    fontWeight: "bold", // Tučný název
    marginBottom: 5, // Mezery pod názvem
    textAlign: "center", // Zarovnání na střed
    color: "#4A148C", // Tmavě fialová barva textu
  },
  description: {
    fontSize: 18, // Velikost textu popisu
    color: "#6B728E", // Neutrální barva textu
    textAlign: "center", // Zarovnání na střed
    marginBottom: 10, // Spodní mezera
  },
});

// Export komponenty pro použití v aplikaci
export default HomeScreen;