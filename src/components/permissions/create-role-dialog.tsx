'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const roleSchema = z.object({
    name: z
        .string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .regex(/^[a-z_]+$/, 'Solo letras minúsculas y guiones bajos'),
    title: z.string().min(2, 'El título debe tener al menos 2 caracteres'),
    level: z.number().min(0).max(100).optional(),
});

type RoleFormData = z.infer<typeof roleSchema>;

interface CreateRoleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateRoleDialog({ open, onOpenChange }: CreateRoleDialogProps) {
    const form = useForm<RoleFormData>({
        resolver: zodResolver(roleSchema),
        defaultValues: {
            name: '',
            title: '',
            level: undefined,
        },
    });

    const onSubmit = (data: RoleFormData) => {
        console.log('Create role:', data);
        form.reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Crear nuevo rol</DialogTitle>
                    <DialogDescription>
                        Define un nuevo rol para agrupar permisos. Luego podrás asignar habilidades.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre técnico</FormLabel>
                                    <FormControl>
                                        <Input placeholder="admin, manager, employee" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Identificador único en minúsculas (ej: admin, manager)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Título visible</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Administrador, Gerente, Empleado" {...field} />
                                    </FormControl>
                                    <FormDescription>Nombre que se mostrará en la interfaz</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="level"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nivel de jerarquía (opcional)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="0-100" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Nivel jerárquico del rol (0-100, siendo 100 el más alto)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-2 justify-end pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    form.reset();
                                    onOpenChange(false);
                                }}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit">Crear rol</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
