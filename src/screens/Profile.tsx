import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UserPhoto';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import {
  Center,
  Heading,
  ScrollView,
  Skeleton,
  Text,
  useToast,
  VStack,
} from 'native-base';

const PHOTO_SIZE = 33;

export function Profile() {
  const [photoIsLoaded, setPhotoIsLoaded] = useState(true);
  const [userPhoto, setUserPhoto] = useState('https://github.com/guilous.png');

  const toast = useToast();

  async function handleUserPhotoSelect() {
    setPhotoIsLoaded(false);
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });

      if (photoSelected.canceled) {
        setPhotoIsLoaded(true);
        return;
      }

      if (photoSelected.assets[0].uri) {
        const photoInfo = await FileSystem.getInfoAsync(
          photoSelected.assets[0].uri,
        );

        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            title: 'Essa imagem é muito grande',
            description: 'Escolha uma de no máximo 5mb.',
            placement: 'top',
            bgColor: 'red.500',
            marginX: '8px',
            _title: { textAlign: 'center' },
            _description: { textAlign: 'center' },
          });
        }

        setUserPhoto(photoSelected.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPhotoIsLoaded(true);
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Meu perfil" />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 36 }}
        showsVerticalScrollIndicator={false}>
        <Center mt={6} px={10}>
          <Skeleton
            w={PHOTO_SIZE}
            h={PHOTO_SIZE}
            rounded="full"
            startColor="gray.500"
            endColor="gray.400"
            isLoaded={photoIsLoaded}>
            <TouchableOpacity onPress={() => handleUserPhotoSelect()}>
              <UserPhoto
                source={{ uri: userPhoto }}
                alt="Foto do usuário"
                size={PHOTO_SIZE}
              />
            </TouchableOpacity>
          </Skeleton>

          <TouchableOpacity onPress={() => handleUserPhotoSelect()}>
            <Text
              color="green.500"
              fontWeight="bold"
              fontSize="md"
              mt={2}
              mb={8}>
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Input bg="gray.600" placeholder="Nome" />
          <Input
            bg="gray.600"
            placeholder="email"
            value={'guilherme.silva@gmail.com'}
            isDisabled
          />

          <Heading
            color="gray.200"
            fontSize="md"
            fontFamily="heading"
            mb={2}
            mt={12}
            alignSelf="flex-start">
            Alterar Senha
          </Heading>

          <Input bg="gray.600" placeholder="Senha antiga" secureTextEntry />
          <Input bg="gray.600" placeholder="Nova senha" secureTextEntry />
          <Input
            bg="gray.600"
            placeholder="Confirme a nova senha"
            secureTextEntry
          />

          <Button title="Atualizar" mt={4} />
        </Center>
      </ScrollView>
    </VStack>
  );
}
