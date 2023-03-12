import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { Heading, HStack, Icon, Image, Text, VStack } from 'native-base';

interface ExerciseCardProps extends TouchableOpacityProps {}

export function ExerciseCard({ ...rest }: ExerciseCardProps) {
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
            uri: 'https://blog.gsuplementos.com.br/wp-content/uploads/2021/04/iStock-1176660107-1024x683.jpg',
          }}
          alt="Imagem de homem treinando remada alta"
          w={16}
          h={16}
          mr={4}
          rounded="md"
          resizeMode="cover"
        />

        <VStack flex={1}>
          <Heading fontSize="lg" color="white">
            Reamada Alta
          </Heading>
          <Text fontSize="sm" color="gray.200" mt={1} numberOfLines={2}>
            3 series x 12 repetições
          </Text>
        </VStack>

        <Icon as={Entypo} name="chevron-thin-right" />
      </HStack>
    </TouchableOpacity>
  );
}
