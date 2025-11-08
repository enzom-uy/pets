/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ConfigService } from '@nestjs/config'
import { GoogleService } from './google.service'
import { PinoLogger } from 'nestjs-pino'
import { OAuth2Client } from 'google-auth-library'

jest.mock('google-auth-library', () => {
    return {
        OAuth2Client: jest.fn().mockImplementation(() => {
            return {
                generateAuthUrl: jest.fn(),
                getToken: jest.fn(),
                setCredentials: jest.fn(),
            }
        }),
    }
})

jest.mock('googleapis', () => {
    return {
        google: {
            oauth2: jest.fn().mockReturnValue({
                userinfo: {
                    get: jest.fn(),
                },
            }),
        },
    }
})

describe('GoogleService', () => {
    let configService: ConfigService
    let googleService: GoogleService
    let logger: PinoLogger
    beforeEach(() => {
        jest.clearAllMocks()

        logger = jest.fn() as any
        configService = {
            get: jest.fn((key: string): string => {
                const mockConfig = {
                    GOOGLE_CLIENT_ID: 'mock-client-id-1234',
                    GOOGLE_CLIENT_SECRET: 'mock-secret-1234',
                    REDIRECT_URI: 'http://localhost:3000/callback',
                }
                return mockConfig[key] as string
            }),
        } as any
        googleService = new GoogleService(configService, logger)
    })

    describe('getAuthClient', () => {
        it('should create a new OAuth2Client with valid credentials', () => {
            const client = googleService.getAuthClient()

            expect(OAuth2Client).toHaveBeenCalledWith({
                clientId: 'mock-client-id-1234',
                clientSecret: 'mock-secret-1234',
                redirectUri: 'http://localhost:3000/callback',
            })

            expect(client).toBeDefined()
            expect(client.generateAuthUrl).toBeDefined()
        })
    })

    describe('getAuthUrl', () => {
        it('should generate a url with correct scope and params', () => {
            const mockUrl =
                'https://accounts.google.com/o/oauth2/v2/auth?client_id='
            const client = googleService.getAuthClient()
            client.generateAuthUrl = jest.fn().mockReturnValue(mockUrl)

            const authUrl = googleService.getAuthUrl(client)
            expect(client.generateAuthUrl).toHaveBeenCalledWith({
                access_type: 'offline',
                scope: ['email', 'profile'],
                prompt: 'consent',
                include_granted_scopes: true,
            })
            expect(authUrl).toEqual({
                url: mockUrl,
            })
        })
    })
})
