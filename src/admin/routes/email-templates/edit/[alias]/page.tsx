import EmailEditor from 'react-email-editor'
import { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAdminCustomQuery, useAdminCustomPost, useAdminCustomDelete } from 'medusa-react';
import { GetEmailTemplateRequestBody, GetEmailTemplateResponseBody, NotificationEvent, UpdateEmailTemplateRequestBody, UpdateEmailTemplateResponseBody } from '../../../../../types/email-template';
import { debounce } from 'lodash';
import EmailTemplate from '../../../../../models/email-template';
import { NotificationEventVariables } from '../../../../../types/email-template';


const EmailTemplateEditorPage = () => {
    const { alias } = useParams();
    const { data, isLoading } = useAdminCustomQuery<GetEmailTemplateRequestBody, GetEmailTemplateResponseBody>(
        `/admin/email-templates/${alias}`,
        [alias],
        {
            alias: alias,
        }
    );

    return (
        <div className='min-h-full flex flex-col'>
            {isLoading && <span>Loading...</span>}
            {data?.template && (
                <EmailTemplateEditor template={data.template} available_events={data.available_events} />
            )}
        </div>
    );
};

export default EmailTemplateEditorPage

const EmailTemplateEditor = (props: { template: EmailTemplate, available_events: string[] }) => {
    const { template, available_events } = props;
    const emailEditorRef = useRef(null);

    const { mutate, status } = useAdminCustomPost<UpdateEmailTemplateRequestBody, UpdateEmailTemplateResponseBody>(
        `/admin/email-templates/${template.alias}`,
        [template.alias],
    );

    const deleteHook = useAdminCustomDelete(
        `/admin/email-templates/${template.alias}`,
        [template.alias],
    );

    const [selectedEvent, setSelectedEvent] = useState(template.notification_event);
    const [subject, setSubject] = useState(template.subject);
    useEffect(() => {
        save();
    }, [subject, selectedEvent]);

    const save = debounce(() => {
        emailEditorRef.current.editor.exportHtml((data) => {
            const { design, html } = data;
            mutate({
                template: {
                    alias: template.alias,
                    json_template: design,
                    html_body: html,
                    notification_event: selectedEvent,
                    subject: subject,
                }
            }, {
                onSuccess: () => {
                    if (selectedEvent !== template.notification_event) {
                        window.location.reload();
                    }
                }
            })
        });
    }, 1000);

    const deleteTemplate = () => {
        deleteHook.mutate(void 0, {
            onSuccess: () => {
                window.location.href = '/a/email-templates';
            }
        })
    }

    const onLoad = () => {
        emailEditorRef.current.editor.loadDesign(template.json_template);
        setSelectedEvent(template.notification_event);
    };

    const onReady = () => {
        emailEditorRef.current.editor.addEventListener('design:updated', (design) => {
            save();
        });
    };

    return (
        <form onSubmit={(event) => event.preventDefault()} className='-mt-5 flex flex-col flex-grow'>
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900">{template.name}</h1>
                <button
                    type="button"
                    onClick={deleteTemplate}
                    className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-700"
                >
                    Delete Template
                </button>
            </div>
            <div className="flex flex-wrap space-x-4">
                <div className="flex-1">
                    <label htmlFor="event-selector" className="block text-sm font-medium text-gray-700">Notification event</label>
                    <select
                        name="Notification Event Selector"
                        id="event-selector"
                        value={selectedEvent ?? "unset"}
                        onChange={(event) => setSelectedEvent(event.target.value as NotificationEvent)}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        {available_events.map((event) => (
                            <option key={event} value={event}>{event}</option>
                        ))}
                    </select>
                </div>
                <div className="flex-1">
                    <label htmlFor="subject-input" className="block text-sm font-medium text-gray-700">Subject</label>
                    <input
                        id="subject-input"
                        type="text"
                        value={subject}
                        onChange={(event) => setSubject(event.target.value)}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
            </div>
            <EmailEditor
                ref={emailEditorRef}
                onLoad={onLoad}
                onReady={onReady}
                style={{ flexGrow: 1 }}
                options={{
                    displayMode: 'email',
                    mergeTags: NotificationEventVariables[selectedEvent],
                }}
            />
        </form>
    )
}
