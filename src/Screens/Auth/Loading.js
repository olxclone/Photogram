import React, { useEffect } from "react";
import { View } from "react-native";
import auth from "@react-native-firebase/auth";
import * as Animatable from "react-native-animatable";
import { Navigation } from "react-native-navigation";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { height } from "../../Utils/constants/styles";

export default function Loading(props) {
    Ionicons.getImageSource("search", 25),
    Ionicons.getImageSource("search", 25),
    AntDesign.getImageSource("plussquareo", 25),
    AntDesign.getImageSource("plussquare", 25),
    Ionicons.getImageSource("ios-notifications-outline", 25),
    Ionicons.getImageSource("ios-notifications", 25),
    Ionicons.getImageSource("ios-people-outline", 25),
    Ionicons.getImageSource("ios-people", 25),
    useEffect(() => {
      auth().onAuthStateChanged((user) => {
        setTimeout(() => {
          if (!user) {
            Navigation.push(props.componentId, {
              component: {
                name: "CHOOSEAUTH_SCREEN",
                id: "CHOOSEAUTH_SCREEN",
              },
            });
          } else {
            Navigation.setRoot({
              root: {
                bottomTabs: {
                  id: "MAIN_BOTTOM_TABS",
                  children: [
                    {
                      stack: {
                        children: [
                          {
                            component: {
                              name: "HOME_SCREEN",
                            },
                          },
                        ],
                        options: {
                          bottomTab: {
                            text: "Home",
                            iconWidth: 32,
                            iconInsets: {
                              top: 70,
                              left: 0,
                              bottom: 10,
                              right: 0,
                            },
                            iconHeight: 32,
                            // selectedIcon: Ionicons.getImageSource(
                            //   "home-outline",
                            //   25
                            // ),
                            // icon: Ionicons.getImageSource("home", 25),
                            selectedIcon: require("../../../assets/home.png"),
                            icon: require("../../../assets/home-outline.png"),
                          },
                        },
                      },
                    },
                    {
                      stack: {
                        children: [
                          {
                            component: {
                              name: "SEARCH_SCREEN",
                            },
                          },
                        ],
                        options: {
                          bottomTab: {
                            text: "Search",
                            iconHeight: 32,
                            iconWidth: 32,
                            titleDisplayMode: "alwaysHide",
                            animateBadge: false,
                            fontSize: 0,
                            iconInsets: {
                              top: 0,
                              left: 0,
                              bottom: 0,
                              right: 0,
                            },
                            selectedIcon: require("../../../assets/search-outline.png"),
                            icon: require("../../../assets/search-outline.png"),
                          },
                        },
                      },
                    },
                    {
                      stack: {
                        children: [
                          {
                            component: {
                              name: "POST_SCREEN",
                            },
                          },
                        ],
                        options: {
                          bottomTab: {
                            text: "Post",
                            fontSize: 0,
                            iconWidth: 32,
                            iconHeight: 32,
                            animateBadge: false,
                            iconInsets: {
                              top: 0,
                              left: 0,
                              bottom: 0,
                              right: 0,
                            },
                            icon: require("../../../assets/plus-square-outline.png"),
                            selectedIcon: require("../../../assets/plus-square.png"),
                          },
                        },
                      },
                    },
                    {
                      stack: {
                        children: [
                          {
                            component: {
                              name: "UPDATES_SCREEN",
                            },
                          },
                        ],
                        options: {
                          bottomTab: {
                            text: "Notification",
                            fontSize: 0,
                            iconWidth: 32,
                            iconHeight: 32,
                            animateBadge: false,
                            iconInsets: {
                              top: 0,
                              left: 0,
                              bottom: 0,
                              right: 0,
                            },
                            titleDisplayMode: "alwaysHide",
                            icon: require("../../../assets/bell-outline.png"),
                            selectedIcon: require("../../../assets/bell.png"),
                          },
                        },
                      },
                    },
                    {
                      stack: {
                        children: [
                          {
                            component: {
                              name: "PROFILE_SCREEN",
                            },
                          },
                        ],
                        options: {
                          bottomTab: {
                            text: "Profile",
                            fontSize: 0,
                            iconWidth: 32,
                            iconHeight: 32,
                            animateBadge: false,
                            iconInsets: {
                              top: 0,
                              left: 0,
                              bottom: 0,
                              right: 0,
                            },
                            selectedIcon: require("../../../assets/people.png"),
                            icon: require("../../../assets/people-outline.png"),
                          },
                        },
                        //
                      },
                    },
                  ],
                },
              },
            });
          }
        }, 3000);
      });
    });
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Animatable.Text
        animation="bounce"
        duration={2000}
        style={{
          fontWeight: "bold",
          fontSize: height / 12,
          fontFamily: "Roboto-Regular",
        }}
      >
        {"Photogram"}
      </Animatable.Text>
    </View>
  );
}
