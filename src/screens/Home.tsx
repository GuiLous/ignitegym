import { useCallback, useEffect, useState } from 'react';
import { ExerciseCard } from '@components/ExerciseCard';
import { Group } from '@components/Group';
import { HomeHeader } from '@components/HomeHeader';
import { Loading } from '@components/Loading';
import { ExerciseDTO } from '@dtos/ExerciseDTO';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { FlatList, Heading, HStack, Text, useToast, VStack } from 'native-base';

export function Home() {
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [groups, setGroups] = useState<string[]>([]);
  const [exercises, setExercises] = useState<ExerciseDTO[]>([]);
  const [groupSelected, setGroupSelected] = useState<string>('');

  const { navigate } = useNavigation<AppNavigatorRoutesProps>();

  function handleOpenExerciseDetails(exerciseId: string) {
    navigate('exercise', { exerciseId });
  }

  async function fetchGroups() {
    try {
      const response = await api.get('/groups');

      setGroups(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar os grupos musculares.';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  async function fetchExercisesByGroup() {
    try {
      setIsLoading(true);
      const response = await api.get(`/exercises/bygroup/${groupSelected}`);

      setExercises(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar os  exercícios.';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchGroups();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchExercisesByGroup();
    }, [groupSelected]),
  );

  useEffect(() => {
    if (groups.length > 0) {
      setGroupSelected(groups[0]);
    }
  }, [groups]);

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

      {isLoading ? (
        <Loading />
      ) : (
        <VStack flex={1} px={8}>
          <HStack alignItems="center" justifyContent="space-between" mb={5}>
            <Heading color="gray.200" fontSize="md" fontFamily="heading">
              Exercícios
            </Heading>

            <Text color="gray.200" fontSize="sm">
              {exercises.length}
            </Text>
          </HStack>

          <FlatList
            data={exercises}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <ExerciseCard
                data={item}
                onPress={() => handleOpenExerciseDetails(item.id)}
              />
            )}
            _contentContainerStyle={{ pb: 20 }}
          />
        </VStack>
      )}
    </VStack>
  );
}
