import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>RYCHLÁ POMOC</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("ZklidnitStres")}>
          <Text style={styles.title}>ZKLIDNIT STRES ➤</Text>
          <Text style={styles.description}>
            Rychlé dechové cvičení pro uvolnění napětí a zklidnění mysli při nadměrném stresu
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("PanickaAtaka")}>
          <Text style={styles.title}>PANICKÁ ATAKA ➤</Text>
          <Text style={styles.description}>
            Dechové cvičení pro zmírnění panické ataky a navrácení pocitu klidu.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, styles.lastCard]} onPress={() => navigation.navigate("SnadneUsinani")}>
          <Text style={styles.title}>SNADNÉ USÍNÁNÍ ➤</Text>
          <Text style={styles.description}>
            Dechové cvičení pro rychlé usnutí a hlubší, kvalitnější spánek.
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F2F4",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 50,
    textAlign: "center",
  },
  card: {
    width: width * 0.9, // Fixní šířka pro všechny karty (90 % obrazovky)
    backgroundColor: "#E3E1E3",
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: height * 0.18, // Fixní výška pro všechny karty
  },
  lastCard: {
    marginBottom: 60, // Extra mezera pod poslední kartou
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
    width: "100%", // Zajistí stejné zarovnání textu
  },
  description: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    width: "100%", // Zarovnání obsahu karty
  },
});

export default HomeScreen;
