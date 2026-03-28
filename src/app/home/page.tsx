'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { redirect } from 'next/navigation';
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
const checkLogin = async () => {
    const res = await fetch('/api/login');
    const data = await res.json();
    if (data.code === 1) {
        return true;
    } else {
        redirect('/');
    }
}

export default function HomePage() {
    const [input, setInput] = useState(''); // 输入框的值
    const messagesEndRef = useRef<HTMLDivElement>(null); // 获取消息结束的ref
    const [messages, setMessages] = useState<{ role: string, content: string }[]>([]); // 消息数组
    const [isLoading, setIsLoading] = useState(false); // 是否正在等待拿取流式
    // 自动滚动到底部
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        checkLogin();
    }, []);

    // 更新AI消息内容的函数
    const updateAIMessageContent = useCallback((content: string) => {
        setMessages(prev => {
            const newMessages = [...prev];
            for (let i = newMessages.length - 1; i >= 0; i--) {
                if (newMessages[i].role === 'assistant') {
                    // 直接设置完整内容（非打字机）
                    newMessages[i] = {
                        ...newMessages[i],
                        content: content
                    };
                    return newMessages;
                }
            }
            return newMessages;
        });
    }, []);


    // 发送消息的函数
    const sendMessage = async (userInput: string) => {
        if (isLoading) return;

        setIsLoading(true);

        // 1. 先添加用户消息
        setMessages(prev => [
            ...prev,
            { role: 'user', content: userInput }
        ]);

        // 2. 立即添加一个空的AI消息（占位）
        setMessages(prev => [
            ...prev,
            { role: 'assistant', content: '' }
        ]);

        setInput('');

        try {
            const res = await fetch('http://localhost:3000/api/ai/chat/stream', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE3NzM0Njg3NjYsImV4cCI6MTgwNTAyNjM2Nn0.M6aZfnbdr-tnFs40ioarCA8dEQtlhK0GrC8S0_QNvBw`,
                },
                body: JSON.stringify({
                    messages: [...messages, { role: 'user', content: userInput }],
                }),
            });

            if (!res.ok) {
                throw new Error(`请求失败: ${res.status}`);
            }

            if (!res.body) {
                throw new Error('无法获取响应流');
            }
            setIsLoading(false);
            const reader = res.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let aiResponse = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split("\n").filter(line => line.trim() !== "");

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.slice(6);

                        if (dataStr === '[DONE]') {
                            continue;
                        }

                        try {
                            const data = JSON.parse(dataStr);                  
                            switch (data.type) {
                                case 'reasoning':
                                    // 累积推理内容
                                    const reasoning_content = data.reasoning || "";
                                    aiResponse += reasoning_content;
                                    // 更新AI消息内容
                                    updateAIMessageContent(aiResponse);
                                    break;
                                case 'text':
                                    // 实时显示文本
                                    const text = data.text || "";
                                    aiResponse += text;
                                    // 更新AI消息内容
                                    updateAIMessageContent(aiResponse);
                                    break;
                                case 'tool':
                                    // 处理工具调用结果
                                   console.log(data.tool_calls);
                                    break;
                            }
                        } catch (e) {
                            console.warn("解析失败:", e, "原始数据:", dataStr);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('API 调用错误:', error);
            // 出错时更新AI消息为错误信息
            updateAIMessageContent('抱歉，请求失败: ' + (error as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    // 回车发送消息
    const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (input.trim()) {
                await sendMessage(input.trim());
            }
        }
    };

    // 按钮发送消息
    const handleSend = () => {
        if (input.trim()) {
            sendMessage(input.trim());
        }
    };

    return (
        <div className='flex flex-col h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 w-screen'>
            {/* 头部标题 */}
            <div className='bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200'>
                <div className='max-w-4xl mx-auto px-6 py-4'>
                    <h1 className='text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                        AI 智能助手
                    </h1>
                    <p className='text-sm text-gray-500 mt-1'>随时为您解答问题</p>
                </div>
            </div>

            {/* 消息区域 */}
            <div className='flex-1 overflow-y-auto px-4 py-6'>
                <div className='max-w-4xl mx-auto space-y-4'>
                    {messages.length === 0 ? (
                        <div className='flex flex-col items-center justify-center h-full text-center py-20'>
                            <div className='bg-gradient-to-br from-blue-100 to-purple-100 rounded-full p-6 mb-4'>
                                <svg className='w-12 h-12 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' />
                                </svg>
                            </div>
                            <h2 className='text-xl font-semibold text-gray-700 mb-2'>开始对话</h2>
                            <p className='text-gray-500'>输入您的问题，我会尽力帮助您</p>
                        </div>
                    ) : (
                        messages.map((message, index) => (
                            <div
                                key={`${index}-${message.role}-${message.content.substring(0, 10)}`}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    {/* 头像 */}
                                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${message.role === 'user'
                                        ? 'bg-linear-to-br from-blue-500 to-blue-600'
                                        : 'bg-linear-to-br from-purple-500 to-purple-600'
                                        }`}>
                                        {message.role === 'user' ? '你' : 'AI'}
                                    </div>

                                    {/* 消息内容 */}
                                    <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                                        <div className={`rounded-2xl px-4 py-3 shadow-sm ${message.role === 'user'
                                            ? 'bg-linear-to-br from-blue-500 to-blue-600 text-white'
                                            : 'bg-white border border-gray-200 text-gray-800'
                                            }`}>
                                            <Markdown remarkPlugins={[remarkGfm]}>{message.content || (message.role === 'assistant' && isLoading ? '思考中...' : '')}</Markdown>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* 输入区域 */}
            <div className='bg-white/80 backdrop-blur-sm border-t border-gray-200 shadow-lg'>
                <div className='max-w-4xl mx-auto px-4 py-4'>
                    <div className='flex gap-3 items-end'>
                        <div className='flex-1 relative'>
                            <Textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder='请输入你的问题... (按 Enter 发送，Shift + Enter 换行)'
                                className='min-h-[60px] max-h-[200px] resize-none rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-sm'
                                disabled={isLoading}
                            />
                            {isLoading&& (
                                <div className="absolute right-3 bottom-3">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <Button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className='h-[60px] px-6 rounded-xl bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {isLoading? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>发送中...</span>
                                </div>
                            ) : (
                                <>
                                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8' />
                                    </svg>
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}