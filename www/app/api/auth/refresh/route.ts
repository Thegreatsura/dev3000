import { type NextRequest, NextResponse } from "next/server"
import { getAuthorizePath, sanitizeAuthRedirectPath } from "@/lib/auth-redirect"

interface RefreshTokenResponse {
  access_token: string
  token_type: string
  id_token: string
  expires_in: number
  scope: string
  refresh_token: string
}

export async function GET(request: NextRequest) {
  const returnTo = sanitizeAuthRedirectPath(request.nextUrl.searchParams.get("next"))
  const refreshToken = request.cookies.get("refresh_token")?.value

  if (!refreshToken) {
    return NextResponse.redirect(new URL(getAuthorizePath(returnTo), request.url))
  }

  const tokenData = await refreshAccessToken(refreshToken)
  if (!tokenData) {
    const response = NextResponse.redirect(new URL(getAuthorizePath(returnTo), request.url))
    clearAuthCookies(response)
    return response
  }

  const response = NextResponse.redirect(new URL(returnTo, request.url))
  setAuthCookies(response, tokenData)
  return response
}

async function refreshAccessToken(refreshToken: string): Promise<RefreshTokenResponse | null> {
  try {
    const params = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID as string,
      client_secret: process.env.CLIENT_SECRET as string,
      refresh_token: refreshToken
    })

    const response = await fetch("https://api.vercel.com/login/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params.toString()
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => "")
      console.error("[Auth Refresh] Failed to refresh token:", response.status, errorText.slice(0, 500))
      return null
    }

    return (await response.json()) as RefreshTokenResponse
  } catch (error) {
    console.error("[Auth Refresh] Error refreshing token:", error)
    return null
  }
}

function setAuthCookies(response: NextResponse, tokenData: RefreshTokenResponse) {
  const secure = process.env.NODE_ENV === "production"

  response.cookies.set("access_token", tokenData.access_token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: tokenData.expires_in
  })

  response.cookies.set("refresh_token", tokenData.refresh_token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  })
}

function clearAuthCookies(response: NextResponse) {
  for (const cookieName of ["access_token", "refresh_token"]) {
    response.cookies.set(cookieName, "", {
      path: "/",
      maxAge: 0
    })
  }
}
