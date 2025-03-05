import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>VYBER S ČÍM POTŘEBUJEŠ POMOCI</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("ZklidnitStres")}>
          <Text style={styles.title}>ZKLIDNIT STRES ➤</Text>
          <Text style={styles.description}>
            Dechové cvičení pro uvolnění napětí a zklidnění mysli při nadměrném stresu.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("PanickaAtaka")}>
          <Text style={styles.title}>PANICKÁ ATAKA ➤</Text>
          <Text style={styles.description}>
            Dechové cvičení pro zmírnění panické ataky a navrácení pocitu klidu.
          </Text>
        </TouchableOpacity>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f7f4fb",
    paddingTop: 40, // Přidal jsem větší horní padding místo SafeAreaView
    paddingBottom: 30, // Přidal jsem dolní padding, aby se obsah neposunul pod navigaci
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 25,
    color: "#5A189A",
    textAlign: "center",
  },
  scrollContainer: {
    width: "100%",
    alignItems: "center",
    paddingBottom: 50,
  },
  card: {
    width: width * 0.9,
    backgroundColor: "#ECE4FF",
    padding: 27,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#5A189A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 5,
  },
  title: {
    fontSize: 23,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
    color: "#4A148C",
  },
  description: {
    fontSize: 18,
    color: "#6B728E",
    textAlign: "center",
    marginBottom: 10,
  },
});

export default HomeScreen;
