import { useAdminCustomQuery, useAdminCustomPost } from 'medusa-react';
import { useState } from 'react';
import { CreateEmailTemplateRequestBody, CreateEmailTemplateResponseBody, GetEmailTemplatesRequestBody, GetEmailTemplatesResponseBody } from 'src/types/email-template';

const CreateEmailTemplate = () => {
    const { data, isLoading } = useAdminCustomQuery<GetEmailTemplatesRequestBody, GetEmailTemplatesResponseBody>(
        `/admin/email-templates`,
        ["email-templates"],
    )

    return (
        <div className="max-w-md mx-auto">
            {isLoading && <span>Loading...</span>}
            {!isLoading && (
                <CreateEmailTemplateForm names={data.templates.map(({ name }) => name.toLowerCase())} />
            )}
        </div>
    );
}

const CreateEmailTemplateForm = (props: { names: string[] }) => {
    const { names } = props;

    const [nameError, setNameError] = useState<string | undefined>("Name is required");

    const templatePost = useAdminCustomPost<CreateEmailTemplateRequestBody, CreateEmailTemplateResponseBody>(
        `/admin/email-templates`,
        ["email-templates"],
    );

    async function createTemplate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const data = {
            name: formData.get('name') as string,
            subject: formData.get('subject') as string,
            html_body: '',
            json_template: {},
        };
        templatePost.mutate({
            template: data,
        }, {
            onSuccess: (result) => {
                window.location.href = `edit/${result.alias}`
            }
        });
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Create Email Template</h1>
            <form onSubmit={createTemplate} className="space-y-4">
                <div className="flex flex-col">
                    <label htmlFor="name" className="mb-2 font-bold text-lg">Name</label>
                    <input type="text" id="name" name="name" onChange={(e) => {
                        if (e.target.value === '' || e.target.value === undefined) {
                            setNameError('Name is required.');
                            return;
                        }
                        setNameError(names.includes(e.target.value.toLowerCase()) ? 'This name already exists.' : undefined);
                    }} className="border-2 border-gray-200 p-2 rounded-lg focus:outline-none focus:border-blue-500" />
                    {nameError && <p className="text-red-500">{nameError}</p>}
                </div>
                <div className="flex flex-col">
                    <label htmlFor="subject" className="mb-2 font-bold text-lg">Subject</label>
                    <input type="text" id="subject" name="subject" className="border-2 border-gray-200 p-2 rounded-lg focus:outline-none focus:border-blue-500" />
                </div>
                <button type="submit" disabled={nameError !== undefined} className={`w-full py-2 px-4 rounded text-white ${nameError !== undefined ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'}`}>Create</button>
            </form>
        </div>
    )
}

export default CreateEmailTemplate;
