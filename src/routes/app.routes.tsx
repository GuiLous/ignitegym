import {
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedbackProps,
} from 'react-native';
import HistorySvg from '@assets/history.svg';
import HomeSvg from '@assets/home.svg';
import ProfileSvg from '@assets/profile.svg';
import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { Exercise } from '@screens/Exercise';
import { History } from '@screens/History';
import { Home } from '@screens/Home';
import { Profile } from '@screens/Profile';
import { useTheme } from 'native-base';

type AppRoutes = {
  home: undefined;
  history: undefined;
  profile: undefined;
  exercise: { exerciseId: string };
};

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>;

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>();

export function AppRoutes() {
  const { sizes, colors } = useTheme();

  const iconsSize = sizes[8];

  const CustomTabButton = (props: TouchableWithoutFeedbackProps) => (
    <TouchableOpacity
      {...props}
      style={
        props?.accessibilityState?.selected
          ? [
              props.style,
              {
                borderTopColor: colors.green[500],
                borderTopWidth: 2,
                marginBottom: 4,
              },
            ]
          : props.style
      }
    />
  );

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.green[500],
        tabBarInactiveTintColor: colors.gray[200],
        tabBarStyle: {
          backgroundColor: colors.gray[600],
          borderTopWidth: 0,
          height: Platform.OS === 'android' ? 'auto' : 80,
          paddingBottom: sizes[0],
        },
      }}>
      <Screen
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <HomeSvg fill={color} width={iconsSize} height={iconsSize} />
          ),
          tabBarButton: CustomTabButton,
        }}
      />
      <Screen
        name="history"
        component={History}
        options={{
          tabBarIcon: ({ color }) => (
            <HistorySvg fill={color} width={iconsSize} height={iconsSize} />
          ),
          tabBarButton: CustomTabButton,
        }}
      />
      <Screen
        name="profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <ProfileSvg fill={color} width={iconsSize} height={iconsSize} />
          ),
          tabBarButton: CustomTabButton,
        }}
      />
      <Screen
        name="exercise"
        component={Exercise}
        options={{ tabBarButton: () => null }}
      />
    </Navigator>
  );
}
