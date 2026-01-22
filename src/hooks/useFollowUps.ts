import { useState, useEffect, useCallback } from 'react';
import { supabase, createAuthenticatedClient } from '../lib/supabase';
import { useAuth } from './useAuth';
import { useAthleteContext } from '../contexts/AthleteContext';
import { format, addDays } from 'date-fns';

export interface FollowUp {
    id: string;
    athlete_id: string;
    interaction_id: string | null;
    school_id: string;
    due_date: string;
    completed: boolean;
    completed_at: string | null;
    snoozed_until: string | null;
    created_at: string;
    updated_at: string;
    // Joined data
    school?: {
        id: string;
        name: string;
    };
    interaction?: {
        id: string;
        type: string;
        date: string;
        notes: string;
    };
}

interface UseFollowUpsReturn {
    followUps: FollowUp[];
    overdueCount: number;
    dueTodayCount: number;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    markComplete: (id: string) => Promise<boolean>;
    snooze: (id: string, days: number) => Promise<boolean>;
}

export function useFollowUps(): UseFollowUpsReturn {
    const { athlete } = useAthleteContext();
    const { getToken } = useAuth();
    const [followUps, setFollowUps] = useState<FollowUp[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const today = format(new Date(), 'yyyy-MM-dd');

    const getClient = useCallback(async () => {
        const token = await getToken({ template: 'supabase' });
        return token ? createAuthenticatedClient(token) : supabase;
    }, [getToken]);

    const fetchFollowUps = useCallback(async () => {
        if (!athlete?.id) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const client = await getClient();

            const { data, error: fetchError } = await client
                .from('follow_ups')
                .select(`
          *,
          school:schools(id, name),
          interaction:interactions(id, type, date, notes)
        `)
                .eq('athlete_id', athlete.id)
                .eq('completed', false)
                .or(`snoozed_until.is.null,snoozed_until.lte.${today}`)
                .order('due_date', { ascending: true });

            if (fetchError) throw fetchError;

            setFollowUps(data || []);
        } catch (err) {
            console.error('Error fetching follow-ups:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch follow-ups');
        } finally {
            setLoading(false);
        }
    }, [athlete?.id, today, getClient]);

    useEffect(() => {
        fetchFollowUps();
    }, [fetchFollowUps]);

    // Calculate counts
    const overdueCount = followUps.filter(f => f.due_date < today).length;
    const dueTodayCount = followUps.filter(f => f.due_date === today).length;

    const markComplete = async (id: string): Promise<boolean> => {
        try {
            setError(null);
            const client = await getClient();

            const { error: updateError } = await client
                .from('follow_ups')
                .update({
                    completed: true,
                    completed_at: new Date().toISOString(),
                })
                .eq('id', id);

            if (updateError) throw updateError;

            // Optimistically remove from list
            setFollowUps(prev => prev.filter(f => f.id !== id));
            return true;
        } catch (err) {
            console.error('Error marking follow-up complete:', err);
            setError(err instanceof Error ? err.message : 'Failed to mark complete');
            return false;
        }
    };

    const snooze = async (id: string, days: number): Promise<boolean> => {
        try {
            setError(null);
            const client = await getClient();

            const snoozeUntil = format(addDays(new Date(), days), 'yyyy-MM-dd');

            const { error: updateError } = await client
                .from('follow_ups')
                .update({
                    snoozed_until: snoozeUntil,
                })
                .eq('id', id);

            if (updateError) throw updateError;

            // Optimistically remove from list (will reappear when snoozed_until passes)
            setFollowUps(prev => prev.filter(f => f.id !== id));
            return true;
        } catch (err) {
            console.error('Error snoozing follow-up:', err);
            setError(err instanceof Error ? err.message : 'Failed to snooze');
            return false;
        }
    };

    return {
        followUps,
        overdueCount,
        dueTodayCount,
        loading,
        error,
        refetch: fetchFollowUps,
        markComplete,
        snooze,
    };
}
