import { Controller, useForm } from 'react-hook-form';
import BackgroundImg from '@assets/background.png';
import LogoSvg from '@assets/logo.svg';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { useNavigation } from '@react-navigation/native';
import {
  Center,
  Divider,
  Heading,
  HStack,
  Image,
  ScrollView,
  Text,
  VStack,
} from 'native-base';

export function SignUp() {
  const { goBack } = useNavigation();

  const { control, handleSubmit, reset } = useForm();

  function handleGoBack() {
    goBack();
  }

  function handleSignUp(data: any) {
    console.log('data', data);
    reset();
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}>
      <VStack flex={1} px={10} pb={16}>
        <Image
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="Pessoas treinando"
          resizeMethod="auto"
          position="absolute"
        />

        <Center my={24}>
          <LogoSvg />

          <Text color="gray.100" fontSize="sm">
            Treine sua mente e o seu corpo
          </Text>
        </Center>

        <Center>
          <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
            Crie sua conta
          </Heading>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input placeholder="Nome" onChangeText={onChange} value={value} />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
              />
            )}
          />

          <HStack flex={1} mb={4} alignItems="center" space={2}>
            <Divider bgColor="gray.400" h={1} flex={1} />
            <Text color="gray.400">#</Text>
            <Divider bgColor="gray.400" h={1} flex={1} />
          </HStack>

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Senha"
                onChangeText={onChange}
                value={value}
                secureTextEntry
              />
            )}
          />

          <Controller
            control={control}
            name="password_confirm"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Confirmar a senha"
                onChangeText={onChange}
                value={value}
                onSubmitEditing={handleSubmit(handleSignUp)}
                returnKeyType="send"
                secureTextEntry
              />
            )}
          />

          <Button
            title="Criar e acessar"
            onPress={handleSubmit(handleSignUp)}
            mt={8}
          />
        </Center>

        <Button
          title="Voltar para o login"
          variant="outline"
          mt={4}
          onPress={handleGoBack}
        />
      </VStack>
    </ScrollView>
  );
}
