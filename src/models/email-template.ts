import { Column, Entity, BeforeInsert, DeleteDateColumn, BeforeSoftRemove } from "typeorm";
import { SoftDeletableEntity, generateEntityId } from "@medusajs/medusa";
import { NotificationEvent } from "../types/email-template";

// Enum template type: standard or layout
enum EmailTemplateType {
    STANDARD = "standard",
    LAYOUT = "layout",
}


@Entity()
export default class EmailTemplate extends SoftDeletableEntity {
    // Name of the template.
    @Column({ type: "varchar", length: 100, nullable: false, unique: true })
    name: string;

    // Postmark ID. This is only necessary to use the postmark plugin.
    @Column({ type: "integer" })
    postmark_id: number;

    // Medusa Event. 
    @Column({ type: "enum", enum: NotificationEvent, default: NotificationEvent.UNSET })
    notification_event: NotificationEvent;

    // Alias to identify template. Can only be used if type is standard.
    @Column({ type: "varchar", length: 100 })
    alias: string;

    // HTML Body of the email. Must have a content placeholder if type is layout.
    @Column({ type: "text" })
    html_body: string;

    // This is what the react-email-editor uses to render the email template.
    @Column({ type: "jsonb" })
    json_template: object;

    // Subject to use when the template is used to send an email.
    @Column({ type: "varchar", length: 50 })
    subject: string;

    // Type of the template. Can be standard or layout.
    @Column({ type: "enum", enum: EmailTemplateType })
    type: EmailTemplateType;

    // If this is a standard template, what layout should be used.
    @Column({ type: "varchar", length: 100 })
    layout?: string;

    @DeleteDateColumn()
    deleted_at: Date | undefined;

    @BeforeInsert()
    beforeInsertActions() {
        this.id = generateEntityId(this.id, "email-template");
    }

    @BeforeSoftRemove()
    beforeSoftRemoveActions() {
        this.notification_event = NotificationEvent.UNSET;
        this.postmark_id = undefined;
    }
}
