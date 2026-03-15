import { useRouter } from "expo-router";
import { Appbar } from "react-native-paper";

const MainAppBar = () => {
  const router = useRouter();

  return (
    <Appbar.Header statusBarHeight={0}>
      <Appbar.BackAction onPress={() => router.back()} />
      <Appbar.Content title="Back" />
    </Appbar.Header>
  );
};

export default MainAppBar;
