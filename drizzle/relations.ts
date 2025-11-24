import { relations } from "drizzle-orm/relations";
import { branches, branchesHours, business, users, accounts, branchUsers, branchesContactInfo, services, branchesServices, pets, sessions } from "./schema";

export const branchesHoursRelations = relations(branchesHours, ({one}) => ({
	branch: one(branches, {
		fields: [branchesHours.branchId],
		references: [branches.id]
	}),
}));

export const branchesRelations = relations(branches, ({one, many}) => ({
	branchesHours: many(branchesHours),
	business: one(business, {
		fields: [branches.businessId],
		references: [business.id]
	}),
	branchUsers: many(branchUsers),
	branchesContactInfos: many(branchesContactInfo),
	branchesServices: many(branchesServices),
}));

export const businessRelations = relations(business, ({one, many}) => ({
	branches: many(branches),
	user: one(users, {
		fields: [business.ownerId],
		references: [users.id]
	}),
}));

export const accountsRelations = relations(accounts, ({one}) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	accounts: many(accounts),
	branchUsers: many(branchUsers),
	businesses: many(business),
	pets: many(pets),
	sessions: many(sessions),
}));

export const branchUsersRelations = relations(branchUsers, ({one}) => ({
	user: one(users, {
		fields: [branchUsers.userId],
		references: [users.id]
	}),
	branch: one(branches, {
		fields: [branchUsers.branchId],
		references: [branches.id]
	}),
}));

export const branchesContactInfoRelations = relations(branchesContactInfo, ({one}) => ({
	branch: one(branches, {
		fields: [branchesContactInfo.branchId],
		references: [branches.id]
	}),
}));

export const branchesServicesRelations = relations(branchesServices, ({one}) => ({
	service: one(services, {
		fields: [branchesServices.servicesId],
		references: [services.id]
	}),
	branch: one(branches, {
		fields: [branchesServices.branchesId],
		references: [branches.id]
	}),
}));

export const servicesRelations = relations(services, ({many}) => ({
	branchesServices: many(branchesServices),
}));

export const petsRelations = relations(pets, ({one}) => ({
	user: one(users, {
		fields: [pets.ownerId],
		references: [users.id]
	}),
}));

export const sessionsRelations = relations(sessions, ({one}) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	}),
}));