// Importuje potřebné knihovny a hooky z Reactu a dalších balíčků
import React, { useState, useEffect } from "react"; // React komponenta + hooky useState a useEffect
import { NavigationContainer } from "@react-navigation/native"; // Hlavní kontejner pro navigaci
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"; // Spodní navigační menu (tabs)
import { createStackNavigator } from "@react-navigation/stack"; // Zásobníková (stack) navigace
import AsyncStorage from "@react-native-async-storage/async-storage"; // Ukládání dat na zařízení
import { Ionicons } from "@expo/vector-icons"; // Ikony z knihovny Ionicons

// Import jednotlivých obrazovek aplikace
import HomeScreen from "./screens/HomeScreen";
import ExercisesScreen from "./screens/ExercisesScreen";
import TasksScreen from "./screens/TasksScreen";
import ZklidnitStresScreen from "./screens/ZklidnitStresScreen";
import PanickaAtakaScreen from "./screens/PanickaAtakaScreen";
import SnadneUsinaniScreen from "./screens/SnadneUsinaniScreen";
import OnboardingScreen1 from "./screens/OnboardingScreen1";
import OnboardingScreen2 from "./screens/OnboardingScreen2";
import GoodMorningDescript from "./screens/GoodMorningDescript";
import GoodMorningExercise from "./screens/GoodMorningExercise";
import DenBezStresuP from "./screens/DenBezStresuP";
import DenBezStresuC from "./screens/DenBezStresuC";
import DychaniPredSpanimP from "./screens/DychaniPredSpanimP";
import DychaniPredSpanimC from "./screens/DychaniPredSpanimC";
import ZmirneniStresuPredZkouskouP from "./screens/ZmirneniStresuPredZkouskouP";
import ZmirneniStresuPredZkouskouC from "./screens/ZmirneniStresuPredZkouskouC";
import DychaniProtiPanickymAtakamP from "./screens/DychaniProtiPanickymAtakamP";
import DychaniProtiPanickymAtakamC from "./screens/DychaniProtiPanickymAtakamC";
import JakSpravneDychatCelyDenP from "./screens/JakSpravneDychatCelyDenP";
import JakSpravneDychatCelyDenC from "./screens/JakSpravneDychatCelyDenC";
import RozdychaniPredBehemP from "./screens/RozdychaniPredBehemP";
import RozdychaniPredBehemC from "./screens/RozdychaniPredBehemC";
import WimHofovaMetodaP from "./screens/WimHofovaMetodaP";
import WimHofovaMetodaC from "./screens/WimHofovaMetodaC";
import RozdychaniPredPotapenimP from "./screens/RozdychaniPredPotapenimP";
import RozdychaniPredPotapenimC from "./screens/RozdychaniPredPotapenimC";

// Vytvoření navigačních objektů pro spodní menu a stack navigaci
const Tab = createBottomTabNavigator(); // Spodní navigace (tabs)
const Stack = createStackNavigator(); // Hlavní stack navigace
const OnboardingStack = createStackNavigator(); // Stack navigace pro onboarding

// Funkce definující spodní menu aplikace
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Rychlá pomoc") iconName = "flash";
          else if (route.name === "Cvičení") iconName = "pulse";
          else if (route.name === "Úkoly") iconName = "checkmark-done";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: { backgroundColor: "#F5F2F4" },
        tabBarActiveTintColor: "#6200EE",
        tabBarInactiveTintColor: "#808080",
      })}
    >
      <Tab.Screen name="Rychlá pomoc" component={HomeScreen} />
      <Tab.Screen name="Cvičení" component={ExercisesScreen} />
      <Tab.Screen name="Úkoly" component={TasksScreen} />
    </Tab.Navigator>
  );
};

// Navigace pro onboarding – zobrazuje se při prvním spuštění
const OnboardingNavigator = ({ setShowOnboarding }) => {
  return (
    <OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
      <OnboardingStack.Screen name="OnboardingScreen1" component={OnboardingScreen1} />
      <OnboardingStack.Screen 
        name="OnboardingScreen2" 
        children={(props) => <OnboardingScreen2 {...props} setShowOnboarding={setShowOnboarding} />} 
      />
    </OnboardingStack.Navigator>
  );
};

// Hlavní komponenta aplikace
const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Po spuštění zkontroluje, zda uživatel viděl onboarding
    const checkOnboarding = async () => {
      try {
        const seen = await AsyncStorage.getItem("hasSeenOnboarding"); // Načte stav z úložiště
        setShowOnboarding(seen !== "true"); // Pokud nebyl onboarding zobrazen, nastaví na true
      } catch (error) {
        console.error("Chyba při načítání onboardingu:", error); // Vypíše chybu v konzoli
      }
      setIsLoading(false); // Ukončí načítání
    };

    checkOnboarding(); // Zavolání funkce při prvním renderu
  }, []); // Prázdné pole = jen při načtení komponenty

  if (isLoading) return null; // Pokud se načítá, nevracej nic

  return (
    // Hlavní navigační kontejner celé aplikace
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {showOnboarding ? (
          <Stack.Screen name="Onboarding">
            {() => <OnboardingNavigator setShowOnboarding={setShowOnboarding} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
        )}
        <Stack.Screen name="ZklidnitStres" component={ZklidnitStresScreen} />
        <Stack.Screen name="PanickaAtaka" component={PanickaAtakaScreen} />
        <Stack.Screen name="SnadneUsinani" component={SnadneUsinaniScreen} />
        <Stack.Screen name="GoodMorningDescript" component={GoodMorningDescript} />
        <Stack.Screen name="GoodMorningExercise" component={GoodMorningExercise} />
        <Stack.Screen name="DenBezStresuP" component={DenBezStresuP} />
        <Stack.Screen name="DenBezStresuC" component={DenBezStresuC} />
        <Stack.Screen name="DychaniPredSpanimP" component={DychaniPredSpanimP} />
        <Stack.Screen name="DychaniPredSpanimC" component={DychaniPredSpanimC} />
        <Stack.Screen name="ZmirneniStresuPredZkouskouP" component={ZmirneniStresuPredZkouskouP} />
        <Stack.Screen name="ZmirneniStresuPredZkouskouC" component={ZmirneniStresuPredZkouskouC} />
        <Stack.Screen name="DychaniProtiPanickymAtakamP" component={DychaniProtiPanickymAtakamP} />
        <Stack.Screen name="DychaniProtiPanickymAtakamC" component={DychaniProtiPanickymAtakamC} />
        <Stack.Screen name="JakSpravneDychatCelyDenP" component={JakSpravneDychatCelyDenP} />
        <Stack.Screen name="JakSpravneDychatCelyDenC" component={JakSpravneDychatCelyDenC} />
        <Stack.Screen name="RozdychaniPredBehemP" component={RozdychaniPredBehemP} />
        <Stack.Screen name="RozdychaniPredBehemC" component={RozdychaniPredBehemC} />
        <Stack.Screen name="WimHofovaMetodaP" component={WimHofovaMetodaP} />
        <Stack.Screen name="WimHofovaMetodaC" component={WimHofovaMetodaC} />
        <Stack.Screen name="RozdychaniPredPotapenimP" component={RozdychaniPredPotapenimP} />
        <Stack.Screen name="RozdychaniPredPotapenimC" component={RozdychaniPredPotapenimC} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Export hlavní komponenty aplikace
export default App;
