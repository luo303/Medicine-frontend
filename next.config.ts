import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: false, //关闭严格模式
  cacheComponents: true, //开启组件缓存
};

export default nextConfig;
