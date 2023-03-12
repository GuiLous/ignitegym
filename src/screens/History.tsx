import { useState } from 'react';
import { HistoryCard } from '@components/HistoryCard';
import { ScreenHeader } from '@components/ScreenHeader';
import { Heading, SectionList, Text, VStack } from 'native-base';

export function History() {
  const [exercises, _setExercises] = useState([
    {
      title: '26.08.22',
      data: ['Pizza', 'burguer', 'risott', 'risotto', 'risotto'],
    },
    {
      title: '27.08.22',
      data: ['Pizza', 'burguer', 'risotto'],
    },
  ]);

  return (
    <VStack flex={1}>
      <ScreenHeader title="Lista de exercícios" />

      <SectionList
        sections={exercises}
        keyExtractor={item => item}
        renderItem={({}) => <HistoryCard />}
        renderSectionHeader={({ section }) => (
          <Heading color="gray.200" fontSize="md" mt={10} mb={3}>
            {section.title}
          </Heading>
        )}
        ListEmptyComponent={() => (
          <Text color="gray.100" textAlign="center">
            Não há exercícios cadastrados ainda.{'\n'} Vamos treinar hoje?
          </Text>
        )}
        contentContainerStyle={
          exercises.length === 0 && { flex: 1, justifyContent: 'center' }
        }
        showsVerticalScrollIndicator={false}
        px={6}
      />
    </VStack>
  );
}
