### Guidelines to be followed for coding

1. Under components folder, we will add nested folders as needed (for modules mostly).
2. Naming conventions
   1. For forms, e.g. `TaskForm.tsx`.
   2. This file will contain component named `TaskForm` and it will be reusable to create and edit the Task. The only difference will be an additional prop for `initialData`.
   3. And the `TaskForm` component will not call any API inside `TaskForm.tsx`
   4. TaskForm will have a prop called `onSave: (values) => Promise<any>`
   5. It will also include a prop named `onCancel`, to perform the action on cancellation.
   6. This form will not have any wrapper component like Drawer or Modal.
   7. For utilities like common text transforms and date related operations there is folder named utils.
   8. for naming utility files. e.g. `file-utility.ts`
   9. for disclosure hooks, naming convention would be as follows:
   10. `const [openedTaskForm, handlersTaskForm] = useDisclosure(false);`
   11. for every component, there will be a props interface named `ComponentNameProps`
3.  We will try to avoid `useEffect`.
4.  Every nested page route file will have a `_layout.tsx` file and `_layout` folder.
5.  Try to avoid use of `any`
