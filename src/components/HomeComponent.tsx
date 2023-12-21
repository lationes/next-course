"use client";
import React, {useEffect, useState} from 'react';
import { useAuthStore } from '@/store/index';
import { useShallow } from 'zustand/react/shallow'
import { redirect } from 'next/navigation'

const HomeComponent = () => {
    const { token } = useAuthStore(
        useShallow((state) => ({
            token: state.token,
        })),
    )

    console.log(token)
    useEffect(() => {
        if (!token?.length) {
            redirect('/login')
        } else {
            redirect('/posts')
        }
    }, [token?.length])

    return (
        <>
        </>
    )
};

export default HomeComponent;