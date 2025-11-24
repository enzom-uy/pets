export interface AccessTokenPayload {
    userId: string
    sessionId: string
    identityId: string
    identityType: 'user' | 'branch' | 'owner'
}

export interface RefreshTokenPayload {
    userId: string
    sessionId: string
}
