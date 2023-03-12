import { useState } from 'react';
import { ExerciseCard } from '@components/ExerciseCard';
import { Group } from '@components/Group';
import { HomeHeader } from '@components/HomeHeader';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { FlatList, Heading, HStack, Text, VStack } from 'native-base';

export function Home() {
  const [groupSelected, setGroupSelected] = useState('costas');
  const [groups, _setGroups] = useState([
    'costas',
    'ombros',
    'biceps',
    'pernas',
  ]);
  const [exercises, _setExercises] = useState([
    'Puxada fronta',
    'remada lateral',
    'leg press',
  ]);

  const { navigate } = useNavigation<AppNavigatorRoutesProps>();

  function handleOpenExerciseDetails() {
    navigate('exercise');
  }

  return (
    <VStack flex={1}>
      <HomeHeader />

      <FlatList
        data={groups}
        keyExtractor={item => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{ px: 8 }}
        my={10}
        maxH={10}
        minH={10}
        renderItem={({ item }) => (
          <Group
            name={item}
            isActive={
              groupSelected.toLocaleUpperCase() === item.toLocaleUpperCase()
            }
            onPress={() => setGroupSelected(item)}
          />
        )}
      />

      <VStack flex={1} px={8}>
        <HStack alignItems="center" justifyContent="space-between" mb={5}>
          <Heading color="gray.200" fontSize="md">
            Exercícios
          </Heading>

          <Text color="gray.200" fontSize="sm">
            {exercises.length}
          </Text>
        </HStack>

        <FlatList
          data={exercises}
          keyExtractor={item => item}
          showsVerticalScrollIndicator={false}
          renderItem={({}) => (
            <ExerciseCard onPress={() => handleOpenExerciseDetails()} />
          )}
          _contentContainerStyle={{ pb: 20 }}
        />
      </VStack>
    </VStack>
  );
}
