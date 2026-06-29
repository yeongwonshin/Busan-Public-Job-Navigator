import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '@/theme/colors';
import { RootStackParamList, MainTabParamList } from '@/navigation/types';
import { HomeScreen } from '@/screens/HomeScreen';
import { SearchScreen } from '@/screens/SearchScreen';
import { RoadmapScreen } from '@/screens/RoadmapScreen';
import { EssayCoachScreen } from '@/screens/EssayCoachScreen';
import { MyPageScreen } from '@/screens/MyPageScreen';
import { JobDetailScreen } from '@/screens/JobDetailScreen';
import { OnboardingScreen } from '@/screens/OnboardingScreen';
import { DatasetImportScreen } from '@/screens/DatasetImportScreen';
import { ChangeCenterScreen } from '@/screens/ChangeCenterScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { height: 70, paddingBottom: 10, paddingTop: 8 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' }
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: '홈', tabBarIcon: () => null }} />
      <Tab.Screen name="Search" component={SearchScreen} options={{ title: '공고', tabBarIcon: () => null }} />
      <Tab.Screen name="Roadmap" component={RoadmapScreen} options={{ title: '로드맵', tabBarIcon: () => null }} />
      <Tab.Screen name="Essay" component={EssayCoachScreen} options={{ title: '자소서', tabBarIcon: () => null }} />
      <Tab.Screen name="MyPage" component={MyPageScreen} options={{ title: '마이', tabBarIcon: () => null }} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.ink,
          headerTitleStyle: { fontWeight: '800' },
          contentStyle: { backgroundColor: colors.background }
        }}
      >
        <Stack.Screen name="MainTabs" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen name="JobDetail" component={JobDetailScreen} options={{ title: '공고 상세' }} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ title: '프로필 설정' }} />
        <Stack.Screen name="DatasetImport" component={DatasetImportScreen} options={{ title: 'DIVE 데이터셋 가져오기' }} />
        <Stack.Screen name="ChangeCenter" component={ChangeCenterScreen} options={{ title: '공고 변경센터' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
