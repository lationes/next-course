"use client";
import React, {useState, ChangeEvent, useMemo, useEffect} from 'react';
import { Input, FormControl, FormLabel, Button, FormErrorMessage, Container, Box, Heading, Text } from '@chakra-ui/react';
import { useAuthStore } from '@/store/index';
import { useShallow } from 'zustand/react/shallow'
import {redirect} from "next/navigation";

interface IProps {
}

type PageType = 'auth' | 'registration';

const pageName = {
    auth: 'Authorization',
    registration: 'Registration',
}

const AuthPage = () => {
    const { login, registration, loading, token } = useAuthStore(
        useShallow((state) => ({
            login: state.login,
            registration: state.registration,
            loading: state.loading,
            token: state.token,
        })),
    )

    const [type, setType] = useState<PageType>('auth')
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    useEffect(() => {
        if (token?.length) {
            redirect('/posts')
        }
    })

    const handleSubmitForm = () => {
        const submitFunction = type === 'auth' ? login : registration;

        const data = {
            email: email,
            password: password,
        }

        submitFunction(data);
    }

    const handleChangeInput = (e: ChangeEvent<HTMLInputElement>, type: 'email' | 'password') => {
        e.stopPropagation();

        const changeFunction = type === 'email' ? setEmail : setPassword;

        changeFunction(e.target.value)
    }

    const linkComponent = useMemo(() => {
        const oppositeType = type === 'auth' ? 'registration' : 'auth';

        return (
            <Text cursor={'pointer'} onClick={() => setType(oppositeType)} fontWeight='bold' color='teal.400' fontSize='sm'>{pageName[oppositeType]}</Text>
        )
    }, [type])

    return (
        <Container width={'100vw'} height={'100vh'} centerContent justifyContent={'center'}>
            <Heading as='h2' size='2xl'>{pageName[type]}</Heading>
            <Box padding='4' maxW='md'>
                <FormControl width={'400px'} display={'flex'} flexDirection={'column'} gap={'4'}>
                    <Box>
                        <FormLabel>Email</FormLabel>
                        <Input onChange={(e) => handleChangeInput(e, 'email')} type='email' placeholder={'Enter your email'}/>
                    </Box>
                    <Box>
                        <FormLabel>Password</FormLabel>
                        <Input onChange={(e) => handleChangeInput(e, 'password')} type='password' placeholder={'Enter your password'}/>
                    </Box>
                    <Button
                        mt={4}
                        colorScheme='teal'
                        isLoading={loading}
                        type='submit'
                        onClick={handleSubmitForm}
                    >
                        Submit
                    </Button>
                    {linkComponent}
                </FormControl>
            </Box>
        </Container>
    );
};

export default AuthPage;