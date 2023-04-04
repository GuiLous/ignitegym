import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Platform, TouchableOpacity } from 'react-native';
import defaultUserPhotoImg from '@assets/userPhotoDefault.png';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UserPhoto';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '@hooks/useAuth';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import {
  Center,
  Heading,
  KeyboardAvoidingView,
  ScrollView,
  Skeleton,
  Text,
  useToast,
  VStack,
} from 'native-base';
import * as yup from 'yup';

const PHOTO_SIZE = 33;

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  old_password: string;
  confirm_password: string;
};

const profileSchema = yup.object({
  name: yup.string().required('Informe o nome'),
  password: yup
    .string()
    .min(6, 'A senha deve conter pelo menos 6 dígitos.')
    .nullable()
    .transform(value => (value ? value : null)),
  confirm_password: yup
    .string()
    .nullable()
    .transform(value => (value ? value : null))
    .oneOf([yup.ref('password')], 'As senhas não batem.')
    .when('password', {
      is: (field: string) => field,
      then: () =>
        yup
          .string()
          .nullable()
          .transform(value => (value ? value : null))
          .required('Informe a confirmação de senha.')
          .oneOf([yup.ref('password')], 'As senhas não batem.'),
    }),
});

export function Profile() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [photoIsLoaded, setPhotoIsLoaded] = useState(true);

  const { user, updateUserProfile } = useAuth();

  const toast = useToast();

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    resolver: yupResolver(profileSchema),
  });

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

        const fileExtension = photoSelected.assets[0].uri.split('.').pop();

        const photoFile = {
          name: `${user.name}.${fileExtension}`.toLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`,
        } as any;

        const userPhotoUploadForm = new FormData();
        userPhotoUploadForm.append('avatar', photoFile);

        const avatarUpdatedResponse = await api.patch(
          '/users/avatar',
          userPhotoUploadForm,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        const userUpdated = user;
        userUpdated.avatar = avatarUpdatedResponse.data.avatar;

        updateUserProfile(userUpdated);

        return toast.show({
          title: 'Perfil atualizado!',
          placement: 'top',
          bgColor: 'green.500',
          marginX: '8px',
          _title: { textAlign: 'center' },
          _description: { textAlign: 'center' },
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPhotoIsLoaded(true);
    }
  }

  async function handleProfileUpdate(data: FormDataProps) {
    try {
      setIsUpdating(true);

      const userUpdated = user;
      userUpdated.name = data.name;

      await api.put('/users', data);

      await updateUserProfile(userUpdated);

      reset();
      toast.show({
        title: 'Perfil atualizado com sucesso!',
        placement: 'top',
        bgColor: 'green.700',
      });
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Não foi possível atualizar os dados.';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Meu perfil" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 120 }}
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
                  source={
                    user.avatar
                      ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
                      : defaultUserPhotoImg
                  }
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

            <Controller
              control={control}
              name="name"
              render={({ field: { value, onChange } }) => (
                <Input
                  bg="gray.600"
                  placeholder="Nome"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { value, onChange } }) => (
                <Input
                  bg="gray.600"
                  placeholder="E-mail"
                  onChangeText={onChange}
                  value={value}
                  isDisabled
                />
              )}
            />

            {/* <Input
            bg="gray.600"
            placeholder="E-mail"
            value={user.email}
            isDisabled
          /> */}

            <Heading
              color="gray.200"
              fontSize="md"
              fontFamily="heading"
              mb={2}
              mt={12}
              alignSelf="flex-start">
              Alterar Senha
            </Heading>

            <Controller
              control={control}
              name="old_password"
              render={({ field: { onChange } }) => (
                <Input
                  bg="gray.600"
                  placeholder="Senha antiga"
                  onChangeText={onChange}
                  secureTextEntry
                  textContentType={'oneTimeCode'}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange } }) => (
                <Input
                  bg="gray.600"
                  placeholder="Nova senha"
                  secureTextEntry
                  onChangeText={onChange}
                  errorMessage={errors.password?.message}
                  textContentType={'oneTimeCode'}
                />
              )}
            />

            <Controller
              control={control}
              name="confirm_password"
              render={({ field: { onChange } }) => (
                <Input
                  bg="gray.600"
                  placeholder="Confirme a nova senha"
                  onChangeText={onChange}
                  secureTextEntry
                  errorMessage={errors.confirm_password?.message}
                  textContentType={'oneTimeCode'}
                />
              )}
            />

            <Button
              title="Atualizar"
              mt={4}
              onPress={handleSubmit(handleProfileUpdate)}
              isLoading={isUpdating}
            />
          </Center>
        </ScrollView>
      </KeyboardAvoidingView>
    </VStack>
  );
}
