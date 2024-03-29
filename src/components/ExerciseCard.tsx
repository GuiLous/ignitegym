import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { ExerciseDTO } from '@dtos/ExerciseDTO';
import { Entypo } from '@expo/vector-icons';
import { api } from '@services/api';
import { Heading, HStack, Icon, Image, Text, VStack } from 'native-base';

interface ExerciseCardProps extends TouchableOpacityProps {
  data: ExerciseDTO;
}

export function ExerciseCard({ data, ...rest }: ExerciseCardProps) {
  return (
    <TouchableOpacity {...rest}>
      <HStack
        bg="gray.500"
        alignItems="center"
        p={2}
        pr={4}
        rounded="md"
        mb={3}>
        <Image
          source={{
            uri: `${api.defaults.baseURL}/exercise/thumb/${data.thumb}`,
          }}
          alt="Imagem de homem treinando remada alta"
          w={16}
          h={16}
          mr={4}
          rounded="md"
          resizeMode="cover"
        />

        <VStack flex={1}>
          <Heading fontSize="lg" color="white" fontFamily="heading">
            {data.name}
          </Heading>
          <Text fontSize="sm" color="gray.200" mt={1} numberOfLines={2}>
            {data.series} series x {data.repetitions} repetições
          </Text>
        </VStack>

        <Icon as={Entypo} name="chevron-thin-right" />
      </HStack>
    </TouchableOpacity>
  );
}
