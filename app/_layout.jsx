import React, { useState, useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "../redux/store"; // Adjust path to your store file
import { themeContext } from "./theme/themeContext";
import { theme } from "./theme/theme";
import { Stack } from "expo-router";
import { EventRegister } from "react-native-event-listeners";

export default function RootLayout() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const listener = EventRegister.addEventListener("ChangeTheme", (data) => {
      setDarkMode(data);
    });
    return () => EventRegister.removeAllListeners(listener);
  }, []);

  return (
    <Provider store={store}>
      <themeContext.Provider value={darkMode ? theme.dark : theme.light}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="(drawer)/(tabs)"
            redirect={!store.getState().auth.isAuthenticated}
          />
          <Stack.Screen
            name="index"
            redirect={store.getState().auth.isAuthenticated}
          />
        </Stack>
      </themeContext.Provider>
    </Provider>
  );
}