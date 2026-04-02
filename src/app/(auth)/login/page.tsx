'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { login } from '@/app/api/auth/auth';
import { useTheme } from '@/components/theme-provider';

export default function LoginPage() {
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login({ username, password });
            
            if (result.code === 1 || result.code === 200) {
                console.log('登录成功，返回结果:', result);
                if (result.data?.token) {
                    localStorage.setItem('auth_token', result.data.token);
                    console.log('Token 已存储:', result.data.token);
                } else {
                    console.log('没有收到 token');
                }
                router.push('/home');
            } else {
                setError(result.message || '登录失败');
            }
        } catch (err: any) {
            setError(err.message || '登录失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='w-full min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col'>
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
                            医院系统 AI 智能助手
                        </h1>
                        <p className='text-gray-600 dark:text-gray-400'>
                            登录以开始使用
                        </p>
                    </div>

                    <Card className='bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-xl'>
                        <CardHeader className='space-y-1 pb-4'>
                            <CardTitle className='text-2xl font-bold text-center'>用户登录</CardTitle>
                            <CardDescription className='text-center'>
                                输入您的账号密码进行登录
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={handleSubmit}>
                            <CardContent className='space-y-4 pb-6'>
                                {error && (
                                    <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3'>
                                        <p className='text-sm text-red-600 dark:text-red-400'>{error}</p>
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
                                        placeholder='请输入密码'
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
                                            <span>登录中...</span>
                                        </div>
                                    ) : (
                                        '登录'
                                    )}
                                </Button>
                                
                                <div className='text-sm text-center text-gray-600 dark:text-gray-400'>
                                    还没有账号？{' '}
                                    <Link
                                        href='/register'
                                        className='text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors'
                                    >
                                        立即注册
                                    </Link>
                                </div>
                            </CardFooter>
                        </form>
                    </Card>

                    <p className='text-center text-sm text-gray-500 dark:text-gray-400 mt-6'>
                        登录即表示您同意我们的服务条款和隐私政策
                    </p>
                </div>
            </div>
        </div>
    );
}
