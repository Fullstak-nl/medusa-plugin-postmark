import { MedusaRequest, MedusaResponse } from "@medusajs/medusa"
import EmailTemplate from "../models/email-template"

export type UpdateEmailTemplateRequestBody = {
    template: Required<Pick<EmailTemplate, "alias" | "json_template" | "html_body">> & Partial<EmailTemplate>
}

export interface UpdateEmailTemplateRequest extends MedusaRequest {
    body: UpdateEmailTemplateRequestBody
}

export type UpdateEmailTemplateResponseBody = {}

export interface UpdateEmailTemplateResponse extends MedusaResponse {
    body: UpdateEmailTemplateResponseBody
}

export interface UpdateEmailTemplateResponse extends MedusaResponse {
    body: UpdateEmailTemplateResponseBody
}

export type GetEmailTemplatesResponseBody = {
    templates: EmailTemplate[];
}

export interface GetEmailTemplatesResponse extends MedusaResponse {
    body: GetEmailTemplatesResponseBody
}

export type GetEmailTemplatesRequestBody = {}

export interface GetEmailTemplatesRequest extends MedusaRequest {
    body: GetEmailTemplatesRequestBody
}

export type GetEmailTemplateRequestBody = {
    alias: string;
}

export interface GetEmailTemplateRequest extends MedusaRequest {
    body: GetEmailTemplateRequestBody
}

export type GetEmailTemplateResponseBody = {
    template: EmailTemplate;
    available_events: string[];
}

export interface GetEmailTemplateResponse extends MedusaResponse {
    body: GetEmailTemplateResponseBody
}

export type CreateEmailTemplateRequestBody = {
    template: Required<Pick<EmailTemplate, "name" | "subject" | "html_body" | "json_template">> & Partial<EmailTemplate>;
}

export interface CreateEmailTemplateRequest extends MedusaRequest {
    body: CreateEmailTemplateRequestBody
}

export type CreateEmailTemplateResponseBody = {
    alias: string;
}

export interface CreateEmailTemplateResponse extends MedusaResponse {
    body: CreateEmailTemplateResponseBody
}

export enum NotificationEvent {
    UNSET = "unset",
    ORDER_PLACED = "order.placed",
    ORDER_CANCELLED = "order.cancelled",
    ORDER_SHIPMENT_CREATED = "order.shipment_created",
    CUSTOMER_CREATED = "customer.created",
    CUSTOMER_PASSWORD_RESET = "customer.password_reset",
    USER_CREATED = "user.created",
    USER_PASSWORD_RESET = "user.password_reset",
    AUTH_PASSWORD_RESET = "auth.password_reset",
    AUTH_VERIFY_ACCOUNT = "auth.verify_account",
    ACTIVITY_INACTIVE_USER = "activity.inactive_user",
    ACTIVITY_INACTIVE_CUSTOMER = "activity.inactive_customer",
}

const _CustomerVariables = [
    {
        name: "Customer First Name",
        value: "{{customer.first_name}}",
        sample: "John",

    },
    {
        name: "Customer Last Name",
        value: "{{customer.last_name}}",
        sample: "Doe",
    },
    {
        name: "Customer Email",
        value: "{{customer.email}}",
        sample: "test@testson.com",
    },
];

export const NotificationEventVariables = {
    [NotificationEvent.UNSET]: undefined,
    [NotificationEvent.ORDER_PLACED]: [..._CustomerVariables,],
    [NotificationEvent.ORDER_CANCELLED]: [..._CustomerVariables,],
    [NotificationEvent.ORDER_SHIPMENT_CREATED]: [..._CustomerVariables,],
    [NotificationEvent.CUSTOMER_CREATED]: [..._CustomerVariables,],
    [NotificationEvent.CUSTOMER_PASSWORD_RESET]: [..._CustomerVariables,],
    [NotificationEvent.USER_CREATED]: [..._CustomerVariables,],
    [NotificationEvent.USER_PASSWORD_RESET]: [
        { name: "User Email", value: "{{email}}", sample: "test@testson.com" },
        { name: "Token", value: "{{token}}", sample: "123456" },
    ],
    [NotificationEvent.AUTH_PASSWORD_RESET]: [
        { name: "User Email", value: "{{email}}", sample: "test@testson.com" },
        { name: "Token", value: "{{token}}", sample: "123456" },
    ],
    [NotificationEvent.AUTH_VERIFY_ACCOUNT]: [..._CustomerVariables],
    [NotificationEvent.ACTIVITY_INACTIVE_USER]: [..._CustomerVariables],
    [NotificationEvent.ACTIVITY_INACTIVE_CUSTOMER]: [..._CustomerVariables],
}
