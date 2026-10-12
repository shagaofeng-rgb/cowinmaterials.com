"use client";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";
export default function AdminError({ reset }: { reset: () => void }) {
  return <main className="admin-login-page" lang="zh-CN"><section className="admin-login-card" role="alert"><TriangleAlert size={28} /><h1>数据暂时无法读取</h1><p>请稍后重试。为避免误导，本次没有将读取失败显示为 0 或空记录。</p><button className="admin-primary-button" onClick={reset}>重新读取</button><Link href="/admin">返回数据概览</Link><Link href="/admin/login">返回登录</Link></section></main>;
}
