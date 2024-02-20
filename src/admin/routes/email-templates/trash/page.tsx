import { useAdminCustomDelete, useAdminCustomPost, useAdminCustomQuery } from "medusa-react"
import { useState, useEffect } from "react"
import { Envelope } from "@medusajs/icons"
import { GetEmailTemplatesRequest, GetEmailTemplatesRequestBody, GetEmailTemplatesResponseBody, NotificationEvent, UpdateEmailTemplateRequestBody, UpdateEmailTemplateResponseBody } from "../../../../types/email-template"
import EmailTemplate from "../../../../models/email-template"

const EmailTemplateCard = ({ template, onDelete, onRestore }: { template: EmailTemplate, onDelete: (alias: string) => void, onRestore: (alias: string) => void }) => {
    const { mutate, status } = useAdminCustomPost<UpdateEmailTemplateRequestBody, UpdateEmailTemplateResponseBody>(
        `/admin/email-templates/trash/${template.alias}`,
        [template.alias],
    );

    const deleteHook = useAdminCustomDelete(
        `/admin/email-templates/trash/${template.alias}`,
        [template.alias],
    )

    const restoreTemplate = () => {
        mutate({
            template: template,
        }, {
            onSuccess: () => {
                onRestore(template.alias);
            }
        });
    }

    const permanentDelete = () => {
        deleteHook.mutate(void 0, { onSuccess: () => onDelete(template.alias) });
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div key={template.alias} className="border rounded-lg p-4 shadow-sm flex flex-col justify-between">
                <div className="pb-2">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold" id={`template-name-${template.alias}`}>{template.name}</h2>
                        <div className="flex space-x-1">
                            <button
                                type="button"
                                onClick={restoreTemplate}
                                className="py-2 px-4 bg-blue-500 text-white rounded-l hover:bg-blue-700"
                            >
                                Restore Template
                            </button>
                            <button
                                type="button"
                                onClick={permanentDelete}
                                className="py-2 px-4 bg-red-500 text-white rounded-r hover:bg-red-700"
                            >
                                Permanently Delete
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-end">
                    <div className="text-sm text-gray-500">
                        <p>Created: {new Date(template.created_at).toLocaleDateString()}</p>
                        <p>Last Updated: {new Date(template.updated_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-sm text-gray-500 text-right">
                        <p>Deleted at: {new Date(template.deleted_at).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

const EmailTemplatesTrash = () => {
    const { data, isLoading } = useAdminCustomQuery<GetEmailTemplatesRequestBody, GetEmailTemplatesResponseBody>(
        "/admin/email-templates/trash",
        ["email-templates"],
        {}
    )

    const [templates, setTemplates] = useState<EmailTemplate[]>(data?.templates || []);

    useEffect(() => {
        if (data?.templates) {
            setTemplates(data.templates);
        }
    }, [data]);

    const removeFromTrash = (alias: string) => {
        setTemplates(templates.filter((t: EmailTemplate) => t.alias !== alias));
    }

    if (isLoading) {
        return <span>Loading...</span>
    }
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Email Templates</h1>
                <a href="/a/email-templates/new" className="inline-block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">Create New Template</a>
            </div>
            {templates && templates.length === 0 && (
                <span className="text-lg text-red-500">No Email Templates in Trash</span>
            )}
            {templates && templates.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {templates.map((template: EmailTemplate) => <EmailTemplateCard key={template.id} template={template} onDelete={removeFromTrash} onRestore={removeFromTrash} />)}
                </div>
            )}
        </div>
    )
}

export default EmailTemplatesTrash
