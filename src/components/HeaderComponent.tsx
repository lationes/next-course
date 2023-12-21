'use client'
import React, {useEffect} from 'react';
import { useShallow } from 'zustand/react/shallow'
import { Box, Tabs, TabList, Tab, Avatar, Heading } from '@chakra-ui/react';
import Link from 'next/link'
import {useAuthStore, useUserStore} from "../store";
import { useRouter } from 'next/navigation'

const navLinks = [{
    href: '.posts',
    name: 'Posts'
}]

const HeaderComponent = () => {
    const router = useRouter()
    const { currentUserData, getCurrentUser } = useUserStore(
        useShallow((state) => ({
            currentUserData: state.currentUserData,
            getCurrentUser: state.getCurrentUser,
        })),
    );
    const { token } = useAuthStore(
        useShallow((state) => ({
            token: state.token,
        })),
    );

    useEffect(() => {
        if (!token) {
            router.push('/login')
        }
    }, [token, router])

    useEffect( () => {
        if (!currentUserData) {
            getCurrentUser();
        }
    }, [currentUserData, getCurrentUser]);

    return (
        <Box display={'flex'} alignItems={'center'} width={'100vw'} paddingX={'12'} paddingY={'4'} bg={'teal.400'} justifyContent={'space-between'}>
            <Box display={'flex'} justifyContent={'flex-start'}>
                <Tabs variant='soft-rounded' colorScheme='green'>
                    <TabList>
                        {navLinks.map((link) => (
                            <Tab key={link.href}>
                                <Link href={link.href}>{link.name}</Link>
                            </Tab>
                        ))}
                    </TabList>
                </Tabs>
            </Box>
            <Box display={'flex'} gap={'8'} justifyContent={'flex-end'} alignItems={'center'}>
                <Heading as='h6' size='xs'>
                    {currentUserData?.email || ''}
                </Heading>
                <Avatar name={currentUserData?.email} src={currentUserData?.avatar} />
            </Box>
        </Box>
    );
};

export default HeaderComponent;