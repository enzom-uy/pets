import { pgEnum } from 'drizzle-orm/pg-core'
import {
    pgTable,
    foreignKey,
    varchar,
    timestamp,
    unique,
    text,
    index,
    integer,
    time,
    boolean,
} from 'drizzle-orm/pg-core'

export const branchesContactInfoTypes = pgEnum('branches_contact_info_types', {
    phone: 'phone',
    email: 'email',
})

export const branchUserRoles = pgEnum('branch_user_roles', [
    'owner',
    'manager',
    'employee',
])

export const users = pgTable(
    'users',
    {
        id: varchar({ length: 36 }).primaryKey().notNull(),
        name: varchar({ length: 50 }).notNull(),
        email: varchar({ length: 255 }).notNull(),
        profilePictureUrl: text('profile_picture_url'),
        city: text().notNull(),
        address: text(),
        createdAt: timestamp('created_at', { mode: 'string' })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp('updated_at', { mode: 'string' }),
    },
    (table) => [
        unique('users_email_key').on(table.email),
        index('users_email_idx').on(table.email),
        index('users_city_idx').on(table.city),
    ],
)

export const sessions = pgTable(
    'sessions',
    {
        id: varchar({ length: 36 }).primaryKey().notNull(),
        userId: varchar('user_id', { length: 36 }).notNull(),
        token: varchar({ length: 255 }).notNull(),
        expiresAt: timestamp('expires_at', { mode: 'string' }).notNull(),
        ipAddress: varchar('ip_address', { length: 50 }),
        userAgent: varchar('user_agent', { length: 255 }),
        createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
        updatedAt: timestamp('updated_at', { mode: 'string' }),
    },
    (table) => [
        foreignKey({
            columns: [table.userId],
            foreignColumns: [users.id],
            name: 'user_sessions_user_id_fkey',
        }).onDelete('cascade'),
        unique('user_sessions_token_key').on(table.token),
    ],
)

export const accounts = pgTable(
    'accounts',
    {
        id: varchar({ length: 36 }).primaryKey().notNull(),
        provider: varchar({ length: 50 }).notNull(),
        provider_id: varchar({ length: 50 }).notNull(),
        userId: varchar('user_id', { length: 36 }).notNull(),
        createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
        updatedAt: timestamp('updated_at', { mode: 'string' }),
    },
    (table) => [
        foreignKey({
            columns: [table.userId],
            foreignColumns: [users.id],
            name: 'user_accounts_user_id_fkey',
        }).onDelete('cascade'),
    ],
)

export const pets = pgTable(
    'pets',
    {
        id: varchar({ length: 36 }).primaryKey().notNull(),
        name: varchar({ length: 255 }).notNull(),
        description: text('description'),
        profilePictureUrl: text('profile_picture_url'),
        ownerId: varchar('owner_id', { length: 36 }).notNull(),
        age: integer('age'),
        specie: varchar('specie', { length: 50 }),
        created_at: timestamp('created_at', { mode: 'string' }).defaultNow(),
        updated_at: timestamp('updated_at', { mode: 'string' }),
    },
    (table) => [
        foreignKey({
            columns: [table.ownerId],
            foreignColumns: [users.id],
            name: 'user_pets_owner_id_fkey',
        }),
    ],
)

export const business = pgTable('business', {
    id: varchar({ length: 36 }).primaryKey().notNull(),
    ownerId: varchar('owner_id', { length: 36 }).notNull(),
    logoUrl: text('logo_url'),
    name: varchar({ length: 255 }).notNull(),
    description: varchar({ length: 500 }),
    created_at: timestamp('created_at', { mode: 'string' }).defaultNow(),
    updated_at: timestamp('updated_at', { mode: 'string' }),
})

export const branches = pgTable(
    'branches',
    {
        id: varchar({ length: 36 }).primaryKey().notNull(),
        name: varchar({ length: 255 }).notNull(),
        description: text(),
        businessId: varchar('business_id', { length: 36 }).notNull(),
        address: text().notNull(),
        city: text().notNull(),
        created_at: timestamp('created_at', { mode: 'string' }).defaultNow(),
        updated_at: timestamp('updated_at', { mode: 'string' }),
    },
    (table) => [
        foreignKey({
            columns: [table.businessId],
            foreignColumns: [business.id],
            name: 'branches_business_id_fkey',
        }).onDelete('cascade'),
        index('branches_city_idx').on(table.city),
    ],
)

export const branchUsers = pgTable(
    'branch_users',
    {
        id: varchar({ length: 36 }).primaryKey().notNull(),
        userId: varchar('user_id', { length: 36 }).notNull(),
        branchId: varchar('branch_id', { length: 36 }).notNull(),
        role: branchUserRoles('role').notNull().default('employee'),
        createdAt: timestamp('created_at', { mode: 'string' })
            .defaultNow()
            .notNull(),
        updated_at: timestamp('updated_at', { mode: 'string' }),
    },
    (table) => [
        foreignKey({
            columns: [table.userId],
            foreignColumns: [users.id],
            name: 'branch_users_user_id_fkey',
        }).onDelete('cascade'),
        foreignKey({
            columns: [table.branchId],
            foreignColumns: [branches.id],
            name: 'branch_users_branch_id_fkey',
        }).onDelete('cascade'),
        unique('branch_users_user_branch_unique').on(
            table.userId,
            table.branchId,
        ),
        index('branch_users_user_id_idx').on(table.userId),
        index('branch_users_branch_id_idx').on(table.branchId),
    ],
)

export const services = pgTable('services', {
    id: varchar({ length: 36 }).primaryKey().notNull(),
    name: varchar({ length: 255 }).notNull(),
    description: text(),
    created_at: timestamp('created_at', { mode: 'string' }).defaultNow(),
    updated_at: timestamp('updated_at', { mode: 'string' }),
})

export const branchesServices = pgTable(
    'branches_services',
    {
        id: varchar({ length: 36 }).primaryKey().notNull(),
        servicesId: varchar('services_id', { length: 36 }).notNull(),
        branchesId: varchar('branches_id', { length: 36 }).notNull(),
        created_at: timestamp('created_at', { mode: 'string' }).defaultNow(),
        updated_at: timestamp('updated_at', { mode: 'string' }),
    },
    (table) => [
        foreignKey({
            columns: [table.servicesId],
            foreignColumns: [services.id],
            name: 'branches_services_services_id_fkey',
        }).onDelete('cascade'),
        foreignKey({
            columns: [table.branchesId],
            foreignColumns: [branches.id],
            name: 'branches_services_branches_id_fkey',
        }).onDelete('cascade'),
    ],
)

export const branchesHours = pgTable(
    'branches_hours',
    {
        id: varchar({ length: 36 }).primaryKey().notNull(),
        branchId: varchar('branch_id', { length: 36 }).notNull(),
        dayOfWeek: integer('day_of_week').notNull(),
        openTime: time('open_time').notNull(),
        closeTime: time('close_time').notNull(),
        isClosed: boolean('is_closed').notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.branchId],
            foreignColumns: [branches.id],
            name: 'branches_hours_branch_id_fkey',
        }).onDelete('cascade'),
        index('branches_hours_is_closed_idx').on(table.isClosed),
    ],
)

export const branchesContactInfo = pgTable(
    'branches_contact_info',
    {
        id: varchar({ length: 36 }).primaryKey().notNull(),
        type: branchesContactInfoTypes('type').notNull(),
        value: varchar('value', { length: 255 }).notNull(),
        branchId: varchar('branch_id', { length: 36 }).notNull().unique(),
        createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
        updatedAt: timestamp('updated_at', { mode: 'string' }),
    },
    (table) => [
        foreignKey({
            columns: [table.branchId],
            foreignColumns: [branches.id],
            name: 'branches_contact_info_branch_id_fkey',
        }),
    ],
)
