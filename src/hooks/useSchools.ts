import { useState, useEffect, useCallback } from 'react';
import { supabase, createAuthenticatedClient } from '../lib/supabase';
import { useAthleteContext } from '../contexts/AthleteContext';
import { useAuth } from './useAuth';

export interface School {
    id: string;
    athlete_id: string;
    name: string;
    division: string | null;
    state: string | null;
    priority: string;
    status: string;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface Coach {
    id: string;
    school_id: string;
    name: string;
    role: string | null;
    email: string | null;
    phone: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

interface CreateSchoolData {
    name: string;
    division?: string;
    state?: string;
    priority?: string;
    status?: string;
    notes?: string;
}

interface CreateCoachData {
    school_id: string;
    name: string;
    role?: string;
    email?: string;
    phone?: string;
    notes?: string;
}

interface UseSchoolsReturn {
    schools: School[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    createSchool: (data: CreateSchoolData) => Promise<School | null>;
    updateSchool: (id: string, data: Partial<School>) => Promise<boolean>;
    deleteSchool: (id: string) => Promise<boolean>;
    // Coach operations
    getCoaches: (schoolId: string) => Promise<Coach[]>;
    createCoach: (data: CreateCoachData) => Promise<Coach | null>;
    updateCoach: (id: string, data: Partial<Coach>) => Promise<boolean>;
    deleteCoach: (id: string) => Promise<boolean>;
}

export function useSchools(): UseSchoolsReturn {
    const { athlete } = useAthleteContext();
    const { getToken } = useAuth();
    const [schools, setSchools] = useState<School[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getClient = useCallback(async () => {
        const token = await getToken({ template: 'supabase' });
        return token ? createAuthenticatedClient(token) : supabase;
    }, [getToken]);

    const fetchSchools = useCallback(async () => {
        if (!athlete?.id) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const client = await getClient();

            const { data, error: fetchError } = await client
                .from('schools')
                .select('*')
                .eq('athlete_id', athlete.id)
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;

            setSchools(data || []);
        } catch (err) {
            console.error('Error fetching schools:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch schools');
        } finally {
            setLoading(false);
        }
    }, [athlete?.id, getClient]);

    useEffect(() => {
        fetchSchools();
    }, [fetchSchools]);

    const createSchool = async (data: CreateSchoolData): Promise<School | null> => {
        if (!athlete?.id) return null;

        try {
            setError(null);
            const client = await getClient();

            const { data: newSchool, error: createError } = await client
                .from('schools')
                .insert({
                    athlete_id: athlete.id,
                    name: data.name,
                    division: data.division || null,
                    state: data.state || null,
                    priority: data.priority || 'Medium',
                    status: data.status || 'Researching',
                    notes: data.notes || null,
                })
                .select()
                .single();

            if (createError) throw createError;

            setSchools(prev => [newSchool, ...prev]);
            return newSchool;
        } catch (err) {
            console.error('Error creating school:', err);
            setError(err instanceof Error ? err.message : 'Failed to create school');
            return null;
        }
    };

    const updateSchool = async (id: string, data: Partial<School>): Promise<boolean> => {
        try {
            setError(null);
            const client = await getClient();

            const { error: updateError } = await client
                .from('schools')
                .update(data)
                .eq('id', id);

            if (updateError) throw updateError;

            setSchools(prev =>
                prev.map(school => (school.id === id ? { ...school, ...data } : school))
            );
            return true;
        } catch (err) {
            console.error('Error updating school:', err);
            setError(err instanceof Error ? err.message : 'Failed to update school');
            return false;
        }
    };

    const deleteSchool = async (id: string): Promise<boolean> => {
        try {
            setError(null);
            const client = await getClient();

            const { error: deleteError } = await client
                .from('schools')
                .delete()
                .eq('id', id);

            if (deleteError) throw deleteError;

            setSchools(prev => prev.filter(school => school.id !== id));
            return true;
        } catch (err) {
            console.error('Error deleting school:', err);
            setError(err instanceof Error ? err.message : 'Failed to delete school');
            return false;
        }
    };

    // Coach operations
    const getCoaches = useCallback(async (schoolId: string): Promise<Coach[]> => {
        try {
            const client = await getClient();
            const { data, error: fetchError } = await client
                .from('coaches')
                .select('*')
                .eq('school_id', schoolId)
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;

            return data || [];
        } catch (err) {
            console.error('Error fetching coaches:', err);
            return [];
        }
    }, [getClient]);

    const createCoach = useCallback(async (data: CreateCoachData): Promise<Coach | null> => {
        try {
            setError(null);
            const client = await getClient();

            const { data: newCoach, error: createError } = await client
                .from('coaches')
                .insert({
                    school_id: data.school_id,
                    name: data.name,
                    role: data.role || null,
                    email: data.email || null,
                    phone: data.phone || null,
                    notes: data.notes || null,
                })
                .select()
                .single();

            if (createError) throw createError;

            return newCoach;
        } catch (err) {
            console.error('Error creating coach:', err);
            setError(err instanceof Error ? err.message : 'Failed to create coach');
            return null;
        }
    }, [getClient]);

    const updateCoach = useCallback(async (id: string, data: Partial<Coach>): Promise<boolean> => {
        try {
            setError(null);
            const client = await getClient();

            const { error: updateError } = await client
                .from('coaches')
                .update(data)
                .eq('id', id);

            if (updateError) throw updateError;

            return true;
        } catch (err) {
            console.error('Error updating coach:', err);
            setError(err instanceof Error ? err.message : 'Failed to update coach');
            return false;
        }
    }, [getClient]);

    const deleteCoach = useCallback(async (id: string): Promise<boolean> => {
        try {
            setError(null);
            const client = await getClient();

            const { error: deleteError } = await client
                .from('coaches')
                .delete()
                .eq('id', id);

            if (deleteError) throw deleteError;

            return true;
        } catch (err) {
            console.error('Error deleting coach:', err);
            setError(err instanceof Error ? err.message : 'Failed to delete coach');
            return false;
        }
    }, [getClient]);

    return {
        schools,
        loading,
        error,
        refetch: fetchSchools,
        createSchool,
        updateSchool,
        deleteSchool,
        getCoaches,
        createCoach,
        updateCoach,
        deleteCoach,
    };
}
