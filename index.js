import { Navigation } from "react-native-navigation";
import CodePush from "react-native-code-push";
import {
  FORGOT_SCREEN,
  FOLLOWING,
  EDITPROFILE_SCREEN,
  POST_SCREEN,
  PROFILE_SCREEN,
  IMAGEDETIALS_SCREEN,
  UPDATES_SCREEN,
  HOME_SCREEN,
  LOADING_SCREEN,
  CHATROOM_SCREEN,
  ONBOARDING_SCREEN,
  COMMENTS_SCREEN,
  SEARCH_SCREEN,
  CHOOSEAUTH_SCREEN,
  SIGNIN_SCREEN,
  SIGNUP_SCREEN,
} from "./src/Screens";
import { LogBox } from "react-native";

let CodePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_START,
};

Navigation.registerComponent("HOME_SCREEN", () =>
  CodePush(CodePushOptions)(HOME_SCREEN)
);
Navigation.registerComponent("PROFILE_SCREEN", () =>
  CodePush(CodePushOptions)(PROFILE_SCREEN)
);
Navigation.registerComponent("COMMENTS_SCREEN", () =>
  CodePush(CodePushOptions)(COMMENTS_SCREEN)
);
Navigation.registerComponent("SIGNUP_SCREEN", () =>
  CodePush(CodePushOptions)(SIGNUP_SCREEN)
);
Navigation.registerComponent("SIGNIN_SCREEN", () =>
  CodePush(CodePushOptions)(SIGNIN_SCREEN)
);
Navigation.registerComponent("HOME_PROFILE_SCREEN", () =>
  CodePush(CodePushOptions)(PROFILE_SCREEN)
);
Navigation.registerComponent("POST_SCREEN", () =>
  CodePush(CodePushOptions)(POST_SCREEN)
);
Navigation.registerComponent("FOLLOWING", () =>
  CodePush(CodePushOptions)(FOLLOWING)
);
Navigation.registerComponent("EDITPROFILE_SCREEN", () =>
  CodePush(CodePushOptions)(EDITPROFILE_SCREEN)
);
Navigation.registerComponent("PROFILE_SCREEN", () =>
  CodePush(CodePushOptions)(PROFILE_SCREEN)
);
Navigation.registerComponent("IMAGEDETIALS_SCREEN", () =>
  CodePush(CodePushOptions)(IMAGEDETIALS_SCREEN)
);
Navigation.registerComponent("LOADING_SCREEN", () =>
  CodePush(CodePushOptions)(LOADING_SCREEN)
);
Navigation.registerComponent("UPDATES_SCREEN", () =>
  CodePush(CodePushOptions)(UPDATES_SCREEN)
);
Navigation.registerComponent("CHATROOM_SCREEN", () =>
  CodePush(CodePushOptions)(CHATROOM_SCREEN)
);
Navigation.registerComponent("SEARCH_SCREEN", () =>
  CodePush(CodePushOptions)(SEARCH_SCREEN)
);
Navigation.registerComponent("FORGOT_SCREEN", () =>
  CodePush(CodePushOptions)(FORGOT_SCREEN)
);
Navigation.registerComponent("CHOOSEAUTH_SCREEN", () =>
  CodePush(CodePushOptions)(CHOOSEAUTH_SCREEN)
);
Navigation.registerComponent("ONBOARDING_SCREEN", () =>
  CodePush(CodePushOptions)(ONBOARDING_SCREEN)
);

LogBox.ignoreAllLogs()

const LoginRoot = {
  root: {
    stack: {
      children: [
        {
          component: {
            name: "LOADING_SCREEN",
          },
        },
      ],
    },
  },
};

Navigation.events().registerAppLaunchedListener(async () => {
  Navigation.setRoot(LoginRoot);
});

PROFILE_SCREEN.options =  {

}

Navigation.setDefaultOptions({
  topBar: {
    visible: false,
    _height: 0,
    drawBehind: true,
  },
  bottomTabs: {
    animate: false,
    fontSize: 0,
    titleDisplayMode: "alwaysHide",
    animateTabSelection: false,
    hideShadow: true,
  },
  bottomTab: {
    disableSelectedIconTint: true,
    animateBadge: false,
    selectTabOnPress: false,
  },
});
