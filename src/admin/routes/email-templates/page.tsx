import { useAdminCustomPost, useAdminCustomQuery } from "medusa-react"
import { Envelope } from "@medusajs/icons"
import { GetEmailTemplatesRequest, GetEmailTemplatesRequestBody, GetEmailTemplatesResponseBody, NotificationEvent } from "../../../types/email-template"
import EmailTemplate from "../../../models/email-template"

const EmailTemplateCard = (props: { template: EmailTemplate }) => {
    const template = props.template;
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div key={template.alias} className="border rounded-lg p-4 shadow-sm flex flex-col justify-between">
                <div className="pb-2">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold" id={`template-name-${template.alias}`}>{template.name}</h2>
                        <a href={`email-templates/edit/${template.alias}`} aria-labelledby={`template-name-${template.alias}`} className="mt-2 ml-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Edit Template</a>
                    </div>
                </div>
                <div className="flex justify-between items-end">
                    <div className="text-sm text-gray-500 flex items-center">
                        <p className="whitespace-nowrap">Event:</p>
                        <pre className="mt-1 text-black w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-100 ml-2">
                            {template.notification_event || "not set"}
                        </pre>
                    </div>
                    <div className="text-sm text-gray-500 text-right">
                        <p>Created: {new Date(template.created_at).toLocaleDateString()}</p>
                        <p>Last Updated: {new Date(template.updated_at).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

const EmailTemplates = () => {
    const { data, isLoading } = useAdminCustomQuery<GetEmailTemplatesRequestBody, GetEmailTemplatesResponseBody>(
        "/admin/email-templates",
        ["email-templates"],
        {}
    )

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Email Templates</h1>
                <div className="flex space-x-1">
                    <a href="email-templates/new" className="inline-block px-4 py-2 bg-green-500 text-white rounded-l hover:bg-green-700">Create New Template</a>
                    <a href="email-templates/trash" className="inline-block px-4 py-2 bg-gray-800 text-white rounded-r hover:bg-gray-900">View Trash</a>
                </div>
            </div>
            {isLoading && <span>Loading...</span>}
            {data?.templates && data.templates.length === 0 && (
                <span className="text-lg text-red-500">No Email Templates Found</span>
            )}
            {data?.templates && data.templates?.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.templates.map((template) => EmailTemplateCard({ template }))}
                </div>
            )}
        </div>
    )
}

export const config = {
    link: {
        label: "Email Templates",
        icon: Envelope,
    },
}

export default EmailTemplates
