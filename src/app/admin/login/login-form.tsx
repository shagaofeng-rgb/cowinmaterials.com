"use client";

import { Eye, EyeOff, LockKeyhole, LogIn } from "lucide-react";
import { useActionState, useState } from "react";
import { loginAction, type LoginState } from "@/app/admin/actions";

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(loginAction, {});
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="admin-login-card">
      <input name="next" type="hidden" value={next} />
      <div className="admin-login-icon">
        <LockKeyhole size={24} />
      </div>
      <h1>后台登录</h1>
      <p>用于 Cowin Materials 海外B2B官网的中文运营管理。</p>

      <label>
        <span>账号</span>
        <input name="username" autoComplete="username" placeholder="admin" required />
      </label>

      <label>
        <span>密码</span>
        <div className="admin-password-field">
          <input
            name="password"
            autoComplete="current-password"
            type={showPassword ? "text" : "password"}
            required
          />
          <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label="显示或隐藏密码">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </label>

      <div className="admin-login-row">
        <label className="admin-checkbox">
          <input name="remember" type="checkbox" />
          <span>记住登录状态</span>
        </label>
        <span>忘记密码请联系管理员</span>
      </div>

      {state.error ? <div className="admin-error">{state.error}</div> : null}

      <button className="admin-primary-button" disabled={pending} type="submit">
        <LogIn size={18} />
        {pending ? "正在登录..." : "登录后台"}
      </button>
    </form>
  );
}
