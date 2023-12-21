import React from 'react';
import dynamic from 'next/dynamic'
const AuthPage = dynamic(() => import('@/components/AuthPage'), { ssr: false })

const Login = () => {
    return (
        <>
            <AuthPage />
        </>
    );
};

export default Login;