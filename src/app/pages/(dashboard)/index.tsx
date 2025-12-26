'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Shield, Key, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UsersTab } from '@/components/permissions/users-tab';
import { RolesTab } from '@/components/permissions/roles-tab';
import { AbilitiesTab } from '@/components/permissions/abilities-tab';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';

export default function PermissionsAdminPage() {
    const [activeTab, setActiveTab] = useState('users');

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b border-border bg-card">
                <div className="mx-auto max-w-7xl px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                                Administración de Permisos
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Gestiona usuarios, roles, y habilidades del sistema
                            </p>
                        </div>

                        <div className='flex gap-2'>
                            <Button variant={"secondary"}>
                                <Settings className="h-4 w-4" />
                                Configuración
                            </Button>
                            <ModeToggle />
                        </div>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-6 py-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full max-w-md grid-cols-3 bg-muted">
                        <TabsTrigger value="users" className="gap-2">
                            <Users className="h-4 w-4" />
                            Usuarios
                        </TabsTrigger>
                        <TabsTrigger value="roles" className="gap-2">
                            <Shield className="h-4 w-4" />
                            Roles
                        </TabsTrigger>
                        <TabsTrigger value="abilities" className="gap-2">
                            <Key className="h-4 w-4" />
                            Habilidades
                        </TabsTrigger>
                    </TabsList>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <TabsContent value="users" className="mt-6">
                                <UsersTab />
                            </TabsContent>

                            <TabsContent value="roles" className="mt-6">
                                <RolesTab />
                            </TabsContent>

                            <TabsContent value="abilities" className="mt-6">
                                <AbilitiesTab />
                            </TabsContent>
                        </motion.div>
                    </AnimatePresence>
                </Tabs>
            </main>
        </div>
    );
}
