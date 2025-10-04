import { zodResolver } from "@hookform/resolvers/zod"
import {
    Alert,
    Button,
    Switch,
} from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Form } from "../../../../../components/form/form"
import { KeyboundForm } from "../../../../../components/modals/utilities/keybound-form"
import { FetchError } from "@medusajs/js-sdk"
import { useRouteModal } from "../../../../../components/modals/route-modal-provider/use-route-modal"
import { RouteDrawer } from "../../../../../components/modals/route-drawer"
import { ReminderSchedule, UpdateReminderSchedule, UpdateReminderScheduleSchema } from "../../../../../../types/reminder-schedules"
import { useUpdateReminderSchedules } from "../../../../../hooks/use-reminder-schedules"
import { ChipInput } from "../../../../../components/general/chip-input"
import { useComboboxData } from "../../../../../hooks/use-combobox-data"
import { sdk } from "../../../../../lib/sdk"
import { Combobox } from "../../../../../components/general/combobox"
const isFetchError = (error: any): error is FetchError => {
    return error instanceof FetchError
}

export const EditReminderScheduleForm = ({ schedule }: { schedule: ReminderSchedule }) => {
    const { t } = useTranslation()
    const { handleSuccess } = useRouteModal()

    const form = useForm<UpdateReminderSchedule>({
        defaultValues: schedule,
        resolver: zodResolver(UpdateReminderScheduleSchema),
    })

    const { mutateAsync, isPending } = useUpdateReminderSchedules(schedule.id)

    const handleSubmit = form.handleSubmit(async (values) => {
        await mutateAsync(values, {
            onSuccess: () => {
                handleSuccess()
            },
            onError: error => {
                if (isFetchError(error) && error.status === 400)
                    form.setError("root", {
                        type: "manual",
                        message: error.message,
                    })

            }
        })
    })

    const templateComboOptions = useComboboxData({
        queryKey: ["postmark", "templates"],
        queryFn: (queryParams) => sdk.admin.postmark.templates.list(queryParams),
        getOptions: (data) =>
            data.Templates.map((template) => ({
                label: template.Name,
                value: template.TemplateId.toString(),
            })),
    })

    return (
        <RouteDrawer.Form form={form}>
            <KeyboundForm
                onSubmit={handleSubmit}
                className="flex h-full flex-col overflow-hidden"
            >
                <RouteDrawer.Body className="flex flex-1 flex-col gap-y-4 overflow-auto">
                    {form.formState.errors.root && (
                        <Alert
                            variant="error"
                            dismissible={false}
                            className="text-balance"
                        >
                            {form.formState.errors.root.message}
                        </Alert>
                    )}

                    <div className="flex flex-col gap-y-4">
                        <Form.Field
                            control={form.control}
                            name="template_id"
                            render={({ field }) => {
                                return (
                                    <Form.Item>
                                        <Form.Label>
                                            Template
                                        </Form.Label>
                                        <Form.Control>
                                            <Combobox
                                                {...field}
                                                options={templateComboOptions.options}
                                                searchValue={templateComboOptions.searchValue}
                                                onSearchValueChange={
                                                    templateComboOptions.onSearchValueChange
                                                }
                                                fetchNextPage={templateComboOptions.fetchNextPage}
                                            />
                                        </Form.Control>
                                        <Form.ErrorMessage />
                                    </Form.Item>
                                )
                            }}
                        />

                        <Form.Field
                            control={form.control}
                            name="offset_hours"
                            render={({ field: { ...field } }) => {
                                return (
                                    <Form.Item>
                                        <Form.Label>
                                            Delays (in hours)
                                        </Form.Label>
                                        <Form.Control>
                                            <ChipInput
                                                {...field}
                                            />
                                        </Form.Control>
                                        <Form.ErrorMessage />
                                    </Form.Item>
                                )
                            }}
                        />

                        <Form.Field
                            control={form.control}
                            name="enabled"
                            render={({ field: { value, onChange, ...field } }) => {
                                return (
                                    <Form.Item>
                                        <div className="flex items-center space-x-2">
                                            <Form.Control>
                                                <Switch
                                                    {...field}
                                                    checked={value}
                                                    onCheckedChange={onChange}
                                                />
                                            </Form.Control>
                                            <Form.Label className="!mt-0">
                                                Enabled
                                            </Form.Label>
                                        </div>
                                        <Form.ErrorMessage />
                                    </Form.Item>
                                )
                            }}
                        />
                    </div>
                </RouteDrawer.Body>
                <RouteDrawer.Footer>
                    <div className="flex items-center justify-end gap-x-2">
                        <RouteDrawer.Close asChild>
                            <Button size="small" variant="secondary">
                                {t("actions.cancel")}
                            </Button>
                        </RouteDrawer.Close>
                        <Button
                            size="small"
                            variant="primary"
                            type="submit"
                            isLoading={isPending}
                        >
                            {t("actions.edit")}
                        </Button>
                    </div>
                </RouteDrawer.Footer>
            </KeyboundForm>
        </RouteDrawer.Form>
    )
}
