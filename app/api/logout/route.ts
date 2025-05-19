import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const supabase = createRouteHandlerClient({ cookies })

    await supabase.auth.signOut()

    return NextResponse.redirect(new URL('/', request.url), {
        status: 301,
    })
}