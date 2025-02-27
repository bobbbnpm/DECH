import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

// Import obrazovek
import HomeScreen from "./screens/HomeScreen";
import ExercisesScreen from "./screens/ExercisesScreen";
import TasksScreen from "./screens/TasksScreen";
import ZklidnitStresScreen from "./screens/ZklidnitStresScreen";
import PanickaAtakaScreen from "./screens/PanickaAtakaScreen";
import SnadneUsinaniScreen from "./screens/SnadneUsinaniScreen";
import OnboardingScreen1 from "./screens/OnboardingScreen1";
import OnboardingScreen2 from "./screens/OnboardingScreen2";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const OnboardingStack = createStackNavigator();

// ✅ **Spodní menu (hlavní aplikace)**
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

// ✅ **Navigace pro onboarding**
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

// ✅ **Hlavní navigace aplikace**
const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(true); // ✅ Onboarding vždy při startu

  useEffect(() => {
    const resetOnboarding = async () => {
      try {
        await AsyncStorage.removeItem("hasSeenOnboarding"); // ✅ Vždy resetuj onboarding při spuštění
        setShowOnboarding(true);
      } catch (error) {
        console.error("Chyba při resetování onboardingu:", error);
      }
      setIsLoading(false);
    };

    resetOnboarding();
  }, []);

  if (isLoading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {showOnboarding ? (
          <Stack.Screen name="Onboarding">
            {() => <OnboardingNavigator setShowOnboarding={setShowOnboarding} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="TabNavigator" component={TabNavigator} /> // ✅ Navigace na hlavní aplikaci
        )}
        <Stack.Screen name="ZklidnitStres" component={ZklidnitStresScreen} />
        <Stack.Screen name="PanickaAtaka" component={PanickaAtakaScreen} />
        <Stack.Screen name="SnadneUsinani" component={SnadneUsinaniScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
