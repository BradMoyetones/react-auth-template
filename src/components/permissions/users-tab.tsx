'use client';

import { useState } from 'react';
import { Search, UserPlus, MoreVertical, Shield, Key, Ban } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getUsersWithPermissions } from '@/lib/mock-data';
import { UserPermissionsDialog } from './user-permissions-dialog';
import type { UserWithPermissions } from '@/types';

export function UsersTab() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState<UserWithPermissions | null>(null);
    const users = getUsersWithPermissions();

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Buscar usuarios..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Agregar Usuario
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredUsers.map((user, index) => (
                    <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                        <Card className="p-6 transition-all hover:border-primary/50">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={user.image || undefined} />
                                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                            {user.name[0]}
                                            {user.lastname[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-semibold text-foreground">
                                            {user.name} {user.lastname}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                                            <Key className="mr-2 h-4 w-4" />
                                            Ver permisos
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Shield className="mr-2 h-4 w-4" />
                                            Asignar rol
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">
                                            <Ban className="mr-2 h-4 w-4" />
                                            Revocar accesos
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="mt-4 space-y-3">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-2">Roles asignados</p>
                                    <div className="flex flex-wrap gap-2">
                                        {user.roles.length > 0 ? (
                                            user.roles.map((role) => (
                                                <Badge key={role.id} variant="secondary" className="gap-1">
                                                    <Shield className="h-3 w-3" />
                                                    {role.title || role.name}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-xs text-muted-foreground italic">
                                                Sin roles asignados
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-2">Permisos directos</p>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="gap-1">
                                            <Key className="h-3 w-3" />
                                            {user.permissions.length} permisos
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                className="w-full mt-4 bg-transparent"
                                onClick={() => setSelectedUser(user)}
                            >
                                Gestionar permisos
                            </Button>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {selectedUser && (
                <UserPermissionsDialog
                    user={selectedUser}
                    open={!!selectedUser}
                    onOpenChange={(open) => !open && setSelectedUser(null)}
                />
            )}
        </div>
    );
}
