import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    }}
    >
      <StatusBar style="dark" />
      <Text>Edit app/index.tsx to edit this screen. hiiii</Text>
      <Link href={"/about"}>Go to About</Link>
    </View>
  );
}
