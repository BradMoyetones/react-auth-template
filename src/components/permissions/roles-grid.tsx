'use client';

import { useState, useMemo } from 'react';
import { Search, Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockRoles } from '@/lib/mock-data';

interface RolesGridProps {
    selectedRoles: string[];
    onRoleToggle: (roleId: string) => void;
}

export function RolesGrid({ selectedRoles, onRoleToggle }: RolesGridProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredRoles = useMemo(() => {
        return mockRoles.filter(
            (role) =>
                role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                role.title?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Buscar roles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Badge variant="secondary">
                    {selectedRoles.length} seleccionado{selectedRoles.length !== 1 ? 's' : ''}
                </Badge>
            </div>

            <ScrollArea className="h-[500px]">
                <div className="grid gap-3 pr-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredRoles.map((role) => {
                        const isSelected = selectedRoles.includes(role.id);

                        return (
                            <div
                                key={role.id}
                                className={`group rounded-lg border-2 p-4 transition-all ${
                                    isSelected
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border bg-card hover:border-primary/50'
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <Checkbox
                                        id={`role-${role.id}`}
                                        checked={isSelected}
                                        onCheckedChange={() => onRoleToggle(role.id)}
                                        className="mt-0.5"
                                    />
                                    <div className="flex-1">
                                        <label
                                            htmlFor={`role-${role.id}`}
                                            className="text-sm font-medium leading-tight cursor-pointer flex items-center gap-2"
                                        >
                                            <Shield className="h-3.5 w-3.5 text-primary" />
                                            {role.title || role.name}
                                        </label>
                                        <p className="text-xs text-muted-foreground font-mono mt-1">{role.name}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            {role.level !== undefined && (
                                                <Badge variant="outline" className="text-xs">
                                                    Nivel {role.level}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredRoles.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Search className="h-12 w-12 text-muted-foreground/50 mb-3" />
                        <p className="text-sm text-muted-foreground">No se encontraron roles</p>
                        <p className="text-xs text-muted-foreground mt-1">Intenta con otro término de búsqueda</p>
                    </div>
                )}
            </ScrollArea>
        </div>
    );
}
