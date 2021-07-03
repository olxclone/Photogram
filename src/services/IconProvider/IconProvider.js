import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";

export default async function prepareIcons() {
  const icons = await Promise.all([
    Ionicons.getImageSource("md-home-outline", 25),
    Ionicons.getImageSource("md-home", 25),
    Ionicons.getImageSource("search", 25),
    Ionicons.getImageSource("search", 25),
    AntDesign.getImageSource("plussquareo", 25),
    AntDesign.getImageSource("plussquare", 25),
    Ionicons.getImageSource("ios-notifications-outline", 25),
    Ionicons.getImageSource("ios-notifications", 25),
    Ionicons.getImageSource("ios-people-outline", 25),
    Ionicons.getImageSource("ios-people", 25),
  ]);

  const [
    firstBottomTabIcon,
    ActiveFirstBottomTabIcon,
    secondBottomTabIcon,
    ActiveSecondBottomTabIcon,
    thirdBottomTabIcon,
    ActiveThirdBottomTabIcon,
    fourthBottomTabIcon,
    ActivefourthBottomTabIcon,
    fifthBottomTabIcon,
    ActiveFifthBottomTabIcon,
  ] = icons;

  return {
    firstBottomTabIcon,
    ActiveFirstBottomTabIcon,
    secondBottomTabIcon,
    ActiveSecondBottomTabIcon,
    thirdBottomTabIcon,
    ActiveThirdBottomTabIcon,
    fourthBottomTabIcon,
    ActivefourthBottomTabIcon,
    fifthBottomTabIcon,
    ActiveFifthBottomTabIcon,
  };
}
