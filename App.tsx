import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainEstimator from "./src/screens/MainEstimator";
import HistoryScreen from "./src/screens/HistoryScreen";
import HistoryDetailScreen from "./src/screens/HistoryDetailScreen";

type RootStackParamList = {
  Home: undefined;
  History: undefined;
  HistoryDetail: { estimate: any };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      {/* @ts-ignore - React Navigation 7.x type issue with id prop */}
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={MainEstimator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={{ title: "History" }}
        />
        <Stack.Screen
          name="HistoryDetail"
          component={HistoryDetailScreen}
          options={{ title: "Estimate Details" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
