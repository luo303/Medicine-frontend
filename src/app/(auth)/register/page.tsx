'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { register } from '@/app/api/auth/auth';
import { useTheme } from '@/components/theme-provider';

export default function RegisterPage() {
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password.length < 6) {
            setError('密码长度至少为 6 位');
            return;
        }

        setLoading(true);

        try {
            const result = await register({ username, password });
            
            if (result.code === 201) {
                setSuccess('注册成功！即将跳转到登录页面...');
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                setError(result.message || '注册失败');
            }
        } catch (err: any) {
            setError(err.message || '注册失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col'>
            <div className='absolute top-4 right-4'>
                <Button
                    onClick={toggleTheme}
                    variant='outline'
                    size='sm'
                >
                    {theme === 'dark' ? (
                        <>
                            <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z' />
                            </svg>
                            暗色
                        </>
                    ) : (
                        <>
                            <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' />
                            </svg>
                            亮色
                        </>
                    )}
                </Button>
            </div>

            <div className='flex-1 flex items-center justify-center px-4'>
                <div className='w-full max-w-2xl'>
                    <div className='text-center mb-8'>
                        <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
                            创建新账号
                        </h1>
                        <p className='text-gray-600 dark:text-gray-400'>
                            注册以开始使用
                        </p>
                    </div>

                    <Card className='bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-xl'>
                        <CardHeader className='space-y-1 pb-4'>
                            <CardTitle className='text-2xl font-bold text-center'>用户注册</CardTitle>
                            <CardDescription className='text-center'>
                                填写以下信息创建账号
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={handleSubmit}>
                            <CardContent className='space-y-4 pb-6'>
                                {error && (
                                    <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3'>
                                        <p className='text-sm text-red-600 dark:text-red-400'>{error}</p>
                                    </div>
                                )}
                                
                                {success && (
                                    <div className='bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3'>
                                        <p className='text-sm text-green-600 dark:text-green-400'>{success}</p>
                                    </div>
                                )}
                                
                                <div className='space-y-2'>
                                    <Label htmlFor='username' className='text-sm font-medium'>用户名</Label>
                                    <Input
                                        id='username'
                                        type='text'
                                        placeholder='请输入用户名'
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className='h-11'
                                        required
                                    />
                                </div>
                                
                                <div className='space-y-2'>
                                    <Label htmlFor='password' className='text-sm font-medium'>密码</Label>
                                    <Input
                                        id='password'
                                        type='password'
                                        placeholder='请输入密码（至少 6 位）'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className='h-11'
                                        required
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className='flex flex-col space-y-4 pt-0 pb-6'>
                                <Button
                                    type='submit'
                                    className='w-full h-11 text-base font-medium'
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className='flex items-center space-x-2'>
                                            <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                            <span>注册中...</span>
                                        </div>
                                    ) : (
                                        '注册'
                                    )}
                                </Button>
                                
                                <div className='text-sm text-center text-gray-600 dark:text-gray-400'>
                                    已有账号？{' '}
                                    <Link
                                        href='/login'
                                        className='text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors'
                                    >
                                        立即登录
                                    </Link>
                                </div>
                            </CardFooter>
                        </form>
                    </Card>

                    <p className='text-center text-sm text-gray-500 dark:text-gray-400 mt-6'>
                        注册即表示您同意我们的服务条款和隐私政策
                    </p>
                </div>
            </div>
        </div>
    );
}
