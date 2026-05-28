import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { Form } from "../ui/form";
import { useFormId } from "@/hooks/use-form-id";

export function FormWrapper({
  form,
  children,
  onSubmit,
  ...props
}: {
  form: UseFormReturn<any>;
  children: React.ReactNode;
  onSubmit?: SubmitHandler<any>;
  [key: string]: any;
}) {
  const formId = useFormId();
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit || (() => {}))}
        {...props}
        className="p-2"
        id={formId}
      >
        {children}
      </form>
    </Form>
  );
}
