import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const supabase = createServerComponentClient({ cookies });
  const { userId, resourceId } = await req.json();

  try {
    // ユーザーの権限レベルを取得
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    // リソースのアクセス権限を確認
    const { data: resource, error: resourceError } = await supabase
      .from('resources')
      .select('required_role')
      .eq('id', resourceId)
      .single();

    if (resourceError) throw resourceError;

    // 権限チェック
    const hasAccess = checkAccessRights(user.role, resource.required_role);

    return NextResponse.json({ hasAccess });
  } catch (error) {
    console.error('アクセス制御エラー:', error);
    return NextResponse.json({ error: 'アクセス制御中にエラーが発生しました' }, { status: 500 });
  }
}

function checkAccessRights(userRole: string, requiredRole: string): boolean {
  const roles = ['user', 'manager', 'admin'];
  const userRoleIndex = roles.indexOf(userRole);
  const requiredRoleIndex = roles.indexOf(requiredRole);

  return userRoleIndex >= requiredRoleIndex;
}